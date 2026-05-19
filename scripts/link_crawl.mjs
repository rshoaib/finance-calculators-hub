import fs from 'node:fs';
import path from 'node:path';

const POSTS_DIR = 'content/blog';
const slugs = new Set(
  fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''))
);

// Known route list (from the calculators dir + special pages)
const calculatorSlugs = new Set([
  'mortgage-calculator', 'compound-interest-calculator', '401k-calculator',
  'retirement-calculator', 'budget-planner-calculator', 'savings-goal-calculator',
  'salary-calculator', 'tax-bracket-calculator', 'capital-gains-tax-calculator',
  'inflation-calculator', 'investment-return-calculator', 'loan-emi-calculator',
  'car-loan-calculator', 'cd-calculator', 'credit-card-payoff-calculator',
  'debt-payoff-calculator', 'home-affordability-calculator', 'net-worth-calculator',
  'student-loan-calculator', 'break-even-calculator', 'debt-to-income-calculator',
  'hsa-calculator', 'emergency-fund-calculator',
]);
const knownPages = new Set(['', 'about', 'contact', 'privacy-policy', 'terms', 'blog']);

// Calculator routes follow `/${slug}` pattern + the wage-conversion ones (`/40-dollars-an-hour-is-how-much-a-year`)
function isInternalKnown(p) {
  // Strip leading/trailing slashes
  let s = p.replace(/^\/+|\/+$/g, '').replace(/\.html?$/, '');
  // Empty = home
  if (s === '') return true;
  // /blog/<slug>
  if (s.startsWith('blog/')) {
    const slug = s.slice('blog/'.length);
    return slugs.has(slug);
  }
  if (s === 'blog') return true;
  if (calculatorSlugs.has(s)) return true;
  if (knownPages.has(s)) return true;
  // Wage-conversion or other landing pages — check if a route exists at app/<s>/page.jsx
  const appPath = path.join('app', s, 'page.jsx');
  if (fs.existsSync(appPath)) return true;
  return false;
}

function extractLinks(html) {
  const links = [];
  const re = /<a\s+[^>]*href=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) links.push(m[1]);
  return links;
}

const internalIssues = []; // {post, href, why}
const externalLinks = [];

for (const slug of slugs) {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  const txt = fs.readFileSync(file, 'utf8');
  // strip frontmatter
  const body = txt.replace(/^---[\s\S]*?\n---\n/, '');
  const links = extractLinks(body);
  for (const href of links) {
    if (href.startsWith('http://') || href.startsWith('https://')) {
      const u = new URL(href);
      if (u.hostname === 'mycalcfinance.com' || u.hostname === 'www.mycalcfinance.com') {
        if (!isInternalKnown(u.pathname)) internalIssues.push({ post: slug, href, why: 'internal absolute URL not resolving' });
      } else {
        externalLinks.push({ post: slug, href });
      }
    } else if (href.startsWith('/')) {
      // strip query/hash
      const p = href.split('#')[0].split('?')[0];
      if (!isInternalKnown(p)) internalIssues.push({ post: slug, href, why: 'relative internal path not resolving' });
    } else if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      // skip
    } else {
      internalIssues.push({ post: slug, href, why: 'unrecognized scheme/path' });
    }
  }
}

console.log(`posts scanned: ${slugs.size}`);
console.log(`internal-link issues: ${internalIssues.length}`);
internalIssues.slice(0, 50).forEach(i => console.log(` - [${i.post}] ${i.href}  (${i.why})`));
console.log(`external links: ${externalLinks.length}`);

// Save external for next step
const LINKS_DIR = 'reports/links';
fs.mkdirSync(LINKS_DIR, { recursive: true });
fs.writeFileSync(`${LINKS_DIR}/external_links.json`, JSON.stringify(externalLinks, null, 2));
fs.writeFileSync(`${LINKS_DIR}/internal_issues.json`, JSON.stringify(internalIssues, null, 2));
