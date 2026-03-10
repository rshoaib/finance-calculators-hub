import { calculators } from '../src/data/calculators'
import { salaryPages, hourlyPages, mortgagePages, savingsPages } from '../src/data/seoPages'
import { supabase } from '../src/lib/supabaseClient'

export default async function sitemap() {
  const baseUrl = 'https://mycalcfinance.com'

  // 1. Static Routes & Calculators
  const staticRoutes = [
    '',
    '/blog',
    '/about',
    '/contact',
    '/privacy-policy',
  ].map((route) => ({
    url: `\${baseUrl}\${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }))

  const calculatorRoutes = calculators.map((calc) => ({
    url: `\${baseUrl}/\${calc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  // 2. Dynamic Blog Routes from Supabase
  let blogRoutes = []
  try {
    const { data: posts } = await supabase.from('blog_posts').select('slug, published_at')
    if (posts) {
      blogRoutes = posts.map(post => ({
        url: `\${baseUrl}/blog/\${post.slug}`,
        lastModified: new Date(post.published_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Sitemap Blog Fetch Error:', error)
  }

  // 3. Programmatic SEO Pages
  const allSeoPages = [...salaryPages, ...hourlyPages, ...mortgagePages, ...savingsPages]
  const seoRoutes = allSeoPages.map((page) => ({
    url: `\${baseUrl}/\${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...calculatorRoutes, ...blogRoutes, ...seoRoutes]
}
