import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import SEO from '../components/SEO'
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

  const calculate = () => {
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
  }

  const handleChange = (field, value) => {
    if (field === 'payFrequency') {
      setInputs(prev => ({ ...prev, [field]: value }))
    } else {
      setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
    }
  }

  const faqs = [
    { question: 'How is FICA calculated?', answer: 'FICA consists of Social Security tax (6.2% of income up to $168,600 in 2024) and Medicare tax (1.45% of all income). Your employer matches these amounts.' },
    { question: 'Should I contribute to a 401(k)?', answer: 'Yes, contributing to a 401(k) reduces your taxable income and grows tax-deferred. If your employer offers matching, contribute at least enough to get the full match — it\'s essentially free money.' },
    { question: 'What is gross vs net salary?', answer: 'Gross salary is your total pay before any deductions. Net salary (take-home pay) is what you actually receive after taxes, retirement contributions, and insurance premiums are deducted.' },
  ]

  const freq = FREQUENCIES[inputs.payFrequency].label

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title="Salary & Paycheck Calculator — Take-Home Pay Estimator"
          description="Free salary calculator. Estimate your take-home pay after federal tax, state tax, FICA, 401(k), and insurance deductions for any pay frequency."
          canonical="/salary-calculator"
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Salary Calculator',
            applicationCategory: 'FinanceApplication',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }}
          faqs={faqs}
        />
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
          <p>Your paycheck includes several mandatory deductions before you receive your take-home pay. Understanding each deduction helps you plan your <a href="/budget-planner">budget</a> more effectively.</p>
          <h3>Key Paycheck Deductions</h3>
          <ul>
            <li><strong>Federal Income Tax</strong> — based on progressive <a href="/tax-bracket-calculator">tax brackets</a> after the standard deduction</li>
            <li><strong>State Income Tax</strong> — varies by state (0% in FL, TX, NV; up to 13.3% in CA)</li>
            <li><strong>FICA</strong> — Social Security (6.2%) + Medicare (1.45%), matched by your employer</li>
            <li><strong>401(k)</strong> — pre-tax retirement savings that reduce your taxable income</li>
          </ul>
          <h3>Tips to Maximize Take-Home Pay</h3>
          <ul>
            <li>Contribute enough to 401(k) to get your employer's full match</li>
            <li>Use an HSA if you have a high-deductible health plan</li>
            <li>Review your <a href="/tax-bracket-calculator">tax bracket</a> and adjust W-4 withholdings annually</li>
          </ul>
        </section>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="salary-calculator" category="Tax" />
      </aside>
    </div>
  )
}
