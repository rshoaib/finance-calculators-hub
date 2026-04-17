import Link from 'next/link'

/**
 * A hub-page link block for the programmatic SEO pages in `src/data/seoPages.js`.
 * Without this component, those pages have no inbound internal links and Google
 * never discovers them (verified via GSC URL Inspection on 2026-04-17 — every
 * programmatic page came back "URL is unknown to Google").
 *
 * @param {object} props
 * @param {string} props.heading   Section heading, e.g. "Popular salary calculations"
 * @param {Array<{slug: string, title: string}>} props.pages  Pages to list.
 */
export default function PopularCalculations({ heading, pages }) {
  if (!pages || pages.length === 0) return null

  return (
    <section
      aria-labelledby="popular-calcs-heading"
      style={{
        maxWidth: '760px',
        margin: '2rem auto',
        padding: '1.5rem 1rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <h2
        id="popular-calcs-heading"
        style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}
      >
        {heading}
      </h2>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '0.5rem 1rem',
        }}
      >
        {pages.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/${p.slug}`}
              style={{
                color: 'var(--accent, #10b981)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                lineHeight: 1.4,
              }}
            >
              {p.title.split('(')[0].trim()}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
