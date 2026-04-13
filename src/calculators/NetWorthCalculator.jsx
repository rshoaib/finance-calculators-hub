"use client"
import { useState, useCallback, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
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

  const calculate = useCallback(() => {
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
  }, [assets, liabilities])

  useEffect(() => { calculate() }, [calculate])

  const handleAssetChange = (field, value) => {
    setAssets(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const handleLiabilityChange = (field, value) => {
    setLiabilities(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'What is net worth?', answer: 'Net worth is the total value of everything you own (assets) minus everything you owe (liabilities). It provides a comprehensive snapshot of your financial health at a single point in time. A positive net worth means you own more than you owe; a negative net worth means your debts exceed your assets.' },
    { question: 'How often should I calculate my net worth?', answer: 'Financial experts recommend calculating your net worth at least once a quarter (every 3 months) to track trends over time. After major life events — buying a home, paying off debt, receiving an inheritance — recalculate immediately. Consistent tracking reveals whether your financial decisions are moving you in the right direction.' },
    { question: 'What is a good net worth by age?', answer: 'A common rule of thumb (from The Millionaire Next Door) is: Target Net Worth = (Age × Annual Pre-Tax Income) ÷ 10. By age 30, your net worth should roughly equal your annual salary; by 40, twice your salary; by 50, four times; by 60, six to eight times. However, this varies greatly by career stage, location, and personal circumstances.' },
    { question: 'Should I include my primary home in net worth?', answer: 'Yes, include your home at its current fair market value as an asset, and your remaining mortgage balance as a liability. However, some financial planners distinguish between "investable net worth" (excluding your home) and "total net worth" (including it), since you cannot easily liquidate your primary residence.' },
    { question: 'What is the difference between liquid and illiquid assets?', answer: 'Liquid assets (cash, savings, stocks, bonds) can be quickly converted to cash without significant loss of value. Illiquid assets (real estate, business equity, collectibles) take time to sell and may lose value in the process. A healthy net worth includes a solid base of liquid assets for emergencies.' },
  ]

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Net Worth Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) },
  ]

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        
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
          <p>
            Net worth is the single most important number in personal finance. It provides a complete picture
            of your financial health by showing what you own minus what you owe. Unlike income, which measures
            cash flow, net worth measures accumulated wealth. A growing net worth over time means you're
            building lasting financial security — regardless of how much you earn.
          </p>

          <h3>The Net Worth Formula</h3>
          <ul>
            <li><strong>Net Worth</strong> = Total Assets − Total Liabilities</li>
            <li><strong>Assets-to-Debt Ratio</strong> = Total Assets ÷ Total Liabilities</li>
          </ul>

          <h3>Worked Example</h3>
          <p>A 35-year-old with the following financial picture:</p>
          <ul>
            <li><strong>Assets:</strong> $25,000 cash, $80,000 investments, $300,000 home, $45,000 retirement = <strong>$450,000</strong></li>
            <li><strong>Liabilities:</strong> $220,000 mortgage, $15,000 car loan, $8,000 student loans, $3,000 credit cards = <strong>$246,000</strong></li>
            <li><strong>Net worth:</strong> $204,000</li>
            <li><strong>Assets-to-debt ratio:</strong> 1.83 (healthy — above 1.0)</li>
          </ul>

          <h3>Key Net Worth Terms</h3>
          <dl>
            <dt><strong>Liquid Assets</strong></dt>
            <dd>Cash, savings accounts, and investments that can be quickly converted to cash: checking, savings, stocks, bonds, CDs.</dd>
            <dt><strong>Illiquid Assets</strong></dt>
            <dd>Assets that take time to sell or may lose value when sold quickly: real estate, business equity, collectibles, vehicles.</dd>
            <dt><strong>Asset-to-Debt Ratio</strong></dt>
            <dd>A ratio above 2.0 is healthy (you own twice what you owe). Below 1.0 means debts exceed assets. Use your <a href="/debt-to-income-calculator">DTI ratio</a> alongside this metric.</dd>
            <dt><strong>Equity</strong></dt>
            <dd>The portion of an asset you actually own. Home equity = home value − mortgage balance. Building equity increases net worth.</dd>
            <dt><strong>Depreciation</strong></dt>
            <dd>The decline in value of assets over time (cars, electronics). Avoid counting depreciating assets at their purchase price.</dd>
          </dl>

          <h3>Strategies to Grow Your Net Worth</h3>
          <ul>
            <li><strong>Pay down high-interest debt:</strong> <a href="/credit-card-payoff-calculator">Credit cards</a> and personal loans erode wealth fastest</li>
            <li><strong>Maximize retirement contributions:</strong> 401(k), IRA, and HSA accounts grow tax-advantaged via <a href="/compound-interest-calculator">compound interest</a></li>
            <li><strong>Build an emergency fund:</strong> 3-6 months of expenses in a high-yield savings account</li>
            <li><strong>Invest consistently:</strong> Dollar-cost averaging into index funds builds wealth over decades</li>
            <li><strong>Track quarterly:</strong> Regular <a href="/retirement-calculator">retirement planning</a> reviews keep you on course</li>
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
        <RelatedCalculators currentSlug="net-worth-calculator" category="Savings" />
      </aside>
    </div>
  )
}
