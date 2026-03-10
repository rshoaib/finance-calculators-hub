import fs from 'fs'
import path from 'path'

const pages = [
  { slug: 'mortgage-calculator', component: 'MortgageCalculator' },
  { slug: 'emi-calculator', component: 'LoanEMICalculator' },
  { slug: 'compound-interest-calculator', component: 'CompoundInterestCalculator' },
  { slug: 'retirement-calculator', component: 'RetirementCalculator' },
  { slug: 'credit-card-payoff-calculator', component: 'CreditCardPayoffCalculator' },
  { slug: 'tax-bracket-calculator', component: 'TaxBracketCalculator' },
  { slug: 'car-loan-calculator', component: 'CarLoanCalculator' },
  { slug: 'savings-goal-calculator', component: 'SavingsGoalCalculator' },
  { slug: 'debt-to-income-calculator', component: 'DebtToIncomeCalculator' },
  { slug: 'investment-return-calculator', component: 'InvestmentReturnCalculator' },
  { slug: 'net-worth-calculator', component: 'NetWorthCalculator' },
  { slug: 'inflation-calculator', component: 'InflationCalculator' },
  { slug: 'salary-calculator', component: 'SalaryCalculator' },
  { slug: 'capital-gains-tax-calculator', component: 'CapitalGainsTaxCalculator' },
  { slug: 'budget-planner', component: 'BudgetPlannerCalculator' },
  { slug: 'break-even-calculator', component: 'BreakEvenCalculator' },
  { slug: '401k-calculator', component: 'FourOhOneKCalculator' },
  { slug: 'home-affordability-calculator', component: 'HomeAffordabilityCalculator' },
  { slug: 'debt-payoff-calculator', component: 'DebtPayoffCalculator' },
  { slug: 'cd-calculator', component: 'CDCalculator' },
  { slug: 'student-loan-calculator', component: 'StudentLoanCalculator' },
  { slug: 'contact', component: 'Contact' },
  { slug: 'about', component: 'About' },
  { slug: 'privacy-policy', component: 'PrivacyPolicy' },
]

pages.forEach(({ slug, component }) => {
  const dir = path.join(process.cwd(), 'app', slug)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // Pre-calculate the metadata values instead of relying on interpolation in the output code
  const humanTitle = component.replace(/([A-Z])/g, ' $1').trim()

  const content = `import Calculator from '../../src/pages/\${component}'

export const metadata = {
  title: '\${humanTitle} - Free Calculator',
  description: 'Use our free \${humanTitle} to make smarter financial decisions.',
  alternates: {
    canonical: '/\${slug}',
  }
}

export default function Page() {
  return <Calculator />
}
`
  // Wait, I need to make sure the backticks don't escape `\${component}`! If I use `\${component}` it will interpolate inside Node.js!
  // NO wait, in my content string above I want it INTERPOLATED in the node script to generate literal values for Next.js!
  // So:
  
  // WRONG: import Calculator from '../../src/pages/\${component}' -> That outputs the literal string '${component}'
  // RIGHT: import Calculator from '../../src/pages/${component}' -> That interpolates the variable.
  fs.writeFileSync(path.join(dir, 'page.jsx'), 
`import Calculator from '../../src/pages/${component}'

export const metadata = {
  title: '${humanTitle} - Free Calculator',
  description: 'Use our free ${humanTitle} to make smarter financial decisions.',
  alternates: {
    canonical: '/${slug}',
  }
}

export default function Page() {
  return <Calculator />
}
`
  )
  console.log(`Updated app/${slug}/page.jsx`)
})

console.log('Migration script fix complete!')
