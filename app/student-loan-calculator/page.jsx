import Calculator from '../../src/calculators/StudentLoanCalculator'

export const metadata = {
  title: 'Student Loan Calculator 2026 — Estimate Payments & Total Interest',
  description: 'Calculate student loan payments across standard, graduated, and income-driven plans. See how extra payments save you thousands in interest. Free tool.',
  alternates: {
    canonical: '/student-loan-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
