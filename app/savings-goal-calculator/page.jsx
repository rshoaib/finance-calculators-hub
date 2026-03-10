import Calculator from '../../src/pages/SavingsGoalCalculator'

export const metadata = {
  title: 'Savings Goal Calculator - Free Calculator',
  description: 'Use our free Savings Goal Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/savings-goal-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
