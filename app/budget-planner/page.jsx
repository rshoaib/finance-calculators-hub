import Calculator from '../../src/pages/BudgetPlannerCalculator'

export const metadata = {
  title: 'Budget Planner Calculator - Free Calculator',
  description: 'Use our free Budget Planner Calculator to make smarter financial decisions.',
  alternates: {
    canonical: '/budget-planner',
  }
}

export default function Page() {
  return <Calculator />
}
