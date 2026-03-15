// scripts/update-batch4.mjs
const SUPABASE_URL = 'https://fyjqnidhhwxvzllhjfxk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5anFuaWRoaHd4dnpsbGhqZnhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5NDc2OCwiZXhwIjoyMDg2NjcwNzY4fQ.3KJ6l85zYhgEcpPkTlbdYtdykh3utiBsvjK2bqdqz1g';

const updates = [
  { slug: 'mortgage-refinancing-guide-2026', image_url: '/images/blog/hero_mortgage_refinance.png' },
  { slug: 'how-much-money-need-to-retire-2026', image_url: '/images/blog/hero_retirement_goals.png' },
  { slug: 'debt-to-income-ratio-mortgage-guide-2026', image_url: '/images/blog/hero_dti_ratio.png' },
  { slug: 'home-affordability-guide-2026', image_url: '/images/blog/hero_home_affordability.png' },
  { slug: 'understanding-tax-brackets-2026', image_url: '/images/blog/hero_tax_brackets.png' }
];

async function updateBatch4() {
  console.log('Updating Supabase records for Batch 4...');
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
updateBatch4();
