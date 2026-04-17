import Calculator from '../../src/calculators/SalaryCalculator'
import PopularCalculations from '../../src/components/PopularCalculations'
import { salaryPages, hourlyPages } from '../../src/data/seoPages'

export const metadata = {
  title: 'Salary Calculator 2026 — Estimate Take-Home Pay After Taxes',
  description: 'Calculate your net pay after federal, state, FICA taxes, 401(k), and insurance deductions. See hourly, weekly, biweekly, and monthly breakdowns. Free calculator.',
  alternates: {
    canonical: '/salary-calculator',
  }
}

export default function Page() {
  return (
    <>
      <Calculator />
      <PopularCalculations heading="Popular salary calculations" pages={salaryPages} />
      <PopularCalculations heading="Popular hourly-wage calculations" pages={hourlyPages} />
    </>
  )
}
