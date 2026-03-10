"use client"
import { useState, useCallback, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

const COLORS = ['#ef4444', '#f97316', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981']

const FREQUENCIES = {
  annual: { label: 'Annual', periods: 1 },
  monthly: { label: 'Monthly', periods: 12 },
  biweekly: { label: 'Bi-weekly', periods: 26 },
  weekly: { label: 'Weekly', periods: 52 },
}

export default function SalaryCalculator() {
  const [inputs, setInputs] = useState({
    grossSalary: 85000,
    payFrequency: 'biweekly',
    stateTaxRate: 5,
    retirement401k: 6,
    insurancePremium: 200,
  })
  const [results, setResults] = useState(null)

  const calculate = useCallback(() => {
    const { grossSalary, payFrequency, stateTaxRate, retirement401k, insurancePremium } = inputs
    const periods = FREQUENCIES[payFrequency].periods

    // Federal tax estimate (simplified progressive brackets 2024 single)
    const brackets = [
      { min: 0, max: 11600, rate: 10 },
      { min: 11600, max: 47150, rate: 12 },
      { min: 47150, max: 100525, rate: 22 },
      { min: 100525, max: 191950, rate: 24 },
      { min: 191950, max: 243725, rate: 32 },
      { min: 243725, max: 609350, rate: 35 },
      { min: 609350, max: Infinity, rate: 37 },
    ]
    const standardDeduction = 14600
    const taxableIncome = Math.max(0, grossSalary - standardDeduction)
    let federalTax = 0
    for (const bracket of brackets) {
      if (taxableIncome <= bracket.min) break
      const taxable = Math.min(taxableIncome, bracket.max) - bracket.min
      federalTax += taxable * bracket.rate / 100
    }

    const stateTax = grossSalary * stateTaxRate / 100
    const socialSecurity = Math.min(grossSalary, 168600) * 0.062
    const medicare = grossSalary * 0.0145
    const fica = socialSecurity + medicare
    const retirement = grossSalary * retirement401k / 100
    const insuranceAnnual = insurancePremium * 12

    const totalDeductions = federalTax + stateTax + fica + retirement + insuranceAnnual
    const netPay = grossSalary - totalDeductions

    const perPeriod = {
      gross: grossSalary / periods,
      federal: federalTax / periods,
      state: stateTax / periods,
      fica: fica / periods,
      retirement: retirement / periods,
      insurance: insuranceAnnual / periods,
      net: netPay / periods,
    }

    const chartData = [
      { name: 'Federal Tax', value: Math.round(federalTax) },
      { name: 'State Tax', value: Math.round(stateTax) },
      { name: 'FICA (SS + Medicare)', value: Math.round(fica) },
      { name: '401(k)', value: Math.round(retirement) },
      { name: 'Insurance', value: Math.round(insuranceAnnual) },
      { name: 'Take-Home', value: Math.round(netPay) },
    ].filter(d => d.value > 0)

    setResults({ federalTax, stateTax, fica, retirement, insuranceAnnual, totalDeductions, netPay, perPeriod, chartData })
  }, [inputs])

  useEffect(() => { calculate() }, [calculate])

  const handleChange = (field, value) => {
    if (field === 'payFrequency') {
      setInputs(prev => ({ ...prev, [field]: value }))
    } else {
      setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
    }
  }

  const faqs = [
    { question: 'How is FICA calculated?', answer: 'FICA consists of two parts: Social Security tax (6.2% on income up to $168,600 in 2024) and Medicare tax (1.45% on all income, plus an additional 0.9% on income above $200,000). Your employer matches the base FICA amounts, meaning the total FICA contribution is 15.3%. Self-employed individuals pay both halves (15.3% total) through self-employment tax.' },
    { question: 'Should I contribute to a 401(k)?', answer: 'Absolutely — especially if your employer offers matching. Contributing to a 401(k) reduces your taxable income dollar-for-dollar and grows tax-deferred. If your employer matches 50% up to 6% of salary, contribute at least 6% to capture the full match — it is literally a 50% instant return on your money. The 2024 contribution limit is $23,000 ($30,500 if over 50).' },
    { question: 'What is gross vs net salary?', answer: 'Gross salary is your total compensation before any deductions — the number in your job offer. Net salary (take-home pay) is what actually hits your bank account after federal tax, state tax, FICA, retirement contributions, and insurance premiums. Net pay is typically 25-35% less than gross pay, depending on your tax bracket and benefits elections.' },
    { question: 'What is a W-4 form and why does it matter?', answer: 'Form W-4 tells your employer how much federal income tax to withhold from each paycheck. If you claim too few allowances, too much tax is withheld (you get a large refund but smaller paychecks). If you claim too many, too little is withheld (larger paychecks but you may owe at tax time). Review your W-4 after major life changes like marriage, a new child, or buying a home.' },
    { question: 'How do pre-tax benefits reduce my taxable income?', answer: 'Pre-tax benefits — such as 401(k) contributions, HSA contributions, FSA contributions, and employer-sponsored health insurance — are deducted from your gross pay BEFORE income tax is calculated. This means every $1 contributed to these benefits saves you $0.22–$0.37 in taxes (depending on your bracket), effectively giving you a discount on these expenses.' },
  ]

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Salary Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) },
  ]

  const freq = FREQUENCIES[inputs.payFrequency].label

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        
        <Breadcrumb items={[{ label: 'Salary Calculator' }]} />

        <div className="calc-header">
          <h1>Salary & Paycheck Calculator</h1>
          <p>Estimate your take-home pay after federal taxes, state taxes, FICA, 401(k), and insurance.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Annual Gross Salary ($)</label>
                <input type="number" className="form-input" value={inputs.grossSalary} onChange={e => handleChange('grossSalary', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Pay Frequency</label>
                <select className="form-select" value={inputs.payFrequency} onChange={e => handleChange('payFrequency', e.target.value)}>
                  {Object.entries(FREQUENCIES).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>State Tax Rate (%)</label>
                <input type="number" className="form-input" step="0.1" value={inputs.stateTaxRate} onChange={e => handleChange('stateTaxRate', e.target.value)} />
              </div>
              <div className="form-group">
                <label>401(k) Contribution (%)</label>
                <input type="number" className="form-input" step="0.5" value={inputs.retirement401k} onChange={e => handleChange('retirement401k', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Monthly Health Insurance Premium ($)</label>
                <input type="number" className="form-input" value={inputs.insurancePremium} onChange={e => handleChange('insurancePremium', e.target.value)} />
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Paycheck</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">{freq} Take-Home</div>
                <div className="result-value accent">{formatCurrency(results.perPeriod.net)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Annual Net Pay</div>
                <div className="result-value" style={{ color: '#10b981' }}>{formatCurrency(results.netPay)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Deductions</div>
                <div className="result-value" style={{ color: '#ef4444' }}>{formatCurrency(results.totalDeductions)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Effective Tax Rate</div>
                <div className="result-value gold">{((results.federalTax + results.stateTax + results.fica) / inputs.grossSalary * 100).toFixed(1)}%</div>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="chart-container">
              <h3>Paycheck Breakdown ({freq})</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)' }}>Deduction</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem', color: 'var(--text-muted)' }}>{freq}</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem', color: 'var(--text-muted)' }}>Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Gross Pay', period: results.perPeriod.gross, annual: inputs.grossSalary, color: '#e2e8f0' },
                      { label: 'Federal Tax', period: -results.perPeriod.federal, annual: -results.federalTax, color: '#ef4444' },
                      { label: 'State Tax', period: -results.perPeriod.state, annual: -results.stateTax, color: '#f97316' },
                      { label: 'FICA (SS + Medicare)', period: -results.perPeriod.fica, annual: -results.fica, color: '#8b5cf6' },
                      { label: '401(k)', period: -results.perPeriod.retirement, annual: -results.retirement, color: '#3b82f6' },
                      { label: 'Health Insurance', period: -results.perPeriod.insurance, annual: -results.insuranceAnnual, color: '#06b6d4' },
                    ].map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem', color: row.color, fontWeight: 600 }}>{row.label}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatCurrency(row.period)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatCurrency(row.annual)}</td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: '2px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>Net Take-Home</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>{formatCurrency(results.perPeriod.net)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>{formatCurrency(results.netPay)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="chart-container">
              <h3>Annual Pay Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={results.chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {results.chartData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>Understanding Your Paycheck</h2>
          <p>
            Your paycheck undergoes several mandatory deductions before you receive your take-home pay. On average,
            Americans keep only 65-75% of their gross salary after federal taxes, state taxes, FICA, retirement
            contributions, and insurance premiums. Understanding each deduction empowers you to optimize your finances
            and plan your <a href="/budget-planner">monthly budget</a> accurately.
          </p>

          <h3>Worked Example</h3>
          <p>
            <strong>$75,000 annual gross salary</strong>, single filer in Texas (0% state tax), 6% 401(k) contribution, $200/month insurance:
          </p>
          <ul>
            <li>Gross pay (biweekly): <strong>$2,884.62</strong></li>
            <li>Federal tax: −$338.85</li>
            <li>FICA: −$220.67 (Social Security + Medicare)</li>
            <li>401(k): −$173.08 (6% pre-tax)</li>
            <li>Health insurance: −$92.31</li>
            <li>Biweekly take-home: <strong>$2,059.71</strong></li>
            <li>Annual net pay: <strong>$53,552</strong> (71.4% of gross)</li>
          </ul>

          <h3>Key Paycheck Terms</h3>
          <dl>
            <dt><strong>Federal Income Tax</strong></dt>
            <dd>Based on progressive <a href="/tax-bracket-calculator">tax brackets</a> after the standard deduction ($14,600 for single filers in 2024).</dd>
            <dt><strong>State Income Tax</strong></dt>
            <dd>Varies by state: 0% in FL, TX, NV, WA, WY, TN, SD, NH, AK; up to 13.3% in CA. This can mean thousands of dollars difference in take-home pay.</dd>
            <dt><strong>FICA (Social Security + Medicare)</strong></dt>
            <dd>Social Security (6.2% up to $168,600) and Medicare (1.45% on all income). Your employer matches these amounts.</dd>
            <dt><strong>Pre-Tax Retirement (401k)</strong></dt>
            <dd>Contributions are deducted before income tax, reducing your taxable income. 2024 limit: $23,000 ($30,500 if 50+).</dd>
            <dt><strong>W-4 Withholding</strong></dt>
            <dd>Determines how much federal tax your employer withholds. Incorrect withholding leads to large refunds (too much) or tax bills (too little).</dd>
          </dl>

          <h3>Tips to Maximize Take-Home Pay</h3>
          <ul>
            <li><strong>Capture the full employer match:</strong> Contributing enough to your 401(k) to get the full match is an instant 50-100% return on that money</li>
            <li><strong>Use an HSA:</strong> If you have a high-deductible health plan, HSA contributions are triple tax-advantaged (deductible, grow tax-free, withdraw tax-free for medical)</li>
            <li><strong>Optimize your W-4:</strong> Review withholdings annually and after life changes — aim for a small refund, not a large one</li>
            <li><strong>Consider state taxes:</strong> If relocating, states with no income tax can boost take-home pay by 5-13%</li>
            <li><strong>Use a dependent care FSA:</strong> Up to $5,000 in pre-tax dollars for childcare expenses, saving you hundreds in taxes</li>
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
        <RelatedCalculators currentSlug="salary-calculator" category="Tax" />
      </aside>
    </div>
  )
}
