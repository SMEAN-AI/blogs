#!/usr/bin/env node
// Compiles `posts/index.bundle.json` — a single file containing the
// metadata (slug + frontmatter for both locales) of every published
// post. The brand site fetches this one file for the listing page,
// instead of fanning out to one request per post.
//
// Invoked by `npm run build-index` locally before committing.
// CI re-runs it on PR and fails if the committed bundle drifts.
//
// Layout convention:
//
//   posts/<anything>/<slug>.md         ← canonical English (required)
//   posts/<anything>/<slug>.km.md      ← Khmer translation (optional)
//
// Authors may nest files freely (by year, category, anything) for
// disk organization. The URL slug is the file basename — folder
// structure is invisible to readers. `slug` must be unique across
// the whole tree; collisions fail the build.
//
// No `posts/index.json` to maintain — posts are discovered by walking
// the tree and ordered by frontmatter `date` (newest first).

import { readFile, writeFile, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname, relative, basename, extname, sep, posix } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = join(__dirname, '..', 'posts')
const BUNDLE_PATH = join(POSTS_DIR, 'index.bundle.json')

const CATEGORIES = new Set(['Product', 'Industry', 'Tutorial', 'Case Study'])
const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{0,80}$/

function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
  if (!match) return { data: {}, body: raw }
  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_]+)\s*:\s*(.*)$/.exec(line)
    if (!kv) continue
    let value = kv[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    data[kv[1]] = value
  }
  return { data, body: match[2] }
}

function estimateReadingMin(body) {
  const words = body.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 220))
}

// Recursively find all canonical (`.md`, not `.km.md`) post files.
async function walkPosts(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...(await walkPosts(full)))
      continue
    }
    if (!entry.isFile()) continue
    if (!entry.name.endsWith('.md')) continue
    if (entry.name.endsWith('.km.md')) continue
    out.push(full)
  }
  return out
}

// Turn a filesystem path into the relative path the brand fetcher will
// use against raw.githubusercontent.com. Always POSIX-separated.
function repoPath(absPath) {
  return relative(POSTS_DIR, absPath).split(sep).join(posix.sep)
}

async function loadPost(enPath, errors) {
  const enRel = repoPath(enPath)                    // e.g. "2026/launch.md"
  const enRelNoExt = enRel.replace(/\.md$/, '')     // e.g. "2026/launch"
  const slug = basename(enRelNoExt)                 // e.g. "launch"

  if (!SLUG_REGEX.test(slug)) {
    errors.push(`Invalid slug at posts/${enRel} — basename must match ${SLUG_REGEX}`)
    return null
  }

  const enRaw = await readFile(enPath, 'utf8')
  const { data: en, body: enBody } = parseFrontmatter(enRaw)

  for (const key of ['title', 'excerpt', 'date', 'category']) {
    if (!en[key]) {
      errors.push(`posts/${enRel} is missing required frontmatter: ${key}`)
      return null
    }
  }
  if (!CATEGORIES.has(en.category)) {
    errors.push(`posts/${enRel} has unknown category "${en.category}"`)
    return null
  }

  // Khmer variant sits next to the English one with `.km.md`.
  const kmPath = join(dirname(enPath), `${slug}.km.md`)
  let km
  if (existsSync(kmPath)) {
    const kmRaw = await readFile(kmPath, 'utf8')
    const { data } = parseFrontmatter(kmRaw)
    if (!data.title || !data.excerpt) {
      errors.push(`posts/${repoPath(kmPath)} missing required frontmatter: title or excerpt`)
    } else {
      km = { title: data.title, excerpt: data.excerpt }
    }
  }

  return {
    slug,
    // `path` is the on-repo location (relative to posts/, no extension).
    // The brand fetcher needs this to find the body file at view time;
    // the URL itself stays flat (`/blog/${slug}`).
    path: enRelNoExt,
    date: en.date,
    category: en.category,
    readingMin: Number(en.readingMin) || estimateReadingMin(enBody),
    ...(en.cover ? { cover: en.cover } : {}),
    en: { title: en.title, excerpt: en.excerpt },
    ...(km ? { km } : {}),
  }
}

async function main() {
  if (!existsSync(POSTS_DIR)) {
    console.error(`No posts/ directory at ${POSTS_DIR}`)
    process.exit(1)
  }

  const files = await walkPosts(POSTS_DIR)
  const errors = []
  const posts = []
  for (const f of files) {
    const post = await loadPost(f, errors)
    if (post) posts.push(post)
  }

  // Slug uniqueness — collisions would produce ambiguous URLs.
  const seen = new Map()
  for (const p of posts) {
    if (seen.has(p.slug)) {
      errors.push(`Duplicate slug "${p.slug}" — both posts/${seen.get(p.slug)}.md and posts/${p.path}.md`)
    } else {
      seen.set(p.slug, p.path)
    }
  }

  if (errors.length > 0) {
    console.error('Build failed:')
    for (const e of errors) console.error(`  - ${e}`)
    process.exit(1)
  }

  // Newest first by frontmatter date. Stable secondary sort by slug
  // keeps the output deterministic when two posts share a date.
  posts.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    return a.slug < b.slug ? -1 : 1
  })

  // No `generatedAt` so the same input always produces the same bytes
  // — that's what lets CI verify the bundle is up to date with a
  // plain `git diff --exit-code`.
  const bundle = { version: 1, posts }

  await writeFile(BUNDLE_PATH, JSON.stringify(bundle, null, 2) + '\n')
  console.log(`Wrote ${relative(process.cwd(), BUNDLE_PATH)} with ${posts.length} post(s).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
