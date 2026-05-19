# SMEAN Blog

Markdown source for posts on https://smean.ai/blog.

## Adding a post

1. Create `posts/<slug>.md`. The filename becomes the URL slug, e.g.
   `posts/introducing-smean-2.md` → `/blog/introducing-smean-2`.

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

3. Add the slug to `posts/index.json` — the order in that array is the
   order posts appear on the index page (newest first).

4. Open a PR. Once merged to `main`, the post goes live within a minute.

## Slug rules

Lowercase letters, digits, and hyphens only. Keep it short and
descriptive — it shows up in the URL.

## Images

Place images under `assets/<slug>/<name>.png` and reference them with
a relative path:

```markdown
![alt text](./assets/your-slug/diagram.png)
```
