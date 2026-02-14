import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency, formatPercent } from '../utils/formatters'

export default function InvestmentReturnCalculator() {
  const [inputs, setInputs] = useState({
    initialInvestment: 10000,
    finalValue: 25000,
    years: 5,
    dividends: 500,
    inflationRate: 3,
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const { initialInvestment, finalValue, years, dividends, inflationRate } = inputs
    if (years <= 0 || initialInvestment <= 0) return

    const totalReturn = finalValue + dividends - initialInvestment
    const totalReturnPercent = (totalReturn / initialInvestment) * 100
    const cagr = (Math.pow((finalValue + dividends) / initialInvestment, 1 / years) - 1) * 100
    const realReturn = ((1 + cagr / 100) / (1 + inflationRate / 100) - 1) * 100
    const inflationAdjustedValue = (finalValue + dividends) / Math.pow(1 + inflationRate / 100, years)

    // Chart data
    const chartData = []
    for (let year = 0; year <= years; year++) {
      const nominal = initialInvestment * Math.pow(1 + cagr / 100, year)
      const real = initialInvestment * Math.pow(1 + realReturn / 100, year)
      chartData.push({
        year,
        nominal: Math.round(nominal),
        real: Math.round(real),
      })
    }

    setResults({ totalReturn, totalReturnPercent, cagr, realReturn, inflationAdjustedValue, chartData })
  }

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title="Investment Return Calculator — ROI & CAGR"
          description="Free investment return calculator. Calculate ROI, CAGR (compound annual growth rate), and inflation-adjusted returns on your investments."
          canonical="/investment-return-calculator"
          jsonLd={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Investment Return Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }}
        />
        <Breadcrumb items={[{ label: 'Investment Return Calculator' }]} />

        <div className="calc-header">
          <h1>Investment Return Calculator</h1>
          <p>Calculate ROI, CAGR, and see how inflation impacts your real returns.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Initial Investment</label>
                <input type="number" className="form-input" value={inputs.initialInvestment}
                  onChange={e => handleChange('initialInvestment', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Current / Final Value</label>
                <input type="number" className="form-input" value={inputs.finalValue}
                  onChange={e => handleChange('finalValue', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Investment Period (Years)</label>
                <input type="number" className="form-input" value={inputs.years}
                  onChange={e => handleChange('years', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Total Dividends Received</label>
                <input type="number" className="form-input" value={inputs.dividends}
                  onChange={e => handleChange('dividends', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Inflation Rate (%)</label>
              <input type="number" className="form-input" value={inputs.inflationRate}
                onChange={e => handleChange('inflationRate', e.target.value)} step="0.1" />
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Returns</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Total Return</div>
                <div className="result-value accent">{formatPercent(results.totalReturnPercent)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">CAGR</div>
                <div className="result-value gold">{formatPercent(results.cagr)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Profit / Loss</div>
                <div className="result-value" style={{ color: results.totalReturn >= 0 ? '#10b981' : '#ef4444' }}>
                  {formatCurrency(results.totalReturn)}
                </div>
              </div>
              <div className="result-card">
                <div className="result-label">Real Return (after inflation)</div>
                <div className="result-value">{formatPercent(results.realReturn)}</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Nominal vs Real Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="nominal" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Nominal Value" />
                  <Area type="monotone" dataKey="real" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} name="Inflation-Adjusted" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>Understanding Investment Returns</h2>
          <p>Measuring investment performance correctly is crucial. Simple ROI tells you the total gain, while CAGR (Compound Annual Growth Rate) shows the annualized growth — making it easy to compare investments of different durations.</p>
          <h3>ROI vs CAGR</h3>
          <p><strong>ROI</strong> = (Final Value – Initial Investment) / Initial Investment × 100. <strong>CAGR</strong> = (Final/Initial)^(1/years) – 1. CAGR is more useful for comparing investments held for different timeframes.</p>
          <h3>Why Inflation Matters</h3>
          <ul>
            <li>A 10% return with 3% inflation gives only ~6.8% real purchasing power growth</li>
            <li>Always consider inflation-adjusted returns when evaluating long-term investments</li>
            <li>Treasury Inflation-Protected Securities (TIPS) offer built-in inflation protection</li>
          </ul>
        </section>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="investment-return-calculator" category="Investment" />
      </aside>
    </div>
  )
}
