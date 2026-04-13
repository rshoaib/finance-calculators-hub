import Calculator from '../../src/calculators/About'

export const metadata = {
  title: 'About MyCalcFinance — Free Financial Calculators for Everyone',
  description: 'MyCalcFinance offers 20+ free financial calculators for mortgage, retirement, taxes, investments, and more. No signup, no data stored, 100% private.',
  alternates: {
    canonical: '/about',
  }
}

export default function Page() {
  return <Calculator />
}
