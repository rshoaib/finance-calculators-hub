# MyCalcFinance Content Refresh — 2026-05-03

**Run:** scheduled `mycalcfinance-content-refresh`, 1st Sunday of the month, 8am
**Date gate:** 2026-05-03 is the 1st Sunday of May 2026 → ran the work pass.
**Repo branch:** `master`
**Commit:** `a88f2ed16bddc174952fd9adf7b5255c08c0e554`
**Pushed:** clean fast-forward from `ecdad10` → `a88f2ed` on `origin/master`.
**Verified live:** both refreshed URLs render the updated content after Vercel rebuild.

## 1. Summary

| Category | Count |
|---|---:|
| Posts refreshed | 3 |
| Posts flagged for manual follow-up | 5 |
| Posts skipped (recently-updated, no flag) | 60 |

**Why only 3 posts (not the typical 5+):** every post in `content/blog/` has the same `updated_at` of `2026-04-17T12:46:07.705Z` from a prior bulk-touch operation, which is only ~16 days old. Per the SKILL doc Section 2 ("If there are fewer than 5 candidates older than 90 days, refresh only those. Do NOT pad the cohort with recently-updated posts"), the staleness component yields zero candidates. The cohort was therefore drawn entirely from the morning's GSC audit "Manual follow-ups" section, capped at 3 per the SKILL.

## 2. Per-post changes

