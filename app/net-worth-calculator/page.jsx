import Calculator from '../../src/calculators/NetWorthCalculator'

export const metadata = {
  title: 'Net Worth Calculator - Free Calculator',
  description: 'Use our free Net Worth Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/net-worth-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
