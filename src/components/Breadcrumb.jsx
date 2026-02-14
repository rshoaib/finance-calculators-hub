import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {items.map((item, idx) => (
        <span key={idx}>
          <ChevronRight size={14} className="separator" />
          {item.href ? (
            <Link to={item.href}>{item.label}</Link>
          ) : (
            <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
