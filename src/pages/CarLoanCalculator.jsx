import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b']

export default function CarLoanCalculator() {
  const [inputs, setInputs] = useState({
    vehiclePrice: 35000,
    downPayment: 5000,
    tradeIn: 0,
    loanTerm: 60,
    interestRate: 5.5,
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const { vehiclePrice, downPayment, tradeIn, loanTerm, interestRate } = inputs
    const principal = vehiclePrice - downPayment - tradeIn
    if (principal <= 0) return

    const monthlyRate = interestRate / 100 / 12
    const monthlyPayment = monthlyRate > 0
      ? principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1)
      : principal / loanTerm

    const totalPaid = monthlyPayment * loanTerm
    const totalInterest = totalPaid - principal
    const totalCost = totalPaid + downPayment + tradeIn

    setResults({
      monthlyPayment,
      totalPaid,
      totalInterest,
      totalCost,
      principal,
      pieData: [
        { name: 'Loan Principal', value: Math.round(principal) },
        { name: 'Total Interest', value: Math.round(totalInterest) },
        { name: 'Down Payment + Trade-in', value: Math.round(downPayment + tradeIn) },
      ],
    })
  }

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title="Car Loan Calculator — Auto Payment Estimator"
          description="Free car loan calculator. Estimate your monthly auto payment, total interest, and compare different loan terms. Includes down payment and trade-in value."
          canonical="/car-loan-calculator"
          jsonLd={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Car Loan Calculator', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }}
        />
        <Breadcrumb items={[{ label: 'Car Loan Calculator' }]} />

        <div className="calc-header">
          <h1>Car Loan Calculator</h1>
          <p>Estimate your monthly car payment and total cost of your auto loan.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-group">
              <label>Vehicle Price</label>
              <input type="number" className="form-input" value={inputs.vehiclePrice}
                onChange={e => handleChange('vehiclePrice', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Down Payment</label>
                <input type="number" className="form-input" value={inputs.downPayment}
                  onChange={e => handleChange('downPayment', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Trade-in Value</label>
                <input type="number" className="form-input" value={inputs.tradeIn}
                  onChange={e => handleChange('tradeIn', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Loan Term (Months)</label>
                <select className="form-select" value={inputs.loanTerm}
                  onChange={e => handleChange('loanTerm', e.target.value)}>
                  <option value={24}>24 months (2 years)</option>
                  <option value={36}>36 months (3 years)</option>
                  <option value={48}>48 months (4 years)</option>
                  <option value={60}>60 months (5 years)</option>
                  <option value={72}>72 months (6 years)</option>
                  <option value={84}>84 months (7 years)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input type="number" className="form-input" value={inputs.interestRate}
                  onChange={e => handleChange('interestRate', e.target.value)} step="0.1" />
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate Car Payment</button>
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
                <div className="result-value">{formatCurrency(results.totalCost)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Loan Amount</div>
                <div className="result-value">{formatCurrency(results.principal)}</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Cost Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={results.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={110}
                    paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {results.pieData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>How to Get the Best Car Loan</h2>
          <p>Getting the right auto loan can save you thousands. Your credit score, down payment, and loan term all significantly impact your monthly payment and total cost.</p>
          <h3>Car Buying Tips</h3>
          <ul>
            <li>Get pre-approved from your bank or credit union before visiting dealers</li>
            <li>Keep your loan term to 60 months or less to avoid being "upside down"</li>
            <li>A 20% down payment helps you avoid negative equity</li>
            <li>Compare at least 3 lenders — rates can vary by 2-3%</li>
          </ul>
        </section>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="car-loan-calculator" category="Loans" />
      </aside>
    </div>
  )
}
