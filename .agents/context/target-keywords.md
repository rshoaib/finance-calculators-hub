# MyCalcFinance — Target Keywords & Content Gaps

> Used by `.agents/routines/daily-content.md` to pick Lane C topics. Once a topic is published, tick it with `[x]`. Before adding new entries, run `ls content/blog/` to confirm the slug doesn't already exist.

---

## 🔍 Audit before adding a new keyword

```bash
ls content/blog/*.md | sort   # current coverage
```

The site has 50+ posts as of 2026-05; most pillars are well-populated. **Net new topics are increasingly hard to find** — most useful work now is refresh + internal linking, not new posts. Prefer Lane A and Lane B over Lane C.

---

## 🎯 Priority queue (next ~10 net-new candidates)

### Priority 1 — High intent, broad audience

- [ ] **"how much should I have in savings by age 30 / 40 / 50"** (Savings) — pairs with `/savings-goal-calculator` and `/net-worth-calculator`.
- [ ] **"HELOC vs cash-out refinance 2026"** (Mortgages) — pairs with `/mortgage-refinance-calculator`.
- [ ] **"home equity loan vs HELOC: which is right for you"** (Mortgages) — pairs with `/mortgage-refinance-calculator`.
- [ ] **"how to read your pay stub"** (Salary) — pairs with `/salary-calculator`. Long-tail.

### Priority 2 — Specific scenarios

- [ ] **"FIRE movement: how much to retire early at 50 / 55"** (Retirement) — pairs with `/retirement-calculator`.
- [ ] **"HSA vs FSA: which one should you pick"** (Taxes / Savings) — pairs with `/tax-bracket-calculator`.
- [ ] **"SEP IRA vs Solo 401(k) for self-employed"** (Retirement) — pairs with `/401k-calculator`.

### Priority 3 — Technical / niche

- [ ] **"qualified vs non-qualified annuities: tax treatment"** (Taxes / Retirement)
- [ ] **"municipal bond investing 2026: tax-equivalent yield math"** (Investing / Taxes)
- [ ] **"I-bonds vs TIPS: which inflation hedge fits your goal"** (Investing) — pairs with `/inflation-calculator`.

---

## 🚫 Topics NOT to add (already covered or low-value)

Sample of existing coverage — not exhaustive; always `ls content/blog/` first:

- 401(k) employer match, basics, Roth vs Traditional
- 4% rule for retirement
- 50/30/20 budget
- 529 plan
- APR vs APY
- ARM vs fixed mortgage
- Biweekly mortgage payments
- Break-even analysis
- Capital gains short vs long term
- Car loan basics + saving thousands
- CD calculator + CD ladder
- Compound interest (basic + advanced)
- Credit utilization
- Debt avalanche vs snowball
- DTI mortgage guide
- Mortgage recast vs refinance
- Pay off mortgage early vs invest
- RMDs
- Tax-loss harvesting
- Backdoor Roth IRA high-earners guide

---

## 📝 Anchor-text bank

When adding internal links, use anchor text that matches the destination's primary keyword. NOT "click here" / "read more". Examples:

| Destination | Good anchor text |
|---|---|
| `/blog/4-percent-rule-retirement-withdrawals-2026` | "the 4% rule for retirement withdrawals" |
| `/blog/biweekly-mortgage-payments-vs-monthly-2026` | "biweekly vs monthly mortgage payments" |
| `/blog/debt-avalanche-vs-snowball-2026` | "avalanche vs snowball" |
| `/blog/compound-interest-beginners-guide-2026` | "how compound interest works" |
| `/blog/tax-loss-harvesting-guide-2026` | "tax-loss harvesting" |

Pattern: use the differentiated phrase, not the brand or a generic CTA.
