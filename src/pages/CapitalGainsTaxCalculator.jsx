import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency, formatPercent } from '../utils/formatters'

const LT_BRACKETS = {
  single: [
    { min: 0, max: 47025, rate: 0 },
    { min: 47025, max: 518900, rate: 15 },
    { min: 518900, max: Infinity, rate: 20 },
  ],
  married: [
    { min: 0, max: 94050, rate: 0 },
    { min: 94050, max: 583750, rate: 15 },
    { min: 583750, max: Infinity, rate: 20 },
  ],
}

export default function CapitalGainsTaxCalculator() {
  const [inputs, setInputs] = useState({
    purchasePrice: 50000,
    salePrice: 85000,
    holdingPeriod: 'long',
    filingStatus: 'single',
    taxableIncome: 85000,
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const { purchasePrice, salePrice, holdingPeriod, filingStatus, taxableIncome } = inputs
    const gain = salePrice - purchasePrice

    if (gain <= 0) {
      setResults({ gain, taxRate: 0, taxOwed: 0, netProceeds: salePrice, isLoss: true, comparisonData: [] })
      return
    }

    let shortTermTax = 0
    let longTermTax = 0

    // Short-term: taxed as ordinary income (simplified — use marginal bracket)
    const ordinaryBrackets = [
      { min: 0, max: 11600, rate: 10 },
      { min: 11600, max: 47150, rate: 12 },
      { min: 47150, max: 100525, rate: 22 },
      { min: 100525, max: 191950, rate: 24 },
      { min: 191950, max: 243725, rate: 32 },
      { min: 243725, max: 609350, rate: 35 },
      { min: 609350, max: Infinity, rate: 37 },
    ]
    // Find marginal bracket for taxableIncome + gain
    const combinedIncome = taxableIncome + gain
    let marginalRate = 10
    for (const b of ordinaryBrackets) {
      if (combinedIncome > b.min) marginalRate = b.rate
    }
    shortTermTax = gain * marginalRate / 100

    // Long-term
    const ltBrackets = LT_BRACKETS[filingStatus]
    let ltRate = 0
    for (const b of ltBrackets) {
      if (taxableIncome + gain > b.min) ltRate = b.rate
    }
    longTermTax = gain * ltRate / 100

    const isShort = holdingPeriod === 'short'
    const taxOwed = isShort ? shortTermTax : longTermTax
    const taxRate = isShort ? marginalRate : ltRate
    const netProceeds = salePrice - taxOwed

    const comparisonData = [
      { name: 'Short-Term', tax: Math.round(shortTermTax), rate: marginalRate, net: Math.round(salePrice - shortTermTax) },
      { name: 'Long-Term', tax: Math.round(longTermTax), rate: ltRate, net: Math.round(salePrice - longTermTax) },
    ]

    setResults({ gain, taxRate, taxOwed, netProceeds, isLoss: false, comparisonData, shortTermTax, longTermTax, savings: shortTermTax - longTermTax })
  }

  const handleChange = (field, value) => {
    if (field === 'holdingPeriod' || field === 'filingStatus') {
      setInputs(prev => ({ ...prev, [field]: value }))
    } else {
      setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
    }
  }

  const faqs = [
    { question: 'What is the difference between short-term and long-term capital gains?', answer: 'Short-term capital gains (assets held less than 1 year) are taxed as ordinary income at your marginal tax rate. Long-term capital gains (held over 1 year) receive preferential rates of 0%, 15%, or 20% depending on your income.' },
    { question: 'Can I offset capital gains with losses?', answer: 'Yes, capital losses can offset capital gains dollar-for-dollar. If losses exceed gains, you can deduct up to $3,000 of net losses against ordinary income per year, carrying forward any remaining losses.' },
    { question: 'Do I pay capital gains tax on my primary home?', answer: 'If you\'ve lived in your home for at least 2 of the last 5 years, you can exclude up to $250,000 in gains ($500,000 if married filing jointly) from capital gains tax.' },
  ]

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title="Capital Gains Tax Calculator — Short-Term vs Long-Term"
          description="Free capital gains tax calculator. Compare short-term vs long-term capital gains tax rates and see how much you'll owe on investment profits."
          canonical="/capital-gains-tax-calculator"
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Capital Gains Tax Calculator',
            applicationCategory: 'FinanceApplication',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }}
          faqs={faqs}
        />
        <Breadcrumb items={[{ label: 'Capital Gains Tax Calculator' }]} />

        <div className="calc-header">
          <h1>Capital Gains Tax Calculator</h1>
          <p>Calculate your capital gains tax and compare short-term vs long-term rates.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Purchase Price ($)</label>
                <input type="number" className="form-input" value={inputs.purchasePrice} onChange={e => handleChange('purchasePrice', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Sale Price ($)</label>
                <input type="number" className="form-input" value={inputs.salePrice} onChange={e => handleChange('salePrice', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Holding Period</label>
                <select className="form-select" value={inputs.holdingPeriod} onChange={e => handleChange('holdingPeriod', e.target.value)}>
                  <option value="short">Short-Term (under 1 year)</option>
                  <option value="long">Long-Term (over 1 year)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Filing Status</label>
                <select className="form-select" value={inputs.filingStatus} onChange={e => handleChange('filingStatus', e.target.value)}>
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Other Taxable Income ($)</label>
                <input type="number" className="form-input" value={inputs.taxableIncome} onChange={e => handleChange('taxableIncome', e.target.value)} />
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Capital Gains Tax</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">{results.isLoss ? 'Capital Loss' : 'Capital Gain'}</div>
                <div className="result-value accent" style={{ color: results.isLoss ? '#ef4444' : '#10b981' }}>{formatCurrency(results.gain)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Tax Rate</div>
                <div className="result-value gold">{results.taxRate}%</div>
              </div>
              <div className="result-card">
                <div className="result-label">Tax Owed</div>
                <div className="result-value" style={{ color: '#ef4444' }}>{formatCurrency(results.taxOwed)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Net Proceeds</div>
                <div className="result-value" style={{ color: '#10b981' }}>{formatCurrency(results.netProceeds)}</div>
              </div>
            </div>

            {!results.isLoss && results.comparisonData.length > 0 && (
              <>
                {results.savings > 0 && (
                  <div className="card" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', padding: '1rem 1.5rem', marginBottom: '1.5rem', borderRadius: '12px' }}>
                    <p style={{ margin: 0, color: '#10b981', fontWeight: 600 }}>
                      💡 Holding long-term saves you {formatCurrency(results.savings)} in taxes!
                    </p>
                  </div>
                )}

                <div className="chart-container">
                  <h3>Short-Term vs Long-Term Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={results.comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="tax" name="Tax Owed" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="net" name="Net Proceeds" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>Understanding Capital Gains Tax</h2>
          <p>Capital gains tax applies when you sell an asset for more than you paid for it. The tax rate depends on how long you held the asset and your total income.</p>
          <h3>2024 Long-Term Capital Gains Rates</h3>
          <ul>
            <li><strong>0%</strong> — Single filers with taxable income up to $47,025</li>
            <li><strong>15%</strong> — Single filers between $47,025 and $518,900</li>
            <li><strong>20%</strong> — Single filers above $518,900</li>
          </ul>
          <h3>Tax-Saving Strategies</h3>
          <ul>
            <li>Hold investments for over 1 year to qualify for lower long-term rates</li>
            <li>Use tax-loss harvesting to offset gains with losses</li>
            <li>Consider your total <a href="/tax-bracket-calculator">tax bracket</a> before selling</li>
            <li>Track your cost basis for accurate <a href="/investment-return-calculator">investment return</a> calculations</li>
          </ul>
        </section>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="capital-gains-tax-calculator" category="Tax" />
      </aside>
    </div>
  )
}
