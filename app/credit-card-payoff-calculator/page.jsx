import Calculator from '../../src/pages/CreditCardPayoffCalculator'

export const metadata = {
  title: 'Credit Card Payoff Calculator - Free Calculator',
  description: 'Use our free Credit Card Payoff Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/credit-card-payoff-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
