import Calculator from '../../src/calculators/Contact'

export const metadata = {
  title: 'Contact - Free Calculator',
  description: 'Use our free Contact to make smarter financial decisions.',
  alternates: {
    canonical: '/contact',
  }
}

export default function Page() {
  return <Calculator />
}
