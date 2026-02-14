import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

export default function RetirementCalculator() {
  const [inputs, setInputs] = useState({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 25000,
    monthlyContribution: 1000,
    expectedReturn: 7,
    inflationRate: 3,
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const { currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, inflationRate } = inputs
    const years = retirementAge - currentAge
    if (years <= 0) return

    const monthlyRate = expectedReturn / 100 / 12
    const months = years * 12

    // Future value calculation
    const fvSavings = currentSavings * Math.pow(1 + monthlyRate, months)
    const fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    const totalCorpus = fvSavings + fvContributions

    const totalContributed = currentSavings + monthlyContribution * months
    const totalInterest = totalCorpus - totalContributed

    // Inflation-adjusted value
    const realReturn = (1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1
    const inflationAdjusted = totalCorpus / Math.pow(1 + inflationRate / 100, years)

    // Monthly income in retirement (4% rule)
    const monthlyRetirementIncome = totalCorpus * 0.04 / 12

    // Chart data
    const chartData = []
    for (let age = currentAge; age <= retirementAge; age++) {
      const y = age - currentAge
      const m = y * 12
      const fvS = currentSavings * Math.pow(1 + monthlyRate, m)
      const fvC = m > 0 ? monthlyContribution * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) : 0
      chartData.push({
        age,
        total: Math.round(fvS + fvC),
        contributions: Math.round(currentSavings + monthlyContribution * m),
      })
    }

    setResults({ totalCorpus, totalContributed, totalInterest, inflationAdjusted, monthlyRetirementIncome, chartData })
  }

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title="Retirement Calculator — Savings & Income Planner"
          description="Free retirement calculator. Plan your retirement savings, estimate your corpus, and calculate monthly retirement income using the 4% rule."
          canonical="/retirement-calculator"
          jsonLd={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Retirement Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }}
        />
        <Breadcrumb items={[{ label: 'Retirement Calculator' }]} />

        <div className="calc-header">
          <h1>Retirement Calculator</h1>
          <p>Plan your retirement savings and estimate your monthly income in retirement.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Current Age</label>
                <input type="number" className="form-input" value={inputs.currentAge}
                  onChange={e => handleChange('currentAge', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Retirement Age</label>
                <input type="number" className="form-input" value={inputs.retirementAge}
                  onChange={e => handleChange('retirementAge', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Current Savings</label>
                <input type="number" className="form-input" value={inputs.currentSavings}
                  onChange={e => handleChange('currentSavings', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Monthly Contribution</label>
                <input type="number" className="form-input" value={inputs.monthlyContribution}
                  onChange={e => handleChange('monthlyContribution', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expected Return (%)</label>
                <input type="number" className="form-input" value={inputs.expectedReturn}
                  onChange={e => handleChange('expectedReturn', e.target.value)} step="0.1" />
              </div>
              <div className="form-group">
                <label>Inflation Rate (%)</label>
                <input type="number" className="form-input" value={inputs.inflationRate}
                  onChange={e => handleChange('inflationRate', e.target.value)} step="0.1" />
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Retirement</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Retirement Corpus</div>
                <div className="result-value accent">{formatCurrency(results.totalCorpus)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Monthly Income (4% Rule)</div>
                <div className="result-value gold">{formatCurrency(results.monthlyRetirementIncome)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Contributed</div>
                <div className="result-value">{formatCurrency(results.totalContributed)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Inflation-Adjusted Value</div>
                <div className="result-value">{formatCurrency(results.inflationAdjusted)}</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Savings Growth to Retirement</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="age" stroke="#64748b" fontSize={12} label={{ value: 'Age', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="contributions" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Contributions" />
                  <Area type="monotone" dataKey="total" stroke="#10b981" fill="#10b981" fillOpacity={0.5} name="Total Value" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>Planning for Retirement</h2>
          <p>Retirement planning is one of the most important financial steps you can take. The earlier you start, the more time compound interest has to grow your wealth.</p>
          <h3>The 4% Rule</h3>
          <p>The 4% rule suggests withdrawing 4% of your retirement savings annually. This rate has historically allowed retirees to sustain their savings for 30+ years without running out of money.</p>
          <h3>Retirement Savings Tips</h3>
          <ul>
            <li>Start saving as early as possible — even small amounts compound significantly</li>
            <li>Maximize employer 401(k) matching contributions (it's free money)</li>
            <li>Consider Roth IRA for tax-free growth and withdrawals</li>
            <li>Increase contributions by 1% each year as your income grows</li>
          </ul>
        </section>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="retirement-calculator" category="Savings" />
      </aside>
    </div>
  )
}
