import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function NotFound() {
  return (
    <main className="main-content" style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <SEO
        title="Page Not Found — MyCalcFinance"
        description="The page you're looking for doesn't exist. Browse our free financial calculators."
        canonical="/404"
      />
      <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🔢</div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
        4<span className="gradient-text">0</span>4
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
        This page doesn't exist — but our free financial calculators do! Try one of the popular tools below.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <Link to="/mortgage-calculator" className="btn-calculate" style={{ textDecoration: 'none' }}>🏠 Mortgage Calculator</Link>
        <Link to="/compound-interest-calculator" className="btn-calculate" style={{ textDecoration: 'none', background: 'var(--gradient-gold)' }}>📈 Compound Interest</Link>
        <Link to="/retirement-calculator" className="btn-calculate" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>🏖️ Retirement</Link>
      </div>
      <Link to="/" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>← Back to Home</Link>
    </main>
  )
}
