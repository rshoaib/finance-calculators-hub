import Calculator from '../../src/pages/InflationCalculator'

export const metadata = {
  title: 'Inflation Calculator - Free Calculator',
  description: 'Use our free Inflation Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/inflation-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
