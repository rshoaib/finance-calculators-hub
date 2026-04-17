# Coverage fixes shipped — 2026-04-17

Follow-up action pass after the coverage probe identified 105 programmatic SEO pages as orphans with zero internal links. All changes are staged in the repo and ready to deploy.

## What changed

### Internal linking — the primary fix

Added a new `PopularCalculations` component and wired it into the 3 hub calculator pages that parent the 105 programmatic pages. This turns those hubs into real discovery nodes for Googlebot.

| Hub page | SEO pages now linked | Component |
|---|---:|---|
| `/salary-calculator` | 25 salary + 17 hourly = **42** | `PopularCalculations` ×2 |
| `/mortgage-calculator` | **30** mortgage | `PopularCalculations` ×1 |
| `/savings-goal-calculator` | **33** savings | `PopularCalculations` ×1 |

All 105 programmatic pages now have at least one inbound link from a well-linked hub. Before this change, grep across the site confirmed zero internal links to any `/salary-X-a-year-is-how-much-*`, `/X-dollars-an-hour-is-*`, `/mortgage-payment-on-*`, or `/how-long-to-save-*` URL from anywhere.

Files touched:
- New: `src/components/PopularCalculations.jsx`
- Updated: `app/salary-calculator/page.jsx`, `app/mortgage-calculator/page.jsx`, `app/savings-goal-calculator/page.jsx`

### Sitemap lastmod — the secondary fix

Replaced `new Date()` with stable date constants in `app/sitemap.js`:

- Static routes (homepage, /blog, /about, /contact, /privacy-policy) → `STATIC_LASTMOD = 2026-04-17`
- All 22 calculators → `STATIC_LASTMOD = 2026-04-17`
- Blog posts → **`updated_at`** (was `published_at`) so link-fix passes like yesterday's actually bump the sitemap signal
- 105 programmatic SEO pages → `SEO_PAGES_LASTMOD = 2025-12-01` (unchanged, already a constant)

Before: every Vercel deploy produced a brand-new `lastmod` on 27 unchanged URLs. That "cry-wolf" signal trains Google to ignore lastmod. After: lastmod changes only when content actually changes. Rizwan should bump `STATIC_LASTMOD` manually if a calculator UI is materially updated.

File touched: `app/sitemap.js`.

### Housekeeping

- `public/sitemap.xml` was shadowed by `app/sitemap.js` and contained a stale 2026-02-21 snapshot. Rewrote it to an empty `<urlset>` with a comment explaining it's obsolete. (The sandbox couldn't `rm` it — Rizwan should `git rm public/sitemap.xml` locally.)
- `probe.mjs` from the coverage-probe run is kept in the repo root as reference. Safe to delete.

### Sitemap submitted to GSC

Called `webmasters.sitemaps.submit` with the service account credentials. GSC response:

```
path: https://mycalcfinance.com/sitemap.xml
lastSubmitted: 2026-04-17T19:50:57.110Z
isPending: true
warnings: 0, errors: 0
contents: 177 submitted, 0 indexed (stale counter)
```

`isPending: true` means Google has queued a re-fetch. Useful but weaker than a full internal-link overhaul, which is why we did both.

## What to expect

After Rizwan ships these changes (git push → Vercel deploy):

1. **Week 1–2:** The 105 orphan URLs transition from `URL is unknown to Google` → `Discovered - currently not indexed` → `Crawled - currently not indexed`. Don't expect instant indexation.
2. **Week 2–4:** A meaningful fraction (best guess: 40–60% of the 105 programmatic pages) should reach `Submitted and indexed`. Programmatic pages are notoriously thin to Google, so some will stall at "Crawled - currently not indexed" — that's normal and usually means the page needs more content depth or stronger entity signals to cross the bar.
3. **Week 4+:** Sunday audits will start having enough indexed long-tail pages to produce meaningful CTR data. That's when the title/meta-rewrite branch of the scheduled task becomes useful.

## Deploy checklist for Rizwan

- [ ] `git add app/sitemap.js app/salary-calculator/page.jsx app/mortgage-calculator/page.jsx app/savings-goal-calculator/page.jsx src/components/PopularCalculations.jsx`
- [ ] `git rm public/sitemap.xml` (optional cleanup)
- [ ] `git commit -m "SEO: link programmatic pages from hub calculators + stabilize sitemap lastmod"`
- [ ] `git push` → Vercel builds → deploys
- [ ] After deploy, visit https://mycalcfinance.com/salary-calculator and confirm the "Popular salary calculations" and "Popular hourly-wage calculations" sections render at the bottom
- [ ] Optional: re-run `node probe.mjs` a week after deploy to watch the unknown → discovered transition
