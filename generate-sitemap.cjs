// Generate sitemap.xml for MyCalcFinance
const fs = require('fs');

const existingPages = [
  '/', '/mortgage-calculator', '/emi-calculator', '/compound-interest-calculator',
  '/retirement-calculator', '/credit-card-payoff-calculator', '/tax-bracket-calculator',
  '/car-loan-calculator', '/savings-goal-calculator', '/debt-to-income-calculator',
  '/investment-return-calculator', '/net-worth-calculator', '/inflation-calculator',
  '/salary-calculator', '/capital-gains-tax-calculator', '/budget-planner',
  '/break-even-calculator', '/401k-calculator', '/home-affordability-calculator', '/debt-payoff-calculator',
  '/about', '/privacy-policy', '/blog',
];

// Salary pages
const salaryAmounts = [15000,20000,25000,30000,35000,40000,45000,50000,55000,60000,65000,70000,75000,80000,85000,90000,95000,100000,110000,120000,130000,140000,150000,175000,200000];
const salaryPages = salaryAmounts.map(s => `/${s}-a-year-is-how-much-an-hour`);

// Hourly pages
const hourlyRates = [10,12,15,17,18,20,22,25,27,30,35,40,45,50,60,75,100];
const hourlyPages = hourlyRates.map(r => `/${r}-dollars-an-hour-is-how-much-a-year`);

// Mortgage pages
const homeAmounts = [100000,150000,200000,250000,300000,350000,400000,450000,500000,550000,600000,700000,800000,900000,1000000];
const rates = ['6-5', '7-0'];
const mortgagePages = homeAmounts.flatMap(p => rates.map(r => `/${`mortgage-payment-on-${p}-house-${r}-rate`}`));

// Savings pages
const goals = [1000,5000,10000,15000,20000,25000,50000,100000,250000,500000,1000000];
const monthly = [200,500,1000];
const savingsPages = goals.flatMap(g => monthly.map(m => `/${`how-long-to-save-${g}-saving-${m}-per-month`}`));

const allSeoPages = [...salaryPages, ...hourlyPages, ...mortgagePages, ...savingsPages];

const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];

existingPages.forEach(p => {
  lines.push(`  <url>\n    <loc>https://mycalcfinance.com${p}</loc>\n    <lastmod>2026-02-21</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${p === '/' ? '1.0' : '0.8'}</priority>\n  </url>`);
});

allSeoPages.forEach(p => {
  lines.push(`  <url>\n    <loc>https://mycalcfinance.com${p}</loc>\n    <lastmod>2026-02-21</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`);
});

lines.push('</urlset>');

if (!fs.existsSync('public')) fs.mkdirSync('public');
fs.writeFileSync('public/sitemap.xml', lines.join('\n') + '\n');
console.log(`Sitemap: ${existingPages.length + allSeoPages.length} URLs (${existingPages.length} existing + ${allSeoPages.length} new)`);
