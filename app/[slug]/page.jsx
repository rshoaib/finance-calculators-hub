import Link from 'next/link'
import { notFound } from 'next/navigation'
import { salaryPages, hourlyPages, mortgagePages, savingsPages } from '../../src/data/seoPages'
import FAQ from '../ClientFAQ'

// Combine all SEO programmatic pages into a single flat array
const allSeoPages = [...salaryPages, ...hourlyPages, ...mortgagePages, ...savingsPages]

export function generateStaticParams() {
  return allSeoPages.map((page) => ({
    slug: page.slug,
  }))
}

export function generateMetadata({ params }) {
  const { slug } = params
  const page = allSeoPages.find(p => p.slug === slug)

  if (!page) {
    return { title: 'Not Found' }
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/\${page.slug}`,
    }
  }
}

export default function SeoPage({ params }) {
  const { slug } = params
  const page = allSeoPages.find(p => p.slug === slug)

  if (!page) {
    notFound()
  }

  // Find related pages based on the category (salary, hourly, etc)
  // For simplicity, we just slice the array it came from
  let relatedPages = []
  if (salaryPages.find(p => p.slug === slug)) relatedPages = salaryPages.filter(p => p.slug !== slug).slice(0, 8)
  else if (hourlyPages.find(p => p.slug === slug)) relatedPages = hourlyPages.filter(p => p.slug !== slug).slice(0, 8)
  else if (mortgagePages.find(p => p.slug === slug)) relatedPages = mortgagePages.filter(p => p.slug !== slug).slice(0, 8)
  else if (savingsPages.find(p => p.slug === slug)) relatedPages = savingsPages.filter(p => p.slug !== slug).slice(0, 8)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '1.5rem', fontSize: '0.85rem', opacity: 0.6 }}>
          <Link href="/" style={{ color: 'var(--accent, #10b981)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <Link href={page.parentCalc.to} style={{ color: 'var(--accent, #10b981)', textDecoration: 'none' }}>{page.parentCalc.label}</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <span>{page.title.split('(')[0].trim()}</span>
        </nav>

        {/* Title */}
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
          {page.title.split('(')[0].trim()}
        </h1>

        {/* Answer Card */}
        <div style={{
          background: 'var(--card-bg, #f0fdf4)',
          border: '2px solid var(--accent, #10b981)',
          borderRadius: '12px',
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          fontSize: '1.15rem',
          lineHeight: 1.7,
        }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent, #10b981)' }}>Quick Answer</strong>
          <span dangerouslySetInnerHTML={{ __html: page.answer.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>') }} />
        </div>

        {/* Step by Step */}
        <div style={{
          background: 'var(--surface, #f8fafc)',
          borderRadius: '12px',
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
        }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Step-by-Step Breakdown</h2>
          <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
            {page.steps.map((step, i) => (
              <li key={i} style={{ marginBottom: '0.75rem', lineHeight: 1.6 }}>{step}</li>
            ))}
          </ol>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <Link
            href={page.parentCalc.to}
            className="btn-primary"
            style={{ display: 'inline-block' }}
          >
            Try the {page.parentCalc.label} →
          </Link>
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
          {page.faqs.map((faq, i) => (
            <FAQ key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>

        {/* Related Pages */}
        {relatedPages.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Related Calculations</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
              {relatedPages.map(r => (
                <Link
                  key={r.slug}
                  href={`/\${r.slug}`}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border, #e2e8f0)',
                    textDecoration: 'none',
                    color: 'inherit',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  {r.title.split('(')[0].trim()} →
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
