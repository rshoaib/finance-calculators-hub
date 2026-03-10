import Calculator from '../../src/pages/FourOhOneKCalculator'

export const metadata = {
  title: 'Four Oh One K Calculator - Free Calculator',
  description: 'Use our free Four Oh One K Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/401k-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
