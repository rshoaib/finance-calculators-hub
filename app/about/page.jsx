import Calculator from '../../src/calculators/About'

export const metadata = {
  title: 'About - Free Calculator',
  description: 'Use our free About to make smarter financial decisions.',
  alternates: {
    canonical: '/about',
  }
}

export default function Page() {
  return <Calculator />
}
