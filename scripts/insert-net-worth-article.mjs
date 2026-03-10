// Insert Net Worth Calculator Guide into Supabase
// Run: node scripts/insert-net-worth-article.mjs

const SUPABASE_URL = 'https://fyjqnidhhwxvzllhjfxk.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5anFuaWRoaHd4dnpsbGhqZnhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5NDc2OCwiZXhwIjoyMDg2NjcwNzY4fQ.3KJ6l85zYhgEcpPkTlbdYtdykh3utiBsvjK2bqdqz1g'

const article = {
  title: 'How to Calculate Your Net Worth: The Ultimate 2026 Guide',
  slug: 'how-to-calculate-net-worth-2026-guide',
  excerpt: 'Learn the exact formula to calculate your net worth, what assets and liabilities to include, and why tracking this number is crucial for your financial health.',
  category: 'Savings',
  author: 'MyCalcFinance Team',
  published_at: new Date().toISOString(),
  image_url: '/images/blog/net-worth-guide-hero.png',
  content: `
<img src="/images/blog/net-worth-guide-hero.png" alt="Net worth calculator guide — balance scale weighing assets and liabilities with gold coins" style="width:100%;border-radius:12px;margin-bottom:2rem" />

<p>If you want to understand your true financial health in 2026, checking your bank balance isn't enough. Your income only tells you what you earn, but your <strong>net worth tells you what you actually own</strong>.</p>

<p>Calculating your net worth gives you a complete snapshot of your financial progress. It is the single most important metric for retirement planning, wealth building, and identifying areas where you need to course-correct.</p>

<p>This guide breaks down exactly how to calculate your net worth, what counts as an asset versus a liability, and how often you should track it. You can skip the math and use our free <a href="/net-worth">Net Worth Calculator</a> to do it instantly.</p>

<h2>The Net Worth Formula</h2>

<p>The formula to calculate your net worth is refreshingly simple:</p>

<p><strong>Total Assets – Total Liabilities = Net Worth</strong></p>

<p>Let's break down exactly what falls into each of these categories.</p>

<h3>Step 1: Add Up Your Assets (What You Own)</h3>

<p>Assets are anything you own that holds significant monetary value. These are typically divided into liquid assets (easily converted to cash) and illiquid assets.</p>

<ul>
<li><strong>Liquid Assets:</strong> Cash in your checking and savings accounts, emergency funds, and money market accounts.</li>
<li><strong>Investments:</strong> Your 401(k), IRA, brokerage accounts, stocks, mutual funds, and crypto. Use our <a href="/investment-return-calculator">Investment Return Calculator</a> to track their growth.</li>
<li><strong>Real Estate:</strong> The current estimated market value of your primary home and any investment properties.</li>
<li><strong>Vehicles & Valuables:</strong> Current market value (not purchase price) of your cars, jewelry, and art.</li>
</ul>

<h3>Step 2: Add Up Your Liabilities (What You Owe)</h3>

<p>Liabilities are all your outstanding debts and financial obligations.</p>

<ul>
<li><strong>Mortgages:</strong> The remaining principal balance on your home loan. (Calculating this? Try our <a href="/mortgage">Mortgage Calculator</a>).</li>
<li><strong>Consumer Debt:</strong> Outstanding balances on credit cards and personal loans. Use our <a href="/credit-card-payoff-calculator">Credit Card Payoff Calculator</a> if you're trying to eliminate these.</li>
<li><strong>Student & Auto Loans:</strong> Total remaining balances on your educational and vehicle loans. See our <a href="/student-loan-calculator">Student Loan Calculator</a> for repayment strategies.</li>
</ul>

<h3>Worked Example</h3>

<p>Let's look at Sarah, a 30-year-old professional:</p>

<strong>Sarah's Assets:</strong>
<ul>
<li>Checking/Savings: $5,000</li>
<li>401(k) Balance: $40,000</li>
<li>Home Market Value: $300,000</li>
<li>Car Value: $15,000</li>
<li><strong>Total Assets = $360,000</strong></li>
</ul>

<strong>Sarah's Liabilities:</strong>
<ul>
<li>Remaining Mortgage: $250,000</li>
<li>Student Loans: $30,000</li>
<li>Credit Card Debt: $5,000</li>
<li><strong>Total Liabilities = $285,000</strong></li>
</ul>

<p><strong>Sarah's Net Worth:</strong> $360,000 - $285,000 = <strong>$75,000</strong></p>

<p><strong>What this means for you:</strong> Even if you have significant debt like a mortgage or student loans, your net worth can still be positive if your assets (like home equity and retirement accounts) outpace what you owe.</p>

<h2>Why Your Net Worth is Your Most Important Number</h2>

<p>Many people focus entirely on their income. But a person earning $200,000 a year who spends $210,000 has a negative trajectory, while someone earning $60,000 who saves and invests $10,000 annually is building real wealth.</p>

<table style="width: 100%; border-collapse: collapse; margin-top: 1rem; margin-bottom: 2rem;">
<thead>
<tr style="background-color: var(--bg-card-hover); border-bottom: 2px solid var(--border-color);">
<th style="padding: 1rem; text-align: left;">Metric</th>
<th style="padding: 1rem; text-align: left;">What It Tells You</th>
<th style="padding: 1rem; text-align: left;">What It Hides</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid var(--border-color);">
<td style="padding: 1rem;"><strong>Income</strong></td>
<td style="padding: 1rem;">Your cash flow capacity</td>
<td style="padding: 1rem;">Your living expenses and debt obligations</td>
</tr>
<tr style="border-bottom: 1px solid var(--border-color);">
<td style="padding: 1rem;"><strong>Credit Score</strong></td>
<td style="padding: 1rem;">Your reliability as a borrower</td>
<td style="padding: 1rem;">Your actual wealth and savings</td>
</tr>
<tr>
<td style="padding: 1rem;"><strong>Net Worth</strong></td>
<td style="padding: 1rem;">Your true financial independence</td>
<td style="padding: 1rem;">Short-term cash flow crunches</td>
</tr>
</tbody>
</table>

<p><strong>What this means for you:</strong> Your net worth is the ultimate scorecard. If it is increasing year over year, your financial plan is working. If it is shrinking, you need to revisit your budget or debt strategy.</p>

<h2>How Often Should You Calculate It?</h2>

<p>Financial experts generally recommend tracking your net worth <strong>quarterly (every 3 months)</strong> or <strong>annually</strong>.</p>

<p>Checking it daily or weekly can cause unnecessary stress because investment accounts and home values fluctuate constantly. However, if you are actively executing an aggressive debt payoff strategy, calculating it monthly can provide a powerful psychological boost as you watch your liabilities shrink.</p>

<h2>Frequently Asked Questions</h2>

<h3>Is it normal to have a negative net worth?</h3>
<p>Yes, especially for young adults and recent graduates. If you have significant student loans or are just starting your career, your liabilities will likely exceed your assets. The goal is to ensure the trajectory is moving upward over time by paying down debt and consistently investing.</p>

<h3>Should I include my car in my net worth?</h3>
<p>Yes, but you must use its current depreciated market value (what you could sell it for today), not what you paid for it. You must also include your auto loan balance as a liability. Because cars depreciate quickly, they are often a drag on your net worth.</p>

<h3>Does my salary count toward my net worth?</h3>
<p>No. Your salary or income is cash flow. It only affects your net worth when you use that income to buy an asset (like putting it in savings or buying stocks) or use it to pay down a liability (like making an extra mortgage payment).</p>

<h2>Calculate Your Net Worth Now</h2>
<p>Ready to see exactly where you stand? Input your assets and liabilities into our free tool to get your number instantly.</p>

<p>👉 <strong><a href="/net-worth">Try the Net Worth Calculator →</a></strong></p>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Is it normal to have a negative net worth?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Yes, especially for young adults and recent graduates. If you have significant student loans or are just starting your career, your liabilities will likely exceed your assets. The goal is to ensure the trajectory is moving upward over time by paying down debt and consistently investing."
    }
  }, {
    "@type": "Question",
    "name": "Should I include my car in my net worth?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Yes, but you must use its current depreciated market value (what you could sell it for today), not what you paid for it. You must also include your auto loan balance as a liability."
    }
  }, {
    "@type": "Question",
    "name": "Does my salary count toward my net worth?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "No. Your salary or income is cash flow. It only affects your net worth when you use that income to buy an asset (like putting it in savings) or use it to pay down a liability (like making an extra mortgage payment)."
    }
  }]
}
</script>
`
}

async function insertArticle() {
  console.log('Inserting ' + article.title + '...')

  const res = await fetch(SUPABASE_URL + '/rest/v1/blog_posts', {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(article),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Insert failed:', res.status, err)
    process.exit(1)
  }

  const data = await res.json()
  console.log('✅ Article inserted!')
  console.log('   Slug: ' + data[0]?.slug)

  // Verify
  const check = await fetch(SUPABASE_URL + '/rest/v1/blog_posts?select=slug&slug=eq.' + article.slug, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY },
  })
  const verify = await check.json()
  console.log('✅ Verified:', verify)
}

insertArticle().catch(console.error)
