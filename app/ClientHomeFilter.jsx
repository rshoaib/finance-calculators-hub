"use client"
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import AdSlot from '../src/components/AdSlot'

export default function ClientHomeFilter({ calculators, categories, popularSlugs }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = calculators.filter(c => {
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a calculator... (e.g. Mortgage, ROI, Tax)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>

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
