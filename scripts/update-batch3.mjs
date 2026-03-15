// scripts/update-batch3.mjs
const SUPABASE_URL = 'https://fyjqnidhhwxvzllhjfxk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5anFuaWRoaHd4dnpsbGhqZnhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5NDc2OCwiZXhwIjoyMDg2NjcwNzY4fQ.3KJ6l85zYhgEcpPkTlbdYtdykh3utiBsvjK2bqdqz1g';

const updates = [
  { slug: '401k-employer-match-guide', image_url: '/images/blog/hero_401k_match.png' },
  { slug: '401k-retirement-planning-guide-2026', image_url: '/images/blog/hero_401k_planning.png' },
  { slug: 'car-loan-guide-how-to-save-thousands-2026', image_url: '/images/blog/hero_car_loan.png' },
  { slug: 'compound-interest-beginners-guide-2026', image_url: '/images/blog/hero_compound_interest_beginners.png' },
  { slug: 'credit-card-debt-payoff-strategies-2026', image_url: '/images/blog/hero_cc_payoff_strategies.png' }
];

async function updateBatch3() {
  console.log('Updating Supabase records for Batch 3...');
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
updateBatch3();
