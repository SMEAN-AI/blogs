# Smean Blog

Markdown source for posts on https://smean.ai/blog.

## Adding a post

1. Create the file under `posts/`. You can nest by year, category, or
   anything that helps you stay organized - the URL doesn't reflect
   the folder structure:

   ```
   posts/2026/launch-x.md           → /blog/launch-x
   posts/tutorials/get-started.md   → /blog/get-started
   ```

   The filename (without `.md`) is the URL slug. Slugs must be unique
   across the whole tree.

2. Start the file with YAML frontmatter:

   ```markdown
   ---
   title: "Your post title"
   excerpt: "One or two sentences that show on the index page."
   date: 2026-01-15
   category: Product
   readingMin: 4
   ---

   Body content in Markdown.
   ```

   **Required:** `title`, `excerpt`, `date`, `category`.
   **Optional:** `readingMin` (auto-estimated if omitted).

   `category` must be one of: `Product`, `Industry`, `Tutorial`,
   `Case Study`.

3. Rebuild the index:

   ```bash
   npm run build-index
   ```

   This rescans `posts/`, sorts by date (newest first), and writes
   `posts/index.bundle.json`. The site reads that one file for its
   listing page - CI will fail the PR if you forget.

4. Commit the markdown **and** the regenerated bundle. Once merged to
   `main`, the post goes live within a minute.

## Khmer translation (optional)

Drop a sibling file with `.km.md` next to the English file:

```
posts/2026/launch-x.md      ← English (required, canonical)
posts/2026/launch-x.km.md   ← Khmer (optional)
```

The Khmer file only needs `title`, `excerpt`, and the translated body:

```markdown
---
title: "ចំណងជើងជាខ្មែរ"
excerpt: "សេចក្តីសង្ខេបជាខ្មែរ។"
---

មាតិកាជាខ្មែរ…
```

Date, category, and `readingMin` are inherited from the English file -
don't repeat them. Posts without a Khmer file fall back to English with
a small "Khmer coming soon" notice.

## Slug rules

Lowercase letters, digits, and hyphens only. Keep slugs short and
descriptive - they show up in the URL. Slugs must be unique across the
whole `posts/` tree regardless of which folder a file lives in.

## Images

Place images under `assets/<slug>/<name>.png` and reference them with
a relative path:

```markdown
![alt text](./assets/your-slug/diagram.png)
```
