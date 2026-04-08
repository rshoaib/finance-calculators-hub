import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdSlot from '../../../src/components/AdSlot'
import Breadcrumb from '../../../src/components/Breadcrumb'
import RelatedCalculators from '../../../src/components/RelatedCalculators'
import { supabase } from '../../../src/lib/supabaseClient'

export const revalidate = 60 // Revalidate every 60 seconds

async function getPost(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: 'Post Not Found - MyCalcFinance' }
  }

  return {
    title: `${post.title} — MyCalcFinance Blog`,
    description: post.excerpt || post.title,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://mycalcfinance.com/blog/${post.slug}`,
      images: post.image_url ? [{ url: post.image_url }] : [],
    }
  }
}

export async function generateStaticParams() {
  const { data } = await supabase.from('blog_posts').select('slug')
  return (data || []).map(post => ({ slug: post.slug }))
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author || 'MyCalcFinance Team' },
    datePublished: post.published_at,
    publisher: { '@type': 'Organization', name: 'MyCalcFinance' },
    ...(post.image_url ? { image: post.image_url } : {}),
  }

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Breadcrumb items={[
          { label: 'Blog', path: '/blog' },
          { label: post.title },
        ]} />

        <article className="blog-article">
          {post.image_url && (
            <div className="blog-article-hero">
              <img src={post.image_url} alt={post.title} width="1200" height="514" fetchPriority="high" />
            </div>
          )}

          <div className="blog-article-header">
            {post.category && <span className="blog-card-category">{post.category}</span>}
            <h1>{post.title}</h1>
            <div className="blog-article-meta">
              <span className="blog-article-author">{post.author || 'MyCalcFinance Team'}</span>
              <span className="blog-article-date">{formatDate(post.published_at)}</span>
            </div>
          </div>

          <AdSlot size="leaderboard" />

          <div className="blog-article-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          <AdSlot size="leaderboard" />

          <div className="blog-article-footer">
            <Link href="/blog" className="btn-calculate" style={{ display: 'inline-block', maxWidth: 200, textAlign: 'center' }}>
              ← Back to Blog
            </Link>
          </div>
        </article>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug={post.slug} category={post.category || 'Loans'} />
      </aside>
    </div>
  )
}
