"use client"
import { useState, useCallback, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import AdSlot from '../../src/components/AdSlot'
import Breadcrumb from '../../src/components/Breadcrumb'
import RelatedCalculators from '../../src/components/RelatedCalculators'
import { formatCurrency } from '../../src/utils/formatters'

const COLORS = { needs: '#3b82f6', wants: '#8b5cf6', savings: '#10b981' }

const SUB_CATS = {
  needs: ['Housing / Rent', 'Groceries', 'Utilities', 'Transportation', 'Insurance', 'Min Debt Payments'],
  wants: ['Dining Out', 'Entertainment', 'Shopping', 'Subscriptions', 'Travel', 'Hobbies'],
  savings: ['Emergency Fund', 'Retirement (401k/IRA)', 'Investments', 'Extra Debt Payoff', 'Other Savings'],
}

export default function BudgetPlannerCalculator() {
  const [income, setIncome] = useState(5000)
  const [results, setResults] = useState(null)

  const calculate = useCallback(() => {
    const needs = income * 0.5
    const wants = income * 0.3
    const savings = income * 0.2
    const chartData = [
      { name: 'Needs (50%)', value: Math.round(needs), color: COLORS.needs },
      { name: 'Wants (30%)', value: Math.round(wants), color: COLORS.wants },
      { name: 'Savings (20%)', value: Math.round(savings), color: COLORS.savings },
    ]
    setResults({ needs, wants, savings, chartData })
  }, [income])

  useEffect(() => { calculate() }, [calculate])

  const faqs = [
    { question: 'What is the 50/30/20 budget rule?', answer: 'The 50/30/20 rule, popularized by Senator Elizabeth Warren, allocates 50% of after-tax income to needs (housing, groceries, utilities, insurance), 30% to wants (entertainment, dining out, subscriptions), and 20% to savings and debt repayment. It provides a simple framework without requiring you to track every dollar.' },
    { question: 'What counts as a need vs a want?', answer: 'Needs are essential expenses you cannot avoid: housing/rent, groceries, utilities, transportation to work, minimum debt payments, and health insurance. Wants are non-essential spending that improves quality of life: dining out, entertainment, subscriptions, travel, and hobbies. The distinction can be subjective — a basic phone plan is a need, but the latest smartphone upgrade is a want.' },
    { question: 'What if I can\'t save 20%?', answer: 'Start with whatever percentage you can manage — even 5% is a powerful start. Automate your savings so they happen before you can spend the money. As income grows or expenses shrink, gradually increase your savings rate. The key is consistency over perfection. Many financial experts suggest increasing your savings rate by 1% every six months.' },
    { question: 'What is zero-based budgeting?', answer: 'Zero-based budgeting assigns every dollar of income a specific job — spending, saving, or debt repayment — so your income minus all allocations equals exactly zero. Unlike the 50/30/20 rule, it requires detailed tracking but gives you maximum control over your money. Apps like YNAB (You Need A Budget) use this approach.' },
    { question: 'How should I adjust the 50/30/20 rule for my situation?', answer: 'High-cost-of-living areas may require 60% or more for needs. If you have aggressive debt payoff goals, try 50/20/30 (bumping savings/debt to 30%). High earners might use 40/30/30 to accelerate wealth building. The percentages are guidelines — adjust them to fit your life stage, goals, and financial obligations.' },
  ]

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Budget Planner', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
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
          <p>
            Popularized by Senator Elizabeth Warren in her book <em>All Your Worth</em>, the 50/30/20 rule is one of
            the simplest and most effective budgeting frameworks. It divides your after-tax income into three
            categories — needs, wants, and savings — giving you a clear financial roadmap without the burden of
            tracking every single purchase. This calculator instantly shows you where your money should go each month.
          </p>

          <h3>Worked Example</h3>
          <p>
            With a <strong>$5,000 monthly take-home income</strong>:
          </p>
          <ul>
            <li><strong>Needs (50%):</strong> $2,500 — rent/mortgage, groceries, utilities, insurance, minimum debt payments</li>
            <li><strong>Wants (30%):</strong> $1,500 — dining out, entertainment, subscriptions, shopping, travel</li>
            <li><strong>Savings (20%):</strong> $1,000 — emergency fund, retirement contributions, investments, extra debt payoff</li>
          </ul>

          <h3>Key Budgeting Terms</h3>
          <dl>
            <dt><strong>Needs (50%)</strong></dt>
            <dd>Essential expenses you cannot avoid: housing, groceries, utilities, transportation, insurance, and minimum debt payments.</dd>
            <dt><strong>Wants (30%)</strong></dt>
            <dd>Non-essential spending: dining, entertainment, subscriptions, and hobbies. These improve quality of life but aren't required for survival.</dd>
            <dt><strong>Savings (20%)</strong></dt>
            <dd>Money set aside for future goals: emergency fund, retirement, investments, and extra debt payoff beyond minimums.</dd>
            <dt><strong>Pay Yourself First</strong></dt>
            <dd>Automatically transfer savings before spending on anything else. This ensures your financial goals are always funded.</dd>
            <dt><strong>Sinking Fund</strong></dt>
            <dd>Setting aside money monthly for a future planned expense (car maintenance, vacations, holiday gifts) so it doesn't blow your budget.</dd>
          </dl>

          <h3>Budget Optimization Tips</h3>
          <ul>
            <li><strong>Calculate your <a href="/salary-calculator">after-tax income</a> first:</strong> The 50/30/20 rule works on take-home pay, not gross salary</li>
            <li><strong>Automate savings:</strong> Set up automatic transfers to a <a href="/savings-goal-calculator">savings account</a> on payday</li>
            <li><strong>Track for one month:</strong> Before budgeting, track all spending to understand your current habits</li>
            <li><strong>Review quarterly:</strong> Life changes — reassess your allocations every 3 months</li>
            <li><strong>Adjust for debt:</strong> If paying down <a href="/credit-card-payoff-calculator">credit card debt</a>, consider a 50/20/30 split (30% to savings/debt)</li>
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
        <RelatedCalculators currentSlug="budget-planner" category="Savings" />
      </aside>
    </div>
  )
}
