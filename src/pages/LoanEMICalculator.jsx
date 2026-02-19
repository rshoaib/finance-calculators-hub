import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

const COLORS = ['#10b981', '#3b82f6']

export default function LoanEMICalculator() {
  const [inputs, setInputs] = useState({
    loanAmount: 50000,
    interestRate: 8,
    loanTenure: 5,
    tenureType: 'years',
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const months = inputs.tenureType === 'years' ? inputs.loanTenure * 12 : inputs.loanTenure
    const monthlyRate = inputs.interestRate / 100 / 12

    const emi = monthlyRate > 0
      ? inputs.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
      : inputs.loanAmount / months

    const totalPayment = emi * months
    const totalInterest = totalPayment - inputs.loanAmount

    setResults({
      emi,
      totalPayment,
      totalInterest,
      principal: inputs.loanAmount,
      months,
      pieData: [
        { name: 'Principal', value: Math.round(inputs.loanAmount) },
        { name: 'Interest', value: Math.round(totalInterest) },
      ],
    })
  }

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: field === 'tenureType' ? value : (parseFloat(value) || 0) }))
  }

  const faqs = [
    { question: 'What does EMI stand for?', answer: 'EMI stands for Equated Monthly Installment — a fixed payment amount that a borrower pays to a lender on a specified date each month. Each EMI payment includes both principal repayment and interest charges, structured so the loan is fully repaid by the end of the tenure.' },
    { question: 'What is the difference between flat rate and reducing balance interest?', answer: 'Flat rate interest is calculated on the original loan amount for the entire tenure, making it more expensive. Reducing balance (diminishing balance) calculates interest only on the outstanding principal, which decreases with each payment. A 10% flat rate is roughly equivalent to a 17-18% reducing balance rate.' },
    { question: 'Can I prepay my loan to reduce total interest?', answer: 'Yes, most lenders allow partial or full prepayment. Prepaying reduces your outstanding principal, which means less interest accrues in future months. Some lenders charge a prepayment penalty (typically 2-4% of the prepaid amount), so check your loan agreement before prepaying.' },
    { question: 'How does loan tenure affect my EMI?', answer: 'A longer tenure reduces your monthly EMI but increases the total interest paid over the life of the loan. A shorter tenure means higher monthly payments but significantly less total interest. For example, a $50,000 loan at 8% costs $6,081 interest over 3 years vs. $16,480 over 7 years.' },
    { question: 'What credit score do I need for the best loan rates?', answer: 'Generally, a credit score of 750 or above qualifies you for the best interest rates. Scores between 650-749 may still qualify but at higher rates. Below 650, you may face difficulty getting approved or receive rates 3-5% higher than prime borrowers.' },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Loan EMI Calculator',
      url: 'https://mycalcfinance.com/emi-calculator',
      description: 'Free EMI calculator for personal loans, car loans, and education loans.',
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
          title="Loan EMI Calculator — Equated Monthly Installment"
          description="Free EMI calculator. Calculate your equated monthly installment for personal, auto, or education loans. See principal vs interest breakdown."
          canonical="/emi-calculator"
          jsonLd={jsonLd}
        />
        <Breadcrumb items={[{ label: 'EMI Calculator' }]} />

        <div className="calc-header">
          <h1>Loan EMI Calculator</h1>
          <p>Calculate your Equated Monthly Installment and see the full payment breakdown.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-group">
              <label>Loan Amount ($)</label>
              <input type="number" className="form-input" value={inputs.loanAmount}
                onChange={e => handleChange('loanAmount', e.target.value)} />
              <input type="range" className="range-slider" min="1000" max="500000" step="1000"
                value={inputs.loanAmount} onChange={e => handleChange('loanAmount', e.target.value)} />
              <div className="slider-labels"><span>$1K</span><span>$500K</span></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input type="number" className="form-input" value={inputs.interestRate}
                  onChange={e => handleChange('interestRate', e.target.value)} step="0.1" />
              </div>
              <div className="form-group">
                <label>Loan Tenure</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="number" className="form-input" value={inputs.loanTenure}
                    onChange={e => handleChange('loanTenure', e.target.value)} style={{ flex: 1 }} />
                  <select className="form-select" value={inputs.tenureType}
                    onChange={e => handleChange('tenureType', e.target.value)} style={{ width: '100px' }}>
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate EMI</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Monthly EMI</div>
                <div className="result-value accent">{formatCurrency(results.emi)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Interest</div>
                <div className="result-value gold">{formatCurrency(results.totalInterest)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Payment</div>
                <div className="result-value">{formatCurrency(results.totalPayment)}</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Principal vs Interest</h3>
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
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>What Is an EMI (Equated Monthly Installment)?</h2>
          <p>
            An EMI, or Equated Monthly Installment, is the fixed payment amount a borrower makes to a lender each month
            until the loan is fully repaid. Each EMI consists of two components: a portion that goes toward repaying the
            principal loan amount, and a portion that covers the interest charges. In the early months of a loan, a larger
            share of the EMI goes toward interest. As the outstanding balance decreases over the loan tenure, more of each
            payment is applied to the principal — this is known as the reducing balance method.
          </p>

          <h3>The EMI Formula</h3>
          <p>
            EMI is calculated using: <strong>EMI = P × r × (1 + r)<sup>n</sup> / [(1 + r)<sup>n</sup> – 1]</strong>, where:
          </p>
          <ul>
            <li><strong>P</strong> = Principal loan amount</li>
            <li><strong>r</strong> = Monthly interest rate (annual rate ÷ 12)</li>
            <li><strong>n</strong> = Total number of monthly installments (tenure in months)</li>
          </ul>

          <h3>Worked Example</h3>
          <p>
            For a <strong>$50,000 personal loan</strong> at <strong>8% annual interest</strong> for <strong>5 years</strong> (60 months):
          </p>
          <ul>
            <li>Monthly interest rate: 0.08 ÷ 12 = <strong>0.00667</strong></li>
            <li>EMI = 50,000 × 0.00667 × (1.00667)<sup>60</sup> / [(1.00667)<sup>60</sup> – 1]</li>
            <li>Monthly EMI: <strong>$1,014</strong></li>
            <li>Total payment over 5 years: <strong>$60,831</strong></li>
            <li>Total interest paid: <strong>$10,831</strong></li>
          </ul>

          <h3>Key Terms</h3>
          <dl>
            <dt><strong>Reducing Balance Method</strong></dt>
            <dd>Interest is calculated on the outstanding loan balance after each payment, resulting in lower total interest compared to flat-rate calculation.</dd>
            <dt><strong>Flat Rate Interest</strong></dt>
            <dd>Interest calculated on the original loan amount for the full tenure. More expensive than reducing balance — a 10% flat rate equals roughly 17-18% reducing balance.</dd>
            <dt><strong>Prepayment / Foreclosure</strong></dt>
            <dd>Paying off part or all of the remaining loan balance before the scheduled end date. May incur a prepayment penalty.</dd>
            <dt><strong>Processing Fee</strong></dt>
            <dd>A one-time fee charged by the lender to process your loan application, typically 1-3% of the loan amount.</dd>
            <dt><strong>Loan Tenure</strong></dt>
            <dd>The total duration of the loan, usually expressed in months or years. Longer tenure means lower EMI but higher total interest.</dd>
          </dl>

          <h3>Strategies to Reduce Your EMI Burden</h3>
          <ul>
            <li><strong>Negotiate a lower rate:</strong> Even a 0.5% reduction can save thousands over the loan tenure</li>
            <li><strong>Increase your down payment:</strong> A larger down payment reduces the principal and thus the EMI</li>
            <li><strong>Opt for a longer tenure:</strong> Extends payments but lowers monthly outflow (increases total interest)</li>
            <li><strong>Maintain a high credit score:</strong> Scores above 750 typically qualify for the best rates</li>
            <li><strong>Make partial prepayments:</strong> Periodic lump-sum payments reduce outstanding principal and total interest</li>
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
        <RelatedCalculators currentSlug="emi-calculator" category="Loans" />
      </aside>
    </div>
  )
}
