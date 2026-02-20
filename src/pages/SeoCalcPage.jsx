import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

/**
 * Reusable programmatic SEO landing page for MyCalcFinance.
 * Renders answer, step-by-step breakdown, FAQs with schema, and related links.
 */
export default function SeoCalcPage({ page, relatedPages = [] }) {
  const [openFaq, setOpenFaq] = useState(null)

  // FAQ JSON-LD
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
      <SEO
        title={page.title}
        description={page.description}
        canonical={`/${page.slug}`}
        jsonLd={faqJsonLd}
      />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '1.5rem', fontSize: '0.85rem', opacity: 0.6 }}>
          <Link to="/" style={{ color: 'var(--accent, #10b981)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <Link to={page.parentCalc.to} style={{ color: 'var(--accent, #10b981)', textDecoration: 'none' }}>{page.parentCalc.label}</Link>
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
          <span dangerouslySetInnerHTML={{ __html: page.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
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
            to={page.parentCalc.to}
            style={{
              display: 'inline-block',
              background: 'var(--accent, #10b981)',
              color: 'white',
              padding: '0.85rem 2rem',
              borderRadius: '8px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '1rem',
            }}
          >
            Try the {page.parentCalc.label} →
          </Link>
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
          {page.faqs.map((faq, i) => (
            <div
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                border: '1px solid var(--border, #e2e8f0)',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                padding: '1rem 1.25rem',
                cursor: 'pointer',
                background: 'var(--surface, #f8fafc)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 600 }}>{faq.q}</h3>
                <span style={{ fontSize: '1.2rem', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </div>
              {openFaq === i && (
                <p style={{ marginTop: '0.75rem', marginBottom: 0, lineHeight: 1.7, fontSize: '0.9rem', opacity: 0.8 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Related Pages */}
        {relatedPages.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Related Calculations</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
              {relatedPages.slice(0, 8).map(r => (
                <Link
                  key={r.slug}
                  to={`/${r.slug}`}
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
      </div>
    </>
  )
}
