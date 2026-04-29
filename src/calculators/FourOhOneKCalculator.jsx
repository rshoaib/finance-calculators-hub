"use client"
import { useState, useCallback, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import ShareResults from '../components/ShareResults'
import ExportPDF from '../components/ExportPDF'
import { formatCurrency } from '../utils/formatters'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

export default function FourOhOneKCalculator() {
  const [inputs, setInputs] = useState({
    currentAge: 30,
    retirementAge: 65,
    salary: 75000,
    contribution: 10,
    employerMatch: 4,
    currentBalance: 15000,
    annualReturn: 7,
    salaryGrowth: 2,
  })
  const [results, setResults] = useState(null)

  const calculate = useCallback(() => {
    const years = inputs.retirementAge - inputs.currentAge
    if (years <= 0) return

    let balance = inputs.currentBalance
    let totalContributed = inputs.currentBalance
    let totalEmployerMatch = 0
    let salary = inputs.salary
    const schedule = []

    for (let y = 1; y <= years; y++) {
      const annualContribution = salary * (inputs.contribution / 100)
      const annualMatch = salary * (inputs.employerMatch / 100)
      const growth = balance * (inputs.annualReturn / 100)

      balance += annualContribution + annualMatch + growth
      totalContributed += annualContribution
      totalEmployerMatch += annualMatch

      schedule.push({
        age: inputs.currentAge + y,
        balance: Math.round(balance),
        contributions: Math.round(totalContributed),
        employer: Math.round(totalEmployerMatch),
      })

      salary *= (1 + inputs.salaryGrowth / 100)
    }

    const totalGrowth = balance - totalContributed - totalEmployerMatch

    setResults({
      finalBalance: balance,
      totalContributed,
      totalEmployerMatch,
      totalGrowth,
      monthlyRetirement: balance / (25 * 12), // 4% rule → 25 years
      schedule,
      pieData: [
        { name: 'Your Contributions', value: Math.round(totalContributed) },
        { name: 'Employer Match', value: Math.round(totalEmployerMatch) },
        { name: 'Investment Growth', value: Math.round(totalGrowth) },
      ],
    })
  }, [inputs])

  useEffect(() => { calculate() }, [calculate])

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'What is a 401(k)?', answer: 'A 401(k) is an employer-sponsored retirement savings plan that allows you to contribute pre-tax dollars from your paycheck. Many employers offer matching contributions up to a certain percentage. Your investments grow tax-deferred until you withdraw them in retirement.' },
    { question: 'How much should I contribute to my 401(k)?', answer: 'Financial advisors typically recommend contributing at least enough to get the full employer match (free money). Beyond that, aim for 10-15% of your salary. In 2026, the IRS contribution limit is $23,500 for those under 50, and $31,000 for those 50 and older (catch-up contribution).' },
    { question: 'What is an employer match?', answer: 'An employer match is when your company contributes additional money to your 401(k) based on your own contributions. A common match is 50% of your contributions up to 6% of salary, or 100% up to 3-4%. Always contribute at least enough to get the full match — it is essentially free money.' },
    { question: 'When can I withdraw from my 401(k)?', answer: 'You can withdraw penalty-free starting at age 59½. Withdrawals before that age incur a 10% early withdrawal penalty plus income taxes. Required Minimum Distributions (RMDs) begin at age 73. Some plans allow hardship withdrawals or loans against your balance.' },
    { question: 'What is the 4% rule?', answer: 'The 4% rule suggests you can withdraw 4% of your retirement savings in your first year of retirement, then adjust for inflation each subsequent year, with a high probability your money will last 30 years. For example, a $1M nest egg supports ~$40,000/year in withdrawals.' },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: '401(k) Calculator',
      url: 'https://mycalcfinance.com/401k-calculator',
      description: 'Free 401(k) retirement calculator with employer match, salary growth, and investment returns.',
      applicationCategory: 'FinanceApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
    },
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
        <Breadcrumb items={[{ label: '401(k) Calculator' }]} />

        <div className="calc-header">
          <h1>401(k) Calculator</h1>
          <p>Estimate your retirement savings with employer match and compound growth.</p>
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
                <label>Annual Salary</label>
                <input type="number" className="form-input" value={inputs.salary}
                  onChange={e => handleChange('salary', e.target.value)} placeholder="75,000" />
              </div>
              <div className="form-group">
                <label>Current 401(k) Balance</label>
                <input type="number" className="form-input" value={inputs.currentBalance}
                  onChange={e => handleChange('currentBalance', e.target.value)} placeholder="15,000" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Your Contribution (%)</label>
                <input type="number" className="form-input" value={inputs.contribution}
                  onChange={e => handleChange('contribution', e.target.value)} step="0.5" />
                <input type="range" className="range-slider" min="0" max="25" step="0.5"
                  value={inputs.contribution} onChange={e => handleChange('contribution', e.target.value)} />
                <div className="slider-labels"><span>0%</span><span>25%</span></div>
              </div>
              <div className="form-group">
                <label>Employer Match (%)</label>
                <input type="number" className="form-input" value={inputs.employerMatch}
                  onChange={e => handleChange('employerMatch', e.target.value)} step="0.5" />
                <input type="range" className="range-slider" min="0" max="10" step="0.5"
                  value={inputs.employerMatch} onChange={e => handleChange('employerMatch', e.target.value)} />
                <div className="slider-labels"><span>0%</span><span>10%</span></div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Annual Return (%)</label>
                <input type="number" className="form-input" value={inputs.annualReturn}
                  onChange={e => handleChange('annualReturn', e.target.value)} step="0.5" />
                <input type="range" className="range-slider" min="1" max="15" step="0.5"
                  value={inputs.annualReturn} onChange={e => handleChange('annualReturn', e.target.value)} />
                <div className="slider-labels"><span>1%</span><span>15%</span></div>
              </div>
              <div className="form-group">
                <label>Annual Salary Growth (%)</label>
                <input type="number" className="form-input" value={inputs.salaryGrowth}
                  onChange={e => handleChange('salaryGrowth', e.target.value)} step="0.5" />
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate 401(k)</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Projected Balance at {inputs.retirementAge}</div>
                <div className="result-value accent">{formatCurrency(results.finalBalance)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Monthly Income (4% Rule)</div>
                <div className="result-value gold">{formatCurrency(results.monthlyRetirement)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Your Contributions</div>
                <div className="result-value">{formatCurrency(results.totalContributed)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Employer Match</div>
                <div className="result-value" style={{ color: '#3b82f6' }}>{formatCurrency(results.totalEmployerMatch)}</div>
              </div>
            </div>

            <div className="share-results">
              <ShareResults title="401(k) Calculator Results" resultsSummary={`Balance at ${inputs.retirementAge}: ${formatCurrency(results.finalBalance)}\nMonthly Income (4% Rule): ${formatCurrency(results.monthlyRetirement)}\nYour Contributions: ${formatCurrency(results.totalContributed)}\nEmployer Match: ${formatCurrency(results.totalEmployerMatch)}`} />
              <ExportPDF />
            </div>

            <div className="chart-container">
              <h3>Savings Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={results.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={110}
                    paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {results.pieData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Growth Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={results.schedule}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="age" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="contributions" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Your Contributions" />
                  <Area type="monotone" dataKey="employer" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} name="Employer Match" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>How a 401(k) Works</h2>
          <p>
            A 401(k) is a tax-advantaged retirement savings plan offered by employers. Contributions are made
            pre-tax from your paycheck, reducing your taxable income in the current year. Your investments grow
            tax-deferred until withdrawal in retirement. Many employers offer a matching contribution — essentially
            free money that can significantly accelerate your retirement savings.
          </p>

          <h3>2026 Contribution Limits</h3>
          <ul>
            <li><strong>Under 50:</strong> $23,500 per year (employee contributions)</li>
            <li><strong>50 and older:</strong> $31,000 per year (includes $7,500 catch-up)</li>
            <li><strong>Total limit</strong> (employee + employer): $70,000</li>
          </ul>

          <h3>The Power of Employer Match</h3>
          <p>
            If your employer matches 4% of your salary and you earn $75,000, that's an extra <strong>$3,000 per year</strong> of
            free money. Over a 35-year career with 7% annual returns, that employer match alone could grow to
            over <strong>$400,000</strong>. Always contribute at least enough to capture the full employer match before
            considering other investment vehicles.
          </p>

          <h3>Traditional vs Roth 401(k)</h3>
          <p>
            A <strong>Traditional 401(k)</strong> offers tax-deductible contributions now but taxes withdrawals in retirement.
            A <strong>Roth 401(k)</strong> uses after-tax money but provides tax-free withdrawals in retirement.
            If you expect to be in a higher tax bracket in retirement, Roth may be better. If you need tax savings now,
            Traditional is likely the better choice. Many advisors recommend splitting contributions between both.
          </p>

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
        <RelatedCalculators currentSlug="401k-calculator" category="Savings" />
      </aside>
    </div>
  )
}
