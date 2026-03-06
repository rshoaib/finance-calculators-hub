import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

const REPAYMENT_PLANS = [
  { value: 'standard', label: 'Standard (10 years)', months: 120 },
  { value: 'extended', label: 'Extended (25 years)', months: 300 },
  { value: 'graduated5', label: 'Graduated (10 years)', months: 120 },
  { value: 'custom', label: 'Custom Term', months: 0 },
]

export default function StudentLoanCalculator() {
  const [inputs, setInputs] = useState({
    loanBalance: 35000,
    interestRate: 5.5,
    repaymentPlan: 'standard',
    customMonths: 120,
    extraPayment: 0,
    gracePeriod: 6,
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const { loanBalance, interestRate, repaymentPlan, customMonths, extraPayment, gracePeriod } = inputs
    if (loanBalance <= 0) return

    const monthlyRate = interestRate / 100 / 12

    // Interest accrued during grace period
    const graceInterest = loanBalance * monthlyRate * gracePeriod
    const totalPrincipal = loanBalance + graceInterest

    // Get months based on plan
    const months = repaymentPlan === 'custom' ? customMonths : REPAYMENT_PLANS.find(p => p.value === repaymentPlan).months

    // Standard amortization
    const basePayment = monthlyRate > 0
      ? totalPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      : totalPrincipal / months

    const totalMonthlyPayment = basePayment + extraPayment

    // Calculate actual payoff with extra payments
    let balance = totalPrincipal
    let totalPaid = 0
    let totalInterestPaid = 0
    let actualMonths = 0
    const yearlyData = []
    let yearInterest = 0
    let yearPrincipal = 0

    while (balance > 0.01 && actualMonths < 600) {
      actualMonths++
      const interestThisMonth = balance * monthlyRate
      const payment = Math.min(totalMonthlyPayment, balance + interestThisMonth)
      const principalThisMonth = payment - interestThisMonth

      balance -= principalThisMonth
      totalPaid += payment
      totalInterestPaid += interestThisMonth
      yearInterest += interestThisMonth
      yearPrincipal += principalThisMonth

      if (actualMonths % 12 === 0 || balance <= 0.01) {
        yearlyData.push({
          year: `Year ${Math.ceil(actualMonths / 12)}`,
          Principal: Math.round(yearPrincipal),
          Interest: Math.round(yearInterest),
        })
        yearInterest = 0
        yearPrincipal = 0
      }
    }

    // Standard payoff without extra payments for comparison
    let balanceNoExtra = totalPrincipal
    let totalPaidNoExtra = 0
    let totalInterestNoExtra = 0
    let monthsNoExtra = 0

    while (balanceNoExtra > 0.01 && monthsNoExtra < 600) {
      monthsNoExtra++
      const interestThisMonth = balanceNoExtra * monthlyRate
      const payment = Math.min(basePayment, balanceNoExtra + interestThisMonth)
      balanceNoExtra -= (payment - interestThisMonth)
      totalPaidNoExtra += payment
      totalInterestNoExtra += interestThisMonth
    }

    const interestSaved = extraPayment > 0 ? totalInterestNoExtra - totalInterestPaid : 0
    const monthsSaved = extraPayment > 0 ? monthsNoExtra - actualMonths : 0

    const payoffYears = Math.floor(actualMonths / 12)
    const payoffRemainingMonths = actualMonths % 12

    setResults({
      monthlyPayment: totalMonthlyPayment,
      basePayment,
      totalPaid,
      totalInterest: totalInterestPaid,
      totalPrincipal,
      graceInterest,
      actualMonths,
      payoffYears,
      payoffRemainingMonths,
      interestSaved,
      monthsSaved,
      yearlyData: yearlyData.slice(0, 12),
      pieData: [
        { name: 'Loan Principal', value: Math.round(loanBalance) },
        { name: 'Grace Period Interest', value: Math.round(graceInterest) },
        { name: 'Repayment Interest', value: Math.round(totalInterestPaid) },
      ].filter(d => d.value > 0),
    })
  }

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: field === 'repaymentPlan' ? value : (parseFloat(value) || 0) }))
  }

  const faqs = [
    { question: 'What is the standard repayment plan for student loans?', answer: 'The standard repayment plan has fixed monthly payments over 10 years (120 months). It typically results in the lowest total interest cost among all federal repayment plans because you pay off the loan faster. Most borrowers default to this plan unless they choose an alternative.' },
    { question: 'Should I pay off student loans during the grace period?', answer: 'If you can afford it, making interest payments during the grace period prevents interest from capitalizing (being added to your principal balance). On a $35,000 loan at 5.5%, skipping the 6-month grace period adds roughly $962 to your balance — and you pay interest on that extra amount for the life of the loan.' },
    { question: 'How do extra payments affect my student loan?', answer: 'Extra payments go directly toward your principal balance, reducing the amount future interest is calculated on. Even an extra $50/month on a $35,000 loan at 5.5% can save you over $1,400 in interest and pay off the loan 14 months early. Always confirm with your servicer that extra payments are applied to principal, not future payments.' },
    { question: 'What is the difference between subsidized and unsubsidized student loans?', answer: 'With subsidized loans, the government pays the interest while you are in school, during grace periods, and during deferment. With unsubsidized loans, interest accrues from the day the loan is disbursed and capitalizes if not paid, increasing your total balance. Unsubsidized loans cost more overall.' },
    { question: 'When does student loan refinancing make sense?', answer: 'Refinancing makes sense when you can get a significantly lower interest rate (usually 1%+ lower), have stable income, and do not need federal loan protections like income-driven repayment or Public Service Loan Forgiveness. Be aware that refinancing federal loans into a private loan eliminates all federal benefits permanently.' },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Student Loan Calculator',
      url: 'https://mycalcfinance.com/student-loan-calculator',
      description: 'Free student loan calculator. Estimate monthly payments, total interest, and explore repayment plans. See how extra payments can save you thousands.',
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
        <SEO
          title="Student Loan Calculator — Repayment & Interest Estimator (2026)"
          description="Free student loan calculator. Estimate monthly payments, compare repayment plans, and see how extra payments save thousands in interest. Updated for 2026 rates."
          canonical="/student-loan-calculator"
          jsonLd={jsonLd}
        />
        <Breadcrumb items={[{ label: 'Student Loan Calculator' }]} />

        <div className="calc-header">
          <h1>Student Loan Calculator</h1>
          <p>Estimate your monthly payment, total interest, and see how extra payments can save you thousands.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-group">
              <label>Total Loan Balance ($)</label>
              <input type="number" className="form-input" value={inputs.loanBalance}
                onChange={e => handleChange('loanBalance', e.target.value)} />
              <input type="range" className="range-slider" min="1000" max="200000" step="1000"
                value={inputs.loanBalance} onChange={e => handleChange('loanBalance', e.target.value)} />
              <div className="slider-labels"><span>$1K</span><span>$200K</span></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input type="number" className="form-input" value={inputs.interestRate}
                  onChange={e => handleChange('interestRate', e.target.value)} step="0.1" />
              </div>
              <div className="form-group">
                <label>Grace Period (Months)</label>
                <input type="number" className="form-input" value={inputs.gracePeriod}
                  onChange={e => handleChange('gracePeriod', e.target.value)} min="0" max="12" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Repayment Plan</label>
                <select className="form-select" value={inputs.repaymentPlan}
                  onChange={e => handleChange('repaymentPlan', e.target.value)}>
                  {REPAYMENT_PLANS.map(plan => (
                    <option key={plan.value} value={plan.value}>{plan.label}</option>
                  ))}
                </select>
              </div>
              {inputs.repaymentPlan === 'custom' && (
                <div className="form-group">
                  <label>Custom Term (Months)</label>
                  <input type="number" className="form-input" value={inputs.customMonths}
                    onChange={e => handleChange('customMonths', e.target.value)} min="12" max="360" />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Extra Monthly Payment ($) <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>— optional</span></label>
              <input type="number" className="form-input" value={inputs.extraPayment}
                onChange={e => handleChange('extraPayment', e.target.value)} min="0" />
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Student Loan</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Monthly Payment</div>
                <div className="result-value accent">{formatCurrency(results.monthlyPayment)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Interest</div>
                <div className="result-value gold">{formatCurrency(results.totalInterest)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Paid</div>
                <div className="result-value">{formatCurrency(results.totalPaid)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Payoff Time</div>
                <div className="result-value">
                  {results.payoffYears > 0 ? `${results.payoffYears}y ` : ''}{results.payoffRemainingMonths}m
                </div>
              </div>
            </div>

            {results.graceInterest > 0 && (
              <div style={{ background: 'var(--surface-alt)', padding: '1rem 1.25rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                ⚠️ <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(results.graceInterest)}</strong> in interest will accrue during your {inputs.gracePeriod}-month grace period and be added to your principal balance.
              </div>
            )}

            {results.interestSaved > 0 && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem 1.25rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                💰 Extra payments save you <strong style={{ color: '#10b981' }}>{formatCurrency(results.interestSaved)}</strong> in interest and pay off your loan <strong style={{ color: '#10b981' }}>{results.monthsSaved} months</strong> early!
              </div>
            )}

            <div className="chart-container">
              <h3>Cost Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={results.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={110}
                    paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {results.pieData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {results.yearlyData.length > 1 && (
              <div className="chart-container">
                <h3>Annual Principal vs Interest</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={results.yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={12} />
                    <YAxis stroke="var(--text-secondary)" fontSize={12} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="Principal" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Interest" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>How Student Loans Work</h2>
          <p>
            Student loans are installment loans designed to cover education costs including tuition, room and board,
            books, and other expenses. Federal student loans offer fixed interest rates set by Congress each year,
            while private student loans may have fixed or variable rates set by the lender. Most federal loans come with
            a 6-month grace period after graduation before payments begin, but interest may still accrue during this time
            on unsubsidized loans.
          </p>

          <h3>The Student Loan Payment Formula</h3>
          <p>
            Monthly payments use the standard amortization formula:
            <strong> M = P × r × (1 + r)<sup>n</sup> / [(1 + r)<sup>n</sup> – 1]</strong>, where P is your total loan
            balance (including any capitalized grace period interest), r is the monthly interest rate, and n is the total
            number of monthly payments in your repayment plan.
          </p>

          <h3>Worked Example</h3>
          <p>
            For <strong>$35,000 in student loans</strong> at <strong>5.5% APR</strong> on the <strong>standard 10-year plan</strong>:
          </p>
          <ul>
            <li>Grace period interest (6 months): <strong>$962</strong></li>
            <li>Adjusted balance: <strong>$35,962</strong></li>
            <li>Monthly payment: <strong>$390</strong></li>
            <li>Total interest paid: <strong>$10,820</strong></li>
            <li>With $100 extra/month: payoff in <strong>7 years 8 months</strong>, saving <strong>$2,880 in interest</strong></li>
          </ul>

          <h3>Federal Repayment Plans Compared</h3>
          <table>
            <thead>
              <tr><th>Plan</th><th>Term</th><th>Monthly Payment</th><th>Best For</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Standard</strong></td><td>10 years</td><td>Fixed</td><td>Lowest total cost</td></tr>
              <tr><td><strong>Extended</strong></td><td>Up to 25 years</td><td>Fixed or graduated</td><td>Lower monthly payments (higher total cost)</td></tr>
              <tr><td><strong>Graduated</strong></td><td>10 years</td><td>Starts low, increases every 2 years</td><td>Expect rising income</td></tr>
              <tr><td><strong>SAVE/IBR/PAYE</strong></td><td>20-25 years</td><td>Based on income (10-15% of discretionary)</td><td>Low income relative to debt</td></tr>
            </tbody>
          </table>

          <h3>Key Student Loan Terms</h3>
          <dl>
            <dt><strong>Subsidized Loan</strong></dt>
            <dd>Federal loan where the government pays interest while you are in school, during grace periods, and deferment. Only available to undergraduates with financial need.</dd>
            <dt><strong>Unsubsidized Loan</strong></dt>
            <dd>Federal loan where interest accrues from day one. Available to both undergraduates and graduates regardless of financial need.</dd>
            <dt><strong>Capitalization</strong></dt>
            <dd>When unpaid interest is added to your principal balance, increasing the amount you pay interest on going forward.</dd>
            <dt><strong>Grace Period</strong></dt>
            <dd>A period (usually 6 months) after graduation or dropping below half-time enrollment before payments are required.</dd>
            <dt><strong>PSLF (Public Service Loan Forgiveness)</strong></dt>
            <dd>Forgives remaining federal loan balance after 120 qualifying payments (10 years) while working for a qualifying employer (government, nonprofit).</dd>
          </dl>

          <h3>Strategies to Pay Off Student Loans Faster</h3>
          <ul>
            <li><strong>Pay interest during grace period:</strong> Prevents capitalization and reduces your total cost by hundreds</li>
            <li><strong>Make biweekly payments:</strong> Paying half your monthly payment every 2 weeks results in 13 full payments per year instead of 12</li>
            <li><strong>Use windfalls aggressively:</strong> Tax refunds, bonuses, and gifts applied to principal can shave years off your loan</li>
            <li><strong>Consider refinancing:</strong> If your credit score has improved since school, you may qualify for lower rates — but only refinance federal loans if you do not need income-driven plans or PSLF</li>
            <li><strong>Set up autopay:</strong> Most servicers offer a 0.25% rate reduction for automatic payments</li>
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
        <RelatedCalculators currentSlug="student-loan-calculator" category="Loans" />
      </aside>
    </div>
  )
}
