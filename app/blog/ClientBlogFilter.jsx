"use client"
import { useState } from 'react'
import Link from 'next/link'
import AdSlot from '../../src/components/AdSlot'

const CATEGORIES = ['All', 'Mortgage', 'Investing', 'Tax', 'Savings', 'Credit', 'Insurance']

export default function ClientBlogFilter({ initialPosts }) {
  const [category, setCategory] = useState('All')

  const filtered = category === 'All'
    ? initialPosts
    : initialPosts.filter(p => p.category?.toLowerCase() === category.toLowerCase())

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <>
      <div className="category-filter">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            className={`filter-btn${category === cat ? ' active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <AdSlot size="leaderboard" />

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No articles found in this category.
        </div>
      ) : (
        <div className="blog-grid">
          {filtered.map((post, idx) => (
            <article key={post.id || idx} className="blog-card">
              {post.image_url && (
                <Link href={`/blog/${post.slug}`} className="blog-card-image">
                  <img src={post.image_url} alt={post.title} width="800" height="450" loading="lazy" />
                </Link>
              )}
              <div className="blog-card-body">
                {post.category && <span className="blog-card-category">{post.category}</span>}
                <h2 className="blog-card-title">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-meta">
                  <span>{post.author || 'MyCalcFinance Team'}</span>
                  <span>{formatDate(post.published_at)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdSlot size="leaderboard" />
    </>
  )
}
