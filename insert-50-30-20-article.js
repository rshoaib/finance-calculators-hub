import https from 'https';

const contentHTML = `
<img src="/images/blog/50-30-20-budget-hero.png" alt="50 30 20 budget rule explained using a pie chart with needs, wants, and savings portions" style="width:100%; border-radius:12px; margin-bottom:2rem;" />

<h2>What is the 50/30/20 Budget Rule?</h2>
<p>If you find budgeting overly complicated, you are not alone. Tracking every single penny of your paycheck can lead to spreadsheet fatigue. That's exactly why the <strong>50 30 20 budget rule</strong> has become one of the most popular financial planning methods in the world.</p>

<p>The 50/30/20 rule is a simple, straightforward framework that tells you roughly how to divide your after-tax income (your net pay) across three major categories: Needs, Wants, and Savings.</p>

<h2>The 50/30/20 Breakdown</h2>
<p>Here is exactly how the math works:</p>
<ul>
  <li><strong>50% Needs:</strong> Half of your income goes to expenses you absolutely must pay to survive. This includes your rent or <a href="/mortgage">mortgage</a>, groceries, utilities, basic transportation, and minimum debt payments.</li>
  <li><strong>30% Wants:</strong> Almost a third of your income is for lifestyle choices. This includes dining out, entertainment, vacations, streaming subscriptions, and hobbies.</li>
  <li><strong>20% Savings & Debt Payoff:</strong> The final portion goes toward building your <a href="/net-worth">net worth</a>. This means emergency funds, retirement investments, and paying down toxic debt (like high-interest credit cards).</li>
</ul>

<h3>Real-World Example</h3>
<p>Let's say your take-home pay is <strong>$4,500 per month</strong>.</p>
<table border="1" cellpadding="10" cellspacing="0" style="width:100%; text-align:left; border-collapse:collapse; margin-bottom: 20px;">
  <thead style="background-color:#f4f4f4;">
    <tr>
      <th>Category</th>
      <th>Percentage</th>
      <th>Monthly Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Needs</strong></td>
      <td>50%</td>
      <td>$2,250</td>
    </tr>
    <tr>
      <td><strong>Wants</strong></td>
      <td>30%</td>
      <td>$1,350</td>
    </tr>
    <tr>
      <td><strong>Savings/Debt</strong></td>
      <td>20%</td>
      <td>$900</td>
    </tr>
  </tbody>
</table>

<p>If you can stick to this $900/month savings goal, putting that money into a compounding investment account or a high-yield <a href="/savings">savings goal</a> fund will drastically accelerate your path to financial independence.</p>

<div class="tip-box" style="background:#f0f9ff; padding:15px; border-left:4px solid #005bb5; margin:20px 0;">
  <strong>💡 What this means for you:</strong> The 50/30/20 rule is a guideline, not a strict law. If you live in an expensive city, your "Needs" might creep closer to 60%. The key is to automate that 20% into savings the moment you get paid, so you never even have the chance to spend it on "Wants".
</div>

<h2>Why the 50 30 20 Rule Works</h2>
<p>Most diets fail because they are too restrictive. The exact same principle applies to budgeting.</p>
<p>The brilliance of the 50/30/20 rule is that it <strong>explicitly gives you permission to spend 30% of your money on fun</strong>. By clearly defining what you are allowed to spend guilt-free, you avoid the burnout that causes so many people to abandon their budgets entirely.</p>
<p>Furthermore, dedicating 20% of your income to savings ensures that you are consistently building wealth and beating <a href="/inflation">inflation</a> over the long term.</p>

<div style="text-align:center; margin-top:40px;">
  <h3>How fast will your 20% savings grow?</h3>
  <br />
  <a href="/savings" style="background:#005bb5; color:#fff; padding:12px 24px; text-decoration:none; border-radius:4px; font-weight:bold;">Use Our Free Savings Calculator</a>
</div>
`;

const postData = {
  title: "50 30 20 Budget Rule Explained: The Simple Path to Wealth (2026)",
  slug: "50-30-20-budget-rule-explained-2026",
  excerpt: "What is the 50/30/20 budget rule? We explain how to divide your income into needs, wants, and savings so you can reach your financial goals faster.",
  content: contentHTML,
  category: "Budgeting",
  author: "MyCalcFinance Team",
  image_url: "/images/blog/50-30-20-budget-hero.png",
  published_at: new Date().toISOString()
};

const postDataString = JSON.stringify(postData);

const options = {
  hostname: 'fyjqnidhhwxvzllhjfxk.supabase.co',
  path: '/rest/v1/blog_posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5anFuaWRoaHd4dnpsbGhqZnhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5NDc2OCwiZXhwIjoyMDg2NjcwNzY4fQ.3KJ6l85zYhgEcpPkTlbdYtdykh3utiBsvjK2bqdqz1g',  
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5anFuaWRoaHd4dnpsbGhqZnhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5NDc2OCwiZXhwIjoyMDg2NjcwNzY4fQ.3KJ6l85zYhgEcpPkTlbdYtdykh3utiBsvjK2bqdqz1g' 
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', e => {
  console.error(e);
});

req.write(postDataString);
req.end();
