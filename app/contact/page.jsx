import Calculator from '../../src/calculators/Contact'

export const metadata = {
  title: 'Contact Us — MyCalcFinance',
  description: 'Get in touch with the MyCalcFinance team. Questions, feedback, or partnership inquiries — we would love to hear from you.',
  alternates: {
    canonical: '/contact',
  }
}

export default function Page() {
  return <Calculator />
}
