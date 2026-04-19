import { getAllPostsMeta } from '../../src/lib/posts'
import ClientBlogFilter from './ClientBlogFilter'
import Breadcrumb from '../../src/components/Breadcrumb'

export const metadata = {
  title: 'Financial Blog — Expert Tips & Guides | MyCalcFinance',
  description: 'Expert financial tips, guides, and strategies. Learn about mortgages, investing, tax planning, and personal finance from MyCalcFinance.',
  alternates: {
    canonical: '/blog'
  }
}

// Static export — posts come from /content/blog/*.md, baked at build time.
// To publish a new post: drop a Markdown file there and rebuild.

export default function BlogListPage() {
  // getAllPostsMeta extracts the hero <svg> as thumbnail_svg and omits the
  // full HTML body, so we don't ship the entire article to the client bundle.
  const posts = getAllPostsMeta()

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
