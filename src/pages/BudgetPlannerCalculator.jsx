import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

const COLORS = { needs: '#3b82f6', wants: '#8b5cf6', savings: '#10b981' }

const SUB_CATS = {
  needs: ['Housing / Rent', 'Groceries', 'Utilities', 'Transportation', 'Insurance', 'Min Debt Payments'],
  wants: ['Dining Out', 'Entertainment', 'Shopping', 'Subscriptions', 'Travel', 'Hobbies'],
  savings: ['Emergency Fund', 'Retirement (401k/IRA)', 'Investments', 'Extra Debt Payoff', 'Other Savings'],
}

export default function BudgetPlannerCalculator() {
  const [income, setIncome] = useState(5000)
  const [results, setResults] = useState(null)

  const calculate = () => {
    const needs = income * 0.5
    const wants = income * 0.3
    const savings = income * 0.2
    const chartData = [
      { name: 'Needs (50%)', value: Math.round(needs), color: COLORS.needs },
      { name: 'Wants (30%)', value: Math.round(wants), color: COLORS.wants },
      { name: 'Savings (20%)', value: Math.round(savings), color: COLORS.savings },
    ]
    setResults({ needs, wants, savings, chartData })
  }

  const faqs = [
    { question: 'What is the 50/30/20 budget rule?', answer: 'Allocate 50% of after-tax income to needs, 30% to wants, and 20% to savings and debt repayment.' },
    { question: 'What counts as a need vs a want?', answer: 'Needs are essentials: housing, groceries, utilities, insurance. Wants are non-essentials: dining out, entertainment, subscriptions.' },
    { question: 'What if I can\'t save 20%?', answer: 'Start with whatever you can. Even 5% is a great start. Increase gradually as income grows or expenses shrink.' },
  ]

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO title="Budget Planner — 50/30/20 Rule Calculator" description="Free budget planner using the 50/30/20 rule. Allocate your monthly income between needs, wants, and savings." canonical="/budget-planner"
          jsonLd={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Budget Planner', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }} faqs={faqs} />
        <Breadcrumb items={[{ label: 'Budget Planner' }]} />

        <div className="calc-header">
          <h1>Budget Planner — 50/30/20 Rule</h1>
          <p>Allocate your monthly take-home income using the proven 50/30/20 framework.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Monthly Take-Home Income ($)</label>
                <input type="number" className="form-input" value={income} onChange={e => setIncome(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Plan My Budget</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card" style={{ borderLeft: `4px solid ${COLORS.needs}` }}>
                <div className="result-label">Needs (50%)</div>
                <div className="result-value" style={{ color: COLORS.needs }}>{formatCurrency(results.needs)}</div>
              </div>
              <div className="result-card" style={{ borderLeft: `4px solid ${COLORS.wants}` }}>
                <div className="result-label">Wants (30%)</div>
                <div className="result-value" style={{ color: COLORS.wants }}>{formatCurrency(results.wants)}</div>
              </div>
              <div className="result-card" style={{ borderLeft: `4px solid ${COLORS.savings}` }}>
                <div className="result-label">Savings (20%)</div>
                <div className="result-value" style={{ color: COLORS.savings }}>{formatCurrency(results.savings)}</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Budget Allocation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={results.chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={120} dataKey="value" nameKey="name"
                    label={({ name, percent }) => `${name.split(' (')[0]} ${(percent * 100).toFixed(0)}%`}>
                    {results.chartData.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {[
              { key: 'needs', title: '🏠 Needs', amount: results.needs },
              { key: 'wants', title: '🎉 Wants', amount: results.wants },
              { key: 'savings', title: '💰 Savings', amount: results.savings },
            ].map(cat => (
              <div className="chart-container" key={cat.key}>
                <h3>{cat.title} — <span style={{ color: COLORS[cat.key] }}>{formatCurrency(cat.amount)}</span>/mo</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
                  {SUB_CATS[cat.key].map(item => (
                    <div key={item} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: 'var(--font-size-sm)' }}>{item}</div>
                  ))}
                </div>
              </div>
            ))}
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>The 50/30/20 Rule Explained</h2>
          <p>Popularized by Senator Elizabeth Warren, this rule provides a simple framework without requiring you to track every dollar.</p>
          <h3>How to Get Started</h3>
          <ul>
            <li>Calculate your <a href="/salary-calculator">after-tax income</a> first</li>
            <li>List fixed bills (housing, utilities) as core needs</li>
            <li>Automate 20% into a <a href="/savings-goal-calculator">savings account</a> or <a href="/retirement-calculator">retirement fund</a></li>
            <li>Spend the remaining 30% guilt-free on wants</li>
          </ul>
          <h3>When to Adjust</h3>
          <p>High-cost area? Needs might take 60%. Aggressively paying down <a href="/credit-card-payoff-calculator">credit card debt</a>? Bump savings to 30%.</p>
        </section>
      </div>
      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="budget-planner" category="Savings" />
      </aside>
    </div>
  )
}
