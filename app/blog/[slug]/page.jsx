import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdSlot from '../../../src/components/AdSlot'
import Breadcrumb from '../../../src/components/Breadcrumb'
import RelatedCalculators from '../../../src/components/RelatedCalculators'
import { getPost as readPost, getAllSlugs } from '../../../src/lib/posts'

// Static export — no revalidate, posts are baked at build time. To publish a
// new post, drop a Markdown file in /content/blog and rebuild.

async function getPost(slug) {
  return readPost(slug)
}

// SEO description cap. Google typically truncates around 155-160 chars in SERPs.
const SAFE_DESC_LEN = 155;

// Prefer a curated SEO title when set; otherwise the editorial title.
// No auto-truncation — over-length raw titles are tracked as content debt.
function safeTitle(post) {
  return post.meta_title || post.title;
}

function safeDescription(post) {
  if (post.meta_description) return post.meta_description;
  const text = post.excerpt || post.title || '';
  if (text.length <= SAFE_DESC_LEN) return text;
  const cut = text.slice(0, SAFE_DESC_LEN);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…';
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: 'Post Not Found - MyCalcFinance' }
  }

  const title = safeTitle(post);
  const description = safeDescription(post);

  return {
    // Title suffix intentionally omitted — the layout-level site name already
    // appears in Google's SERP result line; adding " — MyCalcFinance Blog"
    // here was pushing most posts past the ~60-char title cap. For posts whose
    // editorial title is itself over 60 chars, set blog_posts.meta_title.
    title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://mycalcfinance.com/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  }
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
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
          {/* Hero image is now inlined as the first <svg> inside post.content */}

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
