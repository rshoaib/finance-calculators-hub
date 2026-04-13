// Script to insert DTI Ratio Guide 2026 blog article into Supabase
// Run: node scripts/insert-dti-ratio-article.mjs

const SUPABASE_URL = 'https://fyjqnidhhwxvzllhjfxk.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5anFuaWRoaHd4dnpsbGhqZnhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5NDc2OCwiZXhwIjoyMDg2NjcwNzY4fQ.3KJ6l85zYhgEcpPkTlbdYtdykh3utiBsvjK2bqdqz1g'

const article = {
  slug: 'debt-to-income-ratio-mortgage-guide-2026',
  title: 'What DTI Ratio Do You Need for a Mortgage in 2026? The Complete Guide',
  excerpt: 'Your debt-to-income ratio is the #1 factor lenders use to determine how much house you can afford. Learn the exact DTI limits for FHA, conventional, and VA loans in 2026 — and how to lower yours fast.',
  category: 'Mortgage',
  author: 'MyCalcFinance Team',
  published_at: '2026-02-27T12:00:00Z',
  image_url: '',
  content: `
<h2>What Is Debt-to-Income Ratio (DTI)?</h2>
<p>Your debt-to-income ratio is the percentage of your <strong>gross monthly income</strong> that goes toward paying debts. It's the single most important number mortgage lenders use to decide how much you can borrow — and whether you qualify at all.</p>

<p>The formula is simple:</p>
<p style="text-align:center; font-size:1.2em; font-weight:bold; color:#10b981;">DTI = (Total Monthly Debt Payments ÷ Gross Monthly Income) × 100</p>

<p>Calculate yours instantly with our <a href="/debt-to-income-calculator">Debt-to-Income Calculator</a>.</p>

<h2>The Two Types of DTI Ratios</h2>
<p>Lenders evaluate two separate DTI calculations when reviewing your mortgage application:</p>

<h3>Front-End DTI (Housing Ratio)</h3>
<p>This measures only your <strong>housing-related expenses</strong> as a percentage of gross income. It includes:</p>
<ul>
  <li>Mortgage principal and interest (P&I)</li>
  <li>Property taxes</li>
  <li>Homeowner's insurance</li>
  <li>HOA fees</li>
  <li>Private mortgage insurance (PMI), if applicable</li>
</ul>
<p><strong>Target:</strong> Most lenders want this at or below <strong>28%</strong>.</p>

<h3>Back-End DTI (Total Debt Ratio)</h3>
<p>This includes your housing costs <strong>plus all other monthly debt obligations</strong>:</p>
<ul>
  <li>Car loan payments</li>
  <li>Student loan payments</li>
  <li>Credit card minimum payments</li>
  <li>Personal loans</li>
  <li>Child support or alimony</li>
  <li>Any other recurring debt payments</li>
</ul>
<p><strong>Target:</strong> Most lenders prefer <strong>36%</strong> or below, though many loan programs allow higher.</p>

<h2>2026 DTI Limits by Loan Type</h2>
<p>Different mortgage programs have different DTI ceilings. Here's what you need to know for 2026:</p>

<h3>Conventional Loans (Fannie Mae / Freddie Mac)</h3>
<ul>
  <li><strong>Preferred DTI:</strong> 36% or below</li>
  <li><strong>Maximum DTI (automated underwriting):</strong> Up to 50% with strong compensating factors</li>
  <li><strong>Manual underwriting:</strong> 36% standard, up to 45% with a credit score of 680+ and cash reserves</li>
  <li><strong>2026 conforming loan limit:</strong> $832,750 (baseline), up to $1,249,125 in high-cost areas</li>
</ul>

<h3>FHA Loans</h3>
<ul>
  <li><strong>Front-end DTI cap:</strong> 31%</li>
  <li><strong>Back-end DTI cap:</strong> 43% (standard)</li>
  <li><strong>With compensating factors:</strong> Up to 50% — and even 57% in rare cases</li>
  <li><strong>Minimum credit score:</strong> 580 for 3.5% down, 500 for 10% down</li>
  <li><strong>2026 FHA loan limit:</strong> $541,287 (floor) to $1,249,125 (ceiling)</li>
</ul>
<p>Compensating factors that help you qualify with a higher DTI include: credit scores above 740, significant cash reserves (3–6 months of payments), stable employment history (2+ years), and limited "payment shock" (your proposed mortgage is close to your current rent).</p>

<h3>VA Loans (Veterans)</h3>
<ul>
  <li><strong>No official DTI cap</strong> — the VA uses a residual income test instead</li>
  <li><strong>Guideline DTI:</strong> 41%, but lenders routinely approve higher with residual income</li>
  <li><strong>No down payment required</strong></li>
  <li><strong>No PMI</strong></li>
</ul>

<h3>USDA Loans</h3>
<ul>
  <li><strong>Front-end DTI cap:</strong> 29%</li>
  <li><strong>Back-end DTI cap:</strong> 41%</li>
  <li><strong>Income limits apply</strong> — household income must be within 115% of area median</li>
</ul>

<h2>Real-World Example: Calculating Your DTI</h2>
<p>Let's say you earn <strong>$85,000/year</strong> ($7,083/month gross) and have these monthly debts:</p>
<ul>
  <li>Proposed mortgage (P&I + tax + insurance): $1,983</li>
  <li>Car loan: $350</li>
  <li>Student loans: $250</li>
  <li>Credit card minimums: $100</li>
</ul>

<h3>Front-End DTI</h3>
<p style="text-align:center; font-weight:bold;">$1,983 ÷ $7,083 = <strong style="color:#10b981;">28.0%</strong> ✅ (at the 28% threshold)</p>

<h3>Back-End DTI</h3>
<p style="text-align:center; font-weight:bold;">($1,983 + $350 + $250 + $100) ÷ $7,083 = <strong style="color:#10b981;">37.9%</strong></p>

<p>At 37.9%, you'd qualify for most <strong>conventional</strong> and <strong>FHA</strong> programs. But if you could pay off those credit cards ($100/month), your back-end DTI drops to <strong>36.5%</strong> — putting you in the preferred range for the best rates.</p>

<p>See how your specific numbers shake out with our <a href="/debt-to-income-calculator">DTI Calculator</a>, then model your mortgage payment with the <a href="/mortgage-calculator">Mortgage Calculator</a>.</p>

<h2>Why Your DTI Matters More Than You Think</h2>
<p>Your DTI doesn't just determine <em>if</em> you qualify — it affects your entire mortgage experience:</p>

<h3>Interest Rates</h3>
<p>Borrowers with DTI below 36% consistently receive better interest rates. On a $300,000 mortgage, even a 0.25% rate difference saves you roughly <strong>$16,000</strong> over 30 years.</p>

<h3>Loan Amount</h3>
<p>Every $300/month in existing debt reduces your borrowing power by approximately <strong>$50,000</strong>. Eliminating a car payment before applying could significantly increase how much house you can afford. Use our <a href="/home-affordability-calculator">Home Affordability Calculator</a> to see the impact.</p>

<h3>Approval Speed</h3>
<p>Applications with DTI above 43% typically require <strong>manual underwriting</strong>, which is slower and more scrutinizing. A lower DTI means faster, smoother processing through automated systems.</p>

<h2>7 Proven Ways to Lower Your DTI Before Applying</h2>

<h3>1. Pay Down Credit Card Balances</h3>
<p>Credit card minimums directly inflate your DTI. Paying off even one card can meaningfully shift your ratio. Map out your payoff strategy with our <a href="/credit-card-payoff-calculator">Credit Card Payoff Calculator</a>.</p>

<h3>2. Pay Off Small Debts Entirely</h3>
<p>If you have a personal loan with 6 months left, consider paying it off before applying. Eliminating a $200/month payment on a $48,000 salary boosts your borrowing power by roughly $35,000.</p>

<h3>3. Avoid Taking on New Debt</h3>
<p>Don't finance a new car or open new credit cards in the months before your mortgage application. Even a small new payment increases your DTI.</p>

<h3>4. Increase Your Income</h3>
<p>A raise, bonus, or documented side income reduces your DTI because the denominator (gross income) gets larger. Use our <a href="/salary-calculator">Salary Calculator</a> to understand your full income picture.</p>

<h3>5. Refinance Existing Debt</h3>
<p>Extending a car loan from 36 months to 60 months lowers the monthly payment — and your DTI. Just be aware of the total interest cost.</p>

<h3>6. Make a Larger Down Payment</h3>
<p>A bigger down payment means a smaller mortgage, which means a lower monthly housing cost and lower front-end DTI. Start saving strategically with our <a href="/savings-goal-calculator">Savings Goal Calculator</a>.</p>

<h3>7. Pay Off Student Loans Strategically</h3>
<p>If you're on an income-driven repayment plan with low monthly payments, your DTI may already be reasonable. But if you're on a standard 10-year plan with high payments, paying down the balance or refinancing to a longer term could help your mortgage qualification.</p>

<h2>Common DTI Mistakes to Avoid</h2>
<ul>
  <li><strong>Forgetting co-signed loans:</strong> If you co-signed a friend's or family member's loan, that payment counts in YOUR DTI — even if they're making the payments</li>
  <li><strong>Ignoring credit card limits:</strong> Lenders use your minimum payment, not your balance. But maxed-out cards can still hurt your credit score</li>
  <li><strong>Not documenting income correctly:</strong> Self-employed borrowers often have lower "qualifying income" due to tax deductions. This inflates your DTI on paper</li>
  <li><strong>Assuming pre-approval means approval:</strong> Your DTI is recalculated at final underwriting. Taking on new debt after pre-approval can sink your application</li>
</ul>

<h2>Your DTI Action Plan for 2026</h2>
<ol>
  <li><strong>Calculate your current DTI:</strong> Use our <a href="/debt-to-income-calculator">free DTI Calculator</a> with your real numbers</li>
  <li><strong>List all monthly debts:</strong> Include everything — car, student loans, credit cards, personal loans</li>
  <li><strong>Identify what to pay off first:</strong> Target the smallest balances for quick DTI wins</li>
  <li><strong>Model your home purchase:</strong> Run scenarios in the <a href="/home-affordability-calculator">Home Affordability Calculator</a> to see how your DTI affects what you can afford</li>
  <li><strong>Build your budget:</strong> Use the <a href="/budget-planner">Budget Planner</a> to allocate income toward debt payoff and down payment savings</li>
  <li><strong>Get pre-approved:</strong> Once your DTI is in range, apply with confidence</li>
</ol>

<h2>The Bottom Line</h2>
<p>Your DTI ratio is the gatekeeper to homeownership. In 2026, with mortgage rates declining and conforming loan limits at $832,750, the opportunity is real — but only if your debt ratio cooperates. The good news: DTI is one of the few financial metrics you can actively improve in a matter of months. Start with our <a href="/debt-to-income-calculator">Debt-to-Income Calculator</a>, build your payoff plan, and position yourself for the best mortgage terms available.</p>
  `
}

async function insertArticle() {
  console.log('Inserting DTI Ratio Guide 2026 article into Supabase...\n')

  const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(article),
  })

  if (response.ok) {
    console.log(`✅ Inserted: ${article.slug}`)
  } else {
    const err = await response.text()
    console.error(`❌ Failed: ${article.slug} — ${response.status} ${err}`)
  }

  console.log('\nVerifying post count...')

  const countRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=slug,title`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  })
  const all = await countRes.json()
  console.log(`Total posts in database: ${all.length}`)
  all.forEach(p => console.log(`  - ${p.slug}`))
}

insertArticle()
