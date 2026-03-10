const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://fyjqnidhhwxvzllhjfxk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5anFuaWRoaHd4dnpsbGhqZnhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5NDc2OCwiZXhwIjoyMDg2NjcwNzY4fQ.3KJ6l85zYhgEcpPkTlbdYtdykh3utiBsvjK2bqdqz1g';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function cleanContent() {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', 'how-to-calculate-net-worth-2026-guide')
    .single();

  if (post && post.content) {
    // Regex to match the img tag at the beginning of the content
    const cleanedContent = post.content.replace(/<img[^>]+>/i, '').trim();
    
    if (cleanedContent !== post.content) {
      const { error } = await supabase
        .from('blog_posts')
        .update({ content: cleanedContent })
        .eq('id', post.id);

      if (error) {
        console.error("Error updating:", error);
      } else {
        console.log("Successfully removed duplicate image from database content!");
      }
    } else {
      console.log("No img tag found in the content to replace.");
    }
  }
}

cleanContent();
