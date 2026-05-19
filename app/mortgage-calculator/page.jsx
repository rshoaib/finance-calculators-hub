import Calculator from './Calculator'
import PopularCalculations from '../../src/components/PopularCalculations'
import { mortgagePages } from '../../src/config/seoPages'

export const metadata = {
  title: 'Free Mortgage Calculator 2026 — Monthly Payment, Interest & Amortization',
  description: 'Calculate your monthly mortgage payment, total interest, and view a full amortization schedule. Compare 15-year vs 30-year terms. Free, instant, no signup.',
  alternates: {
    canonical: '/mortgage-calculator',
  }
}

export default function Page() {
  return (
    <>
      <Calculator />
      <PopularCalculations heading="Popular mortgage scenarios" pages={mortgagePages} />
    </>
  )
}
