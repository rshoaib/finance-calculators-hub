import Calculator from '../../src/calculators/CarLoanCalculator'

export const metadata = {
  title: 'Car Loan Calculator 2026 — Estimate Monthly Auto Payments & Total Cost',
  description: 'Calculate your monthly car payment, total interest, and compare loan scenarios. See how down payment and term length affect your auto loan. Free calculator.',
  alternates: {
    canonical: '/car-loan-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
