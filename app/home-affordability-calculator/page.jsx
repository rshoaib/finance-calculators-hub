import Calculator from './Calculator'

export const metadata = {
  title: 'Home Affordability Calculator — How Much House Can You Afford? (2026)',
  description: 'Find out how much house you can afford based on your income, debts, down payment, and interest rate. Get a realistic home buying budget. Free calculator.',
  alternates: {
    canonical: '/home-affordability-calculator',
  }
}

export default function Page() {
  return <Calculator />
}
