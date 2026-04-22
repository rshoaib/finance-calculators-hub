"use client"
import { useState, useCallback, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'
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

  const calculate = useCallback(() => {
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
  }, [inputs])

  useEffect(() => { calculate() }, [calculate])

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'What is break-even analysis?', answer: 'Break-even analysis determines the exact point where total revenue equals total costs, meaning you make neither a profit nor a loss. It is a critical planning tool for startups, new products, and pricing decisions. By knowing your break-even point, you can set realistic sales targets and assess whether a business idea is financially viable.' },
    { question: 'What is contribution margin?', answer: 'Contribution margin is the selling price per unit minus the variable cost per unit. It represents how much each unit sold contributes toward covering fixed costs and generating profit. A higher contribution margin means you reach break-even faster. For example, if you sell a product for $50 with $25 in variable costs, your contribution margin is $25 per unit.' },
    { question: 'How can I lower my break-even point?', answer: 'You can lower your break-even point by: (1) reducing fixed costs (negotiate rent, cut unnecessary subscriptions), (2) lowering variable costs per unit (find cheaper suppliers, improve efficiency), or (3) increasing your selling price. Combining all three strategies has the greatest impact.' },
    { question: 'What is the margin of safety?', answer: 'The margin of safety is the difference between your actual (or expected) sales and your break-even point. It shows how much sales can drop before you start losing money. For example, if your break-even is 400 units and you sell 600, your margin of safety is 200 units (33%). A higher margin of safety indicates lower business risk.' },
    { question: 'How do fixed and variable costs differ?', answer: 'Fixed costs remain the same regardless of how many units you produce (rent, salaries, insurance). Variable costs change proportionally with production volume (materials, shipping, commissions). Understanding this distinction is essential because it determines your contribution margin and break-even point.' },
  ]

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Break-Even Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
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
          <p>
            Break-even analysis is one of the most essential tools in business finance. It tells you exactly how many
            units you must sell — or how much revenue you need — to cover all your costs before you start making a
            profit. Whether you're launching a new product, evaluating a side hustle, or setting prices for an existing
            business, knowing your break-even point helps you make data-driven decisions and avoid costly mistakes.
          </p>

          <h3>Break-Even Formulas</h3>
          <ul>
            <li><strong>Contribution Margin</strong> = Selling Price per Unit − Variable Cost per Unit</li>
            <li><strong>Break-Even Units</strong> = Fixed Costs ÷ Contribution Margin</li>
            <li><strong>Break-Even Revenue</strong> = Break-Even Units × Selling Price</li>
            <li><strong>Margin of Safety</strong> = (Actual Sales − Break-Even Sales) ÷ Actual Sales × 100</li>
          </ul>

          <h3>Worked Example</h3>
          <p>
            A small business has <strong>$10,000 in monthly fixed costs</strong> (rent, salaries, software).
            Each unit costs <strong>$25 to produce</strong> and sells for <strong>$50</strong>:
          </p>
          <ul>
            <li>Contribution margin: <strong>$25 per unit</strong> ($50 − $25)</li>
            <li>Break-even units: <strong>400 units/month</strong> ($10,000 ÷ $25)</li>
            <li>Break-even revenue: <strong>$20,000/month</strong></li>
            <li>If they sell 600 units, margin of safety: <strong>33%</strong> — sales can drop by a third before losing money</li>
          </ul>

          <h3>Key Business Terms</h3>
          <dl>
            <dt><strong>Fixed Costs</strong></dt>
            <dd>Expenses that remain constant regardless of production volume: rent, salaries, insurance, software subscriptions.</dd>
            <dt><strong>Variable Costs</strong></dt>
            <dd>Expenses that change proportionally with units produced: raw materials, packaging, shipping, sales commissions.</dd>
            <dt><strong>Contribution Margin</strong></dt>
            <dd>The amount each unit sold contributes toward covering fixed costs and generating profit.</dd>
            <dt><strong>Margin of Safety</strong></dt>
            <dd>How far sales can fall before reaching the break-even point. Higher is better — it means less business risk.</dd>
            <dt><strong>Operating Leverage</strong></dt>
            <dd>A company with high fixed costs and low variable costs has high operating leverage — profits grow quickly above break-even but losses mount quickly below it.</dd>
          </dl>

          <h3>Strategies to Improve Profitability</h3>
          <ul>
            <li><strong>Raise prices strategically:</strong> Even a 10% price increase dramatically lowers break-even if demand stays stable</li>
            <li><strong>Negotiate fixed costs:</strong> Renegotiate rent, switch to cheaper software, or hire contractors instead of full-time employees</li>
            <li><strong>Reduce variable costs:</strong> Buy materials in bulk, automate production steps, or find more efficient suppliers</li>
            <li><strong>Increase volume:</strong> More units sold above break-even means more profit per unit due to fixed cost absorption</li>
            <li><strong>Diversify revenue streams:</strong> Add complementary products to spread fixed costs across more revenue sources</li>
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
        <RelatedCalculators currentSlug="break-even-calculator" category="Investment" />
      </aside>
    </div>
  )
}
