"use client"
import { useState, useCallback, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import ShareResults from '../components/ShareResults'
import ExportPDF from '../components/ExportPDF'
import { formatCurrency } from '../utils/formatters'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

export default function HomeAffordabilityCalculator() {
  const [inputs, setInputs] = useState({
    annualIncome: 85000,
    monthlyDebts: 500,
    downPayment: 60000,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    insuranceAnnual: 1800,
    hoaMonthly: 0,
    dtiTarget: 36,
  })
  const [results, setResults] = useState(null)

  const calculate = useCallback(() => {
    const monthlyIncome = inputs.annualIncome / 12
    const maxTotalDebt = monthlyIncome * (inputs.dtiTarget / 100)
    const maxHousing = maxTotalDebt - inputs.monthlyDebts

    // Subtract taxes, insurance, HOA from available payment
    const monthlyTax = (inputs.propertyTaxRate / 100) * 1 / 12  // per dollar of home value
    const monthlyInsurance = inputs.insuranceAnnual / 12
    const availableForPI = maxHousing - monthlyInsurance - inputs.hoaMonthly

    // Work backwards from payment to find max loan
    const monthlyRate = inputs.interestRate / 100 / 12
    const n = inputs.loanTerm * 12

    // We need to account for property tax being % of home price
    // maxPayment = PI + tax*homePrice/12 + insurance + HOA
    // Available for PI + tax = maxHousing - insurance - HOA
    const availableForPIandTax = maxHousing - monthlyInsurance - inputs.hoaMonthly

    // PI = homePrice*(1-DP/homePrice) * [r(1+r)^n]/[(1+r)^n - 1]
    // Let's solve numerically: find homePrice where PI + tax = available
    let homePrice = 100000
    for (let i = 0; i < 100; i++) {
      const loanAmount = homePrice - inputs.downPayment
      if (loanAmount <= 0) break
      const pi = monthlyRate > 0
        ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
        : loanAmount / n
      const tax = homePrice * (inputs.propertyTaxRate / 100) / 12
      const totalHousing = pi + tax
      if (totalHousing < availableForPIandTax) {
        homePrice += 5000
      } else {
        homePrice -= 2500
        break
      }
    }

    // Refine
    const loanAmount = homePrice - inputs.downPayment
    const monthlyPI = monthlyRate > 0
      ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
      : loanAmount / n
    const monthlyPropertyTax = homePrice * (inputs.propertyTaxRate / 100) / 12
    const totalMonthly = monthlyPI + monthlyPropertyTax + monthlyInsurance + inputs.hoaMonthly
    const frontEndRatio = (totalMonthly / monthlyIncome * 100)
    const backEndRatio = ((totalMonthly + inputs.monthlyDebts) / monthlyIncome * 100)

    setResults({
      maxHomePrice: homePrice,
      loanAmount,
      monthlyPI,
      monthlyPropertyTax,
      monthlyInsurance,
      totalMonthly,
      frontEndRatio,
      backEndRatio,
      monthlyIncome,
      pieData: [
        { name: 'Principal & Interest', value: Math.round(monthlyPI) },
        { name: 'Property Tax', value: Math.round(monthlyPropertyTax) },
        { name: 'Insurance', value: Math.round(monthlyInsurance) },
        ...(inputs.hoaMonthly > 0 ? [{ name: 'HOA', value: inputs.hoaMonthly }] : []),
      ],
    })
  }, [inputs])

  useEffect(() => { calculate() }, [calculate])

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'How much house can I afford?', answer: 'A common guideline is the 28/36 rule: spend no more than 28% of gross monthly income on housing costs (PITI) and no more than 36% on all debts combined. This calculator uses your target DTI ratio to determine the maximum home price you can comfortably afford.' },
    { question: 'What is DTI (debt-to-income ratio)?', answer: 'DTI is your total monthly debt payments divided by gross monthly income. Lenders use two DTI ratios: front-end (housing costs only, ideally ≤28%) and back-end (all debts, ideally ≤36%). FHA loans may allow up to 43% back-end DTI, while conventional loans prefer 36% or less.' },
    { question: 'How much should I save for a down payment?', answer: 'While 20% is ideal to avoid paying PMI (Private Mortgage Insurance), many loan programs allow lower down payments: FHA loans require only 3.5%, conventional loans can go as low as 3%, and VA/USDA loans offer 0% down for eligible borrowers.' },
    { question: 'What costs are not included in this calculation?', answer: 'This calculator estimates PITI (Principal, Interest, Taxes, Insurance) and HOA. Additional costs like closing costs (typically 2-5% of home price), maintenance (budget 1% of home value/year), utilities, and moving expenses are not included.' },
    { question: 'Should I buy the most expensive house I can afford?', answer: 'No. Financial experts recommend buying below your maximum to maintain financial flexibility. Unexpected expenses, job changes, and lifestyle costs mean that stretching to your limit can lead to being "house poor" — where too much income goes to housing, leaving little for savings and emergencies.' },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Home Affordability Calculator',
      url: 'https://mycalcfinance.com/home-affordability-calculator',
      description: 'Free home affordability calculator — find out how much house you can afford based on income, debts, and down payment.',
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
        <Breadcrumb items={[{ label: 'Home Affordability Calculator' }]} />

        <div className="calc-header">
          <h1>Home Affordability Calculator</h1>
          <p>Find out how much house you can afford based on your income and monthly debts.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Annual Gross Income</label>
                <input type="number" className="form-input" value={inputs.annualIncome}
                  onChange={e => handleChange('annualIncome', e.target.value)} placeholder="85,000" />
              </div>
              <div className="form-group">
                <label>Monthly Debt Payments</label>
                <input type="number" className="form-input" value={inputs.monthlyDebts}
                  onChange={e => handleChange('monthlyDebts', e.target.value)} placeholder="500" />
                <small style={{ opacity: 0.6, fontSize: '0.75rem' }}>Car loans, student loans, credit cards, etc.</small>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Down Payment</label>
                <input type="number" className="form-input" value={inputs.downPayment}
                  onChange={e => handleChange('downPayment', e.target.value)} placeholder="60,000" />
              </div>
              <div className="form-group">
                <label>Target DTI Ratio (%)</label>
                <input type="number" className="form-input" value={inputs.dtiTarget}
                  onChange={e => handleChange('dtiTarget', e.target.value)} step="1" />
                <input type="range" className="range-slider" min="20" max="50" step="1"
                  value={inputs.dtiTarget} onChange={e => handleChange('dtiTarget', e.target.value)} />
                <div className="slider-labels"><span>Conservative (20%)</span><span>Aggressive (50%)</span></div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input type="number" className="form-input" value={inputs.interestRate}
                  onChange={e => handleChange('interestRate', e.target.value)} step="0.1" />
                <input type="range" className="range-slider" min="2" max="12" step="0.1"
                  value={inputs.interestRate} onChange={e => handleChange('interestRate', e.target.value)} />
                <div className="slider-labels"><span>2%</span><span>12%</span></div>
              </div>
              <div className="form-group">
                <label>Loan Term</label>
                <select className="form-select" value={inputs.loanTerm}
                  onChange={e => handleChange('loanTerm', e.target.value)}>
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Property Tax Rate (%/year)</label>
                <input type="number" className="form-input" value={inputs.propertyTaxRate}
                  onChange={e => handleChange('propertyTaxRate', e.target.value)} step="0.1" />
              </div>
              <div className="form-group">
                <label>Annual Insurance</label>
                <input type="number" className="form-input" value={inputs.insuranceAnnual}
                  onChange={e => handleChange('insuranceAnnual', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Monthly HOA Fees</label>
                <input type="number" className="form-input" value={inputs.hoaMonthly}
                  onChange={e => handleChange('hoaMonthly', e.target.value)} placeholder="0" />
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Affordability</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Maximum Home Price</div>
                <div className="result-value accent">{formatCurrency(results.maxHomePrice)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Monthly Payment</div>
                <div className="result-value gold">{formatCurrency(results.totalMonthly)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Loan Amount</div>
                <div className="result-value">{formatCurrency(results.loanAmount)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Front-End DTI</div>
                <div className="result-value" style={{ color: results.frontEndRatio > 28 ? '#ef4444' : '#10b981' }}>
                  {results.frontEndRatio.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="share-results">
              <ShareResults title="Home Affordability Results" resultsSummary={`Max Home Price: ${formatCurrency(results.maxHomePrice)}\nMonthly Payment: ${formatCurrency(results.totalMonthly)}\nLoan Amount: ${formatCurrency(results.loanAmount)}\nFront-End DTI: ${results.frontEndRatio.toFixed(1)}%`} />
              <ExportPDF />
            </div>

            <div className="chart-container">
              <h3>Monthly Payment Breakdown</h3>
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

            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Monthly Breakdown</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border, #e2e8f0)' }}>
                    <td style={{ padding: '0.75rem 0' }}>Principal & Interest</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(results.monthlyPI)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border, #e2e8f0)' }}>
                    <td style={{ padding: '0.75rem 0' }}>Property Tax</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(results.monthlyPropertyTax)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border, #e2e8f0)' }}>
                    <td style={{ padding: '0.75rem 0' }}>Insurance</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(results.monthlyInsurance)}</td>
                  </tr>
                  {inputs.hoaMonthly > 0 && (
                    <tr style={{ borderBottom: '1px solid var(--border, #e2e8f0)' }}>
                      <td style={{ padding: '0.75rem 0' }}>HOA</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(inputs.hoaMonthly)}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ padding: '0.75rem 0', fontWeight: 700 }}>Total PITI</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent, #10b981)' }}>{formatCurrency(results.totalMonthly)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>How to Determine Home Affordability</h2>
          <p>
            Determining how much house you can afford involves balancing your income, existing debts, and the costs
            of homeownership. Lenders primarily use your debt-to-income (DTI) ratio to decide how much they're willing
            to lend. This calculator uses your target DTI to work backwards from your income to find the maximum home
            price you can comfortably afford.
          </p>

          <h3>The 28/36 Rule</h3>
          <p>
            The 28/36 rule is a widely-used guideline:
          </p>
          <ul>
            <li><strong>28%:</strong> No more than 28% of gross monthly income should go to housing costs (PITI — Principal, Interest, Taxes, Insurance)</li>
            <li><strong>36%:</strong> No more than 36% of gross monthly income should go to all debt payments combined (housing + car loans + student loans + credit cards)</li>
          </ul>
          <p>
            For example, with a <strong>$85,000 annual income</strong> ($7,083/month), the 28% front-end limit is
            <strong> $1,983/month</strong> for housing, and the 36% back-end limit is <strong>$2,550/month</strong> for all debts.
          </p>

          <h3>Hidden Costs of Homeownership</h3>
          <ul>
            <li><strong>Closing costs:</strong> 2-5% of home price ($6,000-$15,000 on a $300K home)</li>
            <li><strong>Maintenance:</strong> Budget 1-2% of home value per year ($3,000-$6,000)</li>
            <li><strong>PMI:</strong> 0.5-1% of loan value annually if down payment is less than 20%</li>
            <li><strong>Utilities:</strong> $200-$400/month depending on location and home size</li>
            <li><strong>Moving costs:</strong> $1,000-$5,000 for local moves</li>
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
        <RelatedCalculators currentSlug="home-affordability-calculator" category="Loans" />
      </aside>
    </div>
  )
}
