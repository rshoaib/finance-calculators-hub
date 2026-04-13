import Calculator from '../../src/calculators/MortgageRefinanceCalculator'

export const metadata = {
  title: 'Mortgage Refinance Calculator — Is Refinancing Worth It? (2026)',
  description: 'Calculate your refinance break-even point, monthly savings, and total interest saved. Compare your current mortgage vs a new rate. Free calculator.',
  alternates: {
    canonical: '/mortgage-refinance-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
