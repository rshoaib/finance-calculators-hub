import Calculator from '../../src/calculators/MortgageRefinanceCalculator'

export const metadata = {
  title: 'Mortgage Refinance Calculator - Free Calculator',
  description: 'Use our free Mortgage Refinance Calculator to calculate your break-even point and see how much you can save.',
  alternates: {
    canonical: '/mortgage-refinance-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