| Slug | Changes | Sources cited |
|---|---|---|
| `roth-401k-vs-traditional-401k-2026` | (a) Replaced dead IRS SECURE 2.0 W-2 link with the IRS Treasury final-regs page on the new Roth catch-up rule (better topical fit for "employers can offer a Roth match" anchor context). (b) Replaced dead DOL EBSA SECURE 2.0 FAQ link with the canonical EBSA SECURE 2.0 law page. (c) Bumped disclaimer "as of November 2025" → "as of May 2026" per SKILL Section 3.e. (d) Bumped `updated_at`. | IRS news release on Roth catch-up final regs (`/newsroom/treasury-irs-issue-final-regulations-on-new-roth-catch-up-rule-other-secure-2point0-act-provisions`); DOL EBSA SECURE 2.0 of 2022 (`/agencies/ebsa/laws-and-regulations/laws/secure-2-0-act-of-2022`). |
| `required-minimum-distributions-rmd-2026-guide` | (a) Replaced dead DOL EBSA SECURE 2.0 FAQ link with the canonical EBSA SECURE 2.0 law page. (b) Bumped `updated_at`. Disclaimer already said "May 2026" — left untouched. | DOL EBSA SECURE 2.0 of 2022 (same canonical as above). |
| `biweekly-mortgage-payments-vs-monthly-2026` | (a) Replaced CFPB en-1947 link (now 301s to an off-topic ARM page per the morning's GSC audit) with Ask CFPB en-1943 ("How does paying down a mortgage work?") — a topic-correct CFPB explainer about applying extra payments to principal, on the same authority. (b) Bumped disclaimer "as of April 2026" → "as of May 2026". (c) Populated empty `meta_title` (53 chars) and `meta_description` (154 chars), both within the SKILL caps; this is the first batch from the GSC audit's empty-meta hand-off (Section 7 follow-up #1). Existing `title` and `excerpt` left untouched per SKILL Section 3.f / Constraints. (d) Bumped `updated_at`. | Consumer Financial Protection Bureau (`/ask-cfpb/how-does-paying-down-a-mortgage-work-en-1943/`) — verified live via web fetch. The $108,846 figure cited in the new meta_description is the post's own table value at $400K / 6.30% (Freddie Mac PMMS, week of Apr 16, 2026), not invented. |

No `slug`, `title`, `excerpt`, `published_at`, `author`, or `image_url` values were modified. SEO meta rewrites were limited to one post (the empty-meta `biweekly-mortgage` post). No paragraphs, sections, or FAQ entries were deleted.

## 3. Manual follow-ups

1. **`mortgage-recast-vs-refinance-2026.md` — same CFPB en-1947 redirect** as `biweekly-mortgage-payments-vs-monthly-2026.md`. The morning's GSC audit flagged both posts, but the SKILL's per-run cap on GSC additions to the cohort (3) excluded one. Recommend including this post in the next run; the canonical replacement is already known: swap to `https://www.consumerfinance.gov/ask-cfpb/how-does-paying-down-a-mortgage-work-en-1943/`.
2. **Empty `meta_title`/`meta_description` across ~53 remaining posts.** The GSC audit's manual follow-up #1 enumerated 54 posts with empty meta; this run populated 1 (the cohort post `biweekly-mortgage-payments-vs-monthly-2026`), leaving ~53. The SKILL caps SEO rewrites to GSC-flagged stale-CTR posts on a per-run basis; without per-post GSC top-query data for each of the 53, batch-populating would be guesswork. Recommend either (a) the GSC audit start emitting top-query data per empty-meta post into its weekly report so the content-refresh task has signal to draft against, or (b) Rizwan picks the 5–10 highest-impression empty-meta posts and queues them for next month explicitly. (`hsa-calculator-guide-2026` and `sinking-funds-budget-guide-2026` were already populated by this morning's GSC audit and are not in the 53.)
3. **External 403/405 bot-blocks (informational, no action).** The morning's GSC audit flagged 5 external links that return 403/405 to curl but render fine in browsers (Bankrate ARM/HYSA pages, fha.com, bogleheads.org, my529.org). These are not in this run's cohort and need no action — the `web_fetch` MCP tool used in spot-checks confirms they are reachable. They should remain in audit reports for visibility but not be auto-rewritten.
4. **Pre-existing index/HEAD lock files in `.git/`.** Same operational issue the GSC audit reported in its Section 7 item 7 (`.git/index.lock`, `.git/HEAD.lock`, `.git/old.index.lock`, `.git/old.HEAD.lock` exist as 0-byte files owned by the same UID but cannot be unlinked or moved on the virtiofs mount — `Operation not permitted`). This run worked around it by cloning the repo into `/tmp/mycalcfinance-scratch` (a tmpfs path), making edits there, and pushing from the clone; the edited files were then copied back to the mount so the working tree stays in sync. Recommend Rizwan SSH to the host and `rm -f .git/*.lock .git/old.*.lock` once, since the sandbox cannot resolve this from inside.
5. **Cohort-staleness drought.** All 63 posts share `updated_at: 2026-04-17` from a bulk operation, so no post will register as "stale" (>90 days) until 2026-07-16 by the SKILL's own rule. Until then, content-refresh runs will be entirely GSC-driven. If the GSC audit produces few or no manual follow-ups in a given month, the run will be near-empty. Recommend either keeping the bulk-touch behavior in mind when reading future "small cohort" reports, or letting the SKILL pick the oldest-by-`published_at` as a tiebreaker when all `updated_at` values cluster.

No claims required a numeric verification this run — the IRS/IRA limits in the affected posts (401(k) $24,500, IRA $7,500, QCD $111,000, RMD age 73/75, missed-RMD penalty 25%/10%) were all spot-verified against current IRS guidance via WebSearch and were already correct. No numbers were changed; only dead URLs and disclaimer dates.

## 4. Commit

```
commit a88f2ed16bddc174952fd9adf7b5255c08c0e554
Author: Rizwan (content-refresh) <segmentbi@gmail.com>

    blog: monthly refresh 2026-05 (link fixes + disclaimer/meta tune)

    - roth-401k-vs-traditional-401k-2026: replace dead IRS SECURE 2.0 W-2 URL
      (now 404) with IRS final-regs page on Roth catch-up rule; replace dead
      DOL EBSA SECURE 2.0 FAQ URL with canonical EBSA SECURE 2.0 law page;
      bump disclaimer 'as of November 2025' -> 'as of May 2026'.
    - required-minimum-distributions-rmd-2026-guide: replace dead DOL EBSA
      SECURE 2.0 FAQ URL with canonical EBSA SECURE 2.0 law page.
    - biweekly-mortgage-payments-vs-monthly-2026: replace CFPB en-1947 link
      (now 301s to off-topic ARM page) with Ask CFPB en-1943 ('How does
      paying down a mortgage work?'); bump disclaimer to May 2026; populate
      empty meta_title/meta_description per GSC follow-up.
    - updated_at bumped on all three files.

 content/blog/biweekly-mortgage-payments-vs-monthly-2026.md    | 10 +++++-----
 content/blog/required-minimum-distributions-rmd-2026-guide.md |  4 ++--
 content/blog/roth-401k-vs-traditional-401k-2026.md            |  8 ++++----
 3 files changed, 11 insertions(+), 11 deletions(-)
```

Pushed to `origin/master` cleanly: `ecdad10..a88f2ed master -> master`. No force-push, no amend, no history rewrite. One commit per the SKILL constraint.

## 5. Live spot-check

Vercel rebuild completed within ~90 seconds of push. Both spot-checked URLs render the updated content:

**`https://mycalcfinance.com/blog/roth-401k-vs-traditional-401k-2026/`** (HTTP 200, 67,735 bytes)
- New IRS final-regs link present (2 occurrences: in body + JSON-LD); old `secure-2-0-act-changes-affect-how-businesses-complete-forms-w-2` link absent (0 occurrences).
- New DOL EBSA SECURE 2.0 law-page link present (2 occurrences); old `about-ebsa/our-activities/resource-center/faqs/secure-2.0-act` link absent.
- Disclaimer renders as "as of May 2026 for tax year 2026 and may change" ✓.

**`https://mycalcfinance.com/blog/biweekly-mortgage-payments-vs-monthly-2026/`** (HTTP 200, 65,447 bytes)
- New CFPB en-1943 link present (2 occurrences: in body + JSON-LD); old en-1947 redirect target absent.
- Disclaimer renders as "as of May 2026 and may change" ✓.
- New `<title>Biweekly Mortgage Payments vs Monthly 2026: Real Math</title>` rendered in head.
- New `<meta name="description" content="Biweekly mortgage payments add one extra annual payment. On a $400K, 6.30% 2026 loan that's ~$108K saved and 5+ years off — plus the free DIY 1/12 method.">` rendered in head (apostrophe HTML-entity-encoded as `&#x27;`, which is correct HTML).

No rendering issues detected. The third refreshed post (`required-minimum-distributions-rmd-2026-guide`) was not spot-checked beyond the file-level diff verification, but its single change (DOL link swap) is identical to the swap verified working on post 1.
