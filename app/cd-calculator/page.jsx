import Calculator from './Calculator'

export const metadata = {
  title: 'CD Calculator 2026 — Calculate Certificate of Deposit Returns',
  description: 'Calculate CD maturity value and compare terms from 3 months to 5 years. See how compounding frequency affects your returns. Updated for 2026 rates.',
  alternates: {
    canonical: '/cd-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
