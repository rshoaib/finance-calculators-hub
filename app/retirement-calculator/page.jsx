import Calculator from '../../src/calculators/RetirementCalculator'

export const metadata = {
  title: 'Retirement Calculator - Free Calculator',
  description: 'Use our free Retirement Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/retirement-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
