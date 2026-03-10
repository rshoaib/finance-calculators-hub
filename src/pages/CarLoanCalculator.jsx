"use client"
import { useState, useCallback, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b']

export default function CarLoanCalculator() {
  const [inputs, setInputs] = useState({
    vehiclePrice: 35000,
    downPayment: 5000,
    tradeIn: 0,
    loanTerm: 60,
    interestRate: 5.5,
  })
  const [results, setResults] = useState(null)

  const calculate = useCallback(() => {
    const { vehiclePrice, downPayment, tradeIn, loanTerm, interestRate } = inputs
    const principal = vehiclePrice - downPayment - tradeIn
    if (principal <= 0) return

    const monthlyRate = interestRate / 100 / 12
    const monthlyPayment = monthlyRate > 0
      ? principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1)
      : principal / loanTerm

    const totalPaid = monthlyPayment * loanTerm
    const totalInterest = totalPaid - principal
    const totalCost = totalPaid + downPayment + tradeIn

    setResults({
      monthlyPayment,
      totalPaid,
      totalInterest,
      totalCost,
      principal,
      pieData: [
        { name: 'Loan Principal', value: Math.round(principal) },
        { name: 'Total Interest', value: Math.round(totalInterest) },
        { name: 'Down Payment + Trade-in', value: Math.round(downPayment + tradeIn) },
      ],
    })
  }, [inputs])

  useEffect(() => { calculate() }, [calculate])

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'How is a car loan payment calculated?', answer: 'Car loan payments use the same amortization formula as other installment loans: M = P × r × (1+r)ⁿ / [(1+r)ⁿ – 1], where P is the loan amount (vehicle price minus down payment and trade-in), r is the monthly interest rate, and n is the number of monthly payments. A higher down payment or shorter term reduces the total cost.' },
    { question: 'What is negative equity on a car loan?', answer: 'Negative equity (being "upside down") means you owe more on the loan than the car is currently worth. This commonly happens with long loan terms (72-84 months), small down payments, or rapid depreciation. If you need to sell or trade in the car, you would have to pay the difference out of pocket.' },
    { question: 'Should I finance through the dealer or my bank?', answer: 'Getting pre-approved through your bank or credit union before visiting a dealer gives you leverage to negotiate. Dealer financing may offer promotional rates (0% APR) on new cars, but typically has higher rates on used vehicles. Always compare at least 3 offers before committing.' },
    { question: 'How much should I put down on a car?', answer: 'Financial experts recommend a 20% down payment on new cars and 10% on used cars to avoid negative equity. A larger down payment reduces your loan amount, monthly payment, and total interest. It also means you start with positive equity immediately.' },
    { question: 'Is a longer car loan term always better?', answer: 'Longer terms (72-84 months) lower your monthly payment but cost significantly more in total interest and increase the risk of negative equity. A 60-month or shorter term is ideal — it balances affordable payments with reasonable total cost and keeps you above water on the loan.' },
  ]

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Car Loan Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) },
  ]

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        
        <Breadcrumb items={[{ label: 'Car Loan Calculator' }]} />

        <div className="calc-header">
          <h1>Car Loan Calculator</h1>
          <p>Estimate your monthly car payment and total cost of your auto loan.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-group">
              <label>Vehicle Price</label>
              <input type="number" className="form-input" value={inputs.vehiclePrice}
                onChange={e => handleChange('vehiclePrice', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Down Payment</label>
                <input type="number" className="form-input" value={inputs.downPayment}
                  onChange={e => handleChange('downPayment', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Trade-in Value</label>
                <input type="number" className="form-input" value={inputs.tradeIn}
                  onChange={e => handleChange('tradeIn', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Loan Term (Months)</label>
                <select className="form-select" value={inputs.loanTerm}
                  onChange={e => handleChange('loanTerm', e.target.value)}>
                  <option value={24}>24 months (2 years)</option>
                  <option value={36}>36 months (3 years)</option>
                  <option value={48}>48 months (4 years)</option>
                  <option value={60}>60 months (5 years)</option>
                  <option value={72}>72 months (6 years)</option>
                  <option value={84}>84 months (7 years)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input type="number" className="form-input" value={inputs.interestRate}
                  onChange={e => handleChange('interestRate', e.target.value)} step="0.1" />
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Car Payment</button>
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
                <div className="result-label">Total Cost</div>
                <div className="result-value">{formatCurrency(results.totalCost)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Loan Amount</div>
                <div className="result-value">{formatCurrency(results.principal)}</div>
              </div>
            </div>

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
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>How Car Loans Work</h2>
          <p>
            A car loan (auto loan) is a secured installment loan where the vehicle serves as collateral. The lender
            provides funds to purchase the car, and you repay the loan in fixed monthly installments over an agreed term.
            Your monthly payment amount depends on four key factors: the vehicle price, your down payment and trade-in value,
            the interest rate (APR), and the loan term length. Understanding how these factors interact helps you make
            a smarter financing decision and avoid common pitfalls like negative equity.
          </p>

          <h3>The Auto Loan Formula</h3>
          <p>
            Monthly payment: <strong>M = P × r × (1 + r)<sup>n</sup> / [(1 + r)<sup>n</sup> – 1]</strong>, where P is the
            financed amount (vehicle price − down payment − trade-in), r is the monthly interest rate, and n is the total
            number of monthly payments.
          </p>

          <h3>Worked Example</h3>
          <p>
            Buying a <strong>$35,000 car</strong> with <strong>$5,000 down</strong> and a <strong>$3,000 trade-in</strong>,
            financing <strong>$27,000</strong> at <strong>5.5% APR</strong> for <strong>60 months</strong>:
          </p>
          <ul>
            <li>Monthly payment: <strong>$515</strong></li>
            <li>Total interest over 5 years: <strong>$3,915</strong></li>
            <li>Total cost of the vehicle: <strong>$38,915</strong></li>
            <li>Same loan at 72 months: <strong>$442/month</strong> but <strong>$4,811 total interest</strong> — $896 more</li>
          </ul>

          <h3>Key Auto Financing Terms</h3>
          <dl>
            <dt><strong>APR (Annual Percentage Rate)</strong></dt>
            <dd>The total annual cost of borrowing, including fees. Compare APRs across lenders for an apples-to-apples comparison.</dd>
            <dt><strong>Negative Equity (Upside Down)</strong></dt>
            <dd>When you owe more on the loan than the car is worth. Common with long terms and small down payments.</dd>
            <dt><strong>Trade-in Value</strong></dt>
            <dd>The amount a dealer offers for your current vehicle, applied as a credit toward your new purchase.</dd>
            <dt><strong>Pre-Approval</strong></dt>
            <dd>Getting a rate commitment from a bank/credit union before shopping, giving you negotiating leverage.</dd>
            <dt><strong>GAP Insurance</strong></dt>
            <dd>Covers the "gap" between your loan balance and the car's actual value if the vehicle is totaled or stolen.</dd>
          </dl>

          <h3>Smart Car Buying Strategies</h3>
          <ul>
            <li><strong>Get pre-approved first:</strong> Know your rate before visiting dealerships to negotiate from a position of strength</li>
            <li><strong>Limit your term to 60 months:</strong> Longer terms increase total cost and risk of negative equity</li>
            <li><strong>Put 20% down:</strong> Helps you start with positive equity and reduces total interest</li>
            <li><strong>Compare at least 3 lenders:</strong> Rates can vary 2-3% between banks, credit unions, and dealers</li>
            <li><strong>Focus on total cost, not monthly payment:</strong> Dealers may stretch the term to lower your payment while increasing total cost</li>
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
        <RelatedCalculators currentSlug="car-loan-calculator" category="Loans" />
      </aside>
    </div>
  )
}
