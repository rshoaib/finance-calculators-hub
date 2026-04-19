import { calculators } from '../src/data/calculators'
import { salaryPages, hourlyPages, mortgagePages, savingsPages } from '../src/data/seoPages'
import { getAllPostsMeta } from '../src/lib/posts'

// Required by `output: 'export'` — forces the sitemap to be generated once at
// build time and written to /out/sitemap.xml, rather than served dynamically.
export const dynamic = 'force-static'

// Static lastmod for routes whose content doesn't change on every deploy.
// Bump this manually when you actually modify a calculator or static page —
// using `new Date()` here (the old behaviour) made every build produce a new
// lastmod on 27 unchanged URLs, which trains Google to ignore the signal.
const STATIC_LASTMOD = new Date('2026-04-17')

// Programmatic SEO pages (salary/hourly/mortgage/savings). Content is stable.
const SEO_PAGES_LASTMOD = new Date('2025-12-01')

export default function sitemap() {
  const baseUrl = 'https://mycalcfinance.com'

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/blog',
    '/about',
    '/contact',
    '/privacy-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: STATIC_LASTMOD,
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }))

  // 2. Calculators
  const calculatorRoutes = calculators.map((calc) => ({
    url: `${baseUrl}/${calc.slug}`,
    lastModified: STATIC_LASTMOD,
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  // 3. Blog Routes — read from /content/blog/*.md at build time. updated_at
  // still reflects real content changes because it's authored into the
  // frontmatter by the publishing pipeline.
  const posts = getAllPostsMeta()
  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at || STATIC_LASTMOD),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 4. Programmatic SEO Pages (lower priority — Google treats many as thin)
  const allSeoPages = [...salaryPages, ...hourlyPages, ...mortgagePages, ...savingsPages]
  const seoRoutes = allSeoPages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: SEO_PAGES_LASTMOD,
    changeFrequency: 'yearly',
    priority: 0.5,
  }))

  return [...staticRoutes, ...calculatorRoutes, ...blogRoutes, ...seoRoutes]
}
