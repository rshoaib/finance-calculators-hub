import Calculator from './Calculator'

export const metadata = {
  title: 'Investment Return Calculator — ROI, CAGR & Inflation-Adjusted Returns (2026)',
  description: 'Calculate your investment ROI, compound annual growth rate (CAGR), and inflation-adjusted returns. Compare asset classes and time periods. Free tool.',
  alternates: {
    canonical: '/investment-return-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
