import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'
import { salaryPages, hourlyPages, mortgagePages, savingsPages } from './data/seoPages'

const HomePage = lazy(() => import('./pages/HomePage'))
const MortgageCalculator = lazy(() => import('./pages/MortgageCalculator'))
const LoanEMICalculator = lazy(() => import('./pages/LoanEMICalculator'))
const CompoundInterestCalculator = lazy(() => import('./pages/CompoundInterestCalculator'))
const RetirementCalculator = lazy(() => import('./pages/RetirementCalculator'))
const CreditCardPayoffCalculator = lazy(() => import('./pages/CreditCardPayoffCalculator'))
const TaxBracketCalculator = lazy(() => import('./pages/TaxBracketCalculator'))
const CarLoanCalculator = lazy(() => import('./pages/CarLoanCalculator'))
const SavingsGoalCalculator = lazy(() => import('./pages/SavingsGoalCalculator'))
const DebtToIncomeCalculator = lazy(() => import('./pages/DebtToIncomeCalculator'))
const InvestmentReturnCalculator = lazy(() => import('./pages/InvestmentReturnCalculator'))
const NetWorthCalculator = lazy(() => import('./pages/NetWorthCalculator'))
const InflationCalculator = lazy(() => import('./pages/InflationCalculator'))
const SalaryCalculator = lazy(() => import('./pages/SalaryCalculator'))
const CapitalGainsTaxCalculator = lazy(() => import('./pages/CapitalGainsTaxCalculator'))
const BudgetPlannerCalculator = lazy(() => import('./pages/BudgetPlannerCalculator'))
const BreakEvenCalculator = lazy(() => import('./pages/BreakEvenCalculator'))
const About = lazy(() => import('./pages/About'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const BlogList = lazy(() => import('./pages/BlogList'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const SeoCalcPage = lazy(() => import('./pages/SeoCalcPage'))
const FourOhOneKCalculator = lazy(() => import('./pages/FourOhOneKCalculator'))
const HomeAffordabilityCalculator = lazy(() => import('./pages/HomeAffordabilityCalculator'))
const DebtPayoffCalculator = lazy(() => import('./pages/DebtPayoffCalculator'))
const CDCalculator = lazy(() => import('./pages/CDCalculator'))
const StudentLoanCalculator = lazy(() => import('./pages/StudentLoanCalculator'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Contact = lazy(() => import('./pages/Contact'))

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
          <Route path="/emi-calculator" element={<LoanEMICalculator />} />
          <Route path="/compound-interest-calculator" element={<CompoundInterestCalculator />} />
          <Route path="/retirement-calculator" element={<RetirementCalculator />} />
          <Route path="/credit-card-payoff-calculator" element={<CreditCardPayoffCalculator />} />
          <Route path="/tax-bracket-calculator" element={<TaxBracketCalculator />} />
          <Route path="/car-loan-calculator" element={<CarLoanCalculator />} />
          <Route path="/savings-goal-calculator" element={<SavingsGoalCalculator />} />
          <Route path="/debt-to-income-calculator" element={<DebtToIncomeCalculator />} />
          <Route path="/investment-return-calculator" element={<InvestmentReturnCalculator />} />
          <Route path="/net-worth-calculator" element={<NetWorthCalculator />} />
          <Route path="/inflation-calculator" element={<InflationCalculator />} />
          <Route path="/salary-calculator" element={<SalaryCalculator />} />
          <Route path="/capital-gains-tax-calculator" element={<CapitalGainsTaxCalculator />} />
          <Route path="/budget-planner" element={<BudgetPlannerCalculator />} />
          <Route path="/break-even-calculator" element={<BreakEvenCalculator />} />
          <Route path="/401k-calculator" element={<FourOhOneKCalculator />} />
          <Route path="/home-affordability-calculator" element={<HomeAffordabilityCalculator />} />
          <Route path="/debt-payoff-calculator" element={<DebtPayoffCalculator />} />
          <Route path="/cd-calculator" element={<CDCalculator />} />
          <Route path="/student-loan-calculator" element={<StudentLoanCalculator />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* PROGRAMMATIC SEO PAGES */}
          {salaryPages.map(p => (
            <Route key={p.slug} path={`/${p.slug}`} element={<SeoCalcPage page={p} relatedPages={salaryPages.filter(r => r.slug !== p.slug).slice(0, 6)} />} />
          ))}
          {hourlyPages.map(p => (
            <Route key={p.slug} path={`/${p.slug}`} element={<SeoCalcPage page={p} relatedPages={hourlyPages.filter(r => r.slug !== p.slug).slice(0, 6)} />} />
          ))}
          {mortgagePages.map(p => (
            <Route key={p.slug} path={`/${p.slug}`} element={<SeoCalcPage page={p} relatedPages={mortgagePages.filter(r => r.slug !== p.slug).slice(0, 6)} />} />
          ))}
          {savingsPages.map(p => (
            <Route key={p.slug} path={`/${p.slug}`} element={<SeoCalcPage page={p} relatedPages={savingsPages.filter(r => r.slug !== p.slug).slice(0, 6)} />} />
          ))}

          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
