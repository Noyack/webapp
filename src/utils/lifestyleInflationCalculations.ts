import {
  LifestyleInflationInputs,
  LifestyleInflationResults,
  YearlyProjection,
  CategoryComparison,
  SpendingCategory,
  InflationSeverity,
  INFLATION_SEVERITY
} from '../types/lifestyleInflation';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Calculate income projections with raises
export const calculateIncomeProjections = (
  currentAnnualIncome: number,
  raiseFrequency: number,
  averageRaisePercentage: number,
  yearsToProject: number
): { year: number; income: number; raisePercentage?: number }[] => {
  const projections = [];
  let currentIncome = currentAnnualIncome;
  
  for (let year = 0; year <= yearsToProject; year++) {
    let raisePercentage: number | undefined;
    
    // Apply raise if it's a raise year
    if (year > 0 && year % raiseFrequency === 0) {
      raisePercentage = averageRaisePercentage;
      currentIncome = currentIncome * (1 + averageRaisePercentage / 100);
    }
    
    projections.push({
      year,
      income: currentIncome,
      raisePercentage
    });
  }
  
  return projections;
};

// Calculate spending for a category based on raises received
export const calculateCategorySpending = (
  category: SpendingCategory,
  raisesReceived: number
): number => {
  // Each raise increases spending by the category's inflation rate
  const inflationMultiplier = Math.pow(1 + category.inflationRate / 100, raisesReceived);
  return category.currentMonthlyAmount * inflationMultiplier * 12; // Convert to annual
};

// Calculate complete lifestyle inflation projections
export const calculateLifestyleInflationProjections = (
  inputs: LifestyleInflationInputs
): LifestyleInflationResults => {
  const incomeProjections = calculateIncomeProjections(
    inputs.currentIncome.annual,
    inputs.expectedRaises.frequency,
    inputs.expectedRaises.averagePercentage,
    inputs.expectedRaises.yearsToProject
  );
  
  const projections: YearlyProjection[] = [];
  let cumulativeWealthLoss = 0;
  
  // Calculate baseline spending (no lifestyle inflation)
  const baselineAnnualSpending = inputs.spendingCategories.reduce(
    (total, category) => total + (category.currentMonthlyAmount * 12),
    0
  );
  
  incomeProjections.forEach((projection, index) => {
    const raisesReceived = Math.floor(projection.year / inputs.expectedRaises.frequency);
    
    // Calculate spending for each category
    const spendingByCategory: { [categoryName: string]: number } = {};
    let totalSpending = 0;
    
    inputs.spendingCategories.forEach(category => {
      const categorySpending = calculateCategorySpending(category, raisesReceived);
      spendingByCategory[category.name] = categorySpending;
      totalSpending += categorySpending;
    });
    
    // Calculate savings
    const actualSavings = projection.income - totalSpending;
    const actualSavingsRate = (actualSavings / projection.income) * 100;
    const targetSavings = projection.income * (inputs.savingsGoals.targetSavingsRate / 100);
    const savingsShortfall = targetSavings - actualSavings;
    
    // Calculate lifestyle inflation amount (spending increase from baseline)
    const lifestyleInflationAmount = totalSpending - baselineAnnualSpending;
    
    // Calculate wealth loss (compounded)
    if (savingsShortfall > 0) {
      const yearlyWealthLoss = savingsShortfall * Math.pow(
        1 + inputs.investmentAssumptions.expectedReturn / 100,
        inputs.expectedRaises.yearsToProject - projection.year
      );
      cumulativeWealthLoss += yearlyWealthLoss;
    }
    
    projections.push({
      year: projection.year,
      income: projection.income,
      totalSpending,
      spendingByCategory,
      actualSavings,
      actualSavingsRate,
      targetSavings,
      savingsShortfall: Math.max(0, savingsShortfall),
      cumulativeWealthLoss,
      lifestyleInflationAmount
    });
  });
  
  // Calculate summary statistics
  const firstYear = projections[0];
  const lastYear = projections[projections.length - 1];
  
  const totalIncomeIncrease = lastYear.income - firstYear.income;
  const totalSpendingIncrease = lastYear.totalSpending - firstYear.totalSpending;
  const totalWealthLoss = projections.reduce((sum, p) => sum + p.savingsShortfall, 0);
  
  // Calculate time to financial goals
  const emergencyFundTarget = inputs.savingsGoals.emergencyFund;
  const yearsToGoalWithoutInflation = calculateYearsToGoal(
    firstYear.targetSavings,
    emergencyFundTarget,
    inputs.investmentAssumptions.expectedReturn
  );
  const yearsToGoalWithInflation = calculateYearsToGoal(
    lastYear.actualSavings,
    emergencyFundTarget,
    inputs.investmentAssumptions.expectedReturn
  );
  
  const recommendations = generateRecommendations(inputs, projections);
  
  return {
    projections,
    summary: {
      totalIncomeIncrease,
      totalSpendingIncrease,
      finalSavingsRate: lastYear.actualSavingsRate,
      totalWealthLoss,
      compoundedWealthLoss: cumulativeWealthLoss,
      yearsToFinancialGoal: {
        withInflation: yearsToGoalWithInflation,
        withoutInflation: yearsToGoalWithoutInflation,
        difference: yearsToGoalWithInflation - yearsToGoalWithoutInflation
      }
    },
    recommendations
  };
};

