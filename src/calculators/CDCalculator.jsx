"use client"
import { useState, useCallback, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency, formatPercent } from '../utils/formatters'

const TERM_OPTIONS = [
  { label: '3 Months', months: 3 },
  { label: '6 Months', months: 6 },
  { label: '1 Year', months: 12 },
  { label: '2 Years', months: 24 },
  { label: '3 Years', months: 36 },
  { label: '5 Years', months: 60 },
]

export default function CDCalculator() {
  const [inputs, setInputs] = useState({
    deposit: 10000,
    apy: 4.5,
    termMonths: 12,
    compounding: 12,
  })
  const [results, setResults] = useState(null)

  const calculate = useCallback(() => {
    const { deposit, apy, termMonths, compounding } = inputs
    const t = termMonths / 12 // term in years
    const n = compounding

    // Convert APY to APR: APR = n * [(1 + APY)^(1/n) - 1]
    const apyDecimal = apy / 100
    const apr = n * (Math.pow(1 + apyDecimal, 1 / n) - 1)

    // Maturity value using APR & compounding
    const maturityValue = deposit * Math.pow(1 + apr / n, n * t)
    const interestEarned = maturityValue - deposit

    // Early withdrawal penalty estimate
    // Common bank penalties: < 1yr term = 3 months interest, >= 1yr = 6 months interest
    const penaltyMonths = termMonths < 12 ? 3 : 6
    const monthlyInterest = interestEarned / termMonths
    const earlyWithdrawalPenalty = monthlyInterest * penaltyMonths

    // Chart data — month-by-month growth
    const chartData = []
    for (let month = 0; month <= termMonths; month++) {
      const tM = month / 12
      const value = deposit * Math.pow(1 + apr / n, n * tM)
      chartData.push({
        month,
        value: Math.round(value * 100) / 100,
        interest: Math.round((value - deposit) * 100) / 100,
      })
    }

    // Comparison table — same deposit & APY across all terms
    const comparison = TERM_OPTIONS.map(term => {
      const tC = term.months / 12
      const mv = deposit * Math.pow(1 + apr / n, n * tC)
      return {
        label: term.label,
        months: term.months,
        maturity: mv,
        interest: mv - deposit,
      }
    })

    setResults({
      maturityValue,
      interestEarned,
      apr: apr * 100,
      earlyWithdrawalPenalty,
      penaltyMonths,
      chartData,
      comparison,
    })
  }, [inputs])

  useEffect(() => { calculate() }, [calculate])

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'What is a Certificate of Deposit (CD)?', answer: 'A Certificate of Deposit (CD) is a time-deposit savings product offered by banks and credit unions. You agree to lock your money for a fixed term (e.g., 6 months, 1 year, 5 years) in exchange for a guaranteed interest rate, which is typically higher than a regular savings account. At the end of the term — called the maturity date — you receive your original deposit plus all accrued interest.' },
    { question: 'What is the difference between APY and APR?', answer: 'APY (Annual Percentage Yield) is the effective annual rate of return that accounts for the effect of compounding. APR (Annual Percentage Rate) is the stated annual rate without compounding. For CDs, banks advertise the APY because it reflects the actual return you earn. For example, a 4.50% APY with monthly compounding corresponds to an APR of approximately 4.41%.' },
    { question: 'What happens if I withdraw early from a CD?', answer: 'Most banks charge an early withdrawal penalty (EWP) if you cash out before the maturity date. The penalty is typically measured in months of interest — for example, 3 months of interest for short-term CDs or 6 months for longer terms. Some banks offer no-penalty CDs, but these usually come with lower interest rates.' },
    { question: 'Are CDs FDIC insured?', answer: 'Yes. CDs at FDIC-member banks are insured up to $250,000 per depositor, per bank. Credit union CDs (called "share certificates") are similarly insured by the NCUA. This makes CDs one of the safest savings vehicles available.' },
    { question: 'What is a CD ladder?', answer: 'A CD ladder is a strategy where you divide your deposit across multiple CDs with staggered maturity dates (e.g., 1-year, 2-year, 3-year). As each CD matures, you reinvest it into a new long-term CD. This gives you regular access to your money while still capturing higher long-term rates.' },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'CD Calculator',
      url: 'https://mycalcfinance.com/cd-calculator',
      description: 'Free CD calculator. Calculate certificate of deposit maturity value, compare terms, and estimate early withdrawal penalties.',
      applicationCategory: 'FinanceApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
    },
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
        <Breadcrumb items={[{ label: 'CD Calculator' }]} />

        <div className="calc-header">
          <h1>CD Calculator</h1>
          <p>Calculate your certificate of deposit maturity value, compare terms, and see how compounding affects your returns.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Deposit Amount</label>
                <input type="number" className="form-input" value={inputs.deposit}
                  onChange={e => handleChange('deposit', e.target.value)} />
              </div>
              <div className="form-group">
                <label>APY (%)</label>
                <input type="number" className="form-input" value={inputs.apy}
                  onChange={e => handleChange('apy', e.target.value)} step="0.01" />
                <input type="range" className="range-slider" min="0.5" max="7" step="0.01"
                  value={inputs.apy} onChange={e => handleChange('apy', e.target.value)} />
                <div className="slider-labels"><span>0.5%</span><span>7%</span></div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>CD Term</label>
                <select className="form-select" value={inputs.termMonths}
                  onChange={e => handleChange('termMonths', e.target.value)}>
                  {TERM_OPTIONS.map(opt => (
                    <option key={opt.months} value={opt.months}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Compounding Frequency</label>
                <select className="form-select" value={inputs.compounding}
                  onChange={e => handleChange('compounding', e.target.value)}>
                  <option value={365}>Daily</option>
                  <option value={12}>Monthly</option>
                  <option value={4}>Quarterly</option>
                  <option value={1}>Annually</option>
                </select>
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate CD Returns</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Maturity Value</div>
                <div className="result-value accent">{formatCurrency(results.maturityValue)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Interest Earned</div>
                <div className="result-value gold">{formatCurrency(results.interestEarned)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Effective APR</div>
                <div className="result-value">{formatPercent(results.apr)}</div>
              </div>
            </div>

            <div className="result-card" style={{ marginTop: '1rem' }}>
              <div className="result-label">⚠️ Estimated Early Withdrawal Penalty ({results.penaltyMonths} months interest)</div>
              <div className="result-value" style={{ color: 'var(--red, #ef4444)' }}>{formatCurrency(results.earlyWithdrawalPenalty)}</div>
            </div>

            <div className="chart-container">
              <h3>CD Growth Over Term</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.4} name="CD Value" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container" style={{ marginTop: '1.5rem' }}>
              <h3>Term Comparison — Same Deposit &amp; APY</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Term</th>
                      <th>Maturity Value</th>
                      <th>Interest Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.comparison.map(row => (
                      <tr key={row.months} className={row.months === inputs.termMonths ? 'highlight-row' : ''}>
                        <td>{row.label}</td>
                        <td>{formatCurrency(row.maturity)}</td>
                        <td style={{ color: 'var(--accent, #10b981)' }}>{formatCurrency(row.interest)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>What Is a Certificate of Deposit (CD)?</h2>
          <p>
            A Certificate of Deposit (CD) is a federally insured savings product offered by banks and credit unions.
            When you open a CD, you agree to deposit a fixed amount of money for a set period — called the <strong>term</strong> — in
            exchange for a guaranteed interest rate that's typically higher than a standard savings account. At the end of the
            term (the <strong>maturity date</strong>), you receive your original deposit plus all accumulated interest.
          </p>
          <p>
            CDs are popular among conservative investors because they offer <strong>FDIC-insured, predictable returns</strong> with
            zero market risk. In a high-interest-rate environment, CDs become especially attractive compared to volatile stock
            investments. They're FDIC-insured up to $250,000 per depositor, per bank, making them one of the safest places to
            park your money.
          </p>

          <h3>How CD Interest Is Calculated</h3>
          <p>
            CD interest uses the compound interest formula: <strong>FV = P × (1 + r/n)<sup>nt</sup></strong>, where:
          </p>
          <ul>
            <li><strong>P</strong> = Principal (your initial deposit)</li>
            <li><strong>r</strong> = Annual interest rate (APR, as a decimal)</li>
            <li><strong>n</strong> = Compounding frequency (e.g., 365 for daily, 12 for monthly)</li>
            <li><strong>t</strong> = Term in years</li>
            <li><strong>FV</strong> = Future value (maturity value)</li>
          </ul>
          <p>
            Banks advertise rates as <strong>APY</strong> (Annual Percentage Yield), which already accounts for compounding.
            The actual nominal rate (APR) is slightly lower. For example, a 4.50% APY with daily compounding corresponds to an
            APR of about 4.40%. This calculator converts the advertised APY to APR internally for accurate calculations.
          </p>

          <h3>Worked Example</h3>
          <p>
            Suppose you deposit <strong>$10,000</strong> in a CD paying <strong>4.50% APY</strong>, compounded monthly,
            for <strong>1 year</strong>:
          </p>
          <ul>
            <li>APR equivalent: 4.50% APY ÷ compounding effect ≈ <strong>4.41% APR</strong></li>
            <li>Maturity value: $10,000 × (1 + 0.0441/12)<sup>12</sup> = <strong>$10,450</strong></li>
            <li>Interest earned: <strong>$450</strong></li>
            <li>Early withdrawal penalty (3 months interest): ~<strong>$112</strong></li>
          </ul>

          <h3>CD vs Savings Account</h3>
          <p>
            Both CDs and high-yield savings accounts (HYSAs) are FDIC-insured and pay interest. The key differences:
          </p>
          <ul>
            <li><strong>Interest rate:</strong> CDs typically offer higher rates because you commit to a fixed term. HYSAs have variable rates that can drop.</li>
            <li><strong>Liquidity:</strong> HYSAs allow withdrawals anytime. CDs lock your money; early withdrawals incur penalties.</li>
            <li><strong>Rate lock:</strong> A CD locks in today's rate for the entire term. If rates drop, your CD keeps earning the higher rate.</li>
            <li><strong>Best for:</strong> CDs are ideal for money you won't need for a specific period. HYSAs are better for emergency funds.</li>
          </ul>

          <h3>Key Terms</h3>
          <dl>
            <dt><strong>APY (Annual Percentage Yield)</strong></dt>
            <dd>The effective annual return including compounding. This is the rate banks advertise. A higher compounding frequency produces a higher APY for the same APR.</dd>
            <dt><strong>APR (Annual Percentage Rate)</strong></dt>
            <dd>The nominal annual rate without accounting for compounding. APR is always ≤ APY for the same product.</dd>
            <dt><strong>Maturity Date</strong></dt>
            <dd>The date when the CD term ends. On this date, you can withdraw your principal + interest penalty-free or roll it into a new CD.</dd>
            <dt><strong>Early Withdrawal Penalty (EWP)</strong></dt>
            <dd>A fee charged if you withdraw funds before maturity. Typically measured in months of interest — e.g., 3 months for short CDs, 6 months for longer ones.</dd>
            <dt><strong>CD Ladder</strong></dt>
            <dd>A strategy of splitting your deposit across multiple CDs with staggered terms (1yr, 2yr, 3yr, etc.) to balance higher rates with regular liquidity.</dd>
          </dl>

          <h3>CD Ladder Strategy</h3>
          <ul>
            <li><strong>How it works:</strong> Divide your savings equally across CDs with different maturity dates (e.g., 1-year, 2-year, 3-year, 4-year, 5-year)</li>
            <li><strong>When one matures:</strong> Reinvest into a new 5-year CD at the back of the ladder</li>
            <li><strong>Benefit:</strong> You always have a CD maturing soon (liquidity) while earning the higher rates of long-term CDs</li>
            <li><strong>Best for:</strong> Investors who want higher returns than savings accounts but need periodic access to their funds</li>
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
        <RelatedCalculators currentSlug="cd-calculator" category="Savings" />
      </aside>
    </div>
  )
}
