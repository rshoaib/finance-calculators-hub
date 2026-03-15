// scripts/update-batch5.mjs
const SUPABASE_URL = 'https://fyjqnidhhwxvzllhjfxk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5anFuaWRoaHd4dnpsbGhqZnhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5NDc2OCwiZXhwIjoyMDg2NjcwNzY4fQ.3KJ6l85zYhgEcpPkTlbdYtdykh3utiBsvjK2bqdqz1g';

const updates = [
  { slug: 'emergency-fund-calculator-guide', image_url: '/images/blog/hero_emergency_fund.png' },
  { slug: 'cd-calculator-guide-2026', image_url: '/images/blog/hero_cd_calculator.png' },
  { slug: 'how-to-pay-off-credit-card-debt-fast-2026', image_url: '/images/blog/hero_cc_payoff_strategies.png' },
  { slug: 'car-loan-calculator-guide-2026', image_url: '/images/blog/hero_car_loan.png' },
  { slug: 'mortgage-refinance-guide-2026', image_url: '/images/blog/hero_mortgage_refinance.png' }
];

async function updateBatch5() {
  console.log('Updating Supabase records for Batch 5...');
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
updateBatch5();
