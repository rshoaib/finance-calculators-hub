import Calculator from './Calculator'

export const metadata = {
  title: 'Loan EMI Calculator — Calculate Equated Monthly Installments (2026)',
  description: 'Compute your EMI for personal, auto, or education loans. See total interest, payment schedule, and compare different loan terms. Free and instant.',
  alternates: {
    canonical: '/emi-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
