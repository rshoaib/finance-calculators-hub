import Calculator from '../../src/calculators/MortgageCalculator'

export const metadata = {
  title: 'Mortgage Calculator - Free Calculator',
  description: 'Use our free Mortgage Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/mortgage-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
