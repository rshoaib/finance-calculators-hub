# mycalcfinance-content-pipeline

Auto-publish one SEO-friendly personal finance article to mycalcfinance.com via Supabase, on the cadence controlled by the Claude scheduled task (plus manual triggers).

**Objective:** On each run, generate and publish ONE helpful, topical, SEO-optimized article to https://mycalcfinance.com/blog/ by inserting a row into the Supabase `blog_posts` table. The site reads posts from Supabase at request time (blog index is client-filtered, detail pages use Next.js App Router dynamic params), so NO code commit, NO GitHub push, and NO Vercel redeploy are required. Cadence is driven by the scheduled task's own cron/frequency plus ad-hoc manual triggers — do NOT enforce hardcoded daily/weekly caps inside the run.

**Fixed infrastructure (do not re-discover these at runtime):**
- Supabase project name: mycalcfinance
- Supabase project_id (ref): `fyjqnidhhwxvzllhjfxk`
- Supabase URL: https://fyjqnidhhwxvzllhjfxk.supabase.co
- Table: `public.blog_posts`
- Columns: `id` (int8/auto PK), `slug` (text UNIQUE), `title` (text), `excerpt` (text), `category` (text), `image_url` (text), `author` (text), `published_at` (timestamptz, default now()), `content` (text, stored as HTML + optional leading inline SVG), `created_at` / `updated_at` (timestamptz)
- Storage bucket for hero art: `blog-images` (public). Hero uploaded as `hero-<slug>.svg`, served from `/storage/v1/object/public/blog-images/hero-<slug>.svg`.
- Live site: https://mycalcfinance.com
- Brand: **MyCalcFinance** — free personal-finance calculators and plain-English guides for individuals and families. Tone: practical, numbers-forward, friendly, no jargon. Never offer personalized financial, tax, or investment advice.
- Default author string: `MyCalcFinance Team`

Use the Supabase MCP tools (`mcp__*__list_tables`, `mcp__*__execute_sql`, `mcp__*__apply_migration`). For reads, use `execute_sql`. For the insert, use `execute_sql` with a parameter-safe INSERT (dollar-quoted strings). Storage upload for the hero SVG is done via the Node helper `publish_post.mjs` in the project root (uses `SUPABASE_SERVICE_ROLE_KEY` env var) OR directly through the Supabase storage REST endpoint if the helper is unavailable.

---

## EXECUTE THESE STEPS IN ORDER

### 1. AUDIT EXISTING POSTS (pick a topic that doesn't collide)

Run:

```sql
SELECT slug, title, category, published_at
FROM public.blog_posts
ORDER BY published_at DESC
LIMIT 60;
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
- **Hero image:** always produce a simple, on-brand SVG hero and upload it to the `blog-images` bucket as `hero-<slug>.svg`. Reference it via `image_url = /storage/v1/object/public/blog-images/hero-<slug>.svg`. If the upload step cannot run, set `image_url` to `null` rather than invent a path.

**Quality constraints:**

- Never invent statistics, study names, interest rates, contribution limits, or official figures. If you cite a number, verify it with WebSearch first, and name the source and date of the figure.
- Keep primary keyword density natural (aim ~0.8–1.5%).
- Use semantic (LSI) keywords throughout — APR/APY, principal, amortization, compounding, etc., where they fit.
- Paragraphs 3–5 sentences max. Short sentences for the money-math parts.
- No AI-boilerplate openings ("In today's fast-paced economy…").
- American English, US-centric tax/regulatory framing unless the topic is explicitly global.

### 4. PREPARE THE ROW

- **slug:** kebab-case, <60 chars, keyword-forward, globally unique. Before inserting, run:
  `SELECT 1 FROM public.blog_posts WHERE slug = '<your-slug>';` — if it returns a row, append a distinguishing suffix (e.g., `-2026-guide`) and recheck. Also reject the run only if the *exact* slug collides; cadence-based skips (day of week, weekly counts) do NOT apply here.
- **title:** <65 chars for SERP, include primary keyword near the front, include year (2026) when the angle is time-sensitive.
- **excerpt:** 140–160 chars (used as meta description), include primary keyword once, end with a complete sentence.
- **category:** pick one that matches existing values already in the table (audit step 1 reveals the set — typical values: `Mortgages`, `Loans`, `Credit`, `Savings`, `Investing`, `Retirement`, `Budgeting`, `Taxes`, `Net Worth`). Do NOT invent a new one unless no existing category fits.
- **author:** `MyCalcFinance Team` (unless the user specifies otherwise).
- **image_url:** `/storage/v1/object/public/blog-images/hero-<slug>.svg` after successful upload; `null` if the upload step was skipped.
- **published_at:** `now()` at insert time (ISO timestamp). Use the sandbox's current time.
- **content:** full HTML string. If a hero SVG was generated, prepend the **raw inline SVG** to the HTML (matches the existing `publish_post.mjs` pattern: `svg.trim() + '\n\n' + body.trim()`). This gives each post a self-contained hero even if the storage URL 404s.

### 5. INSERT

Preferred path is the existing helper when env + files are ready:

```bash
# From /sessions/gracious-keen-keller/mnt/mycalcfinance
# Requires SUPABASE_SERVICE_ROLE_KEY in env. Writes ./hero.svg + ./post_body.html into the row.
node publish_post.mjs
```

Otherwise, use the Supabase MCP with dollar-quoted SQL:

```sql
INSERT INTO public.blog_posts (slug, title, excerpt, category, image_url, author, published_at, content)
VALUES (
  $$<slug>$$,
  $$<title>$$,
  $$<excerpt>$$,
  $$<category>$$,
  $$<image_url_or_null>$$,
  $$MyCalcFinance Team$$,
  now(),
  $body$<inline-svg>\n\n<html-content>$body$
);
```

Use distinct dollar-quote tags if any field might contain `$$` (e.g., `$tag$...$tag$`).

After insert, verify:

```sql
SELECT id, slug, title, category, published_at, LENGTH(content) AS content_length
FROM public.blog_posts
WHERE slug = '<slug>';
```

### 6. VERIFY THE LIVE URL

WebFetch `https://mycalcfinance.com/blog/<slug>` and confirm:

- The page renders (not a redirect to `/blog`).
- The title and first paragraph appear.
- The hero image loads (or, if `image_url` was null, the inline SVG at the top of the content renders).
- The meta description in `<head>` matches the excerpt (within trimming).

Also WebFetch `https://mycalcfinance.com/blog` and confirm the new post appears in the index (category filter, newest-first).

If the live page 404s or doesn't render the row, check: did the insert succeed? Is the slug unique? Was there a cached redirect from Vercel? Report the issue in the summary — do NOT delete or update the row.

### 7. REPORT (concise, under 250 words)

- New post: title, live URL
- Category
- Primary keyword, word count (rough), `content_length` chars
- Internal links used (list)
- Outbound citations (list, with source + date of any figure cited)
- Hero image: uploaded URL or "skipped"
- Verified on live URL? yes/no and any issues
- Any skipped steps or warnings

---

## CONSTRAINTS (hard rules)

- **NEVER insert a duplicate slug** — always pre-check.
- **NEVER invent financial statistics, rates, limits, or official figures.** Verify with WebSearch and cite the source + figure date.
- **ALWAYS include the "not financial advice" disclaimer.**
- **NEVER store Markdown in the `content` column** — HTML only, optional inline SVG prepended.
- **NEVER UPDATE or DELETE existing rows in `blog_posts`.** Only INSERT.
- **Do NOT touch any other Supabase table or project** — this task is scoped to project `fyjqnidhhwxvzllhjfxk`, table `public.blog_posts`, and storage bucket `blog-images` only.
- **Do NOT enforce cadence rules inside the run** (day-of-week, same-day duplicates by date, weekly post counts). Cadence is controlled by the scheduled task's cron + manual triggers. The only "already posted" gate is exact slug collision.
- If WebSearch / WebFetch / Supabase MCP auth / storage upload fails mid-run, stop and emit a report explaining what blocked you; do not retry aggressively.
- No personalized advice: no "you should buy", "you should sell", "invest in X". Explain mechanics and trade-offs, let the reader decide.

## SUCCESS CRITERIA

- One new row in `public.blog_posts` with a unique slug.
- Hero SVG present at `https://fyjqnidhhwxvzllhjfxk.supabase.co/storage/v1/object/public/blog-images/hero-<slug>.svg` (or gracefully omitted with `image_url = null`).
- Live URL `https://mycalcfinance.com/blog/<slug>` renders the new article within ~1 minute of insert.
- Article appears on `https://mycalcfinance.com/blog` index.
- No duplicate or near-duplicate of existing content.
- No fabricated figures; every cited number has a named source and a date.
