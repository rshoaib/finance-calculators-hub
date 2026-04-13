"use client"
import { useState, useCallback, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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

  const calculate = useCallback(() => {
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
  }, [inputs])

  useEffect(() => { calculate() }, [calculate])

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'What is ROI (Return on Investment)?', answer: 'ROI measures the total gain or loss on an investment as a percentage of the initial cost. Formula: ROI = (Final Value − Initial Investment) / Initial Investment × 100. A $10,000 investment that grows to $15,000 has an ROI of 50%. However, ROI does not account for the time period, making it less useful for comparing investments held for different durations.' },
    { question: 'What is CAGR and why is it better than ROI?', answer: 'CAGR (Compound Annual Growth Rate) represents the annualized return assuming steady growth. Formula: CAGR = (Final/Initial)^(1/years) − 1. Unlike ROI, CAGR normalizes returns to a per-year basis, making it easy to compare a 3-year investment to a 10-year one. A 50% ROI over 5 years equals a CAGR of 8.45%.' },
    { question: 'What is the difference between nominal and real returns?', answer: 'Nominal return is your raw investment gain. Real return subtracts inflation to show actual purchasing power growth. Real Return ≈ Nominal Return − Inflation Rate. A 10% nominal return with 3% inflation gives about 6.8% real return. Always evaluate long-term investments using real returns.' },
    { question: 'What is dollar-cost averaging?', answer: 'Dollar-cost averaging (DCA) is investing a fixed amount at regular intervals regardless of market conditions. It reduces the impact of volatility by buying more shares when prices are low and fewer when prices are high. Over time, DCA typically results in a lower average cost per share than trying to time the market.' },
    { question: 'What is a good annual return on investments?', answer: 'Historical benchmarks: S&P 500 averages about 10% nominal (7% after inflation), bonds average 4-6%, savings accounts offer 0.5-5%. A "good" return depends on risk tolerance and timeline. Higher returns generally require accepting more risk. Beating the market consistently (alpha) is extremely difficult.' },
  ]

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Investment Return Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) },
  ]

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        
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
          <p>
            Measuring investment performance correctly is essential for making informed financial decisions. Two key
            metrics — ROI (Return on Investment) and CAGR (Compound Annual Growth Rate) — serve different purposes.
            ROI gives you the total gain as a percentage, while CAGR normalizes that return to an annualized rate,
            making it possible to compare investments held for different periods on equal footing. This calculator
            also shows your real (inflation-adjusted) return, revealing the true purchasing power your investment generated.
          </p>

          <h3>ROI vs CAGR Formulas</h3>
          <ul>
            <li><strong>ROI</strong> = (Final Value + Dividends − Initial Investment) / Initial Investment × 100</li>
            <li><strong>CAGR</strong> = ((Final Value + Dividends) / Initial Investment)<sup>1/years</sup> − 1</li>
            <li><strong>Real Return</strong> ≈ ((1 + CAGR) / (1 + Inflation Rate)) − 1</li>
          </ul>

          <h3>Worked Example</h3>
          <p>
            You invested <strong>$10,000</strong> five years ago. It's now worth <strong>$25,000</strong> and paid
            <strong>$500 in dividends</strong>. Inflation averaged <strong>3%</strong>:
          </p>
          <ul>
            <li>Total return: <strong>155%</strong> ($15,500 profit)</li>
            <li>CAGR: <strong>20.1%</strong> per year</li>
            <li>Real return (inflation-adjusted): <strong>16.6%</strong> per year</li>
            <li>Inflation-adjusted value: <strong>$21,990</strong> — your real purchasing power gain</li>
          </ul>

          <h3>Key Investment Terms</h3>
          <dl>
            <dt><strong>ROI (Return on Investment)</strong></dt>
            <dd>Total gain or loss as a percentage of initial investment. Simple but doesn't account for time.</dd>
            <dt><strong>CAGR (Compound Annual Growth Rate)</strong></dt>
            <dd>Annualized return assuming steady growth. Best for comparing investments of different durations.</dd>
            <dt><strong>Alpha</strong></dt>
            <dd>The excess return of an investment relative to a benchmark index. Positive alpha means you're beating the market.</dd>
            <dt><strong>Dollar-Cost Averaging (DCA)</strong></dt>
            <dd>Investing a fixed amount at regular intervals regardless of price. Reduces the impact of market volatility.</dd>
            <dt><strong>Sharpe Ratio</strong></dt>
            <dd>Measures risk-adjusted return. Higher is better — it shows return per unit of risk taken. A ratio above 1.0 is generally considered good.</dd>
          </dl>

          <h3>Smart Investing Principles</h3>
          <ul>
            <li><strong>Always measure real returns:</strong> A 10% gain with 3% inflation is really only ~6.8% growth in purchasing power</li>
            <li><strong>Compare using CAGR:</strong> A 50% return over 5 years (8.4% CAGR) is worse than 40% over 3 years (11.9% CAGR)</li>
            <li><strong>Include dividends:</strong> Reinvested dividends account for roughly 40% of total S&P 500 returns historically</li>
            <li><strong>Diversify broadly:</strong> Spread investments across asset classes, sectors, and geographies</li>
            <li><strong>Stay invested:</strong> Missing the 10 best market days over 20 years can cut your return by more than half</li>
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
        <RelatedCalculators currentSlug="investment-return-calculator" category="Investment" />
      </aside>
    </div>
  )
}

