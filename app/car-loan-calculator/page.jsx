import Calculator from '../../src/calculators/CarLoanCalculator'

export const metadata = {
  title: 'Car Loan Calculator - Free Calculator',
  description: 'Use our free Car Loan Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/car-loan-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
