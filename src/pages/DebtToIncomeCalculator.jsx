import { useState } from 'react'
import SEO from '../components/SEO'
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

  const calculate = () => {
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
  }

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title="Debt-to-Income Ratio Calculator — DTI Check"
          description="Free DTI calculator. Calculate your debt-to-income ratio, see your rating, and understand what lenders look for in mortgage and loan applications."
          canonical="/debt-to-income-calculator"
          jsonLd={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Debt-to-Income Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }}
        />
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
          <h2>What is Debt-to-Income Ratio?</h2>
          <p>Your DTI ratio compares your monthly debt payments to your gross monthly income. Lenders use this to evaluate your ability to manage monthly payments and repay debts.</p>
          <h3>DTI Thresholds for Loans</h3>
          <ul>
            <li>Below 20% — Excellent. Best rates and loan options available</li>
            <li>20-36% — Good. Qualifies for most conventional mortgages</li>
            <li>36-43% — Fair. Maximum for most FHA loans</li>
            <li>43%+ — Difficult to qualify for most loans</li>
          </ul>
        </section>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="debt-to-income-calculator" category="Loans" />
      </aside>
    </div>
  )
}
