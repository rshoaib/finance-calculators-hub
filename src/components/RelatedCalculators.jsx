import Link from 'next/link'
import { calculators } from '../data/calculators'

export default function RelatedCalculators({ currentSlug, category }) {
  const related = calculators
    .filter(c => c.slug !== currentSlug)
    .filter(c => c.category === category || !category)
    .slice(0, 5)

  return (
    <div className="related-calcs">
      <h4>Related Calculators</h4>
      <div className="related-calcs-list">
        {related.map(calc => (
          <Link key={calc.slug} href={`/${calc.slug}`} className="related-calc-item">
            <span>{calc.icon}</span>
            <span>{calc.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
