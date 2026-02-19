import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency, formatPercent } from '../utils/formatters'

export default function InflationCalculator() {
  const [inputs, setInputs] = useState({
    amount: 100000,
    rate: 3.5,
    years: 20,
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const { amount, rate, years } = inputs
    const r = rate / 100
    const chartData = []

    for (let y = 0; y <= years; y++) {
      const futureNominal = amount
      const purchasingPower = amount / Math.pow(1 + r, y)
      chartData.push({
        year: y,
        label: `Year ${y}`,
        nominal: Math.round(futureNominal),
        realValue: Math.round(purchasingPower),
      })
    }

    const futureValue = amount * Math.pow(1 + r, years)
    const purchasingPowerLoss = amount - (amount / Math.pow(1 + r, years))
    const realValue = amount / Math.pow(1 + r, years)
    const lossPercent = (purchasingPowerLoss / amount) * 100

    setResults({ futureValue, purchasingPowerLoss, realValue, lossPercent, chartData })
  }

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'What is inflation?', answer: 'Inflation is the rate at which the general level of prices for goods and services rises over time, reducing the purchasing power of your money. It is measured by tracking the Consumer Price Index (CPI), which monitors the average price change of a basket of consumer goods and services.' },
    { question: 'What is a good inflation rate?', answer: 'Most central banks, including the Federal Reserve, target an annual inflation rate of about 2%. This level is considered healthy for economic growth — enough to encourage spending and investment without rapidly eroding purchasing power. Sustained rates above 4-5% are generally considered problematic.' },
    { question: 'How does inflation affect my savings?', answer: 'If your savings earn less interest than the inflation rate, your money loses real purchasing power over time. For example, $100,000 in a 1% savings account loses about 2% of its buying power annually when inflation is 3%. This is why investing in assets that outpace inflation is essential for long-term wealth preservation.' },
    { question: 'What is the difference between real and nominal returns?', answer: 'Nominal return is the raw percentage gain on your investment. Real return adjusts for inflation: Real Return ≈ Nominal Return − Inflation Rate. A 10% nominal return with 3% inflation gives only about 6.8% real return. Always evaluate investments using real returns for accurate purchasing power comparisons.' },
    { question: 'How can I protect my money from inflation?', answer: 'Key strategies include: investing in stocks (historically 7-10% annual returns), real estate, Treasury Inflation-Protected Securities (TIPS), I Bonds, and commodities. Avoid holding too much cash or low-yield savings accounts. Diversification across inflation-resistant asset classes is the most effective protection.' },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Inflation Calculator',
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
          title="Inflation Calculator — Purchasing Power Over Time"
          description="Free inflation calculator. See how inflation erodes your purchasing power over time and what your money will really be worth in the future."
          canonical="/inflation-calculator"
          jsonLd={jsonLd}
        />
        <Breadcrumb items={[{ label: 'Inflation Calculator' }]} />

        <div className="calc-header">
          <h1>Inflation Calculator</h1>
          <p>See how inflation erodes the purchasing power of your money over time.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Current Amount ($)</label>
                <input type="number" className="form-input" value={inputs.amount} onChange={e => handleChange('amount', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Annual Inflation Rate (%)</label>
                <input type="number" className="form-input" step="0.1" value={inputs.rate} onChange={e => handleChange('rate', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Time Period (years)</label>
                <input type="number" className="form-input" value={inputs.years} onChange={e => handleChange('years', e.target.value)} />
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Inflation Impact</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Purchasing Power Lost</div>
                <div className="result-value accent" style={{ color: '#ef4444' }}>{formatCurrency(results.purchasingPowerLoss)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Real Value in {inputs.years} Years</div>
                <div className="result-value gold">{formatCurrency(results.realValue)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">You'd Need</div>
                <div className="result-value" style={{ color: '#10b981' }}>{formatCurrency(results.futureValue)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Value Lost</div>
                <div className="result-value" style={{ color: '#f97316' }}>{formatPercent(results.lossPercent)}</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Purchasing Power Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickFormatter={v => `Yr ${v}`} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="nominal" name="Nominal Value" stroke="#3b82f6" fill="rgba(59,130,246,0.15)" strokeWidth={2} />
                  <Area type="monotone" dataKey="realValue" name="Real Value" stroke="#ef4444" fill="rgba(239,68,68,0.15)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>What Is Inflation and Why Does It Matter?</h2>
          <p>
            Inflation is the sustained increase in the general price level of goods and services in an economy over time.
            As prices rise, each unit of currency buys fewer items — this decline in purchasing power is often called the
            "silent tax" because it erodes your wealth without a visible deduction. The Consumer Price Index (CPI),
            published monthly by the Bureau of Labor Statistics, is the most widely used measure of inflation in the United States.
          </p>

          <h3>The Inflation Formula</h3>
          <p>
            To calculate the future cost of goods: <strong>Future Price = Current Price × (1 + r)<sup>t</sup></strong>,
            where r is the annual inflation rate and t is the number of years. Conversely, to find today's purchasing
            power: <strong>Real Value = Amount / (1 + r)<sup>t</sup></strong>.
          </p>

          <h3>Worked Example</h3>
          <p>
            With <strong>$100,000 today</strong> and an average inflation rate of <strong>3.5%</strong> over <strong>20 years</strong>:
          </p>
          <ul>
            <li>Your $100,000 will only buy what <strong>$50,257</strong> buys today — losing nearly half its purchasing power</li>
            <li>To maintain the same buying power, you'd need <strong>$198,979</strong> in 20 years</li>
            <li>Purchasing power lost: <strong>$49,743</strong> (49.7% erosion)</li>
            <li>At 2% inflation, you'd retain <strong>$67,297</strong> in purchasing power instead — a massive difference</li>
          </ul>

          <h3>Key Inflation Terms</h3>
          <dl>
            <dt><strong>CPI (Consumer Price Index)</strong></dt>
            <dd>A measure tracking the average price change of a basket of consumer goods and services. The primary U.S. inflation indicator.</dd>
            <dt><strong>Purchasing Power</strong></dt>
            <dd>The quantity of goods and services a unit of currency can buy. Inflation reduces purchasing power over time.</dd>
            <dt><strong>Real vs Nominal Value</strong></dt>
            <dd>Nominal value is the face amount; real value adjusts for inflation. A salary of $50K in 2005 is nominally less than $60K in 2025, but may have equal or greater real value.</dd>
            <dt><strong>Stagflation</strong></dt>
            <dd>A dangerous combination of high inflation, slow economic growth, and rising unemployment. Occurred notably in the 1970s.</dd>
            <dt><strong>Hyperinflation</strong></dt>
            <dd>Extremely rapid inflation (50%+ per month), causing currency to become nearly worthless. Historical examples include Zimbabwe (2008) and Venezuela (2018).</dd>
          </dl>

          <h3>Strategies to Beat Inflation</h3>
          <ul>
            <li><strong>Invest in equities:</strong> Stocks have historically returned 7-10% annually, significantly outpacing inflation</li>
            <li><strong>Consider TIPS:</strong> Treasury Inflation-Protected Securities adjust principal with CPI changes</li>
            <li><strong>Buy I Bonds:</strong> U.S. savings bonds with interest rates that adjust with inflation, up to $10,000/year</li>
            <li><strong>Invest in real estate:</strong> Property values and rental income tend to rise with inflation</li>
            <li><strong>Review investments annually:</strong> Ensure your portfolio's <a href="/investment-return-calculator">real returns</a> exceed inflation</li>
          </ul>

          <h3>Historical Inflation Rates</h3>
          <p>
            The U.S. average annual inflation rate has been about 3.3% since 1913. Recent years (2021–2023) saw rates
            above 6%, making inflation planning more critical than ever for <a href="/retirement-calculator">retirement savers</a>
            and long-term investors.
          </p>

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
        <RelatedCalculators currentSlug="inflation-calculator" category="Investment" />
      </aside>
    </div>
  )
}

