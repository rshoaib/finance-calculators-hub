import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { supabase } from '../lib/supabaseClient'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    setLoading(true)
    if (!supabase) {
      setPost(SAMPLE_POST)
      setLoading(false)
      return
    }
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      setPost(data)
    } catch (err) {
      console.error('Error fetching post:', err)
      setPost(null)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (loading) {
    return (
      <main className="main-content" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading article...</p>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="main-content" style={{ textAlign: 'center', padding: '4rem' }}>
        <h1>Article Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
          The article you're looking for doesn't exist.
        </p>
        <Link to="/blog" style={{ color: 'var(--accent)', marginTop: '1rem', display: 'inline-block' }}>
          ← Back to Blog
        </Link>
      </main>
    )
  }

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title={`${post.title} — FinanceCalc Blog`}
          description={post.excerpt || post.title}
          canonical={`/blog/${post.slug}`}
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            author: { '@type': 'Person', name: post.author || 'FinanceCalc Team' },
            datePublished: post.published_at,
            publisher: { '@type': 'Organization', name: 'FinanceCalc' },
            ...(post.image_url ? { image: post.image_url } : {}),
          }}
        />
        <Breadcrumb items={[
          { label: 'Blog', path: '/blog' },
          { label: post.title },
        ]} />

        <article className="blog-article">
          {post.image_url && (
            <div className="blog-article-hero">
              <img src={post.image_url} alt={post.title} />
            </div>
          )}

          <div className="blog-article-header">
            {post.category && <span className="blog-card-category">{post.category}</span>}
            <h1>{post.title}</h1>
            <div className="blog-article-meta">
              <span className="blog-article-author">{post.author || 'FinanceCalc Team'}</span>
              <span className="blog-article-date">{formatDate(post.published_at)}</span>
            </div>
          </div>

          <AdSlot size="leaderboard" />

          <div className="blog-article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <AdSlot size="leaderboard" />

          <div className="blog-article-footer">
            <Link to="/blog" className="btn-calculate" style={{ display: 'inline-block', maxWidth: 200, textAlign: 'center' }}>
              ← Back to Blog
            </Link>
          </div>
        </article>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="" category={post.category || 'Loans'} />
      </aside>
    </div>
  )
}

/* Fallback sample post for development */
const SAMPLE_POST = {
  title: '10 Mortgage Tips Every First-Time Buyer Needs to Know',
  slug: 'mortgage-tips-first-time-buyers',
  excerpt: 'Navigating your first mortgage can be overwhelming. Here are the essential tips to save thousands.',
  category: 'Mortgage',
  author: 'FinanceCalc Team',
  published_at: '2026-02-10T00:00:00Z',
  image_url: '',
  content: `
    <h2>1. Check Your Credit Score First</h2>
    <p>Your credit score is one of the biggest factors in determining your mortgage interest rate. Before you start house hunting, check your score and take steps to improve it if needed. A score above 740 typically qualifies you for the best rates.</p>

    <h2>2. Get Pre-Approved, Not Just Pre-Qualified</h2>
    <p>Pre-qualification is a rough estimate, while pre-approval involves a thorough review of your finances. Sellers take pre-approved buyers more seriously, and you'll know exactly how much you can afford.</p>

    <h2>3. Don't Forget the Hidden Costs</h2>
    <p>Beyond the down payment and monthly mortgage, budget for closing costs (typically 2-5% of the home price), property taxes, homeowner's insurance, HOA fees, and maintenance costs.</p>

    <h2>4. Shop Around for Rates</h2>
    <p>Don't settle for the first rate you're offered. Compare at least 3-4 lenders — even a 0.25% difference can save you tens of thousands over the life of your loan. Use our <a href="/mortgage-calculator">Mortgage Calculator</a> to compare scenarios.</p>

    <h2>5. Consider a 15-Year vs 30-Year Mortgage</h2>
    <p>A 15-year mortgage has higher monthly payments but saves you significantly on total interest. A 30-year mortgage offers lower payments and more flexibility. The right choice depends on your financial goals.</p>
  `,
}
