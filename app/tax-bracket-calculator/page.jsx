import Calculator from '../../src/calculators/TaxBracketCalculator'

export const metadata = {
  title: 'Tax Bracket Calculator - Free Calculator',
  description: 'Use our free Tax Bracket Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/tax-bracket-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
