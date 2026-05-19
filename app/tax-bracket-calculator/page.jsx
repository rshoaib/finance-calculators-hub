import Calculator from './Calculator'

export const metadata = {
  title: 'Tax Bracket Calculator 2026 — Federal Income Tax Rates & Effective Rate',
  description: 'Calculate your federal income tax by bracket, see your effective tax rate, and understand how marginal rates work. Updated for 2026 tax brackets.',
  alternates: {
    canonical: '/tax-bracket-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
