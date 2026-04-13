import Calculator from '../../src/calculators/DebtPayoffCalculator'

export const metadata = {
  title: 'Debt Payoff Calculator — Snowball vs Avalanche Comparison (2026)',
  description: 'Compare debt snowball and avalanche strategies. See payoff timelines, total interest saved, and create a personalized debt-free plan. Free calculator.',
  alternates: {
    canonical: '/debt-payoff-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
