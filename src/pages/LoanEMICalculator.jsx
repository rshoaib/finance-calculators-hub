import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

const COLORS = ['#10b981', '#3b82f6']

export default function LoanEMICalculator() {
  const [inputs, setInputs] = useState({
    loanAmount: 50000,
    interestRate: 8,
    loanTenure: 5,
    tenureType: 'years',
  })
  const [results, setResults] = useState(null)

  const calculate = () => {
    const months = inputs.tenureType === 'years' ? inputs.loanTenure * 12 : inputs.loanTenure
    const monthlyRate = inputs.interestRate / 100 / 12

    const emi = monthlyRate > 0
      ? inputs.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
      : inputs.loanAmount / months

    const totalPayment = emi * months
    const totalInterest = totalPayment - inputs.loanAmount

    setResults({
      emi,
      totalPayment,
      totalInterest,
      principal: inputs.loanAmount,
      months,
      pieData: [
        { name: 'Principal', value: Math.round(inputs.loanAmount) },
        { name: 'Interest', value: Math.round(totalInterest) },
      ],
    })
  }

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: field === 'tenureType' ? value : (parseFloat(value) || 0) }))
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Loan EMI Calculator',
    url: 'https://financecalc.app/emi-calculator',
    description: 'Free EMI calculator for personal loans, car loans, and education loans.',
    applicationCategory: 'FinanceApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <SEO
          title="Loan EMI Calculator — Equated Monthly Installment"
          description="Free EMI calculator. Calculate your equated monthly installment for personal, auto, or education loans. See principal vs interest breakdown."
          canonical="/emi-calculator"
          jsonLd={jsonLd}
        />
        <Breadcrumb items={[{ label: 'EMI Calculator' }]} />

        <div className="calc-header">
          <h1>Loan EMI Calculator</h1>
          <p>Calculate your Equated Monthly Installment and see the full payment breakdown.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            <div className="form-group">
              <label>Loan Amount ($)</label>
              <input type="number" className="form-input" value={inputs.loanAmount}
                onChange={e => handleChange('loanAmount', e.target.value)} />
              <input type="range" className="range-slider" min="1000" max="500000" step="1000"
                value={inputs.loanAmount} onChange={e => handleChange('loanAmount', e.target.value)} />
              <div className="slider-labels"><span>$1K</span><span>$500K</span></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input type="number" className="form-input" value={inputs.interestRate}
                  onChange={e => handleChange('interestRate', e.target.value)} step="0.1" />
              </div>
              <div className="form-group">
                <label>Loan Tenure</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="number" className="form-input" value={inputs.loanTenure}
                    onChange={e => handleChange('loanTenure', e.target.value)} style={{ flex: 1 }} />
                  <select className="form-select" value={inputs.tenureType}
                    onChange={e => handleChange('tenureType', e.target.value)} style={{ width: '100px' }}>
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
            </div>
            <button className="btn-calculate" onClick={calculate}>Calculate EMI</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-label">Monthly EMI</div>
                <div className="result-value accent">{formatCurrency(results.emi)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Interest</div>
                <div className="result-value gold">{formatCurrency(results.totalInterest)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Payment</div>
                <div className="result-value">{formatCurrency(results.totalPayment)}</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Principal vs Interest</h3>
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
          <h2>What is EMI?</h2>
          <p>
            EMI stands for Equated Monthly Installment. It is the fixed payment amount a borrower pays to a lender
            at a specified date each month. EMIs cover both interest and principal, structured so the loan is fully
            repaid by the end of the tenure.
          </p>
          <h3>EMI Formula</h3>
          <p>
            The EMI is calculated using: <strong>EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ – 1)</strong>, where P is the principal
            loan amount, r is the monthly interest rate, and n is the number of monthly installments.
          </p>
          <h3>Tips to Reduce Your EMI</h3>
          <ul>
            <li>Negotiate a lower interest rate with your lender</li>
            <li>Opt for a longer loan tenure (increases total interest but lowers monthly payment)</li>
            <li>Make a larger down payment to reduce the principal</li>
            <li>Maintain a good credit score for better rates</li>
          </ul>
        </section>
      </div>

      <aside className="page-sidebar">
        <AdSlot size="rectangle" />
        <RelatedCalculators currentSlug="emi-calculator" category="Loans" />
      </aside>
    </div>
  )
}
