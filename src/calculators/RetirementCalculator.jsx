"use client"
import { useState, useCallback, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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

  const calculate = useCallback(() => {
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
  }, [inputs])

  useEffect(() => { calculate() }, [calculate])

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'What is the 4% rule for retirement?', answer: 'The 4% rule suggests that retirees can withdraw 4% of their total retirement savings in the first year, then adjust for inflation annually. Based on the Trinity Study, this approach has historically sustained a portfolio for at least 30 years. For example, a $1 million portfolio would provide $40,000 per year ($3,333/month) in retirement income.' },
    { question: 'How much do I need to save for retirement?', answer: 'A common target is 25 times your desired annual retirement income (the inverse of the 4% rule). If you want $60,000/year in retirement, aim for $1.5 million. Fidelity recommends having 1x your salary saved by 30, 3x by 40, 6x by 50, 8x by 60, and 10x by 67.' },
    { question: 'What is the difference between a 401(k) and an IRA?', answer: 'A 401(k) is employer-sponsored with higher contribution limits ($23,500 in 2025) and possible employer matching. An IRA is individually opened with lower limits ($7,000 in 2025). Both offer Traditional (tax-deductible contributions, taxed withdrawals) and Roth (after-tax contributions, tax-free withdrawals) options.' },
    { question: 'Should I choose a Roth or Traditional retirement account?', answer: 'Choose Roth if you expect to be in a higher tax bracket in retirement — contributions are after-tax but withdrawals are tax-free. Choose Traditional if you are in a high tax bracket now and expect to be in a lower one later — contributions are tax-deductible but withdrawals are taxed. Many advisors recommend having both for tax diversification.' },
    { question: 'What is sequence of returns risk?', answer: 'Sequence of returns risk is the danger that poor market performance in the early years of retirement can permanently damage your portfolio, even if long-term average returns are normal. A market crash in year 1-3 of retirement is much more devastating than one in year 10-15 because early withdrawals deplete your portfolio before it can recover.' },
  ]

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Retirement Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
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
          <h2>How to Plan for Retirement</h2>
          <p>
            Retirement planning is the process of determining your future income needs and building a savings strategy
            to meet them. The earlier you begin, the more time compound interest has to multiply your wealth. A solid
            retirement plan considers your current age, target retirement age, expected investment returns, inflation,
            and the safe withdrawal rate you'll use to draw income from your retirement corpus without depleting it.
          </p>

          <h3>The Retirement Corpus Formula</h3>
          <p>
            Your total retirement savings are built from two components:
          </p>
          <ul>
            <li><strong>Future value of current savings:</strong> FV = PV × (1 + r/12)<sup>n</sup></li>
            <li><strong>Future value of monthly contributions:</strong> FV = C × [(1 + r/12)<sup>n</sup> – 1] / (r/12)</li>
          </ul>
          <p>
            Where PV is your current savings, C is monthly contribution, r is expected annual return, and n is months until retirement.
          </p>

          <h3>Worked Example</h3>
          <p>
            A <strong>30-year-old</strong> with <strong>$25,000 saved</strong>, contributing <strong>$1,000/month</strong>,
            expecting <strong>7% annual return</strong>, retiring at <strong>65</strong>:
          </p>
          <ul>
            <li>Current savings grow to: <strong>$266,863</strong></li>
            <li>Monthly contributions grow to: <strong>$1,714,063</strong></li>
            <li>Total retirement corpus: <strong>$1,980,926</strong></li>
            <li>Monthly income (4% rule): <strong>$6,603</strong></li>
            <li>Inflation-adjusted value (3% inflation): <strong>$704,616</strong> in today's dollars</li>
          </ul>

          <h3>Key Retirement Terms</h3>
          <dl>
            <dt><strong>The 4% Rule (Safe Withdrawal Rate)</strong></dt>
            <dd>Withdraw 4% of your portfolio in year one, then adjust for inflation. Historically sustains a portfolio for 30+ years.</dd>
            <dt><strong>401(k)</strong></dt>
            <dd>An employer-sponsored retirement plan with tax advantages and potential employer matching contributions. 2025 limit: $23,500.</dd>
            <dt><strong>Roth IRA</strong></dt>
            <dd>A retirement account where contributions are after-tax but withdrawals in retirement are completely tax-free. 2025 limit: $7,000.</dd>
            <dt><strong>Sequence of Returns Risk</strong></dt>
            <dd>The risk that poor market returns in early retirement will permanently damage your portfolio, even if average returns are normal.</dd>
            <dt><strong>Asset Allocation</strong></dt>
            <dd>How you divide investments among stocks, bonds, and cash. A common rule of thumb: subtract your age from 110 for your stock percentage.</dd>
          </dl>

          <h3>Retirement Savings Strategies</h3>
          <ul>
            <li><strong>Start as early as possible:</strong> A 25-year-old investing $500/month reaches $1M by 60; a 35-year-old needs $1,000/month</li>
            <li><strong>Maximize employer matching:</strong> Not contributing enough to get the full match is leaving free money on the table</li>
            <li><strong>Increase contributions with raises:</strong> Bump contributions 1-2% annually — you won't notice the difference</li>
            <li><strong>Diversify tax exposure:</strong> Split between Traditional and Roth accounts for flexibility in retirement</li>
            <li><strong>Account for healthcare costs:</strong> The average couple needs about $315,000 for healthcare in retirement</li>
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
        <RelatedCalculators currentSlug="retirement-calculator" category="Savings" />
      </aside>
    </div>
  )
}
