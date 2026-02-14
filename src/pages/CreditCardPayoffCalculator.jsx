import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import SEO from '../components/SEO'
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

  const calculate = () => {
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
  }

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title="Credit Card Payoff Calculator — Pay Off Debt Faster"
          description="Free credit card payoff calculator. See how long it takes to pay off your balance, compare payment strategies, and discover how much interest you can save."
          canonical="/credit-card-payoff-calculator"
          jsonLd={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Credit Card Payoff Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }}
        />
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
          <h2>How to Pay Off Credit Card Debt Faster</h2>
          <p>Credit card debt is one of the most expensive forms of debt, with average APRs of 20% or more. Paying more than the minimum can save you thousands in interest and years of payments.</p>
          <h3>Strategies to Eliminate Credit Card Debt</h3>
          <ul>
            <li>Pay more than the minimum — even an extra $50/month makes a huge difference</li>
            <li>Consider balance transfer cards with 0% intro APR</li>
            <li>Use the debt avalanche method — pay highest-interest cards first</li>
            <li>Set up automatic payments to avoid late fees and interest rate hikes</li>
          </ul>
        </section>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="credit-card-payoff-calculator" category="Loans" />
      </aside>
    </div>
  )
}
