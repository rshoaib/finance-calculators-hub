import Calculator from '../../src/calculators/SalaryCalculator'

export const metadata = {
  title: 'Salary Calculator - Free Calculator',
  description: 'Use our free Salary Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/salary-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
