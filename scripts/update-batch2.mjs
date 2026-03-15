// scripts/update-batch2.mjs
const SUPABASE_URL = 'https://fyjqnidhhwxvzllhjfxk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5anFuaWRoaHd4dnpsbGhqZnhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5NDc2OCwiZXhwIjoyMDg2NjcwNzY4fQ.3KJ6l85zYhgEcpPkTlbdYtdykh3utiBsvjK2bqdqz1g';

const updates = [
  { slug: 'capital-gains-tax-short-term-vs-long-term', image_url: '/images/blog/hero_capital_gains.png' },
  { slug: 'fifty-thirty-twenty-budget-rule-guide', image_url: '/images/blog/hero_budget_rule.png' },
  { slug: 'how-to-calculate-net-worth', image_url: '/images/blog/hero_net_worth.png' },
  { slug: 'inflation-protect-purchasing-power-2026', image_url: '/images/blog/hero_inflation.png' },
  { slug: 'break-even-analysis-side-hustles', image_url: '/images/blog/hero_break_even.png' }
];

async function updateBatch2() {
  console.log('Updating Supabase records for Batch 2...');
  for (const update of updates) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${update.slug}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({ image_url: update.image_url })
    });
    
    if (res.ok) {
      console.log(`✅ Updated: ${update.slug}`);
    } else {
      const text = await res.text();
      console.error(`❌ Failed: ${update.slug} - ${res.statusText} - ${text}`);
    }
  }
}
updateBatch2();
