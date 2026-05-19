import Calculator from './Calculator'

export const metadata = {
  title: 'Net Worth Calculator — Track Your Assets vs Liabilities (2026)',
  description: 'Calculate your total net worth by adding up assets and subtracting liabilities. See your full financial picture and track progress over time. Free calculator.',
  alternates: {
    canonical: '/net-worth-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
