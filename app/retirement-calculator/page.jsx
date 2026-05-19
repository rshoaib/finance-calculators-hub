import Calculator from './Calculator'

export const metadata = {
  title: 'Retirement Calculator 2026 — How Much Do You Need to Retire?',
  description: 'Estimate your retirement savings goal, monthly contributions needed, and projected corpus. Factor in inflation, Social Security, and withdrawal rates. Free tool.',
  alternates: {
    canonical: '/retirement-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
