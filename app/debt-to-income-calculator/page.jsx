import Calculator from '../../src/calculators/DebtToIncomeCalculator'

export const metadata = {
  title: 'Debt-to-Income (DTI) Ratio Calculator — Check Your DTI for Mortgages (2026)',
  description: 'Calculate your debt-to-income ratio and find out if you qualify for a mortgage. See what lenders look for and how to improve your DTI. Free calculator.',
  alternates: {
    canonical: '/debt-to-income-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