// Calculate years to reach a financial goal
const calculateYearsToGoal = (
  annualSavings: number,
  goalAmount: number,
  returnRate: number
): number => {
  if (annualSavings <= 0) return Infinity;
  
  // Using future value of annuity formula
  const monthlyRate = returnRate / 100 / 12;
  const monthlySavings = annualSavings / 12;
  
  if (monthlyRate === 0) {
    return goalAmount / annualSavings;
  }
  
  // FV = PMT * [((1 + r)^n - 1) / r]
  // Solve for n: n = ln(1 + (FV * r) / PMT) / ln(1 + r)
  const numerator = Math.log(1 + (goalAmount * monthlyRate) / monthlySavings);
  const denominator = Math.log(1 + monthlyRate);
  
  return (numerator / denominator) / 12; // Convert months to years
};

// Generate spending category comparisons
export const generateCategoryComparisons = (
  categories: SpendingCategory[],
  yearsToProject: number,
  raiseFrequency: number
): CategoryComparison[] => {
  const finalRaises = Math.floor(yearsToProject / raiseFrequency);
  
  return categories.map(category => {
    const yearOneSpending = category.currentMonthlyAmount * 12;
    const finalYearSpending = calculateCategorySpending(category, finalRaises);
    const totalIncrease = finalYearSpending - yearOneSpending;
    const percentageIncrease = (totalIncrease / yearOneSpending) * 100;
    
    return {
      category: category.name,
      yearOne: yearOneSpending,
      finalYear: finalYearSpending,
      totalIncrease,
      percentageIncrease,
      inflationRate: category.inflationRate
    };
  });
};

// Determine inflation severity level
export const getInflationSeverity = (averageInflationRate: number): InflationSeverity => {
  for (const [severity, config] of Object.entries(INFLATION_SEVERITY)) {
    if (averageInflationRate >= config.min && averageInflationRate <= config.max) {
      return severity as InflationSeverity;
    }
  }
  return 'EXTREME';
};

// Calculate average inflation rate across categories
export const calculateAverageInflationRate = (categories: SpendingCategory[]): number => {
  const totalSpending = categories.reduce((sum, cat) => sum + cat.currentMonthlyAmount, 0);
  const weightedInflation = categories.reduce(
    (sum, cat) => sum + (cat.inflationRate * cat.currentMonthlyAmount / totalSpending),
    0
  );
  return weightedInflation;
};

