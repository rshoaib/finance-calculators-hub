import fs from 'fs';
import https from 'https';

const options = {
  hostname: 'fyjqnidhhwxvzllhjfxk.supabase.co',
  path: '/rest/v1/blog_posts?select=id,title,published_at',
  method: 'GET',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5anFuaWRoaHd4dnpsbGhqZnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTQ3NjgsImV4cCI6MjA4NjY3MDc2OH0.SC_j9-6NB6-WEdf2YntJjheYslyRkYqnGSpMnudZOZc',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5anFuaWRoaHd4dnpsbGhqZnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTQ3NjgsImV4cCI6MjA4NjY3MDc2OH0.SC_j9-6NB6-WEdf2YntJjheYslyRkYqnGSpMnudZOZc'
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const posts = JSON.parse(data);
    posts.sort((a,b) => new Date(b.published_at) - new Date(a.published_at));
    
    const now = new Date('2026-03-11T15:13:29+03:00');
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0,0,0,0);
    
    const today = new Date('2026-03-11T15:13:29+03:00');
    today.setHours(0,0,0,0);

    let publishedToday = 0;
    let publishedThisWeek = 0;
    const thisWeekTitles = [];

    posts.forEach(p => {
      const d = new Date(p.published_at);
      if (d >= today) publishedToday++;
      if (d >= startOfWeek) {
        publishedThisWeek++;
        thisWeekTitles.push(p.title);
      }
    });

    const result = {
      Total: posts.length,
      LastPublished: posts.length > 0 ? `${posts[0].published_at} - ${posts[0].title}` : 'None',
      PublishedToday: publishedToday,
      PublishedThisWeek: publishedThisWeek,
      ThisWeekTitles: thisWeekTitles
    };
    fs.writeFileSync('stats.json', JSON.stringify(result, null, 2));
  });
});
req.end();
