import { RetirementInputs, RetirementResults } from '../types/retirement';

// Helper function for formatting currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper function for formatting percentages
export const formatPercent = (percent: number): string => {
  return `${percent.toFixed(1)}%`;
};

// Calculate total monthly expenses
export const getTotalMonthlyExpenses = (monthlyExpenses: RetirementInputs['monthlyExpenses']): number => {
  const { housing, utilities, food, transportation, healthcare, entertainment, other } = monthlyExpenses;
  return housing + utilities + food + transportation + healthcare + entertainment + other;
};

// Main retirement calculation function
export const calculateRetirement = (
  inputs: RetirementInputs,
  costOfLivingIndex: number
): RetirementResults => {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    expectedAnnualReturn,
    expectedInflation,
    currentAnnualIncome,
    desiredIncomeReplacement,
    socialSecurityBenefits,
    otherIncome,
    monthlyExpenses,
    estimatedTaxRate
  } = inputs;

  // Calculate real rate of return (after inflation)
  const realAnnualReturn = ((1 + expectedAnnualReturn / 100) / (1 + expectedInflation / 100) - 1) * 100;
  const realMonthlyReturn = Math.pow(1 + realAnnualReturn / 100, 1 / 12) - 1;

  // Calculate savings needed at retirement
  const inflationAdjustedIncome = currentAnnualIncome * Math.pow(1 + expectedInflation / 100, retirementAge - currentAge);
  const desiredRetirementIncome = inflationAdjustedIncome * (desiredIncomeReplacement / 100);
  const socialSecurityAnnual = socialSecurityBenefits * 12 * Math.pow(1 + expectedInflation / 100, retirementAge - currentAge);
  const otherIncomeAnnual = otherIncome * 12 * Math.pow(1 + expectedInflation / 100, retirementAge - currentAge);
  const annualIncomeNeeded = desiredRetirementIncome - socialSecurityAnnual - otherIncomeAnnual;

  // Adjust for cost of living in selected location
  const colAdjustedIncomeNeeded = annualIncomeNeeded * (costOfLivingIndex / 100);

  // Calculate expense-based approach (more realistic than income replacement)
  const currentTotalExpenses = Object.values(monthlyExpenses).reduce((sum, expense) => sum + expense, 0) * 12;
  const inflationAdjustedExpenses = currentTotalExpenses * Math.pow(1 + expectedInflation / 100, retirementAge - currentAge);
  const expenseBasedNeed = Math.max(0, (inflationAdjustedExpenses * (costOfLivingIndex / 100)) - socialSecurityAnnual - otherIncomeAnnual);

  // Use the HIGHER of income replacement or actual expense needs for more realistic planning
  const actualAnnualNeed = Math.max(colAdjustedIncomeNeeded, expenseBasedNeed);

  // Calculate total savings needed using the 4% rule
  const requiredSavings = Math.max(0, actualAnnualNeed / 0.04);

  // Calculate taxes
  const totalTaxPaid = actualAnnualNeed * (estimatedTaxRate / 100);

  // Project savings growth until retirement
  const yearlySavingsChart = [];
  let currentSavingsValue = currentSavings;
  let totalContributions = 0;

  for (let age = currentAge; age <= lifeExpectancy; age++) {
    // Stop adding contributions once retirement age is reached
    const contributionsThisYear = age < retirementAge ? monthlyContribution * 12 : 0;

    // Project total expenses with inflation
    const totalExpenses = Object.values(monthlyExpenses).reduce((sum, expense) => 
      sum + expense * 12 * Math.pow(1 + expectedInflation / 100, age - currentAge), 0);

    // Add contributions and calculate interest
    if (age < retirementAge) {
      totalContributions += contributionsThisYear;
      
      const interestEarned = currentSavingsValue * (expectedAnnualReturn / 100);
      currentSavingsValue = currentSavingsValue + interestEarned + contributionsThisYear;
    } else {
      // In retirement, use more conservative returns with age-based glide path
      const yearsIntoRetirement = age - retirementAge;
      const inflationAdjustment = Math.pow(1 + expectedInflation / 100, yearsIntoRetirement);
      const yearlyWithdrawal = actualAnnualNeed * inflationAdjustment;
      
      // Age-based asset allocation: reduce equity exposure with age
      // Rule of thumb: 110 - age = equity percentage, rest in bonds
      const equityPercentage = Math.max(20, Math.min(80, 110 - age)) / 100;
      const bondPercentage = 1 - equityPercentage;
      
      // Conservative return assumptions during retirement
      const equityReturn = expectedAnnualReturn / 100; // Use input return for stocks
      const bondReturn = 0.035; // 3.5% for bonds
      const portfolioReturn = (equityPercentage * equityReturn) + (bondPercentage * bondReturn);
      
      // Add sequence of returns risk: slightly reduce returns in early retirement
      const sequenceRiskAdjustment = yearsIntoRetirement < 5 ? 0.01 : 0; // 1% reduction first 5 years
      const adjustedReturn = Math.max(0.01, portfolioReturn - sequenceRiskAdjustment);
      
      const interestEarned = Math.max(0, currentSavingsValue * adjustedReturn);
      currentSavingsValue = Math.max(0, currentSavingsValue + interestEarned - yearlyWithdrawal);
    }

    yearlySavingsChart.push({
      age,
      savings: currentSavingsValue,
      contributions: totalContributions,
      interest: currentSavingsValue - totalContributions - currentSavings,
      yearsInRetirement: age - retirementAge,
      realMonthlyReturn: realMonthlyReturn,
      totalExpenses: totalExpenses
    });
  }

  // Get projected savings at retirement age
  const projectedSavingsObj = yearlySavingsChart.find(item => item.age === retirementAge);
  const projectedSavings = projectedSavingsObj ? projectedSavingsObj.savings : 0;

  // Calculate monthly retirement income
  const sustainableMonthlyWithdrawal = (projectedSavings * 0.04) / 12;
  const monthlyRetirementIncome = sustainableMonthlyWithdrawal + socialSecurityBenefits + otherIncome;

  // Calculate shortfall (if any)
  const savingsShortfall = Math.max(0, requiredSavings - projectedSavings);

  // Create retirement income chart
  const retirementIncomeChart = [];

  // Calculate projected monthly expenses in retirement
  const inflationMultiplier = Math.pow(1 + expectedInflation / 100, retirementAge - currentAge);
  const projectedMonthlyExpenses = {
    housing: monthlyExpenses.housing * inflationMultiplier,
    utilities: monthlyExpenses.utilities * inflationMultiplier,
    food: monthlyExpenses.food * inflationMultiplier,
    transportation: monthlyExpenses.transportation * inflationMultiplier,
    healthcare: monthlyExpenses.healthcare * inflationMultiplier * 1.5, // Healthcare typically increases faster
    entertainment: monthlyExpenses.entertainment * inflationMultiplier,
    other: monthlyExpenses.other * inflationMultiplier
  };

  const totalMonthlyExpenses = Object.values(projectedMonthlyExpenses).reduce((sum, value) => sum + value, 0);

  for (let age = retirementAge; age <= lifeExpectancy; age++) {
    const yearsIntoRetirement = age - retirementAge;
    
    // Adjust for inflation each year
    const yearlyInflation = Math.pow(1 + expectedInflation / 100, yearsIntoRetirement);
    const incomeThisYear = monthlyRetirementIncome * yearlyInflation;
    const expensesThisYear = totalMonthlyExpenses * yearlyInflation;
    
    // Get savings from the savings chart
    const savingsObj = yearlySavingsChart.find(item => item.age === age);
    const savingsThisYear = savingsObj ? savingsObj.savings : 0;
    
    retirementIncomeChart.push({
      age,
      income: incomeThisYear,
      expenses: expensesThisYear,
      savings: savingsThisYear
    });
  }

  // Create retirement by category chart
  const totalExpenses = Object.values(projectedMonthlyExpenses).reduce((sum, val) => sum + val, 0) * 12;
  const retirementByCategory = [
    { name: 'Housing', value: projectedMonthlyExpenses.housing * 12 },
    { name: 'Healthcare', value: projectedMonthlyExpenses.healthcare * 12 },
    { name: 'Food', value: projectedMonthlyExpenses.food * 12 },
    { name: 'Transportation', value: projectedMonthlyExpenses.transportation * 12 },
    { name: 'Utilities', value: projectedMonthlyExpenses.utilities * 12 },
    { name: 'Entertainment', value: projectedMonthlyExpenses.entertainment * 12 },
    { name: 'Other', value: projectedMonthlyExpenses.other * 12 }
  ];

  // Calculate savings needed for each expense category
  const savingsNeededByExpense = [
    { expense: 'Housing', amountNeeded: (projectedMonthlyExpenses.housing * 12) / 0.04 },
    { expense: 'Healthcare', amountNeeded: (projectedMonthlyExpenses.healthcare * 12) / 0.04 },
    { expense: 'Food', amountNeeded: (projectedMonthlyExpenses.food * 12) / 0.04 },
    { expense: 'Transportation', amountNeeded: (projectedMonthlyExpenses.transportation * 12) / 0.04 },
    { expense: 'Utilities', amountNeeded: (projectedMonthlyExpenses.utilities * 12) / 0.04 },
    { expense: 'Entertainment', amountNeeded: (projectedMonthlyExpenses.entertainment * 12) / 0.04 },
    { expense: 'Other', amountNeeded: (projectedMonthlyExpenses.other * 12) / 0.04 }
  ];

  return {
    requiredSavings,
    projectedSavings,
    monthlyRetirementIncome,
    savingsShortfall,
    yearlySavingsChart,
    retirementIncomeChart,
    retirementByCategory,
    savingsNeededByExpense,
    totalTaxPaid,
    totalExpenses
  };
};

// Function to calculate additional monthly contribution needed
export const calculateAdditionalContribution = (
  savingsShortfall: number,
  currentAge: number,
  retirementAge: number,
  expectedAnnualReturn: number
): number => {
  if (savingsShortfall <= 0) return 0;

  const yearsToRetirement = retirementAge - currentAge;
  const monthlyRate = expectedAnnualReturn / 100 / 12;
  const totalMonths = yearsToRetirement * 12;

  // PMT = FV * r / ((1 + r)^n - 1)
  return savingsShortfall * (monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1));
}; 