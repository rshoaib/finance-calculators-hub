---
name: mycalcfinance-gsc-audit-fixes
description: Weekly Google Search Console audit for mycalcfinance.com with auto-fixes for indexing, Core Web Vitals, low-CTR pages, and broken links.
---

Run a weekly Google Search Console audit for mycalcfinance.com and apply automated fixes where safe. Post content lives as Markdown files in `content/blog/<slug>.md` (frontmatter + HTML body) and the live site is mycalcfinance.com, served as a static Next.js export from `/out`.

## Objective
Identify and fix SEO issues surfaced by Google Search Console so that mycalcfinance.com maintains healthy indexing, performance, and click-through rates. Runs every Sunday at 7am local — completes BEFORE the 8am `mycalcfinance-content-refresh` task so findings can inform that run.

## Data sources
- **Google Search Console** (property: `https://mycalcfinance.com/` — URL-prefix, NOT `sc-domain:`). Primary access path for an unattended scheduled run is the service-account helper at `<repo>/src/lib/gsc.js`. It loads credentials from `<repo>/.gsc-service-account.json` (or `GSC_SERVICE_ACCOUNT_JSON` env var) and exposes `querySearchAnalytics`, `getLowCtrPages`, `inspectUrl`, `listSitemaps`, and `isAvailable()`. The service account `gsc-audit-bot@my-project-15076orderviachat.iam.gserviceaccount.com` has Full permission on the property. Call `isAvailable()` first — if it returns false, skip GSC-dependent sections and note the gap in the report. Do NOT fall back to the browser for unattended runs (requires interactive sign-in).
- **Local Markdown files** at `content/blog/<slug>.md`. Each file has YAML frontmatter (`slug`, `title`, `excerpt`, `category`, `author`, `published_at`, `updated_at`, `meta_title`, `meta_description`, `image_url`) and an HTML body. The helper at `<repo>/src/lib/posts.js` exposes `getAllPostsMeta()`, `getAllSlugs()`, and `getPost(slug)` for reads. For writes, edit the Markdown file directly and `git commit && git push` — Vercel auto-rebuilds the static export.
- The live site at https://mycalcfinance.com for spot-checking rendered HTML, meta tags, and links.

## Environment assumptions
- The working directory IS the repo checkout; `git` is configured with push access to `origin/master`.
- Supabase has been retired from this project. Do NOT call Supabase MCP tools — the `blog_posts` table no longer exists.

## Steps

### 1. Coverage / indexing issues
- Use `gsc.inspectUrl({ url })` for sample URLs, or iterate the sitemap (`gsc.listSitemaps()` → fetch sitemap.xml) and inspect anything flagged as excluded.
- List URLs with `indexStatusResult.verdict` of FAIL / NEUTRAL and `coverageState` indicating: Not indexed, Crawled - currently not indexed, Discovered - currently not indexed, Excluded (noindex), Soft 404, Server error (5xx), Redirect error.
- For each excluded URL, check whether the matching post file exists:
  - `test -f content/blog/<slug>.md` — if the file exists, verify the live URL returns 200 and has no `<meta name="robots" content="noindex">`. If noindex is present unintentionally, find the source (layout.jsx, middleware, etc.) and flag it for Rizwan — do NOT autonomously change site-wide templates.
  - If the file does not exist but GSC still shows the URL, leave it — it will drop out naturally.
- Request re-indexing via the GSC UI for up to 10 URLs fixed this run (the URL Inspection `requestIndexing` endpoint is browser-only; flag for Rizwan if you need it done).

### 2. Core Web Vitals & mobile usability
- Pull the GSC "Core Web Vitals" (mobile + desktop) and "Mobile Usability" reports. These specific reports aren't exposed on the public Search Console API — use PageSpeed Insights API for per-URL CWV instead, or scrape from CrUX via BigQuery if configured. If neither is available this run, note the gap.
- For each URL flagged Poor / Needs Improvement, capture: LCP, INP, CLS, and the specific issue.
- Identify patterns (e.g., "hero image on /blog/* posts causes LCP > 4s"). Do NOT make template-level code changes autonomously — record findings and flag the top 3 issues as follow-ups for Rizwan.
- Safe auto-fixes you MAY apply directly to the HTML body of affected `content/blog/<slug>.md` files:
  - Add width/height attributes to `<img>` tags missing them.
  - Compress inline base64 images that exceed 100KB (replace with CDN-hosted versions if a CDN is configured; otherwise flag).
  - Remove empty `<div>` / layout-shifting wrapper elements in post body.
