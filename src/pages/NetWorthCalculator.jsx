import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

const ASSET_COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b']
const LIABILITY_COLORS = ['#ef4444', '#f97316', '#ec4899', '#f43f5e', '#e11d48']

export default function NetWorthCalculator() {
  const [assets, setAssets] = useState({
    cash: 15000,
    investments: 50000,
    property: 250000,
    retirement: 80000,
    other: 5000,
  })
  const [liabilities, setLiabilities] = useState({
    mortgage: 180000,
    autoLoans: 12000,
    studentLoans: 25000,
    creditCards: 3000,
    other: 2000,
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0)
    const totalLiabilities = Object.values(liabilities).reduce((a, b) => a + b, 0)
    const netWorth = totalAssets - totalLiabilities
    const ratio = totalLiabilities > 0 ? totalAssets / totalLiabilities : Infinity

    const chartData = [
      { name: 'Cash & Savings', value: assets.cash, type: 'asset' },
      { name: 'Investments', value: assets.investments, type: 'asset' },
      { name: 'Property', value: assets.property, type: 'asset' },
      { name: 'Retirement', value: assets.retirement, type: 'asset' },
      { name: 'Other Assets', value: assets.other, type: 'asset' },
      { name: 'Mortgage', value: liabilities.mortgage, type: 'liability' },
      { name: 'Auto Loans', value: liabilities.autoLoans, type: 'liability' },
      { name: 'Student Loans', value: liabilities.studentLoans, type: 'liability' },
      { name: 'Credit Cards', value: liabilities.creditCards, type: 'liability' },
      { name: 'Other Debts', value: liabilities.other, type: 'liability' },
    ].filter(d => d.value > 0)

    setResults({ totalAssets, totalLiabilities, netWorth, ratio, chartData })
  }

  const handleAssetChange = (field, value) => {
    setAssets(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const handleLiabilityChange = (field, value) => {
    setLiabilities(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'What is net worth?', answer: 'Net worth is the total value of your assets minus your liabilities. It gives a snapshot of your overall financial health at a single point in time.' },
    { question: 'How often should I calculate my net worth?', answer: 'Financial experts recommend calculating your net worth at least once a quarter (every 3 months) to track your financial progress over time.' },
    { question: 'What is a good net worth by age?', answer: 'A common rule of thumb is that by age 30 your net worth should equal your annual salary, and by age 40 it should be twice your salary. However, this varies greatly by individual circumstances.' },
  ]

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title="Net Worth Calculator — Track Your Financial Health"
          description="Free net worth calculator. Add up your assets and liabilities to see your total net worth and assets-to-debt ratio."
          canonical="/net-worth-calculator"
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Net Worth Calculator',
            applicationCategory: 'FinanceApplication',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }}
          faqs={faqs}
        />
        <Breadcrumb items={[{ label: 'Net Worth Calculator' }]} />

        <div className="calc-header">
          <h1>Net Worth Calculator</h1>
          <p>Add up your assets and liabilities to see your total net worth and financial health.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>💰 Assets</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Cash & Savings</label>
                <input type="number" className="form-input" value={assets.cash} onChange={e => handleAssetChange('cash', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Investments</label>
                <input type="number" className="form-input" value={assets.investments} onChange={e => handleAssetChange('investments', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Property Value</label>
                <input type="number" className="form-input" value={assets.property} onChange={e => handleAssetChange('property', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Retirement Accounts</label>
                <input type="number" className="form-input" value={assets.retirement} onChange={e => handleAssetChange('retirement', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Other Assets</label>
                <input type="number" className="form-input" value={assets.other} onChange={e => handleAssetChange('other', e.target.value)} />
              </div>
            </div>

            <h3 style={{ color: '#ef4444', marginBottom: '1rem', marginTop: '1.5rem' }}>📋 Liabilities</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Mortgage Balance</label>
                <input type="number" className="form-input" value={liabilities.mortgage} onChange={e => handleLiabilityChange('mortgage', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Auto Loans</label>
                <input type="number" className="form-input" value={liabilities.autoLoans} onChange={e => handleLiabilityChange('autoLoans', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Student Loans</label>
                <input type="number" className="form-input" value={liabilities.studentLoans} onChange={e => handleLiabilityChange('studentLoans', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Credit Cards</label>
                <input type="number" className="form-input" value={liabilities.creditCards} onChange={e => handleLiabilityChange('creditCards', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Other Debts</label>
                <input type="number" className="form-input" value={liabilities.other} onChange={e => handleLiabilityChange('other', e.target.value)} />
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Net Worth</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Net Worth</div>
                <div className="result-value accent" style={{ color: results.netWorth >= 0 ? '#10b981' : '#ef4444' }}>{formatCurrency(results.netWorth)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Assets</div>
                <div className="result-value" style={{ color: '#10b981' }}>{formatCurrency(results.totalAssets)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Liabilities</div>
                <div className="result-value" style={{ color: '#ef4444' }}>{formatCurrency(results.totalLiabilities)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Asset-to-Debt Ratio</div>
                <div className="result-value gold">{results.ratio === Infinity ? '∞' : results.ratio.toFixed(2)}</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Assets vs Liabilities</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={results.chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={110} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="value" name="Amount" radius={[0, 4, 4, 0]}>
                    {results.chartData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.type === 'asset' ? ASSET_COLORS[idx % ASSET_COLORS.length] : LIABILITY_COLORS[idx % LIABILITY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>Understanding Your Net Worth</h2>
          <p>Net worth is the single most important number in personal finance. It shows the big picture of your financial health — what you own minus what you owe. A growing net worth means you're building wealth over time.</p>
          <h3>How to Increase Your Net Worth</h3>
          <ul>
            <li>Pay down high-interest debt first (credit cards, personal loans)</li>
            <li>Maximize <a href="/retirement-calculator">retirement contributions</a> for tax-advantaged growth</li>
            <li>Build an emergency fund of 3–6 months of expenses</li>
            <li>Invest consistently with a <a href="/compound-interest-calculator">compound interest strategy</a></li>
            <li>Track your net worth quarterly to stay on course</li>
          </ul>
          <h3>What Is a Good Assets-to-Debt Ratio?</h3>
          <p>Generally, a ratio above 2.0 is considered healthy — meaning you own at least twice as much as you owe. If your ratio is below 1.0, you owe more than you own and should focus on paying down debt with a <a href="/debt-to-income-calculator">debt management plan</a>.</p>
        </section>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="net-worth-calculator" category="Savings" />
      </aside>
    </div>
  )
}
