import Calculator from '../../src/calculators/HomeAffordabilityCalculator'

export const metadata = {
  title: 'Home Affordability Calculator - Free Calculator',
  description: 'Use our free Home Affordability Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/home-affordability-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
