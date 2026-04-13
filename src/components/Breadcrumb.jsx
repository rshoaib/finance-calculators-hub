"use client"
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Breadcrumb({ items }) {
  const siteUrl = 'https://mycalcfinance.com'
  const pathname = usePathname()

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
        const itemUrl = item.href ? `${siteUrl}${item.href}` : `${siteUrl}${pathname}`
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        {items.map((item, idx) => (
          <span key={idx}>
            <ChevronRight size={14} className="separator" />
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
