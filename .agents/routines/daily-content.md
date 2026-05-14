# finance-calculators-hub (mycalcfinance.com) — daily content routine

> Triage spec for the scheduled remote agent. This delegates the heavy
> lifting to the existing pipeline docs under `docs/claude/`, which
> are the canonical specs for THIS site's content workflow.

## Mission

Land **one** meaningful change per run that helps mycalcfinance.com. The dominant problem on a finance site is **content freshness + indexation**, so prioritize refreshing stale posts before publishing new ones.

## Pre-flight

1. Read `.agents/context/site-context.md` for brand voice + calculator URL map.
2. Read `.agents/context/target-keywords.md` for the content pillars and gaps.
3. Today's date in `YYYY-MM-DD`. Branch: `master`. Posts dir: `content/blog/`.

## Priority lanes — pick the FIRST lane with work to do

### Lane A — Refresh stuck or stale content (highest priority)

For every `content/blog/*.md`, determine state. **If `googleapis` is installed and `.gsc-service-account.json` (or `GSC_SERVICE_ACCOUNT_JSON` env var) is available**, use `src/lib/gsc.js` for ground truth via `inspectUrl`. Otherwise fall back to heuristics: a post is "likely stale" if its `updated_at` frontmatter is ≥60 days old, or it contains numeric claims older than 90 days (Fed rate, IRS limits, mortgage averages — finance facts decay fast).

If any post qualifies:
- Pick the oldest candidate by `updated_at` frontmatter.
- **Follow the refresh procedure in `docs/claude/mycalcfinance-content-refresh.SKILL.md`** (Section "For each post in the cohort, refresh content"). This handles: numeric facts, date references, internal links, outbound links, disclaimer freshness, optional SEO meta tune.
- Bump `updated_at` frontmatter to today's ISO 8601 timestamp.
- **Do NOT change `slug`, `title`, `published_at`, or `excerpt`.**
- **Process ONE post per run.** The existing refresh skill caps at 8 — but for a daily cadence, one-at-a-time is correct.

### Lane B — Internal-link strengthening (medium priority)

Only run if Lane A has nothing to do.

- Identify the most-indexed posts (use GSC `performanceByPage` if available; otherwise pick the 3 most-recently-updated posts as proxy for "Google likes these").
- Find 1–2 currently-underexposed posts (no inbound internal links from indexed pages or homepage) and add inline contextual links from indexed pages into them. Anchor text from `.agents/context/target-keywords.md`. Never "click here".
- Stop after one file edit.

### Lane C — New post (lowest priority)

Only run if Lanes A and B have nothing to do AND no new post has been published in the last 3 days (`git log --since="3 days ago" --name-only -- content/blog/`).

- Pick the next unticked topic in `.agents/context/target-keywords.md`. Skip topics that already have a `.md` file.
- **Follow the full procedure in `docs/claude/mycalcfinance-content-pipeline.md`** (Steps 2–6). This handles: topic selection, article generation (HTML body), hero SVG, frontmatter, commit message.

## Hard constraints (all lanes)

- **Never more than 1 lane per run.**
- **Never more than 1 post created per run.**
- **Never delete or remove existing content.** Refreshes are additive only.
- **Never fabricate statistics, study names, or citations.** When in doubt, omit the figure.
- **Never skip pre-commit hooks** (`--no-verify`) or bypass signing.
- **Never force-push.** Push target is `origin/master`.
- Avoid AI-tell phrasing. Brand voice is practical, numbers-forward, friendly, no jargon. American English. **Never offer personalized financial, tax, or investment advice.**
- **Never write to Supabase.** This site is file-based (Next.js — content lives under `app/blog/ or content/ (inspect)` in the repo). The only legitimate target for new content is a git commit on the default branch. If you see a Supabase MCP connector attached to this routine, ignore it for content writes — that connector is shared across all routines but only `easyorder-bot` legitimately uses Supabase for content. Writing content to Supabase from this routine will contaminate the orderviachat database (verified incident: 2026-05-14 with online-image-shrinker).

## After the change

1. Run `npm run lint`. If it fails, do not commit.
2. Stage only the files you edited. New posts add the hero SVG at `public/blog-images/`.
3. Commit format (matches existing convention in this repo):
   - Refresh: `blog: refresh <slug> — <one-line why>`
   - Internal link: `seo: cross-links to <target-slug>`
   - New post: `blog: add <slug>`
4. Push to `origin/master`. If push fails on auth, exit cleanly and report — do not retry with embedded credentials.
5. Output a one-paragraph report: lane that ran, files changed, commit SHA, one-sentence justification.

## When to skip

If all three lanes are clear, write one line: "No work today — Lane A clear, Lane B saturated, Lane C in cooldown." Do not manufacture work.

## Gotchas (for future-you reading this)

- Static Next.js export (`output: 'export'`). Vercel rebuilds on push to `master`. No SSR.
- Posts are **Markdown files with HTML bodies**. Frontmatter is YAML (`gray-matter`); body is raw HTML.
- Frontmatter fields: `slug`, `title`, `excerpt`, `category`, `author`, `published_at`, `updated_at`, `meta_title`, `meta_description`, `image_url`. All values double-quoted.
- Hero images: `public/blog-images/hero-<slug>.svg` AND prepended inline to the HTML body. Both needed.
- Calculator routes for internal linking — see `.agents/context/site-context.md`.
