"use client"
import { useState, useCallback, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import AdSlot from '../components/AdSlot'
import Breadcrumb from '../components/Breadcrumb'
import RelatedCalculators from '../components/RelatedCalculators'
import ShareResults from '../components/ShareResults'
import ExportPDF from '../components/ExportPDF'
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

  const calculate = useCallback(() => {
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
  }, [inputs])

  useEffect(() => { calculate() }, [calculate])

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const faqs = [
    { question: 'How is a mortgage payment calculated?', answer: 'Your monthly mortgage payment is calculated using the amortization formula: M = P[r(1+r)ⁿ]/[(1+r)ⁿ – 1], where P is the loan principal, r is the monthly interest rate, and n is the total number of payments. This formula ensures each payment covers both principal and interest so the loan is fully repaid by the end of the term.' },
    { question: 'What is PMI and when can I remove it?', answer: 'Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home price. PMI typically costs 0.5% to 1% of the loan amount annually. You can request PMI removal once your loan-to-value (LTV) ratio reaches 80%, and it is automatically cancelled at 78% LTV.' },
    { question: 'Should I choose a 15-year or 30-year mortgage?', answer: 'A 15-year mortgage has higher monthly payments but saves significantly on total interest — often 50% or more compared to a 30-year term. A 30-year mortgage offers lower monthly payments and more cash flow flexibility. Choose based on your monthly budget and long-term financial goals.' },
    { question: 'What is the difference between fixed-rate and adjustable-rate mortgages?', answer: 'A fixed-rate mortgage keeps the same interest rate for the entire loan term, providing predictable payments. An adjustable-rate mortgage (ARM) starts with a lower introductory rate that adjusts periodically based on market conditions. ARMs can save money short-term but carry the risk of rising payments.' },
    { question: 'How much house can I afford?', answer: 'A common guideline is the 28/36 rule: spend no more than 28% of your gross monthly income on housing costs (mortgage, taxes, insurance) and no more than 36% on total debt. For example, with a $6,000 monthly income, aim for a maximum mortgage payment of about $1,680.' },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Mortgage Calculator',
      url: 'https://mycalcfinance.com/mortgage-calculator',
      description: 'Free mortgage calculator — calculate monthly payments, total interest, and view amortization schedule.',
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

            <div className="share-results">
              <ShareResults title="Mortgage Calculator Results" resultsSummary={`Monthly Payment: ${formatCurrency(results.monthlyPayment)}\nTotal Interest: ${formatCurrency(results.totalInterest)}\nTotal Cost: ${formatCurrency(results.totalPaid + results.downPaymentAmount)}\nLoan Amount: ${formatCurrency(results.principal)}`} />
              <ExportPDF />
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
          <h2>How a Mortgage Works</h2>
          <p>
            A mortgage is a secured loan used to purchase real estate, where the property itself serves as collateral.
            Your monthly payment is divided between principal repayment and interest charges. In the early years of an
            amortization schedule, the majority of each payment goes toward interest. As the loan matures, more of each
            payment reduces the outstanding principal balance. Understanding this amortization structure helps homebuyers
            plan for the true cost of homeownership.
          </p>

          <h3>The Mortgage Payment Formula</h3>
          <p>
            The standard amortization formula is: <strong>M = P × [r(1+r)<sup>n</sup>] / [(1+r)<sup>n</sup> – 1]</strong>, where:
          </p>
          <ul>
            <li><strong>P</strong> = Loan principal (home price minus down payment)</li>
            <li><strong>r</strong> = Monthly interest rate (annual rate ÷ 12)</li>
            <li><strong>n</strong> = Total number of monthly payments (years × 12)</li>
            <li><strong>M</strong> = Monthly mortgage payment (principal + interest only)</li>
          </ul>
          <p>
            Note: Your total monthly housing payment also typically includes property taxes, homeowners insurance,
            and possibly private mortgage insurance (PMI) — collectively known as <strong>PITI</strong> (Principal, Interest, Taxes, Insurance).
            Many lenders collect these through an escrow account.
          </p>

          <h3>Worked Example</h3>
          <p>
            For a <strong>$350,000 home</strong> with <strong>20% down payment</strong> ($70,000), a <strong>$280,000 loan</strong>
            at <strong>6.5% interest</strong> for <strong>30 years</strong>:
          </p>
          <ul>
            <li>Monthly payment (P&I): <strong>$1,770</strong></li>
            <li>Total interest over 30 years: <strong>$357,127</strong></li>
            <li>Total cost of the home: <strong>$707,127</strong> (including down payment)</li>
            <li>Same loan at 15 years: <strong>$2,440/month</strong> but only <strong>$159,234 total interest</strong> — saving almost $200K!</li>
          </ul>

          <h3>Key Mortgage Terms</h3>
          <dl>
            <dt><strong>Amortization</strong></dt>
            <dd>The process of spreading loan payments over time so each installment covers both interest and a portion of principal.</dd>
            <dt><strong>Loan-to-Value Ratio (LTV)</strong></dt>
            <dd>The ratio of your mortgage amount to the home's appraised value. An LTV above 80% typically requires PMI.</dd>
            <dt><strong>Escrow</strong></dt>
            <dd>An account managed by your lender to collect and pay property taxes and insurance on your behalf.</dd>
            <dt><strong>Pre-Approval</strong></dt>
            <dd>A lender's conditional commitment to loan you a specific amount, based on your credit, income, and assets.</dd>
            <dt><strong>ARM vs Fixed-Rate</strong></dt>
            <dd>ARM (Adjustable-Rate Mortgage) offers a lower initial rate that adjusts over time. Fixed-rate keeps the same rate for the entire loan term.</dd>
          </dl>

          <h3>Strategies to Lower Your Mortgage Cost</h3>
          <ul>
            <li><strong>Make a 20% down payment</strong> to avoid PMI, which can add $100-$300/month to your costs</li>
            <li><strong>Shop multiple lenders:</strong> Rates can vary 0.5-1% between lenders, potentially saving tens of thousands</li>
            <li><strong>Consider a 15-year term</strong> if you can afford the higher payment — you'll save 50%+ on total interest</li>
            <li><strong>Make one extra payment per year:</strong> This can shave 4-5 years off a 30-year mortgage</li>
            <li><strong>Refinance when rates drop:</strong> A 1% rate reduction on a $300K mortgage saves about $175/month</li>
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
        <RelatedCalculators currentSlug="mortgage-calculator" category="Loans" />
      </aside>
    </div>
  )
}
