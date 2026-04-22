"use client"
import { useState, useCallback, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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

  const calculate = useCallback(() => {
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
  }, [inputs])

  useEffect(() => { calculate() }, [calculate])

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'How much should I have in my emergency fund?', answer: 'Financial experts recommend 3-6 months of essential living expenses. If your monthly expenses are $3,000, aim for $9,000-$18,000. Those with variable income (freelancers, contractors) should target 6-12 months. Keep your emergency fund in a high-yield savings account for quick access.' },
    { question: 'What is a high-yield savings account (HYSA)?', answer: 'A HYSA is a savings account that offers an interest rate significantly higher than traditional savings accounts — typically 4-5% APY versus 0.01-0.5% at big banks. They are FDIC-insured, have no fees, and let your money grow faster. Popular options include online banks like Marcus, Ally, and Capital One 360.' },
    { question: 'What is the 50/30/20 budgeting rule?', answer: 'The 50/30/20 rule divides your after-tax income into three categories: 50% for needs (rent, food, insurance), 30% for wants (entertainment, dining out), and 20% for savings and debt repayment. For a $5,000/month income, this means $1,000 goes toward savings goals.' },
    { question: 'How do I save for multiple goals at once?', answer: 'Use the "sinking fund" approach: create separate sub-accounts (or mental buckets) for each goal and allocate a portion of your monthly savings to each. For example, $500/month might split into $200 for emergency fund, $200 for vacation, and $100 for a new car. Many online banks support multiple savings buckets.' },
    { question: 'Should I pay off debt or save first?', answer: 'Build a small emergency fund ($1,000-$2,000) first, then aggressively tackle high-interest debt (credit cards at 15%+). Once high-interest debt is paid off, split extra money between building your full emergency fund and saving/investing. Low-interest debt (mortgage, student loans at 4-5%) can be paid alongside saving.' },
  ]

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Savings Goal Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) },
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
          <h2>How to Set and Reach a Savings Goal</h2>
          <p>
            A savings goal is a specific financial target you want to reach within a defined timeframe — whether it's
            an emergency fund, a down payment on a home, a vacation, or a new car. Setting a concrete goal with a
            dollar amount and deadline makes you significantly more likely to achieve it. Consistent monthly
            contributions combined with compound interest in a high-yield savings account (HYSA) accelerate your
            progress beyond what cash-only saving can accomplish.
          </p>

          <h3>How This Calculator Works</h3>
          <p>
            The calculator iterates month by month, adding your monthly contribution and earned interest to your
            current balance until it reaches the goal. Interest compounds monthly using:
            <strong> Balance<sub>n+1</sub> = Balance<sub>n</sub> × (1 + r/12) + Contribution</strong>,
            where r is the annual interest rate.
          </p>

          <h3>Worked Example</h3>
          <p>
            Saving for a <strong>$50,000</strong> goal with <strong>$5,000 already saved</strong>,
            contributing <strong>$500/month</strong> at <strong>4% annual interest</strong>:
          </p>
          <ul>
            <li>Time to reach goal: <strong>7 years, 5 months</strong> (89 months)</li>
            <li>Total contributed: <strong>$49,500</strong> ($5,000 + $500 × 89)</li>
            <li>Interest earned: <strong>$7,846</strong> — nearly 2 months of "free" savings</li>
            <li>Without interest (0% rate), it would take <strong>90 months</strong> and earn $0 — interest saves you 1 month</li>
          </ul>

          <h3>Key Savings Terms</h3>
          <dl>
            <dt><strong>High-Yield Savings Account (HYSA)</strong></dt>
            <dd>A savings account offering 4-5% APY vs. 0.01% at traditional banks. FDIC-insured and ideal for savings goals.</dd>
            <dt><strong>Emergency Fund</strong></dt>
            <dd>3-6 months of essential expenses set aside for unexpected costs like job loss, medical bills, or car repairs.</dd>
            <dt><strong>Sinking Fund</strong></dt>
            <dd>A savings strategy where you set aside money each month for a specific planned expense (vacation, car, holiday gifts).</dd>
            <dt><strong>Opportunity Cost</strong></dt>
            <dd>The potential returns you miss by keeping money in savings instead of investing. Important for long-term goals (5+ years).</dd>
            <dt><strong>The 50/30/20 Rule</strong></dt>
            <dd>A budgeting guideline: 50% needs, 30% wants, 20% savings. For a $5,000/month income, $1,000 goes to savings goals.</dd>
          </dl>

          <h3>Accelerate Your Savings</h3>
          <ul>
            <li><strong>Automate transfers:</strong> Set up recurring deposits on payday so you "pay yourself first"</li>
            <li><strong>Use a HYSA:</strong> Earn 4-5% APY instead of 0.01% at traditional banks</li>
            <li><strong>Round up purchases:</strong> Apps that round up spending and save the difference add up over time</li>
            <li><strong>Direct windfalls to savings:</strong> Tax refunds, bonuses, and gifts can accelerate your timeline by months</li>
            <li><strong>Review and cut subscriptions:</strong> Redirect $50-$100/month from unused services to savings</li>
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
        <RelatedCalculators currentSlug="savings-goal-calculator" category="Savings" />
      </aside>
    </div>
  )
}