- When editing a post file, preserve the frontmatter block (everything between the two `---` delimiters) byte-for-byte except for bumping `updated_at` to the current ISO 8601 timestamp.

### 3. Low-CTR / low-impression pages
- Call `gsc.getLowCtrPages({ days: 28, minImpressions: 100 })` — returns rows sorted ascending by CTR.
- Target pages in positions 5-20 with CTR < 2% (use `querySearchAnalytics` with `dimensions:['page','query']` to see the top queries per page).
- For each such page (up to 10 per run):
  - Derive the slug from the URL (`/blog/<slug>/` → `<slug>`) and open `content/blog/<slug>.md`.
  - Rewrite the frontmatter `meta_title` and `meta_description` values to better match the top 3 queries driving impressions. Keep `meta_title` <= 60 chars, `meta_description` <= 155 chars. Preserve the primary keyword; make the promise more specific and click-worthy. YAML-quote both values (`"..."`, escape embedded `"` as `\"`).
  - Bump `updated_at` to the current ISO 8601 timestamp.
  - Log old → new values in the report.
  - NOTE: the blog template at `app/blog/[slug]/page.jsx` prefers `meta_title` / `meta_description` when set, and falls back to `title` / a truncated `excerpt` otherwise. Writing to the `title` or `excerpt` frontmatter fields changes visible page content (H1 and card excerpt) — always write to the `meta_*` fields for SEO-only rewrites.

### 4. Broken links & redirects
- Crawl internal links in all post bodies (HTML inside `content/blog/*.md`) and probe each for 4xx/3xx. GSC's "Links" report covers top pages only — the local crawl is more complete.
- For internal links pointing to 404 URLs: find the intended target (search `getAllSlugs()` for closest slug match, or check the calculator route list) and update the link in the post's HTML body. If no good match exists, remove the `<a>` tag and keep the anchor text. Bump `updated_at` when editing.
- For external links returning 404: flag in the report but do NOT auto-replace.
- For redirect chains (3xx → 3xx → 200), rewrite to point directly to the final URL.

### 5. Commit and push fixes
After all per-file edits are done:

```bash
# Confirm only content/blog/*.md files were changed.
git status --short

# Stage just the changed post files.
git add content/blog/

git commit -m "seo: gsc audit fixes $(date +%Y-%m-%d)"
git push origin master
```

Vercel auto-rebuilds on push (~1–2 minutes). Wait ~90 seconds, then spot-check 1–2 of the changed URLs on the live site to confirm the rewritten meta tags are rendering in `<head>`.

If `git push` fails (conflict, auth), STOP — do NOT force-push or rewrite history. Emit a report section explaining the blocker so Rizwan can resolve manually.

## Output
Write a summary report to the workspace folder as `gsc-audit-YYYY-MM-DD.md` with these sections:
1. **Summary** — counts of issues found vs. auto-fixed vs. flagged-for-Rizwan per category.
2. **Coverage fixes** — table of URL, issue, action taken.
3. **CWV findings** — top 3 performance issues with suggested template-level fixes.
4. **Title/meta rewrites** — table of slug, old `meta_title`/`meta_description`, new values, top queries driving the rewrite.
5. **Link fixes** — table of post slug, old link, new link (or "removed").
6. **Commit** — SHA from `git rev-parse HEAD` after the push.
7. **Manual follow-ups** — anything needing Rizwan's judgment.

## Constraints
- NEVER delete a post file (`content/blog/<slug>.md`).
- NEVER change a post's `slug` frontmatter field or rename its file (would create new 404s).
- NEVER modify post body prose — only the narrowly-scoped image/link fixes listed above.
- Write SEO rewrites to frontmatter `meta_title` / `meta_description` ONLY, never to `title` or `excerpt`.
- Cap auto-rewrites at 10 `meta_title`/`meta_description` rewrites per run to keep changes reviewable.
- NEVER touch files outside `content/blog/`. No code, no templates, no config.
- Preserve YAML frontmatter validity: always quote string values, always use `---` delimiters, never reorder keys.
- If `gsc.isAvailable()` returns false, skip GSC-dependent sections (do NOT fall back to browser automation for unattended runs) and note the gap.
- Still perform link/crawl checks against the live site even if GSC is unavailable.
- NEVER force-push, amend, or rewrite history. One commit per run, on `master`.

## Success criteria
- Report file saved to workspace folder.
- One clean commit on `origin/master` with only `content/blog/*.md` changes (or zero commits if no fixes were applicable).
- Vercel deploy completes green within ~3 minutes of push (Rizwan checks the Vercel dashboard if anything looks off).
- `mycalcfinance-content-refresh` (runs 1 hour later) can pick up from a clean state.
