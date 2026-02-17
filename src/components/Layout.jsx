import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { Calculator, Home, TrendingUp, PiggyBank, Receipt } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="app-wrapper">
      <header className="header">
        <Link to="/" className="header-logo">
          <span className="logo-icon">FC</span>
          <span>MyCalcFinance</span>
        </Link>
        <nav className="header-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/mortgage-calculator">Mortgage</NavLink>
          <NavLink to="/compound-interest-calculator">Investing</NavLink>
          <NavLink to="/retirement-calculator">Retirement</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/about">About</NavLink>
          <ThemeToggle />
        </nav>
      </header>

      <Outlet />

      <footer className="footer">
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/mortgage-calculator">Mortgage Calculator</Link>
          <Link to="/compound-interest-calculator">Compound Interest</Link>
          <Link to="/retirement-calculator">Retirement</Link>
          <Link to="/tax-bracket-calculator">Tax Calculator</Link>
          <Link to="/salary-calculator">Salary Calculator</Link>
          <Link to="/capital-gains-tax-calculator">Capital Gains Tax</Link>
          <Link to="/net-worth-calculator">Net Worth</Link>
          <Link to="/budget-planner">Budget Planner</Link>
          <Link to="/break-even-calculator">Break-Even</Link>
          <Link to="/inflation-calculator">Inflation</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/about">About</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} MyCalcFinance. Free financial calculators for smarter money decisions.</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          Disclaimer: These calculators are for informational purposes only. Consult a financial advisor for personalized advice.
        </p>
      </footer>
    </div>
  )
}
