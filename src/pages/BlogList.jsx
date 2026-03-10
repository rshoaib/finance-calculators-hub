import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import { supabase } from '../lib/supabaseClient'

const CATEGORIES = ['All', 'Mortgage', 'Investing', 'Tax', 'Savings', 'Credit', 'Insurance']

export default function BlogList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    if (!supabase) {
      setPosts(SAMPLE_POSTS)
      setLoading(false)
      return
    }
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, category, image_url, author, published_at')
        .order('published_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      console.error('Error fetching posts:', err)
      setPosts(SAMPLE_POSTS)
    } finally {
      setLoading(false)
    }
  }

  const filtered = category === 'All'
    ? posts
    : posts.filter(p => p.category?.toLowerCase() === category.toLowerCase())

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <main className="main-content">
      <SEO
        title="Financial Blog — Expert Tips & Guides"
        description="Expert financial tips, guides, and strategies. Learn about mortgages, investing, tax planning, and personal finance from MyCalcFinance."
        canonical="/blog"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Blog', name: 'MyCalcFinance Blog', description: 'Financial tips and guides', url: 'https://mycalcfinance.com/blog' }}
      />
      <Breadcrumb items={[{ label: 'Blog' }]} />

      <div className="calc-header">
        <h1>Financial Blog</h1>
        <p>Expert guides, tips, and strategies to help you make smarter financial decisions.</p>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {CATEGORIES.map(cat => (
          <button key={cat} className={`filter-btn${category === cat ? ' active' : ''}`}
            onClick={() => setCategory(cat)}>{cat}</button>
        ))}
      </div>

      <AdSlot size="leaderboard" />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading articles...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No articles found in this category.
        </div>
      ) : (
        <div className="blog-grid">
          {filtered.map((post, idx) => (
            <article key={post.id || idx} className="blog-card">
              {post.image_url && (
                <Link to={`/blog/${post.slug}`} className="blog-card-image">
                  <img src={post.image_url} alt={post.title} width="800" height="450" loading="lazy" />
                </Link>
              )}
              <div className="blog-card-body">
                {post.category && <span className="blog-card-category">{post.category}</span>}
                <h2 className="blog-card-title">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-meta">
                  <span>{post.author || 'MyCalcFinance Team'}</span>
                  <span>{formatDate(post.published_at)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdSlot size="leaderboard" />
    </main>
  )
}

/* Placeholder posts for development when Supabase is not connected */
const SAMPLE_POSTS = [
  {
    id: '1', slug: 'mortgage-tips-first-time-buyers',
    title: '10 Mortgage Tips Every First-Time Buyer Needs to Know',
    excerpt: 'Navigating your first mortgage can be overwhelming. Here are the essential tips to save thousands on your home loan.',
    category: 'Mortgage', image_url: '', author: 'MyCalcFinance Team',
    published_at: '2026-02-10T00:00:00Z',
  },
  {
    id: '2', slug: 'compound-interest-power',
    title: 'The Power of Compound Interest: Why Starting Early Matters',
    excerpt: 'Einstein called compound interest the eighth wonder of the world. Learn how to harness it for your financial goals.',
    category: 'Investing', image_url: '', author: 'MyCalcFinance Team',
    published_at: '2026-02-08T00:00:00Z',
  },
  {
    id: '3', slug: 'tax-deductions-you-might-miss',
    title: '15 Tax Deductions You Might Be Missing',
    excerpt: 'Many taxpayers leave money on the table. Discover commonly overlooked deductions that could lower your tax bill.',
    category: 'Tax', image_url: '', author: 'MyCalcFinance Team',
    published_at: '2026-02-05T00:00:00Z',
  },
  {
    id: '4', slug: 'emergency-fund-guide',
    title: 'How to Build an Emergency Fund in 6 Months',
    excerpt: 'A step-by-step guide to building your financial safety net, even on a tight budget.',
    category: 'Savings', image_url: '', author: 'MyCalcFinance Team',
    published_at: '2026-02-01T00:00:00Z',
  },
]
