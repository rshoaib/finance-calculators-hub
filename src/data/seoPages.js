/**
 * Programmatic SEO Pages for MyCalcFinance
 * 
 * 3 categories:
 * 1. Salary conversions: "$X per year is how much per hour" (50 pages)
 * 2. Mortgage payments: "Mortgage payment on $X house" (30 pages)
 * 3. Savings milestones: "How long to save $X" (20 pages)
 * 
 * Total: ~100 programmatic pages
 */

// ── Salary Conversion Pages ──
// "X salary per year is how much per hour/month"
const salaryAmounts = [
  15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000,
  65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000,
  130000, 140000, 150000, 175000, 200000
];

export const salaryPages = salaryAmounts.map(salary => {
  const hourly = (salary / 2080).toFixed(2);
  const monthly = (salary / 12).toFixed(0);
  const biweekly = (salary / 26).toFixed(0);
  const weekly = (salary / 52).toFixed(0);
  const formatted = salary.toLocaleString('en-US');

  return {
    slug: `${salary}-a-year-is-how-much-an-hour`,
    salary,
    hourly,
    monthly,
    biweekly,
    weekly,
    title: `$${formatted} a Year is How Much an Hour? (2026 Breakdown)`,
    description: `$${formatted} per year equals $${hourly}/hour, $${monthly}/month, or $${biweekly} biweekly before taxes. See the full salary breakdown with take-home estimates.`,
    answer: `$${formatted} per year is approximately **$${hourly} per hour** (based on 2,080 working hours/year).`,
    steps: [
      `Annual salary: $${formatted}`,
      `Hourly: $${formatted} ÷ 2,080 hours = $${hourly}/hr`,
      `Monthly: $${formatted} ÷ 12 = $${Number(monthly).toLocaleString('en-US')}/mo`,
      `Biweekly: $${formatted} ÷ 26 = $${Number(biweekly).toLocaleString('en-US')}`,
      `Weekly: $${formatted} ÷ 52 = $${Number(weekly).toLocaleString('en-US')}`,
    ],
    parentCalc: { label: 'Salary Calculator', to: '/salary-calculator' },
    faqs: [
      {
        q: `How much is $${formatted} a year per hour?`,
        a: `$${formatted} a year is $${hourly} per hour, assuming you work 40 hours per week for 52 weeks (2,080 hours total).`,
      },
      {
        q: `What is the monthly take-home on a $${formatted} salary?`,
        a: `Before taxes, $${formatted}/year is $${Number(monthly).toLocaleString('en-US')}/month. After federal and state taxes, expect roughly 70-80% of that, depending on your state and filing status.`,
      },
      {
        q: `Is $${formatted} a year a good salary?`,
        a: salary < 40000
          ? `$${formatted} is below the US median household income (~$75K). It may be tight in high cost-of-living areas but manageable in affordable regions.`
          : salary < 80000
          ? `$${formatted} is around the US median. It provides a comfortable standard of living in most areas outside major cities.`
          : `$${formatted} is well above the US median household income (~$75K). It provides a comfortable lifestyle in most US cities.`,
      },
    ],
  };
});

// ── Hourly to Annual (reverse) ──
const hourlyRates = [10, 12, 15, 17, 18, 20, 22, 25, 27, 30, 35, 40, 45, 50, 60, 75, 100];

export const hourlyPages = hourlyRates.map(rate => {
  const annual = rate * 2080;
  const monthly = (annual / 12).toFixed(0);
  const formatted = annual.toLocaleString('en-US');

  return {
    slug: `${rate}-dollars-an-hour-is-how-much-a-year`,
    hourly: rate,
    annual,
    monthly,
    title: `$${rate}/Hour is How Much a Year? (Full Salary Breakdown)`,
    description: `$${rate} per hour equals $${formatted} per year or $${Number(monthly).toLocaleString('en-US')}/month before taxes. See full breakdown.`,
    answer: `$${rate}/hour equals **$${formatted} per year** (40 hrs/week × 52 weeks).`,
    steps: [
      `Hourly rate: $${rate}`,
      `Weekly: $${rate} × 40 hours = $${(rate * 40).toLocaleString('en-US')}`,
      `Annual: $${rate} × 2,080 hours = $${formatted}`,
      `Monthly: $${formatted} ÷ 12 = $${Number(monthly).toLocaleString('en-US')}`,
    ],
    parentCalc: { label: 'Salary Calculator', to: '/salary-calculator' },
    faqs: [
      {
        q: `How much is $${rate} an hour annually?`,
        a: `$${rate}/hour × 2,080 hours (full-time) = $${formatted} per year before taxes.`,
      },
      {
        q: `Can you live on $${rate} an hour?`,
        a: rate < 15
          ? `$${rate}/hour ($${formatted}/year) is below the living wage in most US cities. Budget carefully and consider supplemental income.`
          : rate < 25
          ? `$${rate}/hour ($${formatted}/year) is livable in many US areas, especially with budgeting. Housing costs are the biggest factor.`
          : `$${rate}/hour ($${formatted}/year) provides a comfortable income in most US locations.`,
      },
      {
        q: `What is $${rate}/hour after taxes?`,
        a: `After federal and state taxes, expect to take home roughly 70-80% of $${formatted}, or about $${Math.round(annual * 0.75).toLocaleString('en-US')}/year depending on your state.`,
      },
    ],
  };
});

// ── Mortgage Payment Pages ──
const homeAmounts = [
  100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000,
  500000, 550000, 600000, 700000, 800000, 900000, 1000000
];

