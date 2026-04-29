# mycalcfinance-content-pipeline

Auto-publish one SEO-friendly personal finance article to mycalcfinance.com by committing a Markdown file to the GitHub repo, on the cadence controlled by the Claude scheduled task (plus manual triggers).

**Objective:** On each run, generate and publish ONE helpful, topical, SEO-optimized article to https://mycalcfinance.com/blog/ by writing a Markdown file to `content/blog/<slug>.md` and a hero SVG to `public/blog-images/hero-<slug>.svg`, then committing and pushing to GitHub. The site is a static Next.js export — pushes trigger a Vercel/Cloudflare rebuild and the new post is live within ~1–2 minutes. Cadence is driven by the scheduled task's own cron/frequency plus ad-hoc manual triggers — do NOT enforce hardcoded daily/weekly caps inside the run.

**Fixed infrastructure (do not re-discover these at runtime):**
- Repo: `rshoaib/finance-calculators-hub` on GitHub (origin)
- Local checkout (in scheduled task sandbox): the project root mounted into the run; treat the working tree as authoritative.
- Branch: `master` (push targets origin/master; the static host watches that branch).
- Posts directory: `content/blog/` — one Markdown file per post, named `<slug>.md`.
- Hero images directory: `public/blog-images/` — one SVG per post, named `hero-<slug>.svg`. Served from `https://mycalcfinance.com/blog-images/hero-<slug>.svg`.
- Frontmatter fields per post: `slug`, `title`, `excerpt`, `category`, `author`, `published_at`, `updated_at`, `meta_title`, `meta_description`, `image_url`. Body is HTML (Markdown allows inline HTML — no conversion needed).
- Live site: https://mycalcfinance.com
- Hosting: static export deployed via Git push (Vercel auto-deploys `master`).
- Brand: **MyCalcFinance** — free personal-finance calculators and plain-English guides for individuals and families. Tone: practical, numbers-forward, friendly, no jargon. Never offer personalized financial, tax, or investment advice.
- Default author string: `MyCalcFinance Team`

**No Supabase. No database. No storage bucket.** The Supabase project that previously held posts has been retired — all reads happen at build time from local files, all writes happen as `git commit` + `git push`. Do NOT call Supabase MCP tools for this task.

---

## EXECUTE THESE STEPS IN ORDER

### 1. AUDIT EXISTING POSTS (pick a topic that doesn't collide)

List the existing posts from the filesystem:

```bash
ls content/blog/*.md | sort
```

For a richer view of titles and categories, read frontmatter from the 30 most-recently-modified files:

```bash
ls -t content/blog/*.md | head -30 | while read f; do
  head -n 15 "$f" | sed -n 's/^title: //p; s/^category: //p; s/^published_at: //p'
  echo "---"
done
```

Read the titles to understand coverage, voice, and which calculators already have companion articles. The site's content pillars are:

- **Mortgage & Housing** — mortgage math, refinance, home affordability, PMI, points, ARM vs fixed
- **Loans & Debt** — auto loans, student loans, personal loans, EMI, debt payoff (avalanche vs snowball), debt-to-income
- **Credit Cards** — payoff strategies, APR, minimum payments, balance transfers, utilization
- **Savings & Investing** — compound interest, CDs, high-yield savings, investment returns, dollar-cost averaging
- **Retirement** — 401(k), IRA/Roth IRA, retirement income planning, Social Security timing
- **Budgeting** — zero-based, 50/30/20, envelope, family budgets, emergency funds
- **Taxes** — tax brackets, capital gains, deductions vs credits, withholding, estimated taxes
- **Net Worth & Financial Health** — tracking, goal planning, break-even, inflation impact

### 2. PICK A TOPIC

Choose ONE topic that:

- Fits the site's personal-finance pillars above.
- Is NOT already covered (compare against the audit — no near-duplicate slugs or titles).
- Has clear informational search intent (people Googling to understand or calculate something).
- Prefers long-tail, specific angles (e.g., "How much house can I afford on $75k in 2026?" beats "Home affordability explained").
- Ideally pairs with an on-site calculator you can deep-link to (e.g., mortgage topic → `/mortgage-calculator`).
- Optionally ties to a current 2026 development — use WebSearch briefly to check current Fed funds rate, average mortgage/APR, IRS contribution limits, SALT cap, standard deduction, Social Security COLA, etc., and cite only what you verified.

Record: primary keyword, 2–3 secondary keywords, target audience, search intent, and the on-site calculator to deep-link.

### 3. GENERATE THE ARTICLE

**Length:** 1,500–2,500 words. Content length ~18k–30k chars of HTML is the sweet spot (matches existing posts).

**Format:** Content is stored as HTML (not Markdown). Use native HTML tags: `<p>`, `<h2>`, `<h3>`, `<ul>`, `<ol>`, `<li>`, `<strong>`, `<em>`, `<a href="...">`, `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`, `<blockquote>`. Do NOT use `<h1>` (the site wraps the post with an H1 from the title).

**Style to match existing posts:**

- Opening hook paragraph addressing the reader's money problem or question (no H2 first). Lead with a concrete number or a relatable scenario.
- **~6–10 H2 sections**, each 150–400 words, scannable paragraphs.
- 1–3 H3 subsections where natural.
- **At least one worked numeric example** — show the math with a short table or an ordered list. Finance content earns trust with real numbers.
- At least one `<ul>` or `<ol>` list and one `<table>` when a side-by-side comparison is useful (e.g., avalanche vs snowball, Roth vs traditional).
- **FAQ section at the end:** `<h2>Frequently Asked Questions</h2>` with 5–7 Q&A pairs as `<h3>Question?</h3><p>Answer.</p>` — helps qualify for FAQ rich snippets.
- **Disclaimer block near the end:**
  `<p><em>This article is for general informational purposes only and is not financial, tax, or investment advice. Figures reflect conditions as of <month year> and may change. Consult a qualified financial professional before making decisions about your money.</em></p>`
- **2–4 internal links** to on-site pages. Valid destinations:
  - Blog posts: `/blog/<existing-slug>` (verify with `SELECT slug FROM public.blog_posts;`)
  - Calculator pages (verify against `app/` routes — current set):
    `/mortgage-calculator`, `/mortgage-refinance-calculator`, `/home-affordability-calculator`, `/car-loan-calculator`, `/emi-calculator`, `/student-loan-calculator`, `/credit-card-payoff-calculator`, `/debt-payoff-calculator`, `/debt-to-income-calculator`, `/compound-interest-calculator`, `/cd-calculator`, `/investment-return-calculator`, `/savings-goal-calculator`, `/retirement-calculator`, `/401k-calculator`, `/budget-planner`, `/net-worth-calculator`, `/capital-gains-tax-calculator`, `/tax-bracket-calculator`, `/salary-calculator`, `/inflation-calculator`, `/break-even-calculator`
  - Include at least one link to the on-topic calculator with a clear CTA anchor like "run the numbers in our <Calculator Name>".
- **2–4 outbound citations** to authoritative sources (gov.*, federalreserve.gov, irs.gov, ssa.gov, consumerfinance.gov, treasury.gov, fdic.gov, sec.gov, bls.gov, nerdwallet/bankrate ONLY for widely reported averages with a link). Open in new tab: `<a href="..." target="_blank" rel="noopener noreferrer">`.
- **Hero image:** always produce a simple, on-brand SVG hero and write it to `public/blog-images/hero-<slug>.svg`. Reference it via `image_url: "/blog-images/hero-<slug>.svg"` in the frontmatter. If the SVG can't be produced for any reason, set `image_url` to an empty string and prepend the inline SVG to the HTML body so the post still has a hero on the detail page.

**Quality constraints:**

- Never invent statistics, study names, interest rates, contribution limits, or official figures. If you cite a number, verify it with WebSearch first, and name the source and date of the figure.
- Keep primary keyword density natural (aim ~0.8–1.5%).
- Use semantic (LSI) keywords throughout — APR/APY, principal, amortization, compounding, etc., where they fit.
- Paragraphs 3–5 sentences max. Short sentences for the money-math parts.
- No AI-boilerplate openings ("In today's fast-paced economy…").
- American English, US-centric tax/regulatory framing unless the topic is explicitly global.

### 4. PREPARE THE FILES

- **slug:** kebab-case, <60 chars, keyword-forward, globally unique. Before writing, check:
  `test -f content/blog/<your-slug>.md && echo COLLISION` — if it prints COLLISION, append a distinguishing suffix (e.g., `-2026-guide`) and recheck. Reject the run only if the *exact* slug collides; cadence-based skips (day of week, weekly counts) do NOT apply here.
