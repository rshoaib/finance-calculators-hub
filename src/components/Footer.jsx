import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link href="/">Home</Link>
        <Link href="/mortgage-calculator">Mortgage Calculator</Link>
        <Link href="/compound-interest-calculator">Compound Interest</Link>
        <Link href="/retirement-calculator">Retirement</Link>
        <Link href="/tax-bracket-calculator">Tax Calculator</Link>
        <Link href="/salary-calculator">Salary Calculator</Link>
        <Link href="/capital-gains-tax-calculator">Capital Gains Tax</Link>
        <Link href="/net-worth-calculator">Net Worth</Link>
        <Link href="/budget-planner">Budget Planner</Link>
        <Link href="/break-even-calculator">Break-Even</Link>
        <Link href="/inflation-calculator">Inflation</Link>
        <Link href="/cd-calculator">CD Calculator</Link>
        <Link href="/student-loan-calculator">Student Loans</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/privacy-policy">Privacy Policy</Link>
      </div>
      <p>&copy; {new Date().getFullYear()} MyCalcFinance. Free financial calculators for smarter money decisions.</p>
      <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
        Disclaimer: These calculators are for informational purposes only. Consult a financial advisor for personalized advice.
      </p>
      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border, #e5e7eb)' }}>
        <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Our Other Free Tools</p>
        <div className="footer-links" style={{ fontSize: '0.75rem' }}>
          <a href="https://dailysmartcalc.com" target="_blank" rel="noopener noreferrer">Smart Calculators</a>
          <a href="https://onlineimageshrinker.com" target="_blank" rel="noopener noreferrer">Image Compressor</a>
          <a href="https://tinypdftools.com" target="_blank" rel="noopener noreferrer">PDF Tools</a>
          <a href="https://legalpolicygen.com" target="_blank" rel="noopener noreferrer">Legal Policy Generator</a>
          <a href="https://imrizwan.com" target="_blank" rel="noopener noreferrer">Developer Blog</a>
        </div>
      </div>
    </footer>
  )
}
