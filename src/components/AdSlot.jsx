export default function AdSlot({ size = 'leaderboard' }) {
  const sizeClass = {
    leaderboard: 'ad-slot-leaderboard',
    rectangle: 'ad-slot-rectangle',
    'mobile-banner': 'ad-slot-mobile-banner',
  }[size] || 'ad-slot-leaderboard'

  const labels = {
    leaderboard: 'Ad · Responsive',
    rectangle: 'Ad · 300×250',
    'mobile-banner': 'Ad · 320×50',
  }

  return (
    <div className={`ad-slot ${sizeClass}`} aria-label="Advertisement">
      <span>{labels[size] || 'Advertisement'}</span>
    </div>
  )
}
