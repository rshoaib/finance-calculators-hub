import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

export default function SavingsGoalCalculator() {
  const [inputs, setInputs] = useState({
    goalAmount: 50000,
    currentSavings: 5000,
    monthlyContribution: 500,
    interestRate: 4,
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const { goalAmount, currentSavings, monthlyContribution, interestRate } = inputs
    if (monthlyContribution <= 0) return

    const monthlyRate = interestRate / 100 / 12
    let balance = currentSavings
    let months = 0
    let totalInterest = 0
    const chartData = [{ month: 0, balance: currentSavings, goal: goalAmount }]

    while (balance < goalAmount && months < 600) {
      const interest = balance * monthlyRate
      totalInterest += interest
      balance += monthlyContribution + interest
      months++
      if (months % Math.max(1, Math.floor(months / 30)) === 0 || balance >= goalAmount) {
        chartData.push({ month: months, balance: Math.round(Math.min(balance, goalAmount)), goal: goalAmount })
      }
    }

    const totalContributions = currentSavings + monthlyContribution * months

    setResults({
      months,
      years: Math.floor(months / 12),
      remainingMonths: months % 12,
      totalContributions,
      totalInterest,
      chartData,
    })
  }

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title="Savings Goal Calculator — How Long to Save"
          description="Free savings goal calculator. Find out how long it will take to reach your savings target with regular monthly deposits and interest."
          canonical="/savings-goal-calculator"
          jsonLd={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Savings Goal Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }}
        />
        <Breadcrumb items={[{ label: 'Savings Goal Calculator' }]} />

        <div className="calc-header">
          <h1>Savings Goal Calculator</h1>
          <p>Find out how long it will take to reach your savings goal with regular deposits.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Savings Goal</label>
                <input type="number" className="form-input" value={inputs.goalAmount}
                  onChange={e => handleChange('goalAmount', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Current Savings</label>
                <input type="number" className="form-input" value={inputs.currentSavings}
                  onChange={e => handleChange('currentSavings', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Monthly Contribution</label>
                <input type="number" className="form-input" value={inputs.monthlyContribution}
                  onChange={e => handleChange('monthlyContribution', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input type="number" className="form-input" value={inputs.interestRate}
                  onChange={e => handleChange('interestRate', e.target.value)} step="0.1" />
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Timeline</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Time to Goal</div>
                <div className="result-value accent">{results.years}y {results.remainingMonths}m</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Contributed</div>
                <div className="result-value">{formatCurrency(results.totalContributions)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Interest Earned</div>
                <div className="result-value gold">{formatCurrency(results.totalInterest)}</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Savings Progress</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="goal" stroke="#3b82f6" fill="none" strokeDasharray="5 5" name="Goal" />
                  <Area type="monotone" dataKey="balance" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Savings" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>How to Reach Your Savings Goal Faster</h2>
          <p>Whether you're saving for a vacation, emergency fund, or a major purchase, consistent monthly contributions and compound interest are your best tools.</p>
          <h3>Smart Savings Strategies</h3>
          <ul>
            <li>Set up automatic transfers to a high-yield savings account</li>
            <li>Use the 50/30/20 budgeting rule — allocate 20% to savings</li>
            <li>Cut unnecessary subscriptions and redirect the money to savings</li>
            <li>Consider a money market account for higher interest rates</li>
          </ul>
        </section>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="savings-goal-calculator" category="Savings" />
      </aside>
    </div>
  )
}
