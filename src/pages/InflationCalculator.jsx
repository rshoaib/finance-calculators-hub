import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency, formatPercent } from '../utils/formatters'

export default function InflationCalculator() {
  const [inputs, setInputs] = useState({
    amount: 100000,
    rate: 3.5,
    years: 20,
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const { amount, rate, years } = inputs
    const r = rate / 100
    const chartData = []

    for (let y = 0; y <= years; y++) {
      const futureNominal = amount
      const purchasingPower = amount / Math.pow(1 + r, y)
      chartData.push({
        year: y,
        label: `Year ${y}`,
        nominal: Math.round(futureNominal),
        realValue: Math.round(purchasingPower),
      })
    }

    const futureValue = amount * Math.pow(1 + r, years)
    const purchasingPowerLoss = amount - (amount / Math.pow(1 + r, years))
    const realValue = amount / Math.pow(1 + r, years)
    const lossPercent = (purchasingPowerLoss / amount) * 100

    setResults({ futureValue, purchasingPowerLoss, realValue, lossPercent, chartData })
  }

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'What is inflation?', answer: 'Inflation is the rate at which the general level of prices for goods and services rises over time, reducing the purchasing power of your money.' },
    { question: 'What is a good inflation rate?', answer: 'Most central banks target an inflation rate of around 2% per year, which is considered healthy for economic growth without eroding purchasing power too quickly.' },
    { question: 'How does inflation affect my savings?', answer: 'If your savings earn less interest than the inflation rate, your money loses real purchasing power over time. This is why investing is important to outpace inflation.' },
  ]

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title="Inflation Calculator — Purchasing Power Over Time"
          description="Free inflation calculator. See how inflation erodes your purchasing power over time and what your money will really be worth in the future."
          canonical="/inflation-calculator"
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Inflation Calculator',
            applicationCategory: 'FinanceApplication',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }}
          faqs={faqs}
        />
        <Breadcrumb items={[{ label: 'Inflation Calculator' }]} />

        <div className="calc-header">
          <h1>Inflation Calculator</h1>
          <p>See how inflation erodes the purchasing power of your money over time.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Current Amount ($)</label>
                <input type="number" className="form-input" value={inputs.amount} onChange={e => handleChange('amount', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Annual Inflation Rate (%)</label>
                <input type="number" className="form-input" step="0.1" value={inputs.rate} onChange={e => handleChange('rate', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Time Period (years)</label>
                <input type="number" className="form-input" value={inputs.years} onChange={e => handleChange('years', e.target.value)} />
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Inflation Impact</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Purchasing Power Lost</div>
                <div className="result-value accent" style={{ color: '#ef4444' }}>{formatCurrency(results.purchasingPowerLoss)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Real Value in {inputs.years} Years</div>
                <div className="result-value gold">{formatCurrency(results.realValue)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">You'd Need</div>
                <div className="result-value" style={{ color: '#10b981' }}>{formatCurrency(results.futureValue)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Value Lost</div>
                <div className="result-value" style={{ color: '#f97316' }}>{formatPercent(results.lossPercent)}</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Purchasing Power Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickFormatter={v => `Yr ${v}`} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="nominal" name="Nominal Value" stroke="#3b82f6" fill="rgba(59,130,246,0.15)" strokeWidth={2} />
                  <Area type="monotone" dataKey="realValue" name="Real Value" stroke="#ef4444" fill="rgba(239,68,68,0.15)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>How Inflation Affects Your Money</h2>
          <p>Inflation is often called the "silent tax" because it quietly reduces what your money can buy. Even at a modest 3% annual rate, prices double roughly every 24 years.</p>
          <h3>Beating Inflation</h3>
          <ul>
            <li>Invest in assets that historically outpace inflation (stocks, real estate)</li>
            <li>Use a <a href="/compound-interest-calculator">compound interest strategy</a> to grow your wealth faster than prices rise</li>
            <li>Consider Treasury Inflation-Protected Securities (TIPS) for safe, inflation-adjusted returns</li>
            <li>Review your <a href="/investment-return-calculator">investment returns</a> against the inflation rate annually</li>
          </ul>
          <h3>Historical Inflation Rates</h3>
          <p>The U.S. average inflation rate has been about 3.3% since 1913. Recent years (2021–2023) saw rates above 6%, making inflation planning more important than ever for <a href="/retirement-calculator">retirement savers</a>.</p>
        </section>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="inflation-calculator" category="Investment" />
      </aside>
    </div>
  )
}
