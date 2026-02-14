import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency, formatPercent } from '../utils/formatters'

const BRACKETS_2024 = {
  single: [
    { min: 0, max: 11600, rate: 10 },
    { min: 11600, max: 47150, rate: 12 },
    { min: 47150, max: 100525, rate: 22 },
    { min: 100525, max: 191950, rate: 24 },
    { min: 191950, max: 243725, rate: 32 },
    { min: 243725, max: 609350, rate: 35 },
    { min: 609350, max: Infinity, rate: 37 },
  ],
  married: [
    { min: 0, max: 23200, rate: 10 },
    { min: 23200, max: 94300, rate: 12 },
    { min: 94300, max: 201050, rate: 22 },
    { min: 201050, max: 383900, rate: 24 },
    { min: 383900, max: 487450, rate: 32 },
    { min: 487450, max: 731200, rate: 35 },
    { min: 731200, max: Infinity, rate: 37 },
  ],
}

const STANDARD_DEDUCTION = { single: 14600, married: 29200 }
const BRACKET_COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b', '#f97316', '#ef4444']

export default function TaxBracketCalculator() {
  const [inputs, setInputs] = useState({
    income: 85000,
    filingStatus: 'single',
    deductions: 0,
    useStandard: true,
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const { income, filingStatus, deductions, useStandard } = inputs
    const brackets = BRACKETS_2024[filingStatus]
    const totalDeductions = useStandard ? STANDARD_DEDUCTION[filingStatus] : deductions
    const taxableIncome = Math.max(0, income - totalDeductions)

    let totalTax = 0
    const bracketBreakdown = []

    for (const bracket of brackets) {
      if (taxableIncome <= bracket.min) break
      const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min
      const taxInBracket = taxableInBracket * bracket.rate / 100
      totalTax += taxInBracket
      if (taxableInBracket > 0) {
        bracketBreakdown.push({
          bracket: `${bracket.rate}%`,
          rate: bracket.rate,
          income: Math.round(taxableInBracket),
          tax: Math.round(taxInBracket),
          range: bracket.max === Infinity ? `$${bracket.min.toLocaleString()}+` : `$${bracket.min.toLocaleString()} – $${bracket.max.toLocaleString()}`,
        })
      }
    }

    const effectiveRate = taxableIncome > 0 ? (totalTax / income) * 100 : 0
    const marginalRate = bracketBreakdown.length > 0 ? bracketBreakdown[bracketBreakdown.length - 1].rate : 0
    const takeHome = income - totalTax

    setResults({ totalTax, effectiveRate, marginalRate, takeHome, taxableIncome, totalDeductions, bracketBreakdown })
  }

  const handleChange = (field, value) => {
    if (field === 'filingStatus' || field === 'useStandard') {
      setInputs(prev => ({ ...prev, [field]: field === 'useStandard' ? value === 'true' : value }))
    } else {
      setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
    }
  }

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title="Tax Bracket Calculator — Federal Income Tax 2024"
          description="Free federal income tax calculator. See your tax bracket, effective rate, marginal rate, and take-home pay. Updated for 2024 tax brackets."
          canonical="/tax-bracket-calculator"
          jsonLd={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Tax Bracket Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }}
        />
        <Breadcrumb items={[{ label: 'Tax Bracket Calculator' }]} />

        <div className="calc-header">
          <h1>Tax Bracket Calculator</h1>
          <p>Calculate your federal income tax, effective rate, and see how much goes to each bracket.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Annual Income</label>
                <input type="number" className="form-input" value={inputs.income}
                  onChange={e => handleChange('income', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Filing Status</label>
                <select className="form-select" value={inputs.filingStatus}
                  onChange={e => handleChange('filingStatus', e.target.value)}>
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Deduction Type</label>
                <select className="form-select" value={inputs.useStandard.toString()}
                  onChange={e => handleChange('useStandard', e.target.value)}>
                  <option value="true">Standard Deduction (${STANDARD_DEDUCTION[inputs.filingStatus].toLocaleString()})</option>
                  <option value="false">Itemized Deductions</option>
                </select>
              </div>
              {!inputs.useStandard && (
                <div className="form-group">
                  <label>Itemized Deductions</label>
                  <input type="number" className="form-input" value={inputs.deductions}
                    onChange={e => handleChange('deductions', e.target.value)} />
                </div>
              )}
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Tax</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Total Federal Tax</div>
                <div className="result-value accent">{formatCurrency(results.totalTax)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Effective Rate</div>
                <div className="result-value gold">{formatPercent(results.effectiveRate)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Marginal Rate</div>
                <div className="result-value">{results.marginalRate}%</div>
              </div>
              <div className="result-card">
                <div className="result-label">Take-Home Pay</div>
                <div className="result-value" style={{ color: '#10b981' }}>{formatCurrency(results.takeHome)}</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Tax by Bracket</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={results.bracketBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="bracket" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="tax" name="Tax Amount" radius={[4, 4, 0, 0]}>
                    {results.bracketBreakdown.map((entry, idx) => (
                      <Cell key={idx} fill={BRACKET_COLORS[idx]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Bracket Detail Table */}
            <div className="chart-container">
              <h3>Bracket Breakdown</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)' }}>Bracket</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem', color: 'var(--text-muted)' }}>Range</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem', color: 'var(--text-muted)' }}>Taxable</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem', color: 'var(--text-muted)' }}>Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.bracketBreakdown.map((b, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem', color: BRACKET_COLORS[idx], fontWeight: 600 }}>{b.bracket}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-secondary)' }}>{b.range}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatCurrency(b.income)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(b.tax)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>Understanding Federal Tax Brackets</h2>
          <p>The U.S. uses a progressive tax system, meaning higher income is taxed at higher rates. However, only the income within each bracket is taxed at that bracket's rate — not your entire income.</p>
          <h3>Effective vs Marginal Tax Rate</h3>
          <p>Your <strong>marginal rate</strong> is the rate on your last dollar of income. Your <strong>effective rate</strong> is the average rate across all your income. The effective rate is always lower than the marginal rate.</p>
          <h3>Ways to Reduce Your Tax Bill</h3>
          <ul>
            <li>Maximize pre-tax retirement contributions (401k, Traditional IRA)</li>
            <li>Use Health Savings Accounts (HSA) for triple tax benefits</li>
            <li>Itemize deductions if they exceed the standard deduction</li>
            <li>Consider tax-loss harvesting on investment losses</li>
          </ul>
        </section>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="tax-bracket-calculator" category="Tax" />
      </aside>
    </div>
  )
}
