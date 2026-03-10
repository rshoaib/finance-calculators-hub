import Calculator from '../../src/pages/CDCalculator'

export const metadata = {
  title: 'C D Calculator - Free Calculator',
  description: 'Use our free C D Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/cd-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
