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

  const faqs = [
    { question: 'What is a tax bracket?', answer: 'A tax bracket defines the rate at which a specific portion of your income is taxed under the progressive federal income tax system. The U.S. has 7 brackets (10%, 12%, 22%, 24%, 32%, 35%, 37%). Only the income within each bracket is taxed at that rate — not your entire income. This is a common misconception.' },
    { question: 'What is the difference between marginal and effective tax rate?', answer: 'Your marginal rate is the rate on your last (highest) dollar of income — the bracket you fall into. Your effective rate is the average rate across all your income (total tax ÷ total income). The effective rate is always lower because your first dollars are taxed at lower rates. For example, someone in the 22% bracket might have an effective rate of only 14%.' },
    { question: 'Should I take the standard deduction or itemize?', answer: 'Take whichever is larger. The 2024 standard deduction is $14,600 (single) or $29,200 (married filing jointly). Itemize only if your qualifying deductions (mortgage interest, state/local taxes up to $10,000, charitable donations, medical expenses above 7.5% of AGI) exceed the standard deduction. About 90% of taxpayers now use the standard deduction.' },
    { question: 'How can I lower my tax bill legally?', answer: 'Key strategies: (1) Maximize pre-tax retirement contributions ($23,000 401k limit for 2024), (2) use HSA contributions ($4,150 single/$8,300 family), (3) contribute to traditional IRA ($7,000 limit), (4) harvest investment losses to offset gains, (5) donate to charity for itemized deductions, and (6) use dependent care FSA for childcare costs.' },
    { question: 'What is AGI (Adjusted Gross Income)?', answer: 'AGI is your total gross income minus specific "above-the-line" deductions such as retirement contributions, student loan interest ($2,500 max), educator expenses, and HSA contributions. Your AGI determines eligibility for many tax credits and deductions. Your taxable income is AGI minus your standard or itemized deduction.' },
  ]

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Tax Bracket Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) },
  ]

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title="Tax Bracket Calculator — Federal Income Tax 2024"
          description="Free federal income tax calculator. See your tax bracket, effective rate, marginal rate, and take-home pay. Updated for 2024 tax brackets."
          canonical="/tax-bracket-calculator"
          jsonLd={jsonLd}
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
          <h2>Understanding Federal Tax Brackets (2024)</h2>
          <p>
            The U.S. uses a progressive tax system with 7 federal income tax brackets ranging from 10% to 37%.
            A common misconception is that moving into a higher bracket means all your income is taxed at that rate.
            In reality, only the income within each bracket is taxed at that bracket's rate — your first dollars are
            always taxed at 10%, regardless of how much you earn. This calculator breaks down exactly how much tax
            falls into each bracket and shows your true effective rate.
          </p>

          <h3>2024 Tax Brackets — Single Filers</h3>
          <ul>
            <li><strong>10%:</strong> $0 – $11,600</li>
            <li><strong>12%:</strong> $11,600 – $47,150</li>
            <li><strong>22%:</strong> $47,150 – $100,525</li>
            <li><strong>24%:</strong> $100,525 – $191,950</li>
            <li><strong>32%:</strong> $191,950 – $243,725</li>
            <li><strong>35%:</strong> $243,725 – $609,350</li>
            <li><strong>37%:</strong> Over $609,350</li>
          </ul>

          <h3>Worked Example</h3>
          <p>
            <strong>$85,000 gross income</strong>, single filer, standard deduction ($14,600):
          </p>
          <ul>
            <li>Taxable income: <strong>$70,400</strong></li>
            <li>10% bracket: $1,160 tax on first $11,600</li>
            <li>12% bracket: $4,266 tax on next $35,550</li>
            <li>22% bracket: $5,115 tax on remaining $23,250</li>
            <li>Total federal tax: <strong>$10,541</strong></li>
            <li>Effective rate: <strong>12.4%</strong> (much lower than the 22% marginal rate)</li>
          </ul>

          <h3>Key Tax Terms</h3>
          <dl>
            <dt><strong>Marginal Tax Rate</strong></dt>
            <dd>The rate applied to your last dollar of income — the highest bracket you fall into.</dd>
            <dt><strong>Effective Tax Rate</strong></dt>
            <dd>Your average tax rate across all income (total tax ÷ gross income). Always lower than your marginal rate.</dd>
            <dt><strong>Standard Deduction</strong></dt>
            <dd>A flat amount subtracted from income before calculating tax: $14,600 (single) or $29,200 (married) in 2024.</dd>
            <dt><strong>AGI (Adjusted Gross Income)</strong></dt>
            <dd>Gross income minus above-the-line deductions (401k, HSA, student loan interest). Determines credit eligibility.</dd>
            <dt><strong>Tax Credits vs Deductions</strong></dt>
            <dd>Deductions reduce taxable income; credits reduce your tax bill dollar-for-dollar. A $1,000 credit saves more than a $1,000 deduction.</dd>
          </dl>

          <h3>Strategies to Reduce Your Tax Bill</h3>
          <ul>
            <li><strong>Maximize 401(k):</strong> Up to $23,000 in pre-tax contributions ($30,500 if over 50) directly reduces taxable income</li>
            <li><strong>Use HSA:</strong> Triple tax advantage — deductible contributions, tax-free growth, tax-free withdrawals for medical</li>
            <li><strong>Harvest losses:</strong> Sell losing investments to offset <a href="/capital-gains-tax-calculator">capital gains</a> and up to $3,000 of ordinary income</li>
            <li><strong>Itemize when beneficial:</strong> Compare your deductions (mortgage interest, state taxes, charity) against the standard deduction</li>
            <li><strong>Claim all credits:</strong> Child Tax Credit, Earned Income Credit, education credits, and energy credits can significantly reduce your bill</li>
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
        <RelatedCalculators currentSlug="tax-bracket-calculator" category="Tax" />
      </aside>
    </div>
  )
}

