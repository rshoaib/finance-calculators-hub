---
name: mycalcfinance-content-refresh
description: Monthly refresh of existing MyCalcFinance blog posts — update stale stats/dates, fix broken links, tune SEO meta, and rewrite out-of-date sections. Edits Markdown files in `content/blog/` and commits to GitHub.
---

Run a monthly refresh pass over the MyCalcFinance.com blog. Posts live as Markdown files at `content/blog/<slug>.md` (YAML frontmatter + HTML body). The site is a static Next.js export — pushes to `origin/master` trigger a Vercel rebuild (~1–2 minutes) and the updates go live.

## Objective
Keep the existing MyCalcFinance blog accurate, current, and SEO-healthy. Each run should (a) update the oldest/most-stale handful of posts with current figures and live links, (b) tune SEO metadata where CTR is weak, and (c) preserve every post's core narrative and slug. Runs on the 1st Sunday of each month at 8am local — AFTER the GSC audit (7am) so the GSC findings can inform this run.

## Environment assumptions
- The working directory IS the mycalcfinance repo checkout; `git` is configured with push access to `origin/master`.
- Supabase has been retired. Do NOT call Supabase MCP tools — posts are files on disk, not database rows.
- Post reader helper lives at `<repo>/src/lib/posts.js` (`getAllPostsMeta()`, `getAllSlugs()`, `getPost(slug)`).
- Calculator routes available for internal links: `/mortgage-calculator`, `/mortgage-refinance-calculator`, `/home-affordability-calculator`, `/car-loan-calculator`, `/emi-calculator`, `/student-loan-calculator`, `/credit-card-payoff-calculator`, `/debt-payoff-calculator`, `/debt-to-income-calculator`, `/compound-interest-calculator`, `/cd-calculator`, `/investment-return-calculator`, `/savings-goal-calculator`, `/retirement-calculator`, `/401k-calculator`, `/budget-planner`, `/net-worth-calculator`, `/capital-gains-tax-calculator`, `/tax-bracket-calculator`, `/salary-calculator`, `/inflation-calculator`, `/break-even-calculator`.

## Steps

### 1. Gate: only act on the 1st Sunday of the month
This task is dispatched every Sunday at 8am. Most Sundays it should no-op. On non-first Sundays, emit a one-line "skipped (not first Sunday)" report and exit without touching files or git.

```bash
# day of month; first Sunday of any month is on days 1–7
DOM=$(date +%d)
if [ "$DOM" -gt 7 ]; then
  echo "skipped — not first Sunday of month"
  exit 0
fi
```

### 2. Pick the refresh cohort
List post files sorted by `updated_at` frontmatter ascending (oldest first) and pick the **5 most-stale posts** plus up to **3 additional posts flagged by the morning's GSC audit** (see the `gsc-audit-YYYY-MM-DD.md` report in the workspace folder — Section 3 "Title/meta rewrites" is the feed for candidates that already had their meta rewritten an hour ago; those should be skipped this run, but entries under "Manual follow-ups" relating to content staleness are candidates).

```bash
# list posts oldest-first by updated_at
for f in content/blog/*.md; do
  ts=$(awk '/^updated_at:/ {gsub(/"/, ""); print $2; exit}' "$f")
  echo "$ts $f"
done | sort | head -8
```

Cap the run at **8 posts** total. If there are fewer than 5 candidates older than 90 days, refresh only those. Do NOT pad the cohort with recently-updated posts.

### 3. For each post in the cohort, refresh content
Open the file, then for each:

**a. Numeric facts and figures.** Grep the body for numeric claims tied to current conditions — Fed funds rate, average 30-year mortgage APR, average HELOC APR, IRS contribution limits (401k, IRA, HSA), Social Security COLA, SALT cap, standard deduction, estate tax exemption, estimated-tax thresholds. For each one, check with WebSearch whether the figure has changed since the post's last `updated_at`. If the figure is stale, rewrite the sentence with the current figure and cite the source (gov preferred: federalreserve.gov, irs.gov, ssa.gov, fdic.gov, treasury.gov, bls.gov, consumerfinance.gov, sec.gov; bankrate.com / nerdwallet only for widely-reported averages).

**b. Date references.** Update explicit year mentions ("as of 2025", "in tax year 2025") to the current year where the claim is still accurate for the new year. If the claim is year-specific and no longer accurate, either update the figure to match the current year or reframe (e.g., "through 2025" → "through 2026"). Never silently change a year without checking the underlying claim still holds.

