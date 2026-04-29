"use client"
import { useState, useCallback, useEffect } from 'react'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency, formatPercent } from '../utils/formatters'

const DTI_RATINGS = [
  { max: 20, label: 'Excellent', color: '#10b981', desc: 'You have a very low debt burden. Lenders will view you favorably.' },
  { max: 36, label: 'Good', color: '#06b6d4', desc: 'Your DTI is manageable. You qualify for most loan products.' },
  { max: 43, label: 'Fair', color: '#f59e0b', desc: 'You may still qualify for some mortgages, but paying down debt would help.' },
  { max: 50, label: 'Poor', color: '#f97316', desc: 'High debt burden. Focus on paying down existing debt before taking on more.' },
  { max: Infinity, label: 'Critical', color: '#ef4444', desc: 'Very high DTI. You will likely be denied for new loans. Consider debt counseling.' },
]

export default function DebtToIncomeCalculator() {
  const [inputs, setInputs] = useState({
    monthlyIncome: 6000,
    mortgage: 1200,
    carPayment: 350,
    studentLoans: 200,
    creditCards: 150,
    otherDebts: 0,
  })
  const [results, setResults] = useState(null)

  const calculate = useCallback(() => {
    const { monthlyIncome, mortgage, carPayment, studentLoans, creditCards, otherDebts } = inputs
    const totalDebt = mortgage + carPayment + studentLoans + creditCards + otherDebts
    const dtiRatio = monthlyIncome > 0 ? (totalDebt / monthlyIncome) * 100 : 0

    const rating = DTI_RATINGS.find(r => dtiRatio < r.max) || DTI_RATINGS[DTI_RATINGS.length - 1]

    const debtBreakdown = [
      { label: 'Housing', amount: mortgage, color: '#10b981' },
      { label: 'Car Payment', amount: carPayment, color: '#3b82f6' },
      { label: 'Student Loans', amount: studentLoans, color: '#8b5cf6' },
      { label: 'Credit Cards', amount: creditCards, color: '#f59e0b' },
      { label: 'Other Debts', amount: otherDebts, color: '#ef4444' },
    ].filter(d => d.amount > 0)

    setResults({ dtiRatio, totalDebt, rating, remaining: monthlyIncome - totalDebt, debtBreakdown })
  }, [inputs])

  useEffect(() => { calculate() }, [calculate])

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'What is a good debt-to-income ratio?', answer: 'A DTI below 20% is considered excellent by most lenders and qualifies you for the best interest rates. A DTI between 20-36% is good and acceptable for most conventional loans. A DTI of 36-43% is fair — you may still qualify for FHA loans. Above 43% is considered high risk, and most lenders will deny conventional mortgage applications.' },
    { question: 'What debts are included in DTI?', answer: 'DTI includes all recurring monthly debt payments: mortgage/rent, car loans, student loans, credit card minimum payments, personal loans, child support, and alimony. It does NOT include utilities, groceries, insurance premiums, phone bills, or other living expenses that are not debt obligations.' },
    { question: 'What is the difference between front-end and back-end DTI?', answer: 'Front-end DTI (also called housing ratio) includes only housing-related costs — mortgage payment, property taxes, homeowners insurance, and HOA fees. Lenders typically want this below 28%. Back-end DTI includes ALL monthly debts and is the ratio this calculator computes. Lenders usually cap this at 36-43%.' },
    { question: 'How can I lower my DTI ratio?', answer: 'You can lower your DTI by: (1) paying down existing debt (focus on highest payments first), (2) avoiding new debt, (3) increasing your income through raises, side jobs, or freelancing, (4) refinancing loans at lower rates to reduce monthly payments, and (5) extending loan terms (though this increases total interest paid).' },
    { question: 'Does DTI affect my credit score?', answer: 'DTI itself is not a factor in your credit score — credit bureaus do not know your income. However, the factors that create a high DTI (high credit utilization, many accounts with balances) DO affect your credit score. Lenders evaluate both your credit score AND DTI ratio when making lending decisions.' },
  ]

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Debt-to-Income Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) },
  ]

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        {jsonLd.map((ld, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          />
        ))}
        <Breadcrumb items={[{ label: 'Debt-to-Income Calculator' }]} />

        <div className="calc-header">
          <h1>Debt-to-Income Calculator</h1>
          <p>Calculate your DTI ratio and see what it means for your borrowing power.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-group">
              <label>Monthly Gross Income</label>
              <input type="number" className="form-input" value={inputs.monthlyIncome}
                onChange={e => handleChange('monthlyIncome', e.target.value)} />
            </div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Monthly Debts</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Housing (Rent/Mortgage)</label>
                <input type="number" className="form-input" value={inputs.mortgage}
                  onChange={e => handleChange('mortgage', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Car Payment</label>
                <input type="number" className="form-input" value={inputs.carPayment}
                  onChange={e => handleChange('carPayment', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Student Loans</label>
                <input type="number" className="form-input" value={inputs.studentLoans}
                  onChange={e => handleChange('studentLoans', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Credit Card Payments</label>
                <input type="number" className="form-input" value={inputs.creditCards}
                  onChange={e => handleChange('creditCards', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Other Monthly Debts</label>
              <input type="number" className="form-input" value={inputs.otherDebts}
                onChange={e => handleChange('otherDebts', e.target.value)} />
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate DTI</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">DTI Ratio</div>
                <div className="result-value" style={{ color: results.rating.color, fontSize: '2.5rem' }}>
                  {formatPercent(results.dtiRatio)}
                </div>
              </div>
              <div className="result-card">
                <div className="result-label">Rating</div>
                <div className="result-value" style={{ color: results.rating.color }}>{results.rating.label}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Monthly Debt</div>
                <div className="result-value gold">{formatCurrency(results.totalDebt)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Remaining Income</div>
                <div className="result-value" style={{ color: results.remaining >= 0 ? '#10b981' : '#ef4444' }}>
                  {formatCurrency(results.remaining)}
                </div>
              </div>
            </div>

            {/* DTI Gauge */}
            <div className="chart-container">
              <h3>Your DTI Assessment</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{results.rating.desc}</p>
              <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ width: '20%', background: '#10b981' }} />
                <div style={{ width: '16%', background: '#06b6d4' }} />
                <div style={{ width: '7%', background: '#f59e0b' }} />
                <div style={{ width: '7%', background: '#f97316' }} />
                <div style={{ width: '50%', background: '#ef4444' }} />
              </div>
              <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <div style={{
                  position: 'absolute',
                  left: `${Math.min(results.dtiRatio, 100)}%`,
                  transform: 'translateX(-50%)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 700,
                  color: results.rating.color,
                }}>
                  ▲ {formatPercent(results.dtiRatio)}
                </div>
              </div>

              {/* Debt breakdown */}
              <h3 style={{ marginTop: '2rem' }}>Debt Breakdown</h3>
              {results.debtBreakdown.map((d, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                    {d.label}
                  </span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(d.amount)}</span>
                </div>
              ))}
            </div>
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>What Is Debt-to-Income Ratio (DTI)?</h2>
          <p>
            Your debt-to-income ratio is one of the most important numbers in personal finance. It compares your
            total monthly debt payments to your gross monthly income, expressed as a percentage. Lenders use DTI
            to evaluate your ability to manage monthly payments and determine whether you can afford to take on
            additional debt, such as a mortgage, car loan, or personal loan.
          </p>

          <h3>DTI Formula</h3>
          <ul>
            <li><strong>DTI Ratio</strong> = (Total Monthly Debt Payments ÷ Gross Monthly Income) × 100</li>
          </ul>

          <h3>Worked Example</h3>
          <p>
            With a <strong>$6,000 gross monthly income</strong> and monthly debts of:
          </p>
          <ul>
            <li>Mortgage: $1,400</li>
            <li>Car payment: $350</li>
            <li>Student loans: $250</li>
            <li>Credit cards: $150</li>
            <li>Total monthly debt: <strong>$2,150</strong></li>
            <li>DTI ratio: <strong>35.8%</strong> ($2,150 ÷ $6,000 × 100)</li>
            <li>Rating: <strong>Good</strong> — qualifies for most conventional mortgages</li>
          </ul>

          <h3>DTI Thresholds by Lender Type</h3>
          <ul>
            <li><strong>Below 20%:</strong> Excellent — best rates, most loan options, strong financial health</li>
            <li><strong>20-36%:</strong> Good — qualifies for most conventional <a href="/mortgage-calculator">mortgages</a> and loans</li>
            <li><strong>36-43%:</strong> Fair — may qualify for FHA loans; consider reducing debt</li>
            <li><strong>43-50%:</strong> High risk — limited options; VA and some FHA loans may still be available</li>
            <li><strong>50%+:</strong> Very high — unlikely to qualify; focus on aggressive debt reduction</li>
          </ul>

          <h3>Key DTI Terms</h3>
          <dl>
            <dt><strong>Front-End DTI (Housing Ratio)</strong></dt>
            <dd>Only includes housing costs: mortgage, property taxes, insurance, HOA. Lenders typically want this below 28%.</dd>
            <dt><strong>Back-End DTI (Total DTI)</strong></dt>
            <dd>Includes all monthly debt obligations — this is the ratio most commonly referenced and what this calculator computes.</dd>
            <dt><strong>Debt Consolidation</strong></dt>
            <dd>Combining multiple debts into a single loan with a lower interest rate, potentially lowering your monthly payments and DTI.</dd>
            <dt><strong>Debt Snowball Method</strong></dt>
            <dd>Paying off debts smallest-to-largest for psychological wins. Doesn't minimize interest but builds momentum.</dd>
            <dt><strong>Debt Avalanche Method</strong></dt>
            <dd>Paying off debts by highest interest rate first. Mathematically optimal for saving the most on interest.</dd>
          </dl>

          <h3>Strategies to Lower Your DTI</h3>
          <ul>
            <li><strong>Pay down <a href="/credit-card-payoff-calculator">credit card balances</a>:</strong> They usually have the highest minimum payments relative to balance</li>
            <li><strong>Refinance high-rate loans:</strong> A lower rate reduces monthly payments, improving your DTI immediately</li>
            <li><strong>Increase your income:</strong> Even a side job adding $500/month can significantly improve your ratio</li>
            <li><strong>Avoid taking on new debt:</strong> Each new account adds to your monthly obligations</li>
            <li><strong>Use the <a href="/budget-planner">50/30/20 budget</a>:</strong> Allocate 20%+ to aggressive debt payoff to steadily improve DTI</li>
          </ul>

          <h3>Frequently Asked Questions</h3>
          {faqs.map((faq, i) => (
            <div key={i}>
              <h4>{faq.question}</h4>
              <p>{faq.answer}</p>
            </div>
          ))}
        </section>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="debt-to-income-calculator" category="Loans" />
      </aside>
    </div>
  )
}
