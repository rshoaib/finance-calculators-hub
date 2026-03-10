import Calculator from '../../src/calculators/LoanEMICalculator'

export const metadata = {
  title: 'Loan E M I Calculator - Free Calculator',
  description: 'Use our free Loan E M I Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/emi-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
