const SupabaseREST = require('./supabase_rest.cjs');
async function run() {
  const db = new SupabaseREST();
  const res = await db.select('blog_posts', 'slug,image_url');
  console.log(res.find(r => r.slug === 'renting-vs-buying-calculator-guide'));
}
run();
