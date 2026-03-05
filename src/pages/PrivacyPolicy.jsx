import SEO from '../components/SEO'

export default function PrivacyPolicy() {
  return (
    <main className="main-content" style={{ maxWidth: 800 }}>
      <SEO
        title="Privacy Policy"
        description="MyCalcFinance privacy policy. We do not collect, store, or transmit your personal or financial data."
        canonical="/privacy-policy"
      />
      <div className="calc-header">
        <h1 style={{ background: 'none', WebkitTextFillColor: 'var(--text-primary)' }}>Privacy Policy</h1>
        <p>Last updated: February 2026</p>
      </div>
      <div className="seo-content" style={{ borderTop: 'none', paddingTop: 0 }}>
        <h3>Information We Collect</h3>
        <p>
          MyCalcFinance does not collect any personal information. All financial calculations are performed entirely
          within your web browser. No data is sent to our servers.
        </p>

        <h3>Cookies</h3>
        <p>
          We may use cookies for analytics purposes (such as Google Analytics) and to serve ads through Google AdSense.
          These third-party services may collect anonymous usage data such as pages viewed, time on site, and general
          location data. No personally identifiable financial information is collected.
        </p>

        <h3>Third-Party Advertising</h3>
        <p>
          We use Google AdSense to display advertisements. Google and other third-party vendors use cookies —
          including the DoubleClick DART cookie — to serve ads based on your prior visits to this website or other
          websites on the internet.
        </p>
        <p>
          Google's use of advertising cookies enables it and its partners to serve ads based on your visit to this
          site and/or other sites. You may opt out of personalized advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google's Ads Settings</a>.
          You may also opt out of third-party vendor cookies for personalized advertising by visiting{' '}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info/choices</a>.
        </p>

        <h3>Data Security</h3>
        <p>
          Since we do not collect or store any of your financial data, there is no risk of data breaches affecting
          your personal financial information on our platform.
        </p>

        <h3>Changes to This Policy</h3>
        <p>
          We may update this privacy policy from time to time. Any changes will be posted on this page with an updated
          revision date.
        </p>

        <h3>Contact</h3>
        <p>
          If you have any questions about this privacy policy or our practices, please email us
          at <a href="mailto:contact@mycalcfinance.com">contact@mycalcfinance.com</a>.
        </p>
      </div>
    </main>
  )
}
