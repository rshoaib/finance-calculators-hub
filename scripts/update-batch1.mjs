// scripts/update-batch1.mjs
const SUPABASE_URL = 'https://fyjqnidhhwxvzllhjfxk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5anFuaWRoaHd4dnpsbGhqZnhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5NDc2OCwiZXhwIjoyMDg2NjcwNzY4fQ.3KJ6l85zYhgEcpPkTlbdYtdykh3utiBsvjK2bqdqz1g';

const updates = [
  { slug: 'mortgage-tips-first-time-buyers', image_url: '/images/blog/hero_mortgage_tips.png' },
  { slug: 'compound-interest-power', image_url: '/images/blog/hero_compound_interest.png' },
  { slug: 'tax-deductions-you-might-miss', image_url: '/images/blog/hero_tax_deductions.png' },
  { slug: 'emergency-fund-guide', image_url: '/images/blog/hero_emergency_fund.png' },
  { slug: 'how-to-calculate-take-home-pay', image_url: '/images/blog/hero_take_home_pay.png' }
];

async function updateBatch1() {
  console.log('Updating Supabase records for Batch 1...');
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
updateBatch1();
