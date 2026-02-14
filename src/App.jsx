import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MortgageCalculator from './pages/MortgageCalculator'
import LoanEMICalculator from './pages/LoanEMICalculator'
import CompoundInterestCalculator from './pages/CompoundInterestCalculator'
import RetirementCalculator from './pages/RetirementCalculator'
import CreditCardPayoffCalculator from './pages/CreditCardPayoffCalculator'
import TaxBracketCalculator from './pages/TaxBracketCalculator'
import CarLoanCalculator from './pages/CarLoanCalculator'
import SavingsGoalCalculator from './pages/SavingsGoalCalculator'
import DebtToIncomeCalculator from './pages/DebtToIncomeCalculator'
import InvestmentReturnCalculator from './pages/InvestmentReturnCalculator'
import About from './pages/About'
import PrivacyPolicy from './pages/PrivacyPolicy'

export default function App() {
  return (
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
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Route>
    </Routes>
  )
}
