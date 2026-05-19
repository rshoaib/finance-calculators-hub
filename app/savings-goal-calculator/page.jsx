import Calculator from './Calculator'
import PopularCalculations from '../../src/components/PopularCalculations'
import { savingsPages } from '../../src/config/seoPages'

export const metadata = {
  title: 'Savings Goal Calculator — How Long to Reach Your Target? (2026)',
  description: 'Figure out how long it takes to reach your savings goal with regular deposits and interest. Set a target, choose your timeline, and see your plan. Free tool.',
  alternates: {
    canonical: '/savings-goal-calculator',
  }
}

export default function Page() {
  return (
    <>
      <Calculator />
      <PopularCalculations heading="Popular savings scenarios" pages={savingsPages} />
    </>
  )
}
