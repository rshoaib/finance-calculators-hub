import Calculator from '../../src/calculators/PrivacyPolicy'

export const metadata = {
  title: 'Privacy Policy — MyCalcFinance',
  description: 'Read the MyCalcFinance privacy policy. Learn how we protect your data — all calculations run in your browser with no data stored on our servers.',
  alternates: {
    canonical: '/privacy-policy',
  }
}

export default function Page() {
  return <Calculator />
}
