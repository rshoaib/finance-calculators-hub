"use client"
import { useState, useCallback, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

const DEFAULT_DEBTS = [
  { id: 1, name: 'Credit Card', balance: 5000, apr: 22.99, minPayment: 100 },
  { id: 2, name: 'Car Loan', balance: 12000, apr: 6.5, minPayment: 250 },
  { id: 3, name: 'Student Loan', balance: 8000, apr: 5.5, minPayment: 150 },
]

let nextId = 4

export default function DebtPayoffCalculator() {
  const [debts, setDebts] = useState(DEFAULT_DEBTS)
  const [extraPayment, setExtraPayment] = useState(200)
  const [strategy, setStrategy] = useState('avalanche')
  const [results, setResults] = useState(null)

  const addDebt = () => {
    setDebts(prev => [...prev, { id: nextId++, name: '', balance: 0, apr: 0, minPayment: 0 }])
  }

  const removeDebt = (id) => {
    if (debts.length <= 1) return
    setDebts(prev => prev.filter(d => d.id !== id))
  }

  const updateDebt = (id, field, value) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, [field]: field === 'name' ? value : (parseFloat(value) || 0) } : d))
  }

  const simulatePayoff = (debtList, extra, mode) => {
    // Deep‑copy debts
    let active = debtList.map(d => ({ ...d, remaining: d.balance, totalInterest: 0, paidOff: false, paidOffMonth: 0 }))
    const chartData = [{ month: 0, total: active.reduce((s, d) => s + d.remaining, 0) }]
    let month = 0
    let totalInterest = 0

    while (active.some(d => !d.paidOff) && month < 600) {
      month++
      let extraLeft = extra

      // Accrue interest
      for (const d of active) {
        if (d.paidOff) continue
        const interest = d.remaining * (d.apr / 100 / 12)
        d.remaining += interest
        d.totalInterest += interest
        totalInterest += interest
      }

      // Apply minimum payments
      for (const d of active) {
        if (d.paidOff) continue
        const pay = Math.min(d.minPayment, d.remaining)
        d.remaining -= pay
        if (d.remaining <= 0.01) { d.remaining = 0; d.paidOff = true; d.paidOffMonth = month; extraLeft += d.minPayment }
      }

      // Sort for strategy priority
      const unpaid = active.filter(d => !d.paidOff)
      if (mode === 'avalanche') unpaid.sort((a, b) => b.apr - a.apr)
      else if (mode === 'snowball') unpaid.sort((a, b) => a.remaining - b.remaining)

      // Apply extra payment to priority debt(s)
      for (const d of unpaid) {
        if (extraLeft <= 0) break
        const pay = Math.min(extraLeft, d.remaining)
        d.remaining -= pay
        extraLeft -= pay
        if (d.remaining <= 0.01) { d.remaining = 0; d.paidOff = true; d.paidOffMonth = month }
      }

      chartData.push({ month, total: Math.round(active.reduce((s, d) => s + d.remaining, 0)) })
    }

    return { months: month, totalInterest, chartData, order: active.map(d => ({ name: d.name || 'Debt', paidOffMonth: d.paidOffMonth, totalInterest: d.totalInterest })) }
  }

  const calculate = useCallback(() => {
    const validDebts = debts.filter(d => d.balance > 0)
    if (validDebts.length === 0) return

    const avalanche = simulatePayoff(validDebts, extraPayment, 'avalanche')
    const snowball = simulatePayoff(validDebts, extraPayment, 'snowball')
    const minOnly = simulatePayoff(validDebts, 0, 'avalanche')

    // Merge chart data for overlay
    const maxLen = Math.max(avalanche.chartData.length, snowball.chartData.length, minOnly.chartData.length)
    const merged = []
    for (let i = 0; i < maxLen; i++) {
      merged.push({
        month: i,
        avalanche: avalanche.chartData[i]?.total ?? 0,
        snowball: snowball.chartData[i]?.total ?? 0,
        minimum: minOnly.chartData[i]?.total ?? 0,
      })
    }
    // Thin out chart data for performance
    const thin = merged.filter((_, i) => i % Math.max(1, Math.floor(merged.length / 40)) === 0 || i === merged.length - 1)

    const totalDebt = validDebts.reduce((s, d) => s + d.balance, 0)

    setResults({
      avalanche, snowball, minOnly, totalDebt,
      chartData: thin,
      interestSavedAvalanche: minOnly.totalInterest - avalanche.totalInterest,
      interestSavedSnowball: minOnly.totalInterest - snowball.totalInterest,
    })
  }, [debts, extraPayment])

  useEffect(() => { calculate() }, [calculate])

  const active = results ? (strategy === 'avalanche' ? results.avalanche : results.snowball) : null

  const faqs = [
    { question: 'What is the debt avalanche method?', answer: 'The debt avalanche method prioritizes paying off debts with the highest interest rate first while making minimum payments on all others. Once the highest-rate debt is eliminated, its payment is redirected to the next-highest. This approach minimizes total interest paid and is the mathematically optimal strategy.' },
    { question: 'What is the debt snowball method?', answer: 'The debt snowball method focuses on paying off the smallest balance first, regardless of interest rate. The psychological wins of eliminating debts quickly can build momentum and motivation. While you may pay slightly more interest compared to avalanche, the behavioral benefits make it effective for many people.' },
    { question: 'How much extra should I pay toward debt each month?', answer: 'Any extra amount helps, but a good target is at least 20% of your take-home pay toward debt repayment (including minimums). Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings/debt. Even an extra $100/month can save thousands in interest and cut years off your payoff timeline.' },
    { question: 'Should I save or pay off debt first?', answer: 'Financial experts recommend a balanced approach: 1) Build a small emergency fund ($1,000) first to avoid going deeper into debt for unexpected expenses. 2) Aggressively pay down high-interest debt (above 7-8% APR). 3) Once high-interest debt is gone, balance saving and investing with paying off lower-rate debt.' },
    { question: 'Does paying off debt improve my credit score?', answer: 'Yes. Paying off debt reduces your credit utilization ratio, which accounts for 30% of your FICO score. Going from 80% utilization to 10% can boost your score by 50-100 points. Additionally, on-time payments (35% of your score) build a strong payment history. The combination of lower utilization and consistent payments is one of the fastest ways to improve credit.' },
  ]

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Debt Payoff Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
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
        <Breadcrumb items={[{ label: 'Debt Payoff Calculator' }]} />

        <div className="calc-header">
          <h1>Debt Payoff Calculator</h1>
          <p>Enter your debts, choose a strategy, and see how fast you can become debt-free.</p>
        </div>

        {/* ─── DEBT INPUT TABLE ─── */}
        <div className="card">
          <div className="calc-form">
            <h3 style={{ marginTop: 0 }}>Your Debts</h3>
            <div className="debt-table-wrap">
              <table className="debt-table" id="debt-input-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Balance</th>
                    <th>APR %</th>
                    <th>Min Payment</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {debts.map(d => (
                    <tr key={d.id}>
                      <td><input type="text" className="form-input" value={d.name} onChange={e => updateDebt(d.id, 'name', e.target.value)} placeholder="e.g. Visa" /></td>
                      <td><input type="number" className="form-input" value={d.balance} onChange={e => updateDebt(d.id, 'balance', e.target.value)} /></td>
                      <td><input type="number" className="form-input" value={d.apr} onChange={e => updateDebt(d.id, 'apr', e.target.value)} step="0.01" /></td>
                      <td><input type="number" className="form-input" value={d.minPayment} onChange={e => updateDebt(d.id, 'minPayment', e.target.value)} /></td>
                      <td><button className="btn-remove" onClick={() => removeDebt(d.id)} title="Remove debt" aria-label="Remove debt">&times;</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn-add" onClick={addDebt} id="add-debt-btn">+ Add Debt</button>

            <div className="form-row" style={{ marginTop: '1.25rem' }}>
              <div className="form-group">
                <label>Extra Monthly Payment</label>
                <input type="number" className="form-input" value={extraPayment} onChange={e => setExtraPayment(parseFloat(e.target.value) || 0)} id="extra-payment-input" />
              </div>
              <div className="form-group">
                <label>Payoff Strategy</label>
                <div className="strategy-toggle" id="strategy-toggle">
                  <button className={`strategy-btn${strategy === 'avalanche' ? ' active' : ''}`} onClick={() => setStrategy('avalanche')}>🏔️ Avalanche</button>
                  <button className={`strategy-btn${strategy === 'snowball' ? ' active' : ''}`} onClick={() => setStrategy('snowball')}>⛄ Snowball</button>
                </div>
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate} id="calculate-btn">Calculate Payoff Plan</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {/* ─── RESULTS ─── */}
        {results && (
          <div className="results-panel">
            {/* Summary Cards */}
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Debt-Free In</div>
                <div className="result-value accent">{Math.floor(active.months / 12)}y {active.months % 12}m</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Interest</div>
                <div className="result-value gold">{formatCurrency(active.totalInterest)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Interest Saved</div>
                <div className="result-value" style={{ color: '#10b981' }}>{formatCurrency(strategy === 'avalanche' ? results.interestSavedAvalanche : results.interestSavedSnowball)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Debt</div>
                <div className="result-value">{formatCurrency(results.totalDebt)}</div>
              </div>
            </div>

            {/* Strategy Comparison Table */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ marginTop: 0 }}>Strategy Comparison</h3>
              <div className="debt-table-wrap">
                <table className="debt-table comparison-table">
                  <thead>
                    <tr><th></th><th>🏔️ Avalanche</th><th>⛄ Snowball</th><th>Minimum Only</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Payoff Time</strong></td>
                      <td>{Math.floor(results.avalanche.months / 12)}y {results.avalanche.months % 12}m</td>
                      <td>{Math.floor(results.snowball.months / 12)}y {results.snowball.months % 12}m</td>
                      <td style={{ color: '#ef4444' }}>{Math.floor(results.minOnly.months / 12)}y {results.minOnly.months % 12}m</td>
                    </tr>
                    <tr>
                      <td><strong>Total Interest</strong></td>
                      <td>{formatCurrency(results.avalanche.totalInterest)}</td>
                      <td>{formatCurrency(results.snowball.totalInterest)}</td>
                      <td style={{ color: '#ef4444' }}>{formatCurrency(results.minOnly.totalInterest)}</td>
                    </tr>
                    <tr>
                      <td><strong>Interest Saved</strong></td>
                      <td style={{ color: '#10b981' }}>{formatCurrency(results.interestSavedAvalanche)}</td>
                      <td style={{ color: '#10b981' }}>{formatCurrency(results.interestSavedSnowball)}</td>
                      <td>—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chart */}
            <div className="chart-container">
              <h3>Total Remaining Debt Over Time</h3>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={results.chartData}>
                  <defs>
                    <linearGradient id="gradAvalanche" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradSnowball" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradMin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Area type="monotone" dataKey="minimum" stroke="#ef4444" fill="url(#gradMin)" strokeWidth={2} name="Minimum Only" />
                  <Area type="monotone" dataKey="snowball" stroke="#6366f1" fill="url(#gradSnowball)" strokeWidth={2} name="Snowball" />
                  <Area type="monotone" dataKey="avalanche" stroke="#10b981" fill="url(#gradAvalanche)" strokeWidth={2} name="Avalanche" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Payoff Order */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ marginTop: 0 }}>Payoff Order ({strategy === 'avalanche' ? '🏔️ Avalanche' : '⛄ Snowball'})</h3>
              <div className="payoff-order">
                {active.order
                  .slice()
                  .sort((a, b) => a.paidOffMonth - b.paidOffMonth)
                  .map((d, i) => (
                    <div className="payoff-step" key={i}>
                      <div className="payoff-step-num">{i + 1}</div>
                      <div className="payoff-step-info">
                        <strong>{d.name}</strong>
                        <span>Paid off in month {d.paidOffMonth} · {formatCurrency(d.totalInterest)} interest</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <AdSlot size="mobile-banner" />
          </div>
        )}

        {/* ─── SEO CONTENT ─── */}
        <section className="seo-content">
          <h2>How Debt Payoff Strategies Work</h2>
          <p>
            Americans carry over <strong>$1.14 trillion</strong> in credit card debt alone. Add student loans, car loans, and
            personal loans, and the average household debt exceeds $100,000. Two proven strategies — the <strong>avalanche
            method</strong> and <strong>snowball method</strong> — help you systematically eliminate debt faster than making
            minimum payments alone. Both methods use the same core idea: once you pay off one debt, you redirect that payment
            to the next debt, creating a powerful snowball effect.
          </p>

          <h3>Avalanche vs Snowball: Which Is Better?</h3>
          <p>
            <strong>Avalanche (highest interest first):</strong> Saves the most money mathematically. You focus extra payments
            on the debt with the highest APR, minimizing total interest paid. Best for analytical thinkers who are motivated by
            numbers and long-term savings.
          </p>
          <p>
            <strong>Snowball (smallest balance first):</strong> Provides the fastest psychological wins. By eliminating small
            debts quickly, you build momentum and confidence. Research by Harvard Business Review found that people who focus
            on small balances are more likely to stick with their repayment plan.
          </p>

          <h3>Worked Example</h3>
          <p><strong>Three debts:</strong></p>
          <ul>
            <li>Credit Card: <strong>$5,000</strong> at <strong>22.99% APR</strong>, $100/mo minimum</li>
            <li>Car Loan: <strong>$12,000</strong> at <strong>6.5% APR</strong>, $250/mo minimum</li>
            <li>Student Loan: <strong>$8,000</strong> at <strong>5.5% APR</strong>, $150/mo minimum</li>
          </ul>
          <p>With <strong>$200 extra per month</strong>:</p>
          <ul>
            <li><strong>Avalanche:</strong> Debt-free in ~3 years, saving the most interest by targeting the 22.99% credit card first</li>
            <li><strong>Snowball:</strong> Also debt-free in ~3 years, but pays slightly more interest by targeting the $5,000 credit card first (which happens to be both smallest and highest rate in this example)</li>
            <li><strong>Minimum payments only:</strong> Takes 5+ years and costs thousands more in interest</li>
          </ul>

          <h3>Tips to Pay Off Debt Faster</h3>
          <ul>
            <li><strong>Automate payments</strong> to avoid late fees and stay consistent</li>
            <li><strong>Use windfalls</strong> (tax refunds, bonuses) as lump-sum debt payments</li>
            <li><strong>Negotiate lower rates</strong> — a simple phone call can reduce credit card APR by 3-6 points</li>
            <li><strong>Consider balance transfers</strong> to a 0% intro APR card for high-interest debt</li>
            <li><strong>Avoid new debt</strong> — switch to cash or debit while repaying</li>
            <li><strong>Track progress visually</strong> — seeing the chart go down is powerful motivation</li>
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
        <RelatedCalculators currentSlug="debt-payoff-calculator" category="Loans" />
      </aside>
    </div>
  )
}
