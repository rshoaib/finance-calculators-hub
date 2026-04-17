# mycalcfinance.com — Coverage Probe 2026-04-17

Ad-hoc follow-up to the weekly audit. Goal: explain why the Sitemaps report shows "177 submitted, 0 indexed" and identify the highest-leverage fix.

## Method

Called `inspectUrl` (GSC URL Inspection API) on a stratified sample of 24 URLs drawn from https://mycalcfinance.com/sitemap.xml — covering homepage, blog index, conversion pages, a mix of calculators (old and new), and a mix of blog posts.

## Headline finding

**The "0 indexed" number in the Sitemaps report is wrong / stale.** Real-time `inspectUrl` verdicts say ~42% of the sample is actually `Submitted and indexed`:

| Category | Indexed | Total sampled |
|---|---:|---:|
| Homepage | 1 | 1 |
| Calculators | 4 | 8 |
| Blog posts | 4 | 11 |
| Other (about/contact/privacy/blog-index) | 1 | 4 |
| **Total** | **10** | **24** |

Extrapolating, roughly **70–80 of the 177 sitemap URLs are probably already indexed** — the Sitemaps report's "indexed" counter just hasn't caught up. That's important context: the situation isn't "Google ignored our site," it's "discovery is slow and uneven."

## The real problem — 58% of the sample is `URL is unknown to Google`

14 of 24 URLs came back `verdict=NEUTRAL, coverageState="URL is unknown to Google"` with every field blank: `lastCrawlTime=undefined`, `pageFetchState=PAGE_FETCH_STATE_UNSPECIFIED`, `indexingState=INDEXING_STATE_UNSPECIFIED`. Google has literally never fetched them. Examples: `/cd-calculator`, `/emi-calculator`, `/student-loan-calculator`, `/mortgage-refinance-calculator`, `/contact`, `/privacy-policy`, `/blog` (the index!), and 7 blog posts including `emergency-fund-guide`, `apr-vs-apy-difference-explained`, and `retirement-savings-by-age-benchmarks-2026`.

For the **10 URLs that are indexed**, the detail field `sitemap` is empty (`length=0`) on every single one, meaning Google did not credit the sitemap as the discovery source. They were found via internal links or the homepage crawl instead.

That's the diagnosis: **the sitemap isn't driving discovery**. Google hasn't processed it as a URL inventory. Pages that happen to be linked from the homepage get crawled and indexed; pages that aren't well-linked stay `unknown`.

## Supporting evidence

- `robots.txt` on the live site is `User-agent: * / Allow: /` and references `sitemap.xml` — no blocker there.
- The `<meta name="robots">` tag on blog posts does not emit `noindex` — template-level check passes.
- Newest-crawled indexed URLs were crawled today: `/blog/what-to-do-with-tax-refund-2026` (2026-04-17 17:06 UTC) and `/blog/hsa-calculator-guide-2026` (2026-04-17 16:32 UTC). Older indexed pages go back to late Feb. So crawling IS active, just not comprehensive.
- All indexed URLs were crawled as MOBILE (smartphone Googlebot) — mobile-first indexing is working correctly.
- `googleCanonical` matches `userCanonical` on every indexed URL — no duplicate-content confusion.

## Recommendation, ranked by leverage

1. **Re-submit the sitemap and bump its `lastmod` values.** In GSC → Sitemaps → resubmit `https://mycalcfinance.com/sitemap.xml`. Then check if any of the 177 URLs has a `lastmod` date older than 6 months or missing entirely — Google deprioritizes sitemaps whose `lastmod` dates don't change. (The scheduled-task helper can pull the sitemap and report.) **Estimated impact: moves 20–40 URLs from `unknown` → `crawled` over ~2 weeks.**

2. **Add internal links from the homepage and `/blog` index to every calculator and every blog post.** The 10 indexed URLs all have 0–2 referring URLs — the discovery graph is thin. Specifically: the `/blog` index itself is `unknown to Google`, which means blog posts only linked from there will stay orphaned. Fix the blog index first, then ensure the homepage links to all 22 calculators (not just the featured ones). **Estimated impact: unblocks the 7 blog posts that are currently orphan-linked.**

3. **Request indexing via the GSC UI for the top 10 high-value unknown URLs.** Manual — paste each URL into Search Console's URL Inspection search bar and click "Request indexing." Daily quota is 10–12 in the UI. Prioritize: `/blog`, `/emi-calculator`, `/cd-calculator`, `/student-loan-calculator`, `/mortgage-refinance-calculator`, `/blog/emergency-fund-guide`, `/blog/compound-interest-power`, `/blog/apr-vs-apy-difference-explained`, `/blog/retirement-savings-by-age-benchmarks-2026`, `/blog/savings-goal-calculator-guide-2026`.

4. **Skip manual `meta_title` editorial for now.** The 3 SEO follow-ups from yesterday's audit (short titles for long-title posts, etc.) are correct but premature — you can't CTR-optimize pages Google hasn't crawled. Do them after #1–3 move indexation up.

## Raw data

24-URL probe result is in `/tmp/probe_results.json` on the sandbox; the probe script is at `probe.mjs` in the repo root. Re-run with `node probe.mjs` anytime.

## Run metadata

- GSC property: `https://mycalcfinance.com/`
- Service account: `gsc-audit-bot@my-project-15076orderviachat.iam.gserviceaccount.com`
- URLs probed: 24
- Probe duration: ~20s (URL Inspection API has no visible rate-limiting at this volume; daily quota 2000)
