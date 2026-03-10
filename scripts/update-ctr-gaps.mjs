import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fyjqnidhhwxvzllhjfxk.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5anFuaWRoaHd4dnpsbGhqZnhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5NDc2OCwiZXhwIjoyMDg2NjcwNzY4fQ.3KJ6l85zYhgEcpPkTlbdYtdykh3utiBsvjK2bqdqz1g'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const updates = [
  {
    slug: 'debt-to-income-ratio-mortgage-guide-2026',
    title: 'Debt-to-Income (DTI) Ratio for Mortgage in 2026: The Ultimate Guide',
    excerpt: 'Want to get approved for a mortgage in 2026? Learn the exact Debt-to-Income (DTI) ratio requirements, the 28/36 rule, and 5 proven ways to lower your DTI fast.'
  },
  {
    slug: 'home-affordability-guide-2026',
    title: 'How Much House Can I Afford in 2026? Top Affordability Rules Explained',
    excerpt: 'Discover exactly how much house you can afford in 2026. We break down the 28/36 rule of thumb, current mortgage affordability guidelines, and hidden homebuying costs.'
  }
]

async function runUpdates() {
  console.log('Updating CTR Gap articles...')
  for (const update of updates) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ title: update.title, excerpt: update.excerpt })
      .eq('slug', update.slug)
      .select('slug, title, excerpt')
    
    if (error) {
      console.error('❌ Error updating', update.slug, error.message)
    } else if (data && data.length > 0) {
      console.log('✅ Updated:', data[0].slug)
      console.log('   Title:', data[0].title)
      console.log('   Meta:', data[0].excerpt)
    } else {
      console.log('⚠️ No rows updated for', update.slug, '(Slug might not exist)')
    }
  }
}

runUpdates()
