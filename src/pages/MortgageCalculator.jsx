import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b']

export default function MortgageCalculator() {
  const [inputs, setInputs] = useState({
    homePrice: 350000,
    downPayment: 20,
    loanTerm: 30,
    interestRate: 6.5,
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const principal = inputs.homePrice * (1 - inputs.downPayment / 100)
    const monthlyRate = inputs.interestRate / 100 / 12
    const numPayments = inputs.loanTerm * 12

    const monthlyPayment = monthlyRate > 0
      ? principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
      : principal / numPayments

    const totalPaid = monthlyPayment * numPayments
    const totalInterest = totalPaid - principal
    const downPaymentAmount = inputs.homePrice * inputs.downPayment / 100

    // Amortization schedule
    const schedule = []
    let balance = principal
    for (let year = 1; year <= inputs.loanTerm; year++) {
      let yearInterest = 0
      let yearPrincipal = 0
      for (let month = 0; month < 12; month++) {
        const interestPayment = balance * monthlyRate
        const principalPayment = monthlyPayment - interestPayment
        yearInterest += interestPayment
        yearPrincipal += principalPayment
        balance -= principalPayment
      }
      schedule.push({
        year,
        principal: Math.round(yearPrincipal),
        interest: Math.round(yearInterest),
        balance: Math.max(0, Math.round(balance)),
      })
    }

    setResults({
      monthlyPayment,
      totalPaid,
      totalInterest,
      principal,
      downPaymentAmount,
      schedule,
      pieData: [
        { name: 'Principal', value: Math.round(principal) },
        { name: 'Interest', value: Math.round(totalInterest) },
        { name: 'Down Payment', value: Math.round(downPaymentAmount) },
      ],
    })
  }

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Mortgage Calculator',
    url: 'https://financecalc.app/mortgage-calculator',
    description: 'Free mortgage calculator — calculate monthly payments, total interest, and view amortization schedule.',
    applicationCategory: 'FinanceApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title="Mortgage Calculator — Monthly Payment & Amortization"
          description="Free mortgage calculator. Calculate your monthly mortgage payment, total interest paid, and view a full amortization schedule. Compare 15, 20, and 30-year terms."
          canonical="/mortgage-calculator"
          jsonLd={jsonLd}
        />
        <Breadcrumb items={[{ label: 'Mortgage Calculator' }]} />

        <div className="calc-header">
          <h1>Mortgage Calculator</h1>
          <p>Estimate your monthly mortgage payment and total cost of homeownership.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Home Price</label>
                <input type="number" className="form-input" value={inputs.homePrice}
                  onChange={e => handleChange('homePrice', e.target.value)} placeholder="350,000" />
              </div>
              <div className="form-group">
                <label>Down Payment (%)</label>
                <input type="number" className="form-input" value={inputs.downPayment}
                  onChange={e => handleChange('downPayment', e.target.value)} min="0" max="100" />
                <input type="range" className="range-slider" min="0" max="50" step="1"
                  value={inputs.downPayment} onChange={e => handleChange('downPayment', e.target.value)} />
                <div className="slider-labels"><span>0%</span><span>50%</span></div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Loan Term (Years)</label>
                <select className="form-select" value={inputs.loanTerm}
                  onChange={e => handleChange('loanTerm', e.target.value)}>
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>
              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input type="number" className="form-input" value={inputs.interestRate}
                  onChange={e => handleChange('interestRate', e.target.value)} step="0.1" />
                <input type="range" className="range-slider" min="1" max="15" step="0.1"
                  value={inputs.interestRate} onChange={e => handleChange('interestRate', e.target.value)} />
                <div className="slider-labels"><span>1%</span><span>15%</span></div>
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Mortgage</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Monthly Payment</div>
                <div className="result-value accent">{formatCurrency(results.monthlyPayment)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Interest</div>
                <div className="result-value gold">{formatCurrency(results.totalInterest)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Cost</div>
                <div className="result-value">{formatCurrency(results.totalPaid + results.downPaymentAmount)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Loan Amount</div>
                <div className="result-value">{formatCurrency(results.principal)}</div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="chart-container">
              <h3>Cost Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={results.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={110}
                    paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {results.pieData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Amortization Chart */}
            <div className="chart-container">
              <h3>Amortization Schedule</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={results.schedule}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="principal" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Principal" />
                  <Area type="monotone" dataKey="interest" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} name="Interest" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <AdSlot size="mobile-banner" />
          </div>
        )}

        {/* SEO content */}
        <section className="seo-content">
          <h2>How Our Mortgage Calculator Works</h2>
          <p>
            Our free mortgage calculator uses the standard amortization formula to compute your monthly payment:
            <strong> M = P[r(1+r)ⁿ]/[(1+r)ⁿ – 1]</strong>, where P is the loan principal, r is the monthly interest rate,
            and n is the total number of payments.
          </p>
          <h3>Understanding Your Mortgage Payment</h3>
          <p>
            Your monthly mortgage payment consists of principal and interest. In the early years, a larger portion goes toward interest.
            As the loan matures, more of your payment goes toward reducing the principal balance.
          </p>
          <h3>Tips to Lower Your Mortgage Payment</h3>
          <ul>
            <li>Increase your down payment to reduce the loan amount</li>
            <li>Shop for lower interest rates from multiple lenders</li>
            <li>Consider a 15-year term for lower total interest (higher monthly payment)</li>
            <li>Make extra payments toward principal to pay off faster</li>
          </ul>
        </section>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="mortgage-calculator" category="Loans" />
      </aside>
    </div>
  )
}
