import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://fyjqnidhhwxvzllhjfxk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5anFuaWRoaHd4dnpsbGhqZnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTQ3NjgsImV4cCI6MjA4NjY3MDc2OH0.SC_j9-6NB6-WEdf2YntJjheYslyRkYqnGSpMnudZOZc"
);

async function run() {
  const { data, error } = await supabase.from('blog_posts').select('title, published_at').order('published_at', { ascending: false });
  if (error) {
    console.error("Error fetching data:", error);
    process.exit(1);
  }
  
  const nowStr = new Date().toISOString();
  console.log("Current Time (UTC):", nowStr);
  console.log("Total Articles:", data.length);
  data.forEach((p, i) => {
    if (i < 5) {
      console.log(`- ${p.published_at} : ${p.title}`);
    }
  });
}
run();
