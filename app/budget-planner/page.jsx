import Calculator from './Calculator'

export const metadata = {
  title: '50/30/20 Budget Planner — Allocate Your Income Smarter (2026)',
  description: 'Use the 50/30/20 rule to split your income into needs, wants, and savings. Get a personalized budget breakdown based on your take-home pay. Free tool.',
  alternates: {
    canonical: '/budget-planner',
  }
}

export default function Page() {
  return <Calculator />
}
