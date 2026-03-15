import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://fyjqnidhhwxvzllhjfxk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5anFuaWRoaHd4dnpsbGhqZnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTQ3NjgsImV4cCI6MjA4NjY3MDc2OH0.SC_j9-6NB6-WEdf2YntJjheYslyRkYqnGSpMnudZOZc';
const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function auditPosts() {
  console.log('Fetching all blog posts from Supabase...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=id,title,slug,image_url`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
        console.error('Failed to fetch posts:', response.statusText);
        return;
    }

    const posts = await response.json();
    console.log(`Found ${posts.length} posts. Analyzing...\\n`);

    const missingImageUrls = [];
    const missingImageFiles = [];
    const goodPosts = [];
    
    // Check for duplicate slugs
    const slugs = new Set();
    const duplicateSlugs = [];

    for (const post of posts) {
      if (slugs.has(post.slug)) {
        duplicateSlugs.push(post.slug);
      } else {
        slugs.add(post.slug);
      }

      if (!post.image_url) {
        missingImageUrls.push(post);
        continue;
      }

      // Check if file exists
      // image_url is like '/images/blog/tax_bracket_hero.png'
      // We need to check if 'c:\\Projects\\mycalcfinance\\public\\images\\blog\\tax_bracket_hero.png' exists
      
      const localImagePath = path.join(PUBLIC_DIR, post.image_url);
      
      if (!fs.existsSync(localImagePath)) {
          missingImageFiles.push({
              ...post,
              localImagePath
          });
      } else {
          goodPosts.push(post);
      }
    }

    console.log('=== AUDIT RESULTS ===\\n');
    
    console.log(`Total Posts Checked: ${posts.length}`);
    console.log(`Posts completely missing 'image_url' in database: ${missingImageUrls.length}`);
    if (missingImageUrls.length > 0) {
        missingImageUrls.forEach(p => console.log(`  - [${p.slug}] ${p.title}`));
    }
    console.log('');
    
    console.log(`Posts with 'image_url', but file missing from public/ folder: ${missingImageFiles.length}`);
    if (missingImageFiles.length > 0) {
        missingImageFiles.forEach(p => console.log(`  - [${p.slug}] URL: ${p.image_url}`));
    }
    console.log('');
    
    console.log(`Duplicate Slugs Found: ${duplicateSlugs.length}`);
    if (duplicateSlugs.length > 0) {
        duplicateSlugs.forEach(s => console.log(`  - ${s}`));
    }
    console.log('');
    
    console.log(`Posts with valid existing images: ${goodPosts.length}`);

  } catch (error) {
      console.error('Error during audit:', error);
  }
}

auditPosts();
