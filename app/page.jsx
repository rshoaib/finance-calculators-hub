import Link from 'next/link'
import { ArrowRight, Calculator, TrendingUp, Shield } from 'lucide-react'
import AdSlot from '../src/components/AdSlot'
import { calculators, categories } from '../src/data/calculators'
import ClientHomeFilter from './ClientHomeFilter'
import FAQ from './ClientFAQ'

const POPULAR_SLUGS = ['mortgage-calculator', 'compound-interest-calculator', 'retirement-calculator', '401k-calculator', 'home-affordability-calculator']

const SPOTLIGHT = [
  { slug: 'mortgage-calculator', icon: '🏠', color: 'linear-gradient(135deg, #10b981, #059669)', title: 'Mortgage Calculator', desc: 'Calculate monthly payments, total interest, and view amortization schedules for any home loan.' },
  { slug: 'compound-interest-calculator', icon: '📈', color: 'linear-gradient(135deg, #3b82f6, #2563eb)', title: 'Compound Interest', desc: 'See how your investments grow with compound interest and regular contributions over time.' },
  { slug: 'retirement-calculator', icon: '🏖️', color: 'linear-gradient(135deg, #f59e0b, #d97706)', title: 'Retirement Planner', desc: 'Plan your retirement savings and discover how much you need to save each month.' },
]

const faqs = [
  { question: 'Are these calculators free to use?', answer: 'Yes, all of our financial calculators are 100% free. No signup, no account, no hidden fees. Your data stays in your browser and is never stored on our servers.' },
  { question: 'How accurate are the calculations?', answer: 'Our calculators use industry-standard formulas. However, they are for informational purposes and should not replace professional financial advice. Real-world results may vary based on fees, taxes, and changing interest rates.' },
  { question: 'Can I save my calculations?', answer: 'Currently, calculations are performed in real-time in your browser. You can bookmark any calculator page to return to it later, or take a screenshot of your results.' },
  { question: 'Which calculator should I use first?', answer: "If you're buying a home, start with the Mortgage Calculator. For general savings, try the Compound Interest Calculator. For retirement planning, use the Retirement Calculator. Each calculator is designed for a specific financial scenario." },
]

export const metadata = {
  title: 'MyCalcFinance — Free Financial Calculators',
  description: 'Free online financial calculators for mortgage, loans, compound interest, retirement, taxes, and more. Make smarter money decisions today.',
  alternates: {
    canonical: '/',
  }
}

export default function HomePage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'MyCalcFinance',
      url: 'https://mycalcfinance.com',
      description: 'Free online financial calculators for mortgage, loans, compound interest, retirement, taxes, and more.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://mycalcfinance.com/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
  ]

  return (
    <main className="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="hero animate-in">
        <h1>
          Free <span className="gradient-text">Financial Calculators</span>
          <br />for Smarter Decisions
        </h1>
        <p>
          Calculate mortgage payments, investment growth, retirement savings, taxes, and more — 100% free, no signup required.
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta">
          <Link href="/mortgage-calculator" className="btn-primary">
            🏠 Mortgage Calculator
          </Link>
          <Link href="/compound-interest-calculator" className="btn-secondary">
            📈 Investment Growth
          </Link>
        </div>

        {/* Trust Signals */}
        <div className="trust-signals">
          <div className="trust-item">
            <span>🔒</span> <span>100% Private — No Data Stored</span>
          </div>
          <div className="trust-item">
            <span>⚡</span> <span>Instant Results</span>
          </div>
          <div className="trust-item">
            <span>🆓</span> <span>Forever Free — No Signup</span>
          </div>
          <div className="trust-item">
            <span>📊</span> <span>20+ Calculators</span>
          </div>
        </div>
      </section>

      {/* Featured Spotlight */}
      <section className="spotlight-section">
        <div className="spotlight-grid">
          {SPOTLIGHT.map(s => (
            <Link key={s.slug} href={`/${s.slug}`} className="spotlight-card">
              <div className="spotlight-icon" style={{ background: s.color }}>
                {s.icon}
              </div>
              <div className="spotlight-info">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Client Component: Filtering the huge grid of calculators */}
      <ClientHomeFilter calculators={calculators} categories={categories} popularSlugs={POPULAR_SLUGS} />

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <FAQ key={i} question={faq.question} answer={faq.answer} />
        ))}
      </section>
    </main>
  )
}
