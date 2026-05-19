import Calculator from './Calculator'

export const metadata = {
  title: '401(k) Calculator 2026 — Estimate Your Retirement Balance with Employer Match',
  description: 'Calculate your 401(k) growth with employer match, contribution limits, and compound interest. See how much your 401(k) will be worth at retirement. Free tool.',
  alternates: {
    canonical: '/401k-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
