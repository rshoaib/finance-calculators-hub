import Calculator from './Calculator'

export const metadata = {
  title: 'Compound Interest Calculator — See How Your Money Grows (2026)',
  description: 'Calculate compound interest with monthly contributions. See how compounding frequency, rate, and time grow your savings. Interactive charts and breakdown included.',
  alternates: {
    canonical: '/compound-interest-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
