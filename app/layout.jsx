import './globals.css'
import { Inter } from 'next/font/google'
import Header from '../src/components/Header'
import Footer from '../src/components/Footer'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: 'MyCalcFinance — Free Financial Calculators',
  description: 'Free online financial calculators for mortgage, loans, compound interest, retirement, taxes, and more. Make smarter money decisions today.',
  metadataBase: new URL('https://mycalcfinance.com'),
  openGraph: {
    title: 'MyCalcFinance — Free Financial Calculators',
    description: 'Free online financial calculators for mortgage, loans, compound interest, retirement, taxes, and more.',
    url: 'https://mycalcfinance.com/',
    siteName: 'MyCalcFinance',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyCalcFinance — Free Financial Calculators',
    description: 'Free online financial calculators for mortgage, loans, compound interest, retirement, and taxes.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            })();
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <div id="root" className="app-wrapper">
          <Header />
          {children}
          <Footer />
        </div>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-CP0X875LH3" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CP0X875LH3');
          `}
        </Script>
      </body>
    </html>
  )
}