**c. Internal links.** Scan `<a href="/...">` tags in the body. For each:
  - If the href points to `/blog/<slug>`, verify `content/blog/<slug>.md` exists. If not, replace with the nearest-match slug (`getAllSlugs()` + fuzzy compare) or remove the link and keep anchor text.
  - If the href points to a calculator route (`/<calc>-calculator` or `/budget-planner` / `/salary-calculator` / `/net-worth-calculator`), verify against the route list in "Environment assumptions". If the route doesn't exist, swap to the closest valid calculator; if none fits, remove the link.

**d. Outbound links.** HEAD-request every external link (3s timeout). For 404/410 responses, replace with the canonical page on the same authority (e.g., IRS moves its contribution-limit page yearly — find the new URL and swap). For 3xx chains, rewrite to the final URL. For persistent failures, remove the `<a>` tag and keep the anchor text.

**e. Disclaimer freshness.** Ensure the disclaimer paragraph at the bottom reads `"<em>This article is for general informational purposes only and is not financial, tax, or investment advice. Figures reflect conditions as of <month year>..."` — update the month/year to the current month.

**f. SEO meta (if flagged).** If GSC audit flagged this post as stale-CTR but did NOT rewrite the meta (i.e., it's in "Manual follow-ups" rather than the "Title/meta rewrites" table), rewrite `meta_title` (<=60 chars) and `meta_description` (<=155 chars) to better match the top queries. Never edit `title` or `excerpt` — those affect visible page content.

**g. Frontmatter bump.** Always bump `updated_at` to the current ISO 8601 timestamp when any edit is made. Do NOT touch `published_at`, `slug`, `author`, or `image_url`. Preserve YAML-quoted string values.

### 4. What NOT to edit
- Do not rewrite the narrative voice, opening hook, or H2/H3 structure of the post.
- Do not delete paragraphs, sections, or FAQ entries. If a fact in a paragraph is obsolete and can't be updated, flag the post in the report under "Manual follow-ups" — do not silently remove content.
- Do not change `slug` or rename files (creates 404s on previously-indexed URLs).
- Do not touch the hero SVG (`public/blog-images/hero-<slug>.svg`) — image refreshes are out of scope.
- Do not insert or reorder internal links beyond replacing broken ones with valid equivalents.
- Do not touch files outside `content/blog/`.

### 5. Commit and push
After all per-file edits are done for this run:

```bash
git status --short                       # sanity-check: only content/blog/*.md changed
git add content/blog/
git commit -m "blog: monthly refresh $(date +%Y-%m)"
git push origin master
```

Vercel auto-rebuilds on push (~1–2 minutes). Wait ~90 seconds, then spot-check 2 of the refreshed URLs on the live site — confirm the visible text reflects the updated figures and the refreshed disclaimer renders.

If `git push` fails (conflict, auth), STOP. Do NOT force-push or rewrite history. Emit a report section explaining the blocker so Rizwan can resolve manually.

### 6. Report
Write `content-refresh-YYYY-MM-DD.md` to the workspace folder with:
1. **Summary** — number of posts refreshed, number flagged for manual follow-up, number skipped.
2. **Per-post changes** — table of slug, what changed (figures updated, links fixed, meta rewritten, disclaimer bumped), and the top source(s) cited for any numeric update.
3. **Manual follow-ups** — posts that contained a claim this run could not verify or safely update.
4. **Commit** — SHA from `git rev-parse HEAD`.
5. **Live spot-check** — the 2 URLs verified post-deploy and any rendering issues found.

## Constraints (hard rules)
- **NEVER invent a statistic, rate, or limit.** If a figure can't be verified, leave the original and flag in "Manual follow-ups".
- **NEVER change a post's `slug` or rename a file.**
- **NEVER delete paragraphs or FAQ entries.** Refresh text in place, flag if unsalvageable.
- **NEVER touch `title`, `excerpt`, `published_at`, `slug`, `author`, or `image_url` in frontmatter.** SEO rewrites go to `meta_title` / `meta_description` only.
- Cap refreshes at 8 posts per run. Reviewable scope > exhaustive coverage.
- Do NOT touch files outside `content/blog/`.
- Do NOT call Supabase MCP tools.
- **NEVER force-push, amend, or rewrite history.** One commit per run, on `master`.
- Preserve YAML frontmatter validity: always quote string values, always use `---` delimiters, never reorder keys.

## Success criteria
- Report file saved to the workspace folder.
- One clean commit on `origin/master` with only `content/blog/*.md` changes (or zero commits if no posts were stale enough to warrant edits).
- Vercel deploy completes green within ~3 minutes of push.
- Every updated numeric claim is traceable to a named, dated source in the report.
