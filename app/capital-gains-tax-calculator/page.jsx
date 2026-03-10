import Calculator from '../../src/pages/CapitalGainsTaxCalculator'

export const metadata = {
  title: 'Capital Gains Tax Calculator - Free Calculator',
  description: 'Use our free Capital Gains Tax Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/capital-gains-tax-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
