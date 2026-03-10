import Calculator from '../../src/calculators/StudentLoanCalculator'

export const metadata = {
  title: 'Student Loan Calculator - Free Calculator',
  description: 'Use our free Student Loan Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/student-loan-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
