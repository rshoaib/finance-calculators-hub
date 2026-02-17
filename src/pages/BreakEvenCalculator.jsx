import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency, formatNumber } from '../utils/formatters'

export default function BreakEvenCalculator() {
  const [inputs, setInputs] = useState({
    fixedCosts: 10000,
    variableCostPerUnit: 25,
    sellingPricePerUnit: 50,
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const { fixedCosts, variableCostPerUnit, sellingPricePerUnit } = inputs
    const contributionMargin = sellingPricePerUnit - variableCostPerUnit
    if (contributionMargin <= 0) {
      setResults({ error: 'Selling price must be greater than variable cost per unit.' })
      return
    }

    const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin)
    const breakEvenRevenue = breakEvenUnits * sellingPricePerUnit
    const marginPercent = (contributionMargin / sellingPricePerUnit) * 100

    // Chart: show from 0 to 2x break-even units
    const maxUnits = Math.max(breakEvenUnits * 2, 20)
    const step = Math.max(1, Math.floor(maxUnits / 20))
    const chartData = []
    for (let u = 0; u <= maxUnits; u += step) {
      chartData.push({
        units: u,
        revenue: u * sellingPricePerUnit,
        totalCost: fixedCosts + u * variableCostPerUnit,
      })
    }

    setResults({ breakEvenUnits, breakEvenRevenue, contributionMargin, marginPercent, chartData, error: null })
  }

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'What is break-even analysis?', answer: 'Break-even analysis determines the point where total revenue equals total costs, meaning you make neither a profit nor a loss. It helps you understand the minimum sales needed to cover costs.' },
    { question: 'What is contribution margin?', answer: 'Contribution margin is the selling price per unit minus the variable cost per unit. It represents how much each unit sold contributes toward covering fixed costs and then generating profit.' },
    { question: 'How can I lower my break-even point?', answer: 'You can lower your break-even by reducing fixed costs, lowering variable costs per unit, or increasing your selling price — or a combination of all three.' },
  ]

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO title="Break-Even Calculator — Find Your Profit Point" description="Free break-even calculator. Find how many units you need to sell to cover costs and start making profit." canonical="/break-even-calculator"
          jsonLd={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Break-Even Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }} faqs={faqs} />
        <Breadcrumb items={[{ label: 'Break-Even Calculator' }]} />

        <div className="calc-header">
          <h1>Break-Even Calculator</h1>
          <p>Find out how many units you need to sell to cover your costs and start making profit.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Fixed Costs ($)</label>
                <input type="number" className="form-input" value={inputs.fixedCosts} onChange={e => handleChange('fixedCosts', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Variable Cost per Unit ($)</label>
                <input type="number" className="form-input" value={inputs.variableCostPerUnit} onChange={e => handleChange('variableCostPerUnit', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Selling Price per Unit ($)</label>
                <input type="number" className="form-input" value={inputs.sellingPricePerUnit} onChange={e => handleChange('sellingPricePerUnit', e.target.value)} />
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Break-Even</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && !results.error && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Break-Even Units</div>
                <div className="result-value accent">{formatNumber(results.breakEvenUnits)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Break-Even Revenue</div>
                <div className="result-value" style={{ color: '#10b981' }}>{formatCurrency(results.breakEvenRevenue)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Contribution Margin</div>
                <div className="result-value gold">{formatCurrency(results.contributionMargin)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Margin %</div>
                <div className="result-value" style={{ color: '#8b5cf6' }}>{results.marginPercent.toFixed(1)}%</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Revenue vs Total Costs</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="units" stroke="#64748b" fontSize={12} label={{ value: 'Units Sold', position: 'insideBottom', offset: -5 }} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <ReferenceLine x={results.breakEvenUnits} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Break-Even', fill: '#f59e0b', fontSize: 12 }} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="totalCost" name="Total Cost" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <AdSlot size="mobile-banner" />
          </div>
        )}

        {results?.error && (
          <div className="card" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
            <p style={{ margin: 0, color: '#ef4444' }}>⚠️ {results.error}</p>
          </div>
        )}

        <section className="seo-content">
          <h2>Understanding Break-Even Analysis</h2>
          <p>Break-even analysis is essential for any business — whether you're launching a product, setting prices, or evaluating a new venture. It tells you exactly how many units you need to sell before you start making profit.</p>
          <h3>Key Formulas</h3>
          <ul>
            <li><strong>Break-Even Units</strong> = Fixed Costs ÷ Contribution Margin per Unit</li>
            <li><strong>Contribution Margin</strong> = Selling Price − Variable Cost per Unit</li>
            <li><strong>Break-Even Revenue</strong> = Break-Even Units × Selling Price</li>
          </ul>
          <h3>Using Break-Even in Planning</h3>
          <p>Pair this with your <a href="/investment-return-calculator">investment return analysis</a> and <a href="/savings-goal-calculator">savings goals</a> to build a complete financial picture for your business or side project.</p>
        </section>
      </div>
      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="break-even-calculator" category="Investment" />
      </aside>
    </div>
  )
}
