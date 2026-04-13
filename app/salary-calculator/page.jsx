import Calculator from '../../src/calculators/SalaryCalculator'

export const metadata = {
  title: 'Salary Calculator 2026 — Estimate Take-Home Pay After Taxes',
  description: 'Calculate your net pay after federal, state, FICA taxes, 401(k), and insurance deductions. See hourly, weekly, biweekly, and monthly breakdowns. Free calculator.',
  alternates: {
    canonical: '/salary-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
