import Calculator from '../../src/calculators/DebtToIncomeCalculator'

export const metadata = {
  title: 'Debt To Income Calculator - Free Calculator',
  description: 'Use our free Debt To Income Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/debt-to-income-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
