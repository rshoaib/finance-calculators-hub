"use client"
import Link from 'next/link'

export default function About() {
  return (
    <main className="main-content" style={{ maxWidth: 800 }}>
      <div className="calc-header">
        <h1 style={{ background: 'none', WebkitTextFillColor: 'var(--text-primary)' }}>About MyCalcFinance</h1>
      </div>
      <div className="seo-content" style={{ borderTop: 'none', paddingTop: 0 }}>
        <p>
          MyCalcFinance is a free collection of financial calculators designed to help you make smarter money decisions.
          Whether you're buying a home, planning for retirement, or trying to pay off debt — we've got a calculator for that.
        </p>
        <h3>Our Mission</h3>
        <p>
          Financial literacy shouldn't be locked behind paywalls. We believe everyone deserves access to the same
          tools that financial advisors use. That's why all of our calculators are 100% free, with no signup required.
        </p>
        <h3>Privacy First</h3>
        <p>
          Your financial data never leaves your browser. All calculations happen locally on your device — we don't
          store, collect, or transmit any of your financial information. Ever.
        </p>
        <h3>Our Calculators</h3>
        <ul>
          <li><Link href="/mortgage-calculator">Mortgage Calculator</Link> — Monthly payments & amortization</li>
          <li><Link href="/emi-calculator">Loan EMI Calculator</Link> — Equated monthly installments</li>
          <li><Link href="/compound-interest-calculator">Compound Interest Calculator</Link> — Investment growth</li>
          <li><Link href="/retirement-calculator">Retirement Calculator</Link> — Savings planning</li>
          <li><Link href="/credit-card-payoff-calculator">Credit Card Payoff Calculator</Link> — Debt elimination</li>
          <li><Link href="/tax-bracket-calculator">Tax Bracket Calculator</Link> — Federal tax breakdown</li>
          <li><Link href="/car-loan-calculator">Car Loan Calculator</Link> — Auto payment estimator</li>
          <li><Link href="/savings-goal-calculator">Savings Goal Calculator</Link> — Savings timeline</li>
          <li><Link href="/debt-to-income-calculator">Debt-to-Income Calculator</Link> — DTI ratio check</li>
          <li><Link href="/investment-return-calculator">Investment Return Calculator</Link> — ROI & CAGR</li>
        </ul>
        <h3>Disclaimer</h3>
        <p>
          The calculators on this website are for informational and educational purposes only. They should not be
          considered financial advice. Always consult a qualified financial advisor before making major financial decisions.
          Results are estimates and may not reflect actual outcomes due to variations in fees, taxes, and market conditions.
        </p>
      </div>
    </main>
  )
}
