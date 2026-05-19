import Calculator from './Calculator'

export const metadata = {
  title: 'Break-Even Calculator — Find Your Profit Point (2026)',
  description: 'Calculate how many units you need to sell to cover fixed and variable costs. Find your break-even point and start planning for profit. Free business tool.',
  alternates: {
    canonical: '/break-even-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
