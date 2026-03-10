import Calculator from '../../src/calculators/CompoundInterestCalculator'

export const metadata = {
  title: 'Compound Interest Calculator - Free Calculator',
  description: 'Use our free Compound Interest Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/compound-interest-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