// Generate personalized recommendations
const generateRecommendations = (
  inputs: LifestyleInflationInputs,
  projections: YearlyProjection[]
): string[] => {
  const recommendations: string[] = [];
  const lastYear = projections[projections.length - 1];
  const averageInflation = calculateAverageInflationRate(inputs.spendingCategories);
  const severity = getInflationSeverity(averageInflation);
  
  // Severity-based recommendations
  if (severity === 'HIGH' || severity === 'EXTREME') {
    recommendations.push(
      "🚨 Your lifestyle inflation rate is very high. Consider implementing the 50% rule: save 50% of every raise."
    );
  }
  
  // Savings rate recommendations
  if (lastYear.actualSavingsRate < inputs.savingsGoals.targetSavingsRate) {
    recommendations.push(
      `💰 Your savings rate drops to ${lastYear.actualSavingsRate.toFixed(1)}% over time. Consider automating savings increases with each raise.`
    );
  }
  
  // Category-specific recommendations
  const highInflationCategories = inputs.spendingCategories
    .filter(cat => cat.inflationRate > 40)
    .sort((a, b) => b.inflationRate - a.inflationRate);
  
  if (highInflationCategories.length > 0) {
    recommendations.push(
      `🎯 Focus on controlling ${highInflationCategories[0].name} spending (${highInflationCategories[0].inflationRate}% inflation rate per raise).`
    );
  }
  
  // Wealth loss recommendations
  if (lastYear.cumulativeWealthLoss > 100000) {
    recommendations.push(
      "📈 Your lifestyle inflation could cost you over $100k in lost wealth. Consider the 'pay yourself first' strategy."
    );
  }
  
  // Emergency fund recommendations - calculate here instead of referencing inputs.summary
  const emergencyFundTarget = inputs.savingsGoals.emergencyFund;
  const yearsToGoalWithoutInflation = calculateYearsToGoal(
    projections[0].targetSavings,
    emergencyFundTarget,
    inputs.investmentAssumptions.expectedReturn
  );
  const yearsToGoalWithInflation = calculateYearsToGoal(
    lastYear.actualSavings,
    emergencyFundTarget,
    inputs.investmentAssumptions.expectedReturn
  );
  const yearsDelay = yearsToGoalWithInflation - yearsToGoalWithoutInflation;
  
  if (yearsDelay > 2) {
    recommendations.push(
      `⏰ Lifestyle inflation delays your emergency fund by ${yearsDelay.toFixed(1)} years. Consider separate savings automation.`
    );
  }
  
  // Positive reinforcement
  const lowInflationCategories = inputs.spendingCategories.filter(cat => cat.inflationRate < 20);
  if (lowInflationCategories.length > 0) {
    recommendations.push(
      `✅ Good job keeping ${lowInflationCategories[0].name} inflation low at ${lowInflationCategories[0].inflationRate}%.`
    );
  }
  
  return recommendations;
};

// Validate lifestyle inflation inputs
export const validateLifestyleInflationInputs = (
  inputs: LifestyleInflationInputs
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Income validation
  if (inputs.currentIncome.annual <= 0) {
    errors.push('Annual income must be greater than 0');
  }
  
  // Raise validation
  if (inputs.expectedRaises.frequency <= 0 || inputs.expectedRaises.frequency > 10) {
    errors.push('Raise frequency must be between 1 and 10 years');
  }
  
  if (inputs.expectedRaises.averagePercentage <= 0 || inputs.expectedRaises.averagePercentage > 50) {
    errors.push('Average raise percentage must be between 0% and 50%');
  }
  
  if (inputs.expectedRaises.yearsToProject <= 0 || inputs.expectedRaises.yearsToProject > 50) {
    errors.push('Years to project must be between 1 and 50');
  }
  
  // Spending validation
  if (inputs.spendingCategories.length === 0) {
    errors.push('At least one spending category is required');
  }
  
  const totalMonthlySpending = inputs.spendingCategories.reduce(
    (sum, cat) => sum + cat.currentMonthlyAmount,
    0
  );
  
  if (totalMonthlySpending >= inputs.currentIncome.monthly) {
    errors.push('Total monthly spending cannot exceed monthly income');
  }
  
  // Savings validation
  if (inputs.savingsGoals.currentSavingsRate < 0 || inputs.savingsGoals.currentSavingsRate > 100) {
    errors.push('Current savings rate must be between 0% and 100%');
  }
  
  if (inputs.savingsGoals.targetSavingsRate < 0 || inputs.savingsGoals.targetSavingsRate > 100) {
    errors.push('Target savings rate must be between 0% and 100%');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 