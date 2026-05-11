# MyCalcFinance — Site Context

> **URL**: https://mycalcfinance.com
> **Stack**: Next.js 16 (static export) + Markdown content + Vercel
> **Revenue**: AdSense
> **Core Value**: Free personal-finance calculators and plain-English guides. No signup, no data stored.

---

## 🎤 Brand Voice

- **Tone**: Practical, numbers-forward, friendly, no jargon. Like a financially literate friend who actually does the math.
- **Style**: Short paragraphs (3–5 sentences). Lead with a concrete number or scenario. Show your work in worked examples.
- **Address**: Second person ("you"). Audience: US-based individuals and families.
- **Values**: Privacy-first, free, never personalized financial/tax/investment advice.
- **Hard rule**: Never offer personalized financial, tax, or investment advice. Always include the disclaimer block.
- **Citations**: Government sources only for figures (irs.gov, federalreserve.gov, ssa.gov, fdic.gov, treasury.gov, bls.gov, consumerfinance.gov, sec.gov). Bankrate/NerdWallet only for widely-reported averages with a link.

---

## 🔗 Internal Link Map (Calculator Routes)

Always include at least one deep link to the most relevant on-site calculator with a clear CTA anchor like "run the numbers in our <Calculator Name>".

| Calculator | URL | Best anchor texts |
|---|---|---|
| Mortgage | `/mortgage-calculator` | "mortgage calculator", "run the mortgage math" |
| Mortgage Refinance | `/mortgage-refinance-calculator` | "refinance calculator", "check break-even on a refi" |
| Home Affordability | `/home-affordability-calculator` | "how much house can I afford" |
| Car Loan | `/car-loan-calculator` | "car loan calculator" |
| EMI | `/emi-calculator` | "EMI calculator" |
| Student Loan | `/student-loan-calculator` | "student loan calculator" |
| Credit Card Payoff | `/credit-card-payoff-calculator` | "credit card payoff calculator" |
| Debt Payoff | `/debt-payoff-calculator` | "debt payoff calculator", "snowball vs avalanche calculator" |
| Debt-to-Income | `/debt-to-income-calculator` | "DTI calculator" |
| Compound Interest | `/compound-interest-calculator` | "compound interest calculator" |
| CD | `/cd-calculator` | "CD calculator" |
| Investment Return | `/investment-return-calculator` | "investment return calculator" |
| Savings Goal | `/savings-goal-calculator` | "savings goal calculator" |
| Retirement | `/retirement-calculator` | "retirement calculator" |
| 401(k) | `/401k-calculator` | "401(k) calculator" |
| Budget Planner | `/budget-planner` | "50/30/20 budget planner" |
| Net Worth | `/net-worth-calculator` | "net worth tracker" |
| Capital Gains Tax | `/capital-gains-tax-calculator` | "capital gains tax calculator" |
| Tax Bracket | `/tax-bracket-calculator` | "tax bracket calculator", "marginal tax rate calculator" |
| Salary | `/salary-calculator` | "salary calculator", "take-home pay calculator" |
| Inflation | `/inflation-calculator` | "inflation calculator" |
| Break-Even | `/break-even-calculator` | "break-even calculator" |

Cross-links between blog posts also valuable — see `/blog/<slug>` URLs. Aim for 2–4 internal links per post total.

---

## 🎯 Content Pillars

| Pillar | Category | Typical topics |
|---|---|---|
| Mortgage & Housing | `Mortgages` | mortgage math, refinance, home affordability, PMI, points, ARM vs fixed |
| Loans & Debt | `Loans` | auto, student, personal, EMI, debt payoff, DTI |
| Credit Cards | `Credit` | payoff strategies, APR, minimum payments, balance transfers, utilization |
| Savings & Investing | `Savings` / `Investing` | compound interest, CDs, HYSA, investment returns, DCA |
| Retirement | `Retirement` | 401(k), IRA/Roth IRA, retirement income, Social Security |
| Budgeting | `Budgeting` | zero-based, 50/30/20, envelope, emergency funds |
| Taxes | `Taxes` | brackets, capital gains, deductions, withholding |
| Net Worth | `Net Worth` | tracking, goal planning, inflation impact |

---

## 📝 Frontmatter Convention

YAML, all values double-quoted:

```yaml
---
slug: "<kebab-case, <60 chars, globally unique>"
title: "<<65 chars for SERP, primary keyword near front>"
excerpt: "<140-160 chars; meta description; primary keyword once>"
category: "<one of pillar categories above>"
author: "MyCalcFinance Team"
published_at: "<ISO 8601 at first publish>"
updated_at: "<ISO 8601 at most recent edit — BUMP ON EVERY EDIT>"
meta_title: "<≤60 chars>"
meta_description: "<≤155 chars>"
image_url: "/blog-images/hero-<slug>.svg"
---
```

Body is **raw HTML** (not Markdown). Hero SVG is BOTH at `public/blog-images/hero-<slug>.svg` AND prepended inline to the HTML body.

---

## ⚠️ Disclaimer Block (required on every post that touches money decisions)

```html
<p><em>This article is for general informational purposes only and is not financial, tax, or investment advice. Figures reflect conditions as of <month year> and may change. Consult a qualified financial professional before making decisions about your money.</em></p>
```

Always update `<month year>` to the current month when refreshing.
