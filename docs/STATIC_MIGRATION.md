# MyCalcFinance — Supabase → Static Export Migration

This site used to read blog posts from Supabase at request time. It now reads
them from Markdown files in `content/blog/` at **build time**, and the entire
site is exported to static HTML/CSS/JS — no server, no database, no monthly
infra bill.

## What changed in the codebase

- **`next.config.mjs`** — `output: 'export'` enabled. Removed Supabase
  `remotePatterns`, removed the `env` block that proxied Supabase keys, and
  removed `redirects()` (incompatible with static export). Added `images.unoptimized: true` and `trailingSlash: true`.
- **`vercel.json`** — Now holds the 8 blog redirects that used to live in
  `next.config.mjs`. Vercel applies them at the edge.
- **`src/lib/posts.js`** *(new)* — Build-time reader: globs
  `content/blog/*.md`, parses frontmatter with `gray-matter`, returns posts
  shaped exactly like the old Supabase rows.
- **`app/blog/page.jsx`**, **`app/blog/[slug]/page.jsx`**,
  **`app/sitemap.js`** — Now import from `src/lib/posts` instead of
  `src/lib/supabaseClient`. `revalidate` removed.
  `sitemap.js` also needs `export const dynamic = 'force-static'` —
  Next 16 treats the sitemap as dynamic by default, which breaks
  `output: 'export'` with a "couldn't be rendered statically" error.
- **`scripts/export-blog-from-supabase.mjs`** *(new, one-shot)* — Pulls every
  row from Supabase and writes `content/blog/<slug>.md` plus
  `public/blog-images/hero-<slug>.svg`.
- **`package.json`** — Added `gray-matter`. Added the
  `npm run export:blog` script. `npm start` now serves the static
  `out/` directory (the old `next start` doesn't work with `output: 'export'`).
- **`docs/claude/mycalcfinance-content-pipeline.md`** — Rewritten so the
  Claude scheduled task writes Markdown files + `git commit/push` instead of
  inserting into Supabase.
- `src/lib/supabaseClient.js` and `@supabase/supabase-js` are intentionally
  left in place until you've verified the build, then you can delete them.

## What you need to run (one time, on your Windows machine)

From `C:\Projects\mycalcfinance`:

```cmd
git checkout -b static-migration

npm install

REM 1. Pull all 50 blog posts + hero SVGs from Supabase into local files.
REM    Reads SUPABASE_SERVICE_ROLE_KEY from .env.local.
npm run export:blog

REM 2. Build the static site.
npm run build

REM 3. Preview locally (serves /out on http://localhost:3000).
npm start
```

Open the preview, click around, and confirm:

- `/blog` lists all posts.
- `/blog/<some-slug>` renders correctly with hero image + body content.
- A few calculator pages render (they shouldn't have changed).
- `/sitemap.xml` includes blog URLs.

## Deploy

If everything looks right:

```cmd
git add -A
git commit -m "Migrate from Supabase to static export"
git push origin static-migration
```

Open a PR on GitHub. Once merged to `master`, Vercel auto-deploys the static
build. The site URL doesn't change.

**On Vercel**, go to the project's Environment Variables and delete:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

(Not strictly required — they're just dead weight now.)

## Cleanup after verification

Once you've confirmed the live site works:

```cmd
npm uninstall @supabase/supabase-js
del src\lib\supabaseClient.js
del .env.vercel
```

Edit `.env`, `.env.local`, `.env.example` to remove the `SUPABASE_*` and
`VITE_SUPABASE_*` lines.

Then in Supabase: pause or delete the `mycalcfinance` project. Bill stops.

## Going forward

The Claude scheduled task `mycalcfinance-blog-writer` now publishes by:

1. Generating `content/blog/<slug>.md` (frontmatter + HTML body).
2. Generating `public/blog-images/hero-<slug>.svg`.
3. Running `git add … && git commit -m "blog: add <slug>" && git push origin master`.
4. Vercel auto-rebuilds (~1–2 min) and the new post is live.

Cadence is unchanged — still controlled by the scheduled task's cron and
manual triggers.

## Rollback

Everything is on the `static-migration` branch. To abandon:

```cmd
git checkout master
git branch -D static-migration
```

`master` is untouched and still talks to Supabase.
