/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fyjqnidhhwxvzllhjfxk.supabase.co',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  async redirects() {
    return [
      // Credit card debt payoff — consolidated to best version
      { source: '/blog/credit-card-debt-payoff-strategies-2026', destination: '/blog/how-to-pay-off-credit-card-debt-fast-2026', permanent: true },
      { source: '/blog/credit-card-payoff-guide-2026', destination: '/blog/how-to-pay-off-credit-card-debt-fast-2026', permanent: true },
      // 50/30/20 budget rule — consolidated to best version
      { source: '/blog/fifty-thirty-twenty-budget-rule-guide', destination: '/blog/50-30-20-budget-rule-explained-guide-2026', permanent: true },
      { source: '/blog/50-30-20-budget-rule-explained-2026', destination: '/blog/50-30-20-budget-rule-explained-guide-2026', permanent: true },
      { source: '/blog/50-30-20-budget-rule-explained', destination: '/blog/50-30-20-budget-rule-explained-guide-2026', permanent: true },
      // Car loan calculator — consolidated duplicate
      { source: '/blog/car-loan-calculator-2026', destination: '/blog/car-loan-calculator-guide-2026', permanent: true },
      // CD calculator guide — consolidated duplicate
      { source: '/blog/cd-calculator-guide-best-rates-maximize-returns-2026', destination: '/blog/cd-calculator-guide-2026', permanent: true },
      // Net worth guide — consolidated duplicate
      { source: '/blog/how-to-calculate-net-worth', destination: '/blog/how-to-calculate-net-worth-2026-guide', permanent: true },
    ]
  },
};

export default nextConfig;
