"use client"
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import AdSlot from '../src/components/AdSlot'

export default function ClientHomeFilter({ calculators, categories, popularSlugs }) {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? calculators
    : calculators.filter(c => c.category === activeCategory)

  return (
    <>
      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <AdSlot size="leaderboard" />

      <div className="calculators-grid">
        {filtered.map((calc, idx) => (
          <div key={calc.slug} style={{ display: 'contents' }}>
            <Link href={`/${calc.slug}`} className="card card-link calc-card" style={{ animationDelay: `${idx * 60}ms` }}>
              {popularSlugs.includes(calc.slug) && (
                <span className="popular-badge">⭐ Popular</span>
              )}
              <div className={`calc-card-icon ${calc.color}`}>
                {calc.icon}
              </div>
              <h3>{calc.title}</h3>
              <p>{calc.description}</p>
              <span className="card-cta">
                Calculate now <ArrowRight size={16} />
              </span>
            </Link>
            {(idx + 1) % 6 === 0 && idx + 1 < filtered.length && (
              <div key={`ad-${idx}`} style={{ gridColumn: '1 / -1' }}>
                <AdSlot size="leaderboard" />
              </div>
            )}
          </div>
        ))}
      </div>

      <AdSlot size="leaderboard" />
    </>
  )
}