- **title:** <65 chars for SERP, include primary keyword near the front, include year (2026) when the angle is time-sensitive.
- **excerpt:** 140–160 chars (used as meta description), include primary keyword once, end with a complete sentence.
- **category:** pick one that matches existing values already in use (audit step 1 reveals the set — typical values: `Mortgages`, `Loans`, `Credit`, `Savings`, `Investing`, `Retirement`, `Budgeting`, `Taxes`, `Net Worth`). Do NOT invent a new one unless no existing category fits.
- **author:** `MyCalcFinance Team` (unless the user specifies otherwise).
- **image_url:** `/blog-images/hero-<slug>.svg` if the hero SVG file was written; empty string otherwise.
- **published_at** / **updated_at:** current ISO 8601 timestamp (e.g., `2026-04-19T14:22:12.000Z`). Use the sandbox's current time for both.
- **content (body):** full HTML string. If a hero SVG was generated, also prepend the **raw inline SVG** to the HTML body. This keeps each post self-contained (the hero renders from inline markup even if the separate SVG file is missing) and preserves the existing thumbnail pattern used by the blog index.

### 5. WRITE AND COMMIT

Write the Markdown post file. YAML-quote every frontmatter string value (double quotes, escape embedded `"` as `\"`):

```bash
cat > content/blog/<slug>.md <<'MDEOF'
---
slug: "<slug>"
title: "<title>"
excerpt: "<excerpt>"
category: "<category>"
author: "MyCalcFinance Team"
published_at: "<iso-timestamp>"
updated_at: "<iso-timestamp>"
meta_title: ""
meta_description: ""
image_url: "/blog-images/hero-<slug>.svg"
---

<inline-svg>

<html-body>
MDEOF
```

Write the hero SVG:

```bash
cat > public/blog-images/hero-<slug>.svg <<'SVGEOF'
<svg ...>...</svg>
SVGEOF
```

Commit and push:

```bash
git add content/blog/<slug>.md public/blog-images/hero-<slug>.svg
git commit -m "blog: add <slug>"
git push origin master
```

The static host (Vercel) watches `master` and rebuilds automatically. A typical rebuild of this site is ~1–2 minutes.

### 6. VERIFY THE LIVE URL

Wait ~90 seconds after the push, then WebFetch `https://mycalcfinance.com/blog/<slug>` and confirm:

- The page renders (not a redirect to `/blog`, not a 404).
- The title and first paragraph appear.
- The hero image loads (or, if `image_url` was empty, the inline SVG at the top of the content renders).
- The meta description in `<head>` matches the excerpt (within trimming).

Also WebFetch `https://mycalcfinance.com/blog` and confirm the new post appears in the index (category filter, newest-first).

If the live page 404s after ~3 minutes, check: did `git push` succeed? Is the Vercel deploy green? Was the filename exactly `<slug>.md`? Report the issue in the summary — do NOT rewrite history or force-push.

### 7. REPORT (concise, under 250 words)

- New post: title, live URL
- Category
- Primary keyword, word count (rough), HTML body length in chars
- Internal links used (list)
- Outbound citations (list, with source + date of any figure cited)
- Hero image: file path or "skipped"
- Commit SHA from `git rev-parse HEAD`
- Verified on live URL? yes/no and any issues
- Any skipped steps or warnings

---

## CONSTRAINTS (hard rules)

- **NEVER write a duplicate slug** — always pre-check `content/blog/<slug>.md`.
- **NEVER invent financial statistics, rates, limits, or official figures.** Verify with WebSearch and cite the source + figure date.
- **ALWAYS include the "not financial advice" disclaimer.**
- **Body content is HTML only**, optional inline SVG prepended. Markdown allows inline HTML; do NOT convert the body to Markdown syntax — the renderer uses `dangerouslySetInnerHTML`.
- **NEVER edit or delete existing post files** unless the user explicitly asks. Only add new files. Stale or wrong posts get a follow-up commit from the user, not from the scheduled run.
- **Do NOT call Supabase MCP tools** — Supabase has been retired from this project.
- **Do NOT touch any file outside `content/blog/` and `public/blog-images/`.** No code changes from this task.
- **Do NOT enforce cadence rules inside the run** (day-of-week, same-day duplicates by date, weekly post counts). Cadence is controlled by the scheduled task's cron + manual triggers. The only "already posted" gate is exact slug collision.
- **Do NOT force-push, amend, or rewrite history.** Each post is one new commit on `master`.
- If WebSearch / WebFetch / git push fails mid-run, stop and emit a report explaining what blocked you; do not retry aggressively.
- No personalized advice: no "you should buy", "you should sell", "invest in X". Explain mechanics and trade-offs, let the reader decide.

## SUCCESS CRITERIA

- One new commit on `origin/master` adding `content/blog/<slug>.md` and (usually) `public/blog-images/hero-<slug>.svg`.
- Live URL `https://mycalcfinance.com/blog/<slug>` renders the new article within ~3 minutes of push (Vercel rebuild time).
- Article appears on `https://mycalcfinance.com/blog` index.
- No duplicate or near-duplicate of existing content.
- No fabricated figures; every cited number has a named source and a date.
