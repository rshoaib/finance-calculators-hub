import Calculator from '../../src/pages/DebtPayoffCalculator'

export const metadata = {
  title: 'Debt Payoff Calculator - Free Calculator',
  description: 'Use our free Debt Payoff Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/debt-payoff-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
