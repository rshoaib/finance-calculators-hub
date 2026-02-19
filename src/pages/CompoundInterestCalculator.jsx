import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

export default function CompoundInterestCalculator() {
  const [inputs, setInputs] = useState({
    principal: 10000,
    monthlyContribution: 500,
    interestRate: 7,
    years: 20,
    compounding: 12,
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const { principal, monthlyContribution, interestRate, years, compounding } = inputs
    const r = interestRate / 100
    const n = compounding
    const t = years

    // Future value of principal
    const fvPrincipal = principal * Math.pow(1 + r / n, n * t)

    // Future value of annuity (monthly contributions)
    const ratePerPeriod = r / 12
    const totalMonths = t * 12
    const fvContributions = monthlyContribution * ((Math.pow(1 + ratePerPeriod, totalMonths) - 1) / ratePerPeriod)

    const futureValue = fvPrincipal + fvContributions
    const totalContributions = principal + monthlyContribution * totalMonths
    const totalInterest = futureValue - totalContributions

    // Chart data
    const chartData = []
    for (let year = 0; year <= years; year++) {
      const fvP = principal * Math.pow(1 + r / n, n * year)
      const months = year * 12
      const fvC = months > 0 ? monthlyContribution * ((Math.pow(1 + ratePerPeriod, months) - 1) / ratePerPeriod) : 0
      const totalContrib = principal + monthlyContribution * months
      chartData.push({
        year,
        total: Math.round(fvP + fvC),
        contributions: Math.round(totalContrib),
        interest: Math.round(fvP + fvC - totalContrib),
      })
    }

    setResults({ futureValue, totalContributions, totalInterest, chartData })
  }

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'What is compound interest?', answer: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest, which is only calculated on the principal, compound interest grows exponentially over time because you earn "interest on your interest."' },
    { question: 'How does compounding frequency affect returns?', answer: 'The more frequently interest compounds (daily vs. monthly vs. annually), the more total interest you earn. Daily compounding yields slightly more than annual compounding because interest is calculated and added to the principal more often, giving you a marginally higher effective annual rate (EAR).' },
    { question: 'What is the Rule of 72?', answer: 'The Rule of 72 is a quick mental math shortcut to estimate how long it takes to double your investment. Divide 72 by your annual interest rate. For example, at 8% returns, your money doubles in approximately 9 years (72 ÷ 8 = 9). This rule works best for rates between 4% and 12%.' },
    { question: 'What is the difference between APR and APY?', answer: 'APR (Annual Percentage Rate) is the stated annual rate without accounting for compounding. APY (Annual Percentage Yield) includes the effect of compounding and represents the actual return you earn in a year. A 6% APR compounded monthly has an APY of about 6.17%.' },
    { question: 'How much should I invest monthly to reach $1 million?', answer: 'At a 7% average annual return, investing approximately $850 per month will grow to about $1 million in 30 years. Starting earlier dramatically reduces the required monthly amount — at age 25, you need less than half what a 35-year-old needs.' },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Compound Interest Calculator',
      url: 'https://mycalcfinance.com/compound-interest-calculator',
      description: 'Free compound interest calculator with monthly contributions and growth projections.',
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
        <SEO
          title="Compound Interest Calculator — Investment Growth"
          description="Free compound interest calculator. See how your investments grow with compound interest and regular monthly contributions. Visualize growth over time."
          canonical="/compound-interest-calculator"
          jsonLd={jsonLd}
        />
        <Breadcrumb items={[{ label: 'Compound Interest Calculator' }]} />

        <div className="calc-header">
          <h1>Compound Interest Calculator</h1>
          <p>See the power of compound interest and how regular contributions accelerate your wealth.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Initial Investment</label>
                <input type="number" className="form-input" value={inputs.principal}
                  onChange={e => handleChange('principal', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Monthly Contribution</label>
                <input type="number" className="form-input" value={inputs.monthlyContribution}
                  onChange={e => handleChange('monthlyContribution', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Annual Interest Rate (%)</label>
                <input type="number" className="form-input" value={inputs.interestRate}
                  onChange={e => handleChange('interestRate', e.target.value)} step="0.1" />
                <input type="range" className="range-slider" min="1" max="20" step="0.1"
                  value={inputs.interestRate} onChange={e => handleChange('interestRate', e.target.value)} />
                <div className="slider-labels"><span>1%</span><span>20%</span></div>
              </div>
              <div className="form-group">
                <label>Time Period (Years)</label>
                <input type="number" className="form-input" value={inputs.years}
                  onChange={e => handleChange('years', e.target.value)} />
                <input type="range" className="range-slider" min="1" max="50" step="1"
                  value={inputs.years} onChange={e => handleChange('years', e.target.value)} />
                <div className="slider-labels"><span>1yr</span><span>50yr</span></div>
              </div>
            </div>
            <div className="form-group">
              <label>Compounding Frequency</label>
              <select className="form-select" value={inputs.compounding}
                onChange={e => handleChange('compounding', e.target.value)}>
                <option value={1}>Annually</option>
                <option value={4}>Quarterly</option>
                <option value={12}>Monthly</option>
                <option value={365}>Daily</option>
              </select>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Growth</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Future Value</div>
                <div className="result-value accent">{formatCurrency(results.futureValue)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Contributions</div>
                <div className="result-value">{formatCurrency(results.totalContributions)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Interest Earned</div>
                <div className="result-value gold">{formatCurrency(results.totalInterest)}</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Investment Growth Over Time</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="contributions" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} name="Contributions" />
                  <Area type="monotone" dataKey="interest" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Interest" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>What Is Compound Interest?</h2>
          <p>
            Compound interest is the process of earning interest on both your initial principal and on the accumulated interest
            from previous periods. Unlike simple interest, which calculates interest only on the original deposit, compound
            interest creates exponential growth — often called the "eighth wonder of the world." The concept of the
            time value of money is built on compounding: a dollar today is worth more than a dollar tomorrow because it can
            earn interest immediately.
          </p>

          <h3>The Compound Interest Formula</h3>
          <p>
            The standard compound interest formula is: <strong>FV = P × (1 + r/n)<sup>nt</sup></strong>, where:
          </p>
          <ul>
            <li><strong>P</strong> = Principal (initial investment amount)</li>
            <li><strong>r</strong> = Annual interest rate (as a decimal)</li>
            <li><strong>n</strong> = Compounding frequency (e.g., 12 for monthly, 365 for daily)</li>
            <li><strong>t</strong> = Time period in years</li>
            <li><strong>FV</strong> = Future value (maturity value)</li>
          </ul>
          <p>
            For investments with regular monthly contributions, the future value of the annuity is added:
            <strong> FV<sub>annuity</sub> = C × [(1 + r/12)<sup>12t</sup> – 1] / (r/12)</strong>, where C is the monthly
            contribution amount.
          </p>

          <h3>Worked Example</h3>
          <p>
            Suppose you invest <strong>$10,000</strong> at <strong>7% annual return</strong>, compounded monthly, with
            <strong> $500 monthly contributions</strong> for <strong>20 years</strong>:
          </p>
          <ul>
            <li>Future value of principal: $10,000 × (1 + 0.07/12)<sup>240</sup> = <strong>$40,387</strong></li>
            <li>Future value of contributions: $500 × [(1.00583)<sup>240</sup> – 1] / 0.00583 = <strong>$260,464</strong></li>
            <li>Total future value: <strong>$300,851</strong></li>
            <li>Total contributions: $10,000 + ($500 × 240) = <strong>$130,000</strong></li>
            <li>Interest earned: <strong>$170,851</strong> — more than your total contributions!</li>
          </ul>

          <h3>Key Terms</h3>
          <dl>
            <dt><strong>Principal</strong></dt>
            <dd>The initial amount of money invested or deposited before earning interest.</dd>
            <dt><strong>Compounding Frequency</strong></dt>
            <dd>How often interest is calculated and added to the balance — annually, quarterly, monthly, or daily.</dd>
            <dt><strong>APR vs APY</strong></dt>
            <dd>APR is the stated annual rate; APY (Annual Percentage Yield) reflects the actual return after accounting for compounding. A 6% APR compounded monthly equals a 6.17% APY.</dd>
            <dt><strong>Rule of 72</strong></dt>
            <dd>A quick estimate for doubling time: divide 72 by your annual interest rate. At 8%, money doubles in about 9 years.</dd>
            <dt><strong>CAGR</strong></dt>
            <dd>Compound Annual Growth Rate — the smoothed annual return that accounts for compounding over multiple years.</dd>
          </dl>

          <h3>Compounding Strategies to Grow Your Wealth</h3>
          <ul>
            <li><strong>Start early:</strong> 10 extra years of compounding can more than double your final portfolio value</li>
            <li><strong>Increase contributions gradually:</strong> Boosting your monthly deposit by just 1% each year accelerates growth significantly</li>
            <li><strong>Reinvest dividends:</strong> Automatically reinvesting dividends compounds your returns faster than taking them as cash</li>
            <li><strong>Choose higher compounding frequency:</strong> Daily compounding earns slightly more than annual compounding on the same rate</li>
            <li><strong>Minimize fees:</strong> A 1% annual fee can reduce your final balance by 25% or more over 30 years</li>
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
        <RelatedCalculators currentSlug="compound-interest-calculator" category="Investment" />
      </aside>
    </div>
  )
}
