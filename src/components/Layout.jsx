import { useState } from 'react'
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Layout() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close mobile menu on navigation
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="app-wrapper">
      <header className="header">
        <Link to="/" className="header-logo" onClick={closeMenu}>
          <span className="logo-icon">FC</span>
          <span>MyCalcFinance</span>
        </Link>
        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/mortgage-calculator" onClick={closeMenu}>Mortgage</NavLink>
          <NavLink to="/compound-interest-calculator" onClick={closeMenu}>Investing</NavLink>
          <NavLink to="/retirement-calculator" onClick={closeMenu}>Retirement</NavLink>
          <NavLink to="/blog" onClick={closeMenu}>Blog</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
          <ThemeToggle />
        </nav>
        <button
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Overlay to close menu when clicking outside */}
      {menuOpen && <div className="mobile-menu-overlay" onClick={closeMenu} />}

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
          <Link to="/cd-calculator">CD Calculator</Link>
          <Link to="/student-loan-calculator">Student Loans</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
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
            <a href="https://legalpolicygen.com" target="_blank" rel="noopener noreferrer">Legal Policy Generator</a>
            <a href="https://imrizwan.com" target="_blank" rel="noopener noreferrer">Developer Blog</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
