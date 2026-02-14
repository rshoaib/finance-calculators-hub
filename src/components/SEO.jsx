import { Helmet } from 'react-helmet-async'

export default function SEO({ title, description, canonical, type = 'website', jsonLd }) {
  const siteUrl = 'https://financecalc.app'
  const fullTitle = title ? `${title} | FinanceCalc` : 'FinanceCalc — Free Financial Calculators'
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content="FinanceCalc" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  )
}
