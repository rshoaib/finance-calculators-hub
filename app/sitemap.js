import { calculators } from '../src/data/calculators'
import { salaryPages, hourlyPages, mortgagePages, savingsPages } from '../src/data/seoPages'
import { supabase } from '../src/lib/supabaseClient'

// Static lastmod for routes whose content doesn't change on every deploy.
// Bump this manually when you actually modify a calculator or static page —
// using `new Date()` here (the old behaviour) made every build produce a new
// lastmod on 27 unchanged URLs, which trains Google to ignore the signal.
const STATIC_LASTMOD = new Date('2026-04-17')

// Programmatic SEO pages (salary/hourly/mortgage/savings). Content is stable.
const SEO_PAGES_LASTMOD = new Date('2025-12-01')

export default async function sitemap() {
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

  // 3. Dynamic Blog Routes from Supabase — use updated_at so sitemap reflects
  // real content changes (e.g. the 2026-04-16 broken-link fix pass).
  let blogRoutes = []
  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, published_at, updated_at')
    if (posts) {
      blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at || STATIC_LASTMOD),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Sitemap Blog Fetch Error:', error)
  }

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
