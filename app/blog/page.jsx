import { supabase } from '../../src/lib/supabaseClient'
import ClientBlogFilter from './ClientBlogFilter'
import Breadcrumb from '../../src/components/Breadcrumb'

export const metadata = {
  title: 'Financial Blog — Expert Tips & Guides | MyCalcFinance',
  description: 'Expert financial tips, guides, and strategies. Learn about mortgages, investing, tax planning, and personal finance from MyCalcFinance.',
  alternates: {
    canonical: '/blog'
  }
}

export const revalidate = 60 // Revalidate every 60 seconds

export default async function BlogListPage() {
  let posts = []

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, category, excerpt, image_url, author, published_at')
      .order('published_at', { ascending: false })

    if (error) throw error
    posts = data || []
  } catch (err) {
    console.error('Error fetching posts:', err)
  }

  const jsonLd = { 
    '@context': 'https://schema.org', 
    '@type': 'Blog', 
    name: 'MyCalcFinance Blog', 
    description: 'Financial tips and guides', 
    url: 'https://mycalcfinance.com/blog' 
  }

  return (
    <main className="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Breadcrumb items={[{ label: 'Blog' }]} />

      <div className="calc-header">
        <h1>Financial Blog</h1>
        <p>Expert guides, tips, and strategies to help you make smarter financial decisions.</p>
      </div>

      <ClientBlogFilter initialPosts={posts} />
    </main>
  )
}
