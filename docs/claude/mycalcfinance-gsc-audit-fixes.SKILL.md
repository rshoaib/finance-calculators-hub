---
name: mycalcfinance-gsc-audit-fixes
description: Weekly Google Search Console audit for mycalcfinance.com with auto-fixes for indexing, Core Web Vitals, low-CTR pages, and broken links.
---

Run a weekly Google Search Console audit for mycalcfinance.com and apply automated fixes where safe. Post content lives in Supabase (`blog_posts` table) and the live site is mycalcfinance.com.

## Objective
Identify and fix SEO issues surfaced by Google Search Console so that mycalcfinance.com maintains healthy indexing, performance, and click-through rates. Runs every Sunday at 7am local — completes BEFORE the 8am `mycalcfinance-content-refresh` task so findings can inform that run.

## Data sources
- **Google Search Console** (property: `https://mycalcfinance.com/` — URL-prefix, NOT `sc-domain:`). Primary access path for an unattended scheduled run is the service-account helper at `<repo>/src/lib/gsc.js`. It loads credentials from `<repo>/.gsc-service-account.json` (or `GSC_SERVICE_ACCOUNT_JSON` env var) and exposes `querySearchAnalytics`, `getLowCtrPages`, `inspectUrl`, `listSitemaps`, and `isAvailable()`. The service account `gsc-audit-bot@my-project-15076orderviachat.iam.gserviceaccount.com` has Full permission on the property. Call `isAvailable()` first — if it returns false, skip GSC-dependent sections and note the gap in the report. Do NOT fall back to the browser for unattended runs (requires interactive sign-in).
- Supabase `blog_posts` table for mycalcfinance.com (use the connected Supabase MCP to read/update rows). Schema: `slug`, `title`, `excerpt`, `meta_title`, `meta_description`, `category`, `image_url`, `content`, `id`, `author`, `published_at`, `created_at`, `updated_at`. There is no `status` column — every row is live.
- The live site at https://mycalcfinance.com for spot-checking rendered HTML, meta tags, and links.

## Steps

### 1. Coverage / indexing issues
- Use `gsc.inspectUrl({ url })` for sample URLs, or iterate the sitemap (`gsc.listSitemaps()` → fetch sitemap.xml) and inspect anything flagged as excluded.
- List URLs with `indexStatusResult.verdict` of FAIL / NEUTRAL and `coverageState` indicating: Not indexed, Crawled - currently not indexed, Discovered - currently not indexed, Excluded (noindex), Soft 404, Server error (5xx), Redirect error.
- For each excluded URL, check the matching `blog_posts` row:
  - If the slug matches a live row, verify the URL returns 200 and has no `<meta name="robots" content="noindex">`. If noindex is present unintentionally, fix it.
  - If the row doesn't exist but GSC still shows the URL, leave it — it will drop out naturally.
- Request re-indexing via the GSC UI for up to 10 URLs fixed this run (the URL Inspection `requestIndexing` endpoint is browser-only; flag for Rizwan if you need it done).

### 2. Core Web Vitals & mobile usability
- Pull the GSC "Core Web Vitals" (mobile + desktop) and "Mobile Usability" reports. These specific reports aren't exposed on the public Search Console API — use PageSpeed Insights API for per-URL CWV instead, or scrape from CrUX via BigQuery if configured. If neither is available this run, note the gap.
- For each URL flagged Poor / Needs Improvement, capture: LCP, INP, CLS, and the specific issue.
- Identify patterns (e.g., "hero image on /blog/* posts causes LCP > 4s"). Do NOT make template-level code changes autonomously — record findings and flag the top 3 issues as follow-ups for Rizwan.
- Safe auto-fixes you MAY apply directly to affected `blog_posts.content` HTML:
  - Add width/height attributes to `<img>` tags missing them.
  - Compress inline base64 images that exceed 100KB (replace with CDN-hosted versions if a CDN is configured; otherwise flag).
  - Remove empty `<div>` / layout-shifting wrapper elements in post body.

### 3. Low-CTR / low-impression pages
- Call `gsc.getLowCtrPages({ days: 28, minImpressions: 100 })` — returns rows sorted ascending by CTR.
- Target pages in positions 5-20 with CTR < 2% (use `querySearchAnalytics` with `dimensions:['page','query']` to see the top queries per page).
- For each such page (up to 10 per run):
  - Find the matching `blog_posts` row by slug.
  - Rewrite `meta_title` and `meta_description` to better match the top 3 queries driving impressions. Keep `meta_title` <= 60 chars, `meta_description` <= 155 chars. Preserve the primary keyword; make the promise more specific and click-worthy.
  - Update the Supabase row. Log old → new values in the report.
  - NOTE: the blog template at `app/blog/[slug]/page.jsx` prefers `meta_title` / `meta_description` when set, and falls back to `title` / a truncated `excerpt` otherwise. Writing to the `title` or `excerpt` columns changes visible page content (H1 and card excerpt) — always write to the `meta_*` columns for SEO-only rewrites.

### 4. Broken links & redirects
- Crawl internal links in post bodies (`blog_posts.content` HTML) and probe each for 4xx/3xx. GSC's "Links" report covers top pages only — the DB crawl is more complete.
- For internal links pointing to 404 URLs: find the intended target (search `blog_posts` by closest slug match, or check the calculator route list) and update the link. If no good match exists, remove the link and keep the anchor text.
- For external links returning 404: flag in the report but do NOT auto-replace.
- For redirect chains (3xx → 3xx → 200), rewrite to point directly to the final URL.

## Output
Write a summary report to the workspace folder as `gsc-audit-YYYY-MM-DD.md` with these sections:
1. **Summary** — counts of issues found vs. auto-fixed vs. flagged-for-Rizwan per category.
2. **Coverage fixes** — table of URL, issue, action taken.
3. **CWV findings** — top 3 performance issues with suggested template-level fixes.
4. **Title/meta rewrites** — table of slug, old `meta_title`/`meta_description`, new values, top queries driving the rewrite.
5. **Link fixes** — table of post slug, old link, new link (or "removed").
6. **Manual follow-ups** — anything needing Rizwan's judgment.

## Constraints
- NEVER delete a `blog_posts` row.
- NEVER change a post's `slug` (would create new 404s).
- NEVER modify post body prose — only the narrowly-scoped image/link fixes listed above.
- Write SEO rewrites to `meta_title` / `meta_description` ONLY, never to `title` or `excerpt`.
- Cap auto-rewrites at 10 `meta_title`/`meta_description` rewrites per run to keep changes reviewable.
- If `gsc.isAvailable()` returns false, skip GSC-dependent sections (do NOT fall back to browser automation for unattended runs) and note the gap.
- Still perform link/crawl checks against the live site even if GSC is unavailable.

## Success criteria
- Report file saved to workspace folder.
- All Supabase updates applied cleanly (no failed writes).
- `mycalcfinance-content-refresh` (runs 1 hour later) can pick up from a clean state.
