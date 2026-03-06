import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import { calculators, categories } from '../data/calculators'

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? calculators
    : calculators.filter(c => c.category === activeCategory)

  const faqs = [
    { question: 'Are these calculators free to use?', answer: 'Yes, all of our financial calculators are 100% free. No signup, no account, no hidden fees. Your data stays in your browser and is never stored on our servers.' },
    { question: 'How accurate are the calculations?', answer: 'Our calculators use industry-standard formulas. However, they are for informational purposes and should not replace professional financial advice. Real-world results may vary based on fees, taxes, and changing interest rates.' },
    { question: 'Can I save my calculations?', answer: 'Currently, calculations are performed in real-time in your browser. You can bookmark any calculator page to return to it later, or take a screenshot of your results.' },
    { question: 'Which calculator should I use first?', answer: 'If you\'re buying a home, start with the Mortgage Calculator. For general savings, try the Compound Interest Calculator. For retirement planning, use the Retirement Calculator. Each calculator is designed for a specific financial scenario.' },
  ]

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
      <SEO
        description="Free online financial calculators for mortgage, loans, compound interest, retirement, taxes, and more. Make smarter money decisions today."
        canonical="/"
        jsonLd={jsonLd}
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
      </section>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Ad slot */}
      <AdSlot size="leaderboard" />

      {/* Calculator grid */}
      <div className="calculators-grid">
        {filtered.map((calc, idx) => (
          <Link key={calc.slug} to={`/${calc.slug}`} className="card card-link calc-card" style={{ animationDelay: `${idx * 60}ms` }}>
            <div className={`calc-card-icon ${calc.color}`}>
              {calc.icon}
            </div>
            <h3>{calc.title}</h3>
            <p>{calc.description}</p>
            <span className="card-cta">
              Calculate now <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>

      {/* Ad slot after grid */}
      <AdSlot size="leaderboard" />

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


function FAQ({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setOpen(!open)}>
        {question}
        <span style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▾</span>
      </button>
      {open && <div className="faq-answer">{answer}</div>}
    </div>
  )
}
