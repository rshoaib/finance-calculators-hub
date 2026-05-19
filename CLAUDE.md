# MyCalcFinance — Project Notes for Claude

Next.js financial-calculator site. Production on Vercel.

## Folder structure

This project follows the [standard web project structure](../../Users/Riz/.claude/projects/C--Projects/memory/feedback_web_project_structure.md):

```
app/                  Next.js App Router (public site)
src/                  components, lib, data, utils, calculators
content/blog/         MDX/markdown blog posts
public/               static assets (incl. blog-images/)
scripts/              keeper CLI scripts (external_probe.mjs, link_crawl.mjs)
data/                 persistent datasets (gsc_daily.csv, gsc_pages.json)
reports/              date-stamped audit outputs
  ├── gsc/            Google Search Console audit snapshots (markdown)
  ├── seo/            SEO audits (seo-audit-YYYY-MM-DD.md)
  ├── content/        content-refresh notes
  └── links/          external_links.json + external_results.json
.agents/              routines, agents, and shared context (hidden — infra, not site code)
  ├── routines/       daily-content.md, etc.
  └── context/        site-context.md, target-keywords.md, gsc-snapshot.md
docs/                 longer-form project docs (claude/ skills, migrations)
.claude/              project-scoped Claude Code config
.github/workflows/    cron via GitHub Actions
```

## Conventions

- **Report filenames are date-stamped:** `reports/gsc/2026-05-10.md`, never `latest.md`.
- **Scripts are dumb, agents reason.** `scripts/*.mjs` makes one API call or runs one task. Anything multi-step + reasoning belongs under `agents/`.
- **GSC service account** lives at `.secrets/gsc-service-account.json` (gitignored — the whole `.secrets/` folder is). Loader is `src/lib/gsc.js`.

## Verifying routine output (don't trust the report text)

Per the user's "trust observable state" rule, when a routine claims to have done something, verify against the source — not the routine's own summary:

| Routine claim | How to verify |
|---|---|
| Published a blog post | `ls content/blog/*.md` + `git log --oneline -10 content/blog/` |
| Generated a GSC audit | `ls reports/gsc/` — file should be dated today |
| Pinged sitemap / IndexNow | check Vercel logs or `data/gsc_pages.json` for indexed timestamp |
| Fixed broken links | re-run `node scripts/link_crawl.mjs` and diff output |

## Branch

Default branch is `master` (not `main`).

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build
node scripts/external_probe.mjs   # check external link health
node scripts/link_crawl.mjs       # crawl internal links
```
