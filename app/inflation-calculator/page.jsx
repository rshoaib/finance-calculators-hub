import Calculator from './Calculator'

export const metadata = {
  title: 'Inflation Calculator — See How Prices Change Over Time (2026)',
  description: 'Calculate how inflation erodes purchasing power. See what your money was worth in the past or will be worth in the future using historical CPI data. Free tool.',
  alternates: {
    canonical: '/inflation-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
