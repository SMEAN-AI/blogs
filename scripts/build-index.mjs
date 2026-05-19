#!/usr/bin/env node
// Compiles `posts/index.bundle.json` — a single file containing the
// metadata (slug + frontmatter for both locales) of every published
// post. The brand site fetches this one file for the index page,
// instead of fanning out to one request per post.
//
// Invoked by `.github/workflows/build-index.yml` on push to main.
//
// Inputs:
//   posts/index.json               — author-maintained slug order
//   posts/<slug>.md                — canonical English post
//   posts/<slug>.km.md (optional)  — Khmer translation
//
// Output (committed back to main):
//   posts/index.bundle.json
//
// Exit code is non-zero on validation failure (missing required
// frontmatter, unknown category, malformed slug) so CI can block the
// merge.

import { readFile, writeFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = join(__dirname, '..', 'posts')
const MANIFEST_PATH = join(POSTS_DIR, 'index.json')
const BUNDLE_PATH = join(POSTS_DIR, 'index.bundle.json')

const CATEGORIES = new Set(['Product', 'Industry', 'Tutorial', 'Case Study'])
const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{0,80}$/

// Tiny YAML frontmatter parser — same shape the brand fetcher
// accepts. One-line scalars, optional single/double quotes.
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

async function loadPost(slug, errors) {
  if (!SLUG_REGEX.test(slug)) {
    errors.push(`Invalid slug: "${slug}"`)
    return null
  }

  const enPath = join(POSTS_DIR, `${slug}.md`)
  if (!existsSync(enPath)) {
    errors.push(`Missing English post: posts/${slug}.md`)
    return null
  }

  const enRaw = await readFile(enPath, 'utf8')
  const { data: en, body: enBody } = parseFrontmatter(enRaw)

  for (const key of ['title', 'excerpt', 'date', 'category']) {
    if (!en[key]) {
      errors.push(`${slug}.md is missing required frontmatter: ${key}`)
      return null
    }
  }
  if (!CATEGORIES.has(en.category)) {
    errors.push(`${slug}.md has unknown category "${en.category}"`)
    return null
  }

  const kmPath = join(POSTS_DIR, `${slug}.km.md`)
  let km
  if (existsSync(kmPath)) {
    const kmRaw = await readFile(kmPath, 'utf8')
    const { data } = parseFrontmatter(kmRaw)
    if (!data.title || !data.excerpt) {
      errors.push(`${slug}.km.md is missing required frontmatter: title or excerpt`)
    } else {
      km = { title: data.title, excerpt: data.excerpt }
    }
  }

  return {
    slug,
    date: en.date,
    category: en.category,
    readingMin: Number(en.readingMin) || estimateReadingMin(enBody),
    ...(en.cover ? { cover: en.cover } : {}),
    en: { title: en.title, excerpt: en.excerpt },
    ...(km ? { km } : {}),
  }
}

async function main() {
  const manifestRaw = await readFile(MANIFEST_PATH, 'utf8')
  const manifest = JSON.parse(manifestRaw)
  if (!Array.isArray(manifest.posts)) {
    console.error('posts/index.json must have a "posts" array.')
    process.exit(1)
  }

  // Flag orphan files — markdown that exists on disk but isn't in the
  // manifest. Authors usually want this to fail loudly so they don't
  // ship a post that never appears on the site.
  const onDisk = (await readdir(POSTS_DIR))
    .filter((f) => f.endsWith('.md') && !f.endsWith('.km.md'))
    .map((f) => f.replace(/\.md$/, ''))
  const orphans = onDisk.filter((slug) => !manifest.posts.includes(slug))

  const errors = []
  const posts = []
  for (const slug of manifest.posts) {
    const post = await loadPost(slug, errors)
    if (post) posts.push(post)
  }

  if (orphans.length > 0) {
    errors.push(
      `Orphan posts (present on disk but missing from index.json): ${orphans.join(', ')}`,
    )
  }

  if (errors.length > 0) {
    console.error('Build failed:')
    for (const e of errors) console.error(`  - ${e}`)
    process.exit(1)
  }

  // No `generatedAt` field — keeping the output deterministic for the
  // same input is what lets the verify-index workflow detect drift via
  // a plain `git diff`. If we ever need a timestamp, derive it from
  // the latest post `date` instead so it stays content-driven.
  const bundle = {
    version: 1,
    posts,
  }

  await writeFile(BUNDLE_PATH, JSON.stringify(bundle, null, 2) + '\n')
  console.log(`Wrote ${BUNDLE_PATH} with ${posts.length} post(s).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
