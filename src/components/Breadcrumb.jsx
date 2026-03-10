import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

export default function Breadcrumb({ items }) {
  const siteUrl = 'https://mycalcfinance.com'

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      ...items.map((item, idx) => {
        // According to schema.org, the last item doesn't strictly need a URL, 
        // but Google's Rich Results often flags missing 'item' as an error for Breadcrumbs.
        // We will default to a placeholder or the actual path if available.
        const itemUrl = item.href ? `${siteUrl}${item.href}` : `${siteUrl}${window.location.pathname}`
        return {
          '@type': 'ListItem',
          position: idx + 2,
          name: item.label,
          item: itemUrl,
        }
      }),
    ],
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      </Helmet>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        {items.map((item, idx) => (
          <span key={idx}>
            <ChevronRight size={14} className="separator" />
            {item.href ? (
              <Link to={item.href}>{item.label}</Link>
            ) : (
              <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
