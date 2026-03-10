import Calculator from '../../src/calculators/BreakEvenCalculator'

export const metadata = {
  title: 'Break Even Calculator - Free Calculator',
  description: 'Use our free Break Even Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/break-even-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
