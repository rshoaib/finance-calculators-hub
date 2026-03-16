const fs = require('fs');

try {
  const html = fs.readFileSync('test-utf8.html', 'utf8');
  const articles = html.split('<article class="blog-card">').slice(1);
  console.log(`Found ${articles.length} articles in HTML.`);

  let missingImages = 0;
  for (const act of articles) {
    if (!act.includes('<img ')) {
      missingImages++;
      const titleMatch = act.match(/<h2 class="blog-card-title"><a[^>]*>(.*?)<\/a><\/h2>/);
      if (titleMatch) {
         console.log('Missing image for:', titleMatch[1]);
      }
    }
  }

  console.log(`Total missing images in HTML: ${missingImages}`);
  
  // Let's also parse the JSON to see what it has
  const jsonMatch = html.match(/{"id":"[a-z0-9-]+","slug":[^>]*hero_tax_deductions[^}]*}/);
  if (jsonMatch) {
     console.log('Found hero_tax_deductions in JSON payload!');
  } else {
     console.log('hero_tax_deductions NOT found in JSON payload.');
  }
} catch (e) {
  console.error(e);
}
