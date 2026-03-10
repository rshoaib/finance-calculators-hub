import Calculator from '../../src/pages/InvestmentReturnCalculator'

export const metadata = {
  title: 'Investment Return Calculator - Free Calculator',
  description: 'Use our free Investment Return Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/investment-return-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