export const mortgagePages = homeAmounts.flatMap(price => {
  return [6.5, 7.0].map(rate => {
    const formatted = price >= 1000000
      ? `$${(price / 1000000).toFixed(0)}M`
      : `$${(price / 1000).toFixed(0)}K`;
    const downPayment = price * 0.2;
    const loanAmount = price - downPayment;
    const monthlyRate = rate / 100 / 12;
    const n = 360; // 30 years
    const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const totalPaid = payment * n;
    const totalInterest = totalPaid - loanAmount;

    return {
      slug: `mortgage-payment-on-${price}-house-${rate.toFixed(1).replace('.', '-')}-rate`,
      price,
      rate,
      downPayment,
      loanAmount,
      payment: payment.toFixed(0),
      totalInterest: totalInterest.toFixed(0),
      title: `Mortgage Payment on a ${formatted} House at ${rate}% (2026)`,
      description: `Monthly mortgage payment on a ${formatted} house at ${rate}% is ~$${payment.toFixed(0)}/mo with 20% down. See total interest and amortization breakdown.`,
      answer: `With 20% down ($${downPayment.toLocaleString('en-US')}), your monthly P&I payment on a ${formatted} house at ${rate}% is approximately **$${payment.toFixed(0)}/month**.`,
      steps: [
        `Home price: $${price.toLocaleString('en-US')}`,
        `Down payment (20%): $${downPayment.toLocaleString('en-US')}`,
        `Loan amount: $${loanAmount.toLocaleString('en-US')}`,
        `Interest rate: ${rate}% fixed (30-year)`,
        `Monthly P&I: $${payment.toFixed(0)}`,
        `Total interest over 30 years: $${Number(totalInterest.toFixed(0)).toLocaleString('en-US')}`,
        `Total paid: $${Number(totalPaid.toFixed(0)).toLocaleString('en-US')}`,
      ],
      parentCalc: { label: 'Mortgage Calculator', to: '/mortgage-calculator' },
      faqs: [
        {
          q: `What is the monthly payment on a ${formatted} house?`,
          a: `At ${rate}% with 20% down, the principal and interest payment is ~$${payment.toFixed(0)}/month. Add ~$${Math.round(price * 0.015 / 12)} for property tax and ~$${Math.round(price * 0.004 / 12)} for insurance for total PITI.`,
        },
        {
          q: `How much do I need to make to afford a ${formatted} house?`,
          a: `Using the 28% rule, you'd need a gross monthly income of ~$${Math.round(payment / 0.28).toLocaleString('en-US')} or ~$${Math.round(payment / 0.28 * 12).toLocaleString('en-US')}/year to comfortably afford the payment.`,
        },
        {
          q: `How much total interest will I pay on a ${formatted} mortgage?`,
          a: `Over 30 years at ${rate}%, you'll pay approximately $${Number(totalInterest.toFixed(0)).toLocaleString('en-US')} in total interest — that's ${((totalInterest / loanAmount) * 100).toFixed(0)}% of the loan amount.`,
        },
      ],
    };
  });
});

// ── Savings Milestone Pages ──
const savingsGoals = [1000, 5000, 10000, 15000, 20000, 25000, 50000, 100000, 250000, 500000, 1000000];
const monthlySavings = [200, 500, 1000];

export const savingsPages = savingsGoals.flatMap(goal => {
  return monthlySavings.map(monthly => {
    const goalFormatted = goal >= 1000000
      ? `$${(goal / 1000000).toFixed(0)}M`
      : goal >= 1000
      ? `$${(goal / 1000).toFixed(0)}K`
      : `$${goal}`;
    const monthsNeeded = Math.ceil(goal / monthly);
    const years = Math.floor(monthsNeeded / 12);
    const remainingMonths = monthsNeeded % 12;
    const timeStr = years > 0
      ? `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`
      : `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;

    return {
      slug: `how-long-to-save-${goal}-saving-${monthly}-per-month`,
      goal,
      monthly,
      monthsNeeded,
      title: `How Long to Save ${goalFormatted} Saving $${monthly}/Month?`,
      description: `At $${monthly}/month, it takes ${timeStr} to save ${goalFormatted} without interest. With a 5% APY savings account, you'll get there faster.`,
      answer: `Saving $${monthly}/month, it takes **${timeStr}** (${monthsNeeded} months) to reach ${goalFormatted} without interest.`,
      steps: [
        `Goal: ${goalFormatted}`,
        `Monthly savings: $${monthly}`,
        `Months needed: ${goalFormatted} ÷ $${monthly} = ${monthsNeeded} months`,
        `Time: ${timeStr}`,
        `With 5% APY: ~${Math.ceil(monthsNeeded * 0.9)} months (savings grow with compound interest)`,
      ],
      parentCalc: { label: 'Savings Goal Calculator', to: '/savings-goal-calculator' },
      faqs: [
        {
          q: `How long does it take to save ${goalFormatted}?`,
          a: `At $${monthly}/month, it takes ${timeStr}. At $${monthly * 2}/month, it would take roughly half that time.`,
        },
        {
          q: `Where should I keep my savings?`,
          a: `A high-yield savings account (HYSA) currently offers 4-5% APY, which can shave months off your goal. For goals over 1 year away, consider I-Bonds or CDs for slightly better rates.`,
        },
        {
          q: `How do I save $${monthly} per month?`,
          a: `Automate it: set up a recurring transfer from checking to savings on payday. Treat it like a bill. Even small increases matter — $${monthly + 50}/month instead of $${monthly} saves you ${Math.round(goal / (monthly + 50) - goal / monthly) * -1} months.`,
        },
      ],
    };
  });
});
