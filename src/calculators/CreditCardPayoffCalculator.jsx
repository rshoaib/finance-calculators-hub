"use client"
import { useState, useCallback, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

export default function CreditCardPayoffCalculator() {
  const [inputs, setInputs] = useState({
    balance: 5000,
    apr: 19.99,
    monthlyPayment: 200,
  })
  const [results, setResults] = useState(null)

  const calculate = useCallback(() => {
    const { balance, apr, monthlyPayment } = inputs
    const monthlyRate = apr / 100 / 12

    // Check if payment covers interest
    const minInterest = balance * monthlyRate
    if (monthlyPayment <= minInterest) {
      setResults({ error: 'Payment must be higher than monthly interest of ' + formatCurrency(minInterest) })
      return
    }

    // Custom payment schedule
    let customBalance = balance
    let customMonths = 0
    let customInterest = 0
    const customData = [{ month: 0, custom: balance, minimum: balance }]

    while (customBalance > 0 && customMonths < 600) {
      const interest = customBalance * monthlyRate
      customInterest += interest
      customBalance = customBalance + interest - monthlyPayment
      customMonths++
      if (customBalance < 0) customBalance = 0
      customData.push({ month: customMonths, custom: Math.round(customBalance) })
    }

    // Minimum payment schedule (2% of balance or $25, whichever is greater)
    let minBalance = balance
    let minMonths = 0
    let minInterestTotal = 0

    while (minBalance > 0 && minMonths < 600) {
      const interest = minBalance * monthlyRate
      minInterestTotal += interest
      const minPay = Math.max(minBalance * 0.02, 25)
      minBalance = minBalance + interest - minPay
      minMonths++
      if (minBalance < 1) minBalance = 0
      // Add to chart data
      if (minMonths < customData.length) {
        customData[minMonths].minimum = Math.round(minBalance)
      }
    }

    // Fill chart data for minimum path
    for (let i = 0; i < customData.length; i++) {
      if (customData[i].minimum === undefined) customData[i].minimum = 0
    }

    const interestSaved = minInterestTotal - customInterest

    setResults({
      customMonths,
      customInterest,
      customTotal: balance + customInterest,
      minMonths,
      minInterestTotal,
      minTotal: balance + minInterestTotal,
      interestSaved,
      chartData: customData.filter((_, i) => i % Math.max(1, Math.floor(customData.length / 30)) === 0 || i === customData.length - 1),
    })
  }, [inputs])

  useEffect(() => { calculate() }, [calculate])

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'How is credit card interest calculated?', answer: 'Credit card interest is calculated daily using your APR divided by 365 (the daily periodic rate). Each day, the daily rate is applied to your current balance. For a $5,000 balance at 19.99% APR: daily rate = 0.0548%, which means about $2.74 in interest per day or roughly $83.29 per month. This is why even small increases in APR significantly impact your total cost.' },
    { question: 'What is the debt avalanche method?', answer: 'The debt avalanche method prioritizes paying off debts with the highest interest rates first while making minimum payments on all other debts. Once the highest-rate debt is paid off, you redirect those payments to the next-highest. This method saves the most money in total interest compared to other strategies.' },
    { question: 'What is a balance transfer and is it worth it?', answer: 'A balance transfer moves your high-interest credit card debt to a card offering 0% introductory APR (typically 12-21 months). Most charge a 3-5% transfer fee. It is worth it if: the savings from 0% interest exceed the transfer fee, and you can pay off the full balance before the promo period ends. Remaining balances after the intro period often jump to 20%+ APR.' },
    { question: 'Why is paying only the minimum so expensive?', answer: 'Minimum payments (typically 2% of balance or $25) barely cover interest charges, meaning most of your payment goes to interest rather than reducing principal. A $5,000 balance at 19.99% APR with minimum payments takes over 30 years to pay off and costs over $9,000 in interest — nearly doubling the original debt.' },
    { question: 'How does credit card debt affect my credit score?', answer: 'Credit utilization (balance ÷ credit limit) is the second most important factor in your credit score, accounting for 30%. Keeping utilization below 30% is recommended, but under 10% is ideal. A $3,000 balance on a $10,000 limit gives 30% utilization. Paying down balances is one of the fastest ways to improve your score.' },
  ]

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Credit Card Payoff Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) },
  ]

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        
        <Breadcrumb items={[{ label: 'Credit Card Payoff Calculator' }]} />

        <div className="calc-header">
          <h1>Credit Card Payoff Calculator</h1>
          <p>Find out how long it takes to pay off your credit card and how much interest you'll save.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-group">
              <label>Current Balance</label>
              <input type="number" className="form-input" value={inputs.balance}
                onChange={e => handleChange('balance', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Annual Interest Rate (APR %)</label>
                <input type="number" className="form-input" value={inputs.apr}
                  onChange={e => handleChange('apr', e.target.value)} step="0.01" />
              </div>
              <div className="form-group">
                <label>Monthly Payment</label>
                <input type="number" className="form-input" value={inputs.monthlyPayment}
                  onChange={e => handleChange('monthlyPayment', e.target.value)} />
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Payoff</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && !results.error && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Payoff Time</div>
                <div className="result-value accent">{Math.floor(results.customMonths / 12)}y {results.customMonths % 12}m</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Interest</div>
                <div className="result-value gold">{formatCurrency(results.customInterest)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Interest Saved vs Min</div>
                <div className="result-value" style={{ color: '#10b981' }}>{formatCurrency(results.interestSaved)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Min Payment Time</div>
                <div className="result-value" style={{ color: '#ef4444' }}>{Math.floor(results.minMonths / 12)}y {results.minMonths % 12}m</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Payoff Comparison: Your Payment vs Minimum</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="custom" stroke="#10b981" strokeWidth={2} dot={false} name="Your Payment" />
                  <Line type="monotone" dataKey="minimum" stroke="#ef4444" strokeWidth={2} dot={false} name="Minimum Payment" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <AdSlot size="mobile-banner" />
          </div>
        )}

        {results?.error && (
          <div className="results-panel">
            <div className="result-card" style={{ borderColor: 'var(--accent-red)', background: 'rgba(239,68,68,0.1)' }}>
              <div className="result-value" style={{ color: 'var(--accent-red)', fontSize: '1rem' }}>{results.error}</div>
            </div>
          </div>
        )}

        <section className="seo-content">
          <h2>How Credit Card Interest Works</h2>
          <p>
            Credit card debt is one of the most expensive forms of consumer debt, with average APRs exceeding 20%.
            Unlike installment loans with fixed payment schedules, credit cards use revolving credit — interest
            compounds daily on your outstanding balance, and minimum payments are designed to keep you in debt as long
            as possible. Understanding how credit card interest compounds and the true cost of minimum payments is the
            first step toward becoming debt-free. Even a small increase in your monthly payment above the minimum can
            save thousands of dollars and years of payments.
          </p>

          <h3>Credit Card Interest Formula</h3>
          <p>
            Daily interest charge: <strong>Balance × (APR / 365)</strong>. Your monthly interest is approximately
            <strong>Balance × APR / 12</strong>. For a $5,000 balance at 19.99% APR, monthly interest is about
            <strong>$83.29</strong> — meaning most of a $100 minimum payment goes to interest.
          </p>

          <h3>Worked Example</h3>
          <p>
            <strong>$5,000 balance</strong> at <strong>19.99% APR</strong>:
          </p>
          <ul>
            <li>Minimum payments only (2% or $25): <strong>30+ years to pay off</strong>, <strong>$9,117 total interest</strong></li>
            <li>Paying $200/month: <strong>2 years, 7 months</strong>, <strong>$1,377 total interest</strong></li>
            <li>Interest saved by paying $200 vs minimum: <strong>$7,740</strong></li>
            <li>Time saved: <strong>27+ years</strong> of payments eliminated</li>
          </ul>

          <h3>Key Credit Card Terms</h3>
          <dl>
            <dt><strong>APR (Annual Percentage Rate)</strong></dt>
            <dd>The yearly interest rate on your balance. Credit cards typically range from 15% to 29% APR.</dd>
            <dt><strong>Minimum Payment</strong></dt>
            <dd>Usually 2% of your balance or $25 (whichever is greater). Designed to keep you paying for decades.</dd>
            <dt><strong>Debt Avalanche Method</strong></dt>
            <dd>Pay off highest-interest debt first while making minimums on everything else. Saves the most money.</dd>
            <dt><strong>Debt Snowball Method</strong></dt>
            <dd>Pay off smallest balances first for psychological wins. Less optimal mathematically but more motivating for some people.</dd>
            <dt><strong>Credit Utilization Ratio</strong></dt>
            <dd>Your balance divided by your credit limit. Keep below 30% (ideally under 10%) for a healthy credit score.</dd>
          </dl>

          <h3>Debt Payoff Strategies</h3>
          <ul>
            <li><strong>Pay more than the minimum:</strong> Even an extra $50/month can save thousands and cut years off your payoff</li>
            <li><strong>Try a balance transfer:</strong> Move debt to a 0% intro APR card and pay it off before the promo ends</li>
            <li><strong>Use the avalanche method:</strong> Target highest-APR cards first for maximum interest savings</li>
            <li><strong>Automate payments:</strong> Avoid late fees ($35+) and penalty APR increases (29.99%)</li>
            <li><strong>Stop adding new charges:</strong> Use cash or debit while paying down existing balances</li>
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
        <RelatedCalculators currentSlug="credit-card-payoff-calculator" category="Loans" />
      </aside>
    </div>
  )
}

