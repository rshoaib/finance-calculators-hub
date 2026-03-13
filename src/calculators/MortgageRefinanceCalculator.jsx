"use client"
import { useState, useCallback, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import { formatCurrency } from '../utils/formatters'

export default function MortgageRefinanceCalculator() {
  const [inputs, setInputs] = useState({
    originalLoanAmount: 300000,
    currentBalance: 250000,
    currentRate: 6.5,
    remainingYears: 22,
    newRate: 5.5,
    newTermYears: 20,
    closingCosts: 4000,
    rollClosingCosts: true,
  })
  
  const [results, setResults] = useState(null)

  const calculate = useCallback(() => {
    const { currentBalance, currentRate, remainingYears, newRate, newTermYears, closingCosts, rollClosingCosts } = inputs

    // Current Loan Calculation
    const currentMonthlyRate = currentRate / 100 / 12
    const currentNumPayments = remainingYears * 12
    const currentMonthlyPayment = currentMonthlyRate > 0
      ? currentBalance * (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentNumPayments)) / (Math.pow(1 + currentMonthlyRate, currentNumPayments) - 1)
      : currentBalance / currentNumPayments

    const currentTotalPaid = currentMonthlyPayment * currentNumPayments
    const currentTotalInterest = currentTotalPaid - currentBalance

    // New Loan Calculation
    const newPrincipal = rollClosingCosts ? currentBalance + closingCosts : currentBalance
    const newMonthlyRate = newRate / 100 / 12
    const newNumPayments = newTermYears * 12
    const newMonthlyPayment = newMonthlyRate > 0
      ? newPrincipal * (newMonthlyRate * Math.pow(1 + newMonthlyRate, newNumPayments)) / (Math.pow(1 + newMonthlyRate, newNumPayments) - 1)
      : newPrincipal / newNumPayments

    // If they don't roll closing costs in, they pay them upfront. Add it to total cost.
    const newTotalPaidToBank = newMonthlyPayment * newNumPayments
    const upfrontCosts = rollClosingCosts ? 0 : closingCosts
    const newTotalCost = newTotalPaidToBank + upfrontCosts
    
    // Total interest paid on the new loan
    const newTotalInterest = newTotalPaidToBank - newPrincipal

    const monthlySavings = currentMonthlyPayment - newMonthlyPayment
    const lifetimeSavings = currentTotalPaid - newTotalCost

    // Calculate Break-Even Point (Months)
    // Formula: Closing Costs / Monthly Savings
    let breakEvenMonths = 0
    if (monthlySavings > 0) {
       breakEvenMonths = Math.ceil(closingCosts / monthlySavings)
    }

    // Amortization Schedule for Chart (Comparing Balances)
    const schedule = []
    let balOld = currentBalance
    let balNew = newPrincipal
    const maxMonths = Math.max(currentNumPayments, newNumPayments)

    for (let month = 0; month <= maxMonths; month += 12) {
      if (month > 0) {
        // Apply 12 months of payments
        for(let m = 0; m < 12; m++) {
          if (balOld > 0) {
            const intOld = balOld * currentMonthlyRate
            const princOld = currentMonthlyPayment - intOld
            balOld -= princOld
          }
          if (balNew > 0) {
            const intNew = balNew * newMonthlyRate
            const princNew = newMonthlyPayment - intNew
            balNew -= princNew
          }
        }
      }
      
      schedule.push({
        year: month / 12,
        currentBalance: Math.max(0, Math.round(balOld)),
        newBalance: Math.max(0, Math.round(balNew))
      })
    }

    setResults({
      currentMonthlyPayment,
      currentTotalInterest,
      newMonthlyPayment,
      newTotalInterest,
      monthlySavings,
      lifetimeSavings,
      breakEvenMonths,
      schedule,
      newPrincipal,
      upfrontCosts
    })
  }, [inputs])

  useEffect(() => { calculate() }, [calculate])

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const handleCheckbox = (e) => {
    setInputs(prev => ({ ...prev, rollClosingCosts: e.target.checked }))
  }

  const faqs = [
    { question: 'What is a break-even point in refinancing?', answer: 'The break-even point is how long it takes for your monthly savings from the new, lower interest rate to cover the upfront closing costs of the refinance. For example, if refinancing saves you $100 a month but costs $3,000 in fees, your break-even point is 30 months. If you plan to sell the house before 30 months, refinancing will actually cost you money.' },
    { question: 'Should I roll closing costs into my loan?', answer: 'Rolling closing costs into your new loan balance (a "no-cost" refinance) means you bring no cash to closing, which preserves your liquid savings. However, you will pay interest on those closing costs over the life of the loan. Paying closing costs out of pocket upfront is mathematically cheaper in the long run.' },
    { question: 'Does refinancing restart my loan term?', answer: 'It depends on the term you select. If you are 10 years into a 30-year mortgage and you refinance into a new 30-year mortgage, you have reset your clock and will be paying for 40 years total. To avoid this, try to refinance into a term that matches your remaining years (e.g., a 20-year or 15-year mortgage) to maintain your payoff schedule while lowering your rate.' },
    { question: 'How much are typical refinancing closing costs?', answer: 'Closing costs typically range from 2% to 6% of the total loan amount. They include loan origination fees, appraisal fees, title insurance, and credit report charges. When shopping for a refinance, always ask the lender for a Loan Estimate document to compare the exact fees side-by-side.' },
    { question: 'When does it make sense to refinance?', answer: 'A general rule of thumb is that refinancing makes sense if you can lower your interest rate by at least 0.75% to 1%, and you plan to stay in the home long past the break-even point. Refinancing can also make sense if you need to switch from an Adjustable-Rate Mortgage (ARM) to a Fixed-Rate Mortgage for stability, or if your home value has increased enough to remove Private Mortgage Insurance (PMI).' },
  ]

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Mortgage Refinance Calculator', url: 'https://mycalcfinance.com/mortgage-refinance-calculator', description: 'Free mortgage refinance calculator — find your break-even point, calculate monthly savings, and see if refinancing your home makes sense.', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) },
  ]

  return (
    <div className="page-with-sidebar">
      <div className="page-main">
        <Breadcrumb items={[{ label: 'Mortgage Refinance Calculator' }]} />

        <div className="calc-header">
          <h1>Mortgage Refinance Calculator</h1>
          <p>Find out if refinancing your mortgage makes financial sense. Calculate your break-even point, monthly savings, and lifetime interest changes.</p>
        </div>

        <div className="card">
          <div className="calc-form">
            
            <h3 className="section-title">Current Loan</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Remaining Balance</label>
                <input type="number" className="form-input" value={inputs.currentBalance}
                  onChange={e => handleChange('currentBalance', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Current Interest Rate (%)</label>
                <input type="number" className="form-input" value={inputs.currentRate}
                  onChange={e => handleChange('currentRate', e.target.value)} step="0.1" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Years Remaining</label>
                <input type="number" className="form-input" value={inputs.remainingYears}
                  onChange={e => handleChange('remainingYears', e.target.value)} />
              </div>
            </div>

            <h3 className="section-title" style={{marginTop: '1.5rem'}}>New Loan Options</h3>
            <div className="form-row">
              <div className="form-group">
                <label>New Interest Rate (%)</label>
                <input type="number" className="form-input" value={inputs.newRate}
                  onChange={e => handleChange('newRate', e.target.value)} step="0.1" />
              </div>
              <div className="form-group">
                <label>New Loan Term (Years)</label>
                <select className="form-select" value={inputs.newTermYears}
                  onChange={e => handleChange('newTermYears', e.target.value)}>
                  <option value={10}>10 years</option>
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
               <div className="form-group">
                <label>Estimated Closing Costs ($)</label>
                <input type="number" className="form-input" value={inputs.closingCosts}
                  onChange={e => handleChange('closingCosts', e.target.value)} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={inputs.rollClosingCosts} onChange={handleCheckbox} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)'}} />
                  Roll closing costs into new loan
                </label>
              </div>
            </div>

            <button className="btn-calculate" onClick={calculate} style={{marginTop: '1rem'}}>Calculate Refinance</button>
          </div>
        </div>

        <AdSlot size="leaderboard" />

        {results && (
          <div className="results-panel">
            {results.monthlySavings > 0 ? (
                // Positive Savings Scenario
                <>
                <div className="results-grid">
                  <div className="result-card highlight">
                    <div className="result-label">Monthly Savings</div>
                    <div className="result-value accent">+{formatCurrency(results.monthlySavings)}</div>
                    <div className="result-subtext">New Payment: {formatCurrency(results.newMonthlyPayment)}</div>
                  </div>
                  <div className="result-card">
                    <div className="result-label">Break-Even Point</div>
                    <div className="result-value gold">{results.breakEvenMonths} Months</div>
                    <div className="result-subtext">{(results.breakEvenMonths / 12).toFixed(1)} years</div>
                  </div>
                </div>
                
                <div className="results-grid mt-4">
                  <div className="result-card">
                    <div className="result-label">Lifetime Savings</div>
                    <div className="result-value" style={{ color: results.lifetimeSavings > 0 ? '#10b981' : '#ef4444' }}>
                      {results.lifetimeSavings > 0 ? '+' : ''}{formatCurrency(results.lifetimeSavings)}
                    </div>
                  </div>
                  <div className="result-card">
                    <div className="result-label">New Loan Balance</div>
                    <div className="result-value">{formatCurrency(results.newPrincipal)}</div>
                    {inputs.rollClosingCosts && <div className="result-subtext">Includes {formatCurrency(inputs.closingCosts)} fees</div>}
                  </div>
                  <div className="result-card">
                    <div className="result-label">Upfront Cash Needed</div>
                    <div className="result-value">{formatCurrency(results.upfrontCosts)}</div>
                  </div>
                </div>
                </>
            ) : (
                // Negative Savings Scenario
                <div className="results-grid">
                  <div className="result-card highlight" style={{ borderColor: 'var(--accent-red)'}}>
                    <div className="result-label">Monthly Payment Increases By</div>
                    <div className="result-value" style={{ color: 'var(--accent-red)'}}>{formatCurrency(Math.abs(results.monthlySavings))}</div>
                    <div className="result-subtext">New Payment: {formatCurrency(results.newMonthlyPayment)}</div>
                  </div>
                   <div className="result-card">
                    <div className="result-label">Lifetime Cost Change</div>
                    <div className="result-value" style={{ color: results.lifetimeSavings > 0 ? '#10b981' : '#ef4444' }}>
                      {results.lifetimeSavings > 0 ? '+' : ''}{formatCurrency(results.lifetimeSavings)}
                    </div>
                  </div>
                </div>
            )}

            {/* Amortization Chart */}
            <div className="chart-container" style={{ marginTop: '2rem' }}>
              <h3>Loan Balance Comparison Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={results.schedule}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="currentBalance" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} name="Current Loan" strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="newBalance" stroke="#10b981" fill="#10b981" fillOpacity={0.4} name="New Refinanced Loan" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <AdSlot size="mobile-banner" />
          </div>
        )}

        <section className="seo-content">
          <h2>How to Decide if You Should Refinance</h2>
          <p>
            Refinancing your mortgage replaces your current home loan with a new one. Homeowners typically refinance to
            secure a lower interest rate, shorten their loan term, or switch from an adjustable-rate to a fixed-rate mortgage.
            However, because refinancing involves creating a new loan, you must pay closing costs all over again. The mathematical
            key to refinancing is calculating your <strong>break-even point</strong>.
          </p>

          <h3>Finding Your Break-Even Point</h3>
          <p>
            The break-even point is the number of months it takes for your monthly savings to outweigh the upfront costs of the
            new loan. The formula is simple:
          </p>
          <blockquote>
            <strong>Break-Even (Months) = Total Closing Costs ÷ Monthly Savings</strong>
          </blockquote>
          <p>
            For example, if a refinance costs you $3,000 in closing fees, but lowers your monthly payment by $150:
            <br/>$3,000 ÷ $150 = <strong>20 Months</strong>.
            <br/>If you plan to live in the house for exactly two more years (24 months), the refinance will save you money.
            But if you sell the house and move in 12 months, the refinance will have actually cost you money, despite the lower rate.
          </p>

          <h3>Beware the Term Extension Trap</h3>
          <p>
            The biggest mistake homeowners make when refinancing is constantly resetting their loan term back to 30 years.
            If you have paid off 10 years of a 30-year mortgage, and you refinance the remaining balance into a <em>new</em> 30-year
            mortgage, your monthly payment will drop significantly. However, you will now be paying for the house for a total of
            40 years, which drastically increases the total lifetime interest you pay to the bank.
            <br/><br/>
            <strong>Best Practice:</strong> When refinancing, try to select a new term that matches your remaining years (or shorter).
            If you have 22 years left, try to refinance into a 20-year or 15-year mortgage. Your monthly payment might stay the same,
            but you will save tens of thousands of dollars in interest.
          </p>

          <h3>Options for Closing Costs</h3>
          <p>You generally have two options for handling the closing costs of a refinance (appraisals, title fees, origination fees):</p>
          <ul>
            <li><strong>Pay Out of Pocket:</strong> You write a check for $3,000 to $5,000 at closing. This results in the lowest loan balance and lowest total interest.</li>
            <li><strong>Roll Costs into the Loan:</strong> (Often advertised as a "No-Cost Refinance"). You bring no cash to closing, but the $4,000 fee is added to your loan balance. You then pay interest on that $4,000 for the next 15-30 years.</li>
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
        <RelatedCalculators currentSlug="mortgage-refinance-calculator" category="Loans" />
      </aside>
    </div>
  )
}
