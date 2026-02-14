import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

export default function CompoundInterestCalculator() {
  const [inputs, setInputs] = useState({
    principal: 10000,
    monthlyContribution: 500,
    interestRate: 7,
    years: 20,
    compounding: 12,
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const { principal, monthlyContribution, interestRate, years, compounding } = inputs
    const r = interestRate / 100
    const n = compounding
    const t = years

    // Future value of principal
    const fvPrincipal = principal * Math.pow(1 + r / n, n * t)

    // Future value of annuity (monthly contributions)
    const ratePerPeriod = r / 12
    const totalMonths = t * 12
    const fvContributions = monthlyContribution * ((Math.pow(1 + ratePerPeriod, totalMonths) - 1) / ratePerPeriod)

    const futureValue = fvPrincipal + fvContributions
    const totalContributions = principal + monthlyContribution * totalMonths
    const totalInterest = futureValue - totalContributions

    // Chart data
    const chartData = []
    for (let year = 0; year <= years; year++) {
      const fvP = principal * Math.pow(1 + r / n, n * year)
      const months = year * 12
      const fvC = months > 0 ? monthlyContribution * ((Math.pow(1 + ratePerPeriod, months) - 1) / ratePerPeriod) : 0
      const totalContrib = principal + monthlyContribution * months
      chartData.push({
        year,
        total: Math.round(fvP + fvC),
        contributions: Math.round(totalContrib),
        interest: Math.round(fvP + fvC - totalContrib),
      })
    }

    setResults({ futureValue, totalContributions, totalInterest, chartData })
  }

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Compound Interest Calculator',
    url: 'https://financecalc.app/compound-interest-calculator',
    description: 'Free compound interest calculator with monthly contributions and growth projections.',
    applicationCategory: 'FinanceApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title="Compound Interest Calculator — Investment Growth"
          description="Free compound interest calculator. See how your investments grow with compound interest and regular monthly contributions. Visualize growth over time."
          canonical="/compound-interest-calculator"
          jsonLd={jsonLd}
        />
        <Breadcrumb items={[{ label: 'Compound Interest Calculator' }]} />

        <div className="calc-header">
          <h1>Compound Interest Calculator</h1>
          <p>See the power of compound interest and how regular contributions accelerate your wealth.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Initial Investment</label>
                <input type="number" className="form-input" value={inputs.principal}
                  onChange={e => handleChange('principal', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Monthly Contribution</label>
                <input type="number" className="form-input" value={inputs.monthlyContribution}
                  onChange={e => handleChange('monthlyContribution', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Annual Interest Rate (%)</label>
                <input type="number" className="form-input" value={inputs.interestRate}
                  onChange={e => handleChange('interestRate', e.target.value)} step="0.1" />
                <input type="range" className="range-slider" min="1" max="20" step="0.1"
                  value={inputs.interestRate} onChange={e => handleChange('interestRate', e.target.value)} />
                <div className="slider-labels"><span>1%</span><span>20%</span></div>
              </div>
              <div className="form-group">
                <label>Time Period (Years)</label>
                <input type="number" className="form-input" value={inputs.years}
                  onChange={e => handleChange('years', e.target.value)} />
                <input type="range" className="range-slider" min="1" max="50" step="1"
                  value={inputs.years} onChange={e => handleChange('years', e.target.value)} />
                <div className="slider-labels"><span>1yr</span><span>50yr</span></div>
              </div>
            </div>
            <div className="form-group">
              <label>Compounding Frequency</label>
              <select className="form-select" value={inputs.compounding}
                onChange={e => handleChange('compounding', e.target.value)}>
                <option value={1}>Annually</option>
                <option value={4}>Quarterly</option>
                <option value={12}>Monthly</option>
                <option value={365}>Daily</option>
              </select>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Growth</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Future Value</div>
                <div className="result-value accent">{formatCurrency(results.futureValue)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Contributions</div>
                <div className="result-value">{formatCurrency(results.totalContributions)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Interest Earned</div>
                <div className="result-value gold">{formatCurrency(results.totalInterest)}</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Investment Growth Over Time</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="contributions" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} name="Contributions" />
                  <Area type="monotone" dataKey="interest" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Interest" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>Understanding Compound Interest</h2>
          <p>
            Compound interest is when you earn interest on both your initial investment and on previously earned interest.
            Albert Einstein reportedly called it the "eighth wonder of the world." Over time, compounding creates exponential growth
            in your investments.
          </p>
          <h3>The Compound Interest Formula</h3>
          <p>
            <strong>FV = P(1 + r/n)^(nt)</strong> — where P is the principal, r is the annual rate, n is compounding frequency,
            and t is time in years. More frequent compounding (daily vs annual) yields slightly higher returns.
          </p>
          <h3>Why Start Investing Early?</h3>
          <ul>
            <li>10 extra years of compounding can double your final value</li>
            <li>Even small monthly contributions grow significantly over 20+ years</li>
            <li>The "Rule of 72" — divide 72 by your interest rate to estimate doubling time</li>
          </ul>
        </section>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="compound-interest-calculator" category="Investment" />
      </aside>
    </div>
  )
}
