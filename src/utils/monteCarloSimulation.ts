import { RetirementInputs } from '../types/retirement';

export interface MonteCarloResults {
  successProbability: number;
  medianOutcome: number;
  worstCase10th: number;
  bestCase90th: number;
  confidenceIntervals: Array<{
    percentile: number;
    value: number;
  }>;
  probabilityOfDepletion: number;
  scenarios: Array<{
    scenarioId: number;
    finalBalance: number;
    success: boolean;
    yearsDepleted?: number;
  }>;
  yearlyProjections: Array<{
    age: number;
    percentile10: number;
    percentile25: number;
    median: number;
    percentile75: number;
    percentile90: number;
  }>;
}

interface MarketScenario {
  returns: number[];
  inflationRates: number[];
}

// Historical market data patterns (simplified for demo)
const MARKET_VOLATILITY = {
  averageReturn: 0.07,
  standardDeviation: 0.15,
  correlationToInflation: -0.3,
  averageInflation: 0.025,
  inflationVolatility: 0.015
};

// Generate random return using Box-Muller transformation for normal distribution
function generateNormalRandom(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + stdDev * z0;
}

// Generate correlated inflation rate
function generateInflationRate(marketReturn: number): number {
  const baseInflation = MARKET_VOLATILITY.averageInflation;
  const correlation = MARKET_VOLATILITY.correlationToInflation;
  const returnDeviation = (marketReturn - MARKET_VOLATILITY.averageReturn) / MARKET_VOLATILITY.standardDeviation;
  
  const correlatedComponent = correlation * returnDeviation * MARKET_VOLATILITY.inflationVolatility;
  const randomComponent = Math.sqrt(1 - correlation * correlation) * 
    generateNormalRandom(0, MARKET_VOLATILITY.inflationVolatility);
  
  return Math.max(0, baseInflation + correlatedComponent + randomComponent);
}

// Generate market scenario for the entire retirement period
function generateMarketScenario(yearsToProject: number): MarketScenario {
  const returns: number[] = [];
  const inflationRates: number[] = [];
  
  for (let year = 0; year < yearsToProject; year++) {
    const marketReturn = generateNormalRandom(
      MARKET_VOLATILITY.averageReturn,
      MARKET_VOLATILITY.standardDeviation
    );
    const inflationRate = generateInflationRate(marketReturn);
    
    returns.push(marketReturn);
    inflationRates.push(inflationRate);
  }
  
  return { returns, inflationRates };
}

// Run single Monte Carlo scenario
function runSingleScenario(
  inputs: RetirementInputs,
  costOfLivingIndex: number,
  scenario: MarketScenario,
  scenarioId: number
): MonteCarloResults['scenarios'][0] {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    currentAnnualIncome,
    desiredIncomeReplacement,
    socialSecurityBenefits,
    otherIncome,
    monthlyExpenses,
    expectedInflation
  } = inputs;
  
  let currentSavingsValue = currentSavings;
  let yearIndex = 0;
  let success = true;
  let yearsDepleted: number | undefined;
  let cumulativeInflation = 1.0;
  
  // Calculate TWO withdrawal strategies and use the higher amount
  
  // Strategy 1: Income replacement approach
  const baseTargetAnnualIncome = (currentAnnualIncome * desiredIncomeReplacement / 100) * (costOfLivingIndex / 100);
  const socialSecurityAnnual = socialSecurityBenefits * 12;
  const otherIncomeAnnual = otherIncome * 12;
  const incomeBasedNeeds = Math.max(0, baseTargetAnnualIncome - socialSecurityAnnual - otherIncomeAnnual);
  
  // Strategy 2: Expense-based approach (more realistic)
  const currentTotalExpenses = Object.values(monthlyExpenses).reduce((sum, expense) => sum + expense, 0) * 12;
  const inflationAdjustedExpenses = currentTotalExpenses * Math.pow(1 + (expectedInflation || 2.5) / 100, retirementAge - currentAge);
  const expenseBasedNeeds = Math.max(0, (inflationAdjustedExpenses * (costOfLivingIndex / 100)) - socialSecurityAnnual - otherIncomeAnnual);
  
  // Use the HIGHER of the two approaches to ensure adequate withdrawals
  const baseNeededFromSavings = Math.max(incomeBasedNeeds, expenseBasedNeeds);
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const marketReturn = scenario.returns[yearIndex] || MARKET_VOLATILITY.averageReturn;
    const inflationRate = scenario.inflationRates[yearIndex] || MARKET_VOLATILITY.averageInflation;
    
    if (age < retirementAge) {
      // Accumulation phase
      const contributions = monthlyContribution * 12;
      const interestEarned = currentSavingsValue * marketReturn;
      currentSavingsValue = currentSavingsValue + interestEarned + contributions;
    } else {
      // Withdrawal phase - update cumulative inflation each year in retirement
      if (age === retirementAge) {
        cumulativeInflation = 1.0;
      } else {
        cumulativeInflation *= (1 + inflationRate);
      }
      
      // Apply cumulative inflation to base withdrawal need
      const yearlyWithdrawal = baseNeededFromSavings * cumulativeInflation;
      
      // Age-based asset allocation during retirement for more realistic returns
      const yearsIntoRetirement = age - retirementAge;
      const equityPercentage = Math.max(20, Math.min(80, 110 - age)) / 100;
      const bondPercentage = 1 - equityPercentage;
      
      // Apply glide path to market returns
      const bondReturn = 0.035; // 3.5% baseline bond return
      const adjustedMarketReturn = (equityPercentage * marketReturn) + (bondPercentage * bondReturn);
      
      // Add sequence of returns risk in early retirement
      const sequenceRiskAdjustment = yearsIntoRetirement < 5 ? 0.01 : 0;
      const finalReturn = Math.max(0.005, adjustedMarketReturn - sequenceRiskAdjustment); // Min 0.5% return
      
      const interestEarned = currentSavingsValue * finalReturn;
      currentSavingsValue = currentSavingsValue + interestEarned - yearlyWithdrawal;
      
      // Check if depleted
      if (currentSavingsValue <= 0 && !yearsDepleted) {
        success = false;
        yearsDepleted = age;
        currentSavingsValue = 0;
      }
    }
    
    yearIndex++;
  }
  
  return {
    scenarioId,
    finalBalance: Math.max(0, currentSavingsValue),
    success,
    yearsDepleted
  };
}

// Helper function to calculate single scenario for yearly data (consistent with runSingleScenario)
function calculateYearlyScenario(
  inputs: RetirementInputs,
  costOfLivingIndex: number,
  scenario: MarketScenario
): number[] {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    currentAnnualIncome,
    desiredIncomeReplacement,
    socialSecurityBenefits,
    otherIncome,
    monthlyExpenses,
    expectedInflation
  } = inputs;
  
  let tempSavings = currentSavings;
  let cumulativeInflation = 1.0;
  const yearlyBalances: number[] = [];
  
  // Calculate TWO withdrawal strategies and use the higher amount (same as runSingleScenario)
  
  // Strategy 1: Income replacement approach
  const baseTargetAnnualIncome = (currentAnnualIncome * desiredIncomeReplacement / 100) * (costOfLivingIndex / 100);
  const socialSecurityAnnual = socialSecurityBenefits * 12;
  const otherIncomeAnnual = otherIncome * 12;
  const incomeBasedNeeds = Math.max(0, baseTargetAnnualIncome - socialSecurityAnnual - otherIncomeAnnual);
  
  // Strategy 2: Expense-based approach (more realistic)
  const currentTotalExpenses = Object.values(monthlyExpenses).reduce((sum, expense) => sum + expense, 0) * 12;
  const inflationAdjustedExpenses = currentTotalExpenses * Math.pow(1 + (expectedInflation || 2.5) / 100, retirementAge - currentAge);
  const expenseBasedNeeds = Math.max(0, (inflationAdjustedExpenses * (costOfLivingIndex / 100)) - socialSecurityAnnual - otherIncomeAnnual);
  
  // Use the HIGHER of the two approaches
  const baseNeededFromSavings = Math.max(incomeBasedNeeds, expenseBasedNeeds);
  
  let yearIndex = 0;
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const marketReturn = scenario.returns[yearIndex] || MARKET_VOLATILITY.averageReturn;
    const inflationRate = scenario.inflationRates[yearIndex] || MARKET_VOLATILITY.averageInflation;
    
    if (age < retirementAge) {
      // Accumulation phase
      const contributions = monthlyContribution * 12;
      const interestEarned = tempSavings * marketReturn;
      tempSavings = tempSavings + interestEarned + contributions;
    } else {
      // Withdrawal phase - update cumulative inflation each year in retirement
      if (age === retirementAge) {
        cumulativeInflation = 1.0;
      } else {
        cumulativeInflation *= (1 + inflationRate);
      }
      
      // Apply cumulative inflation to base withdrawal need
      const yearlyWithdrawal = baseNeededFromSavings * cumulativeInflation;
      
      // Age-based asset allocation during retirement for more realistic returns
      const yearsIntoRetirement = age - retirementAge;
      const equityPercentage = Math.max(20, Math.min(80, 110 - age)) / 100;
      const bondPercentage = 1 - equityPercentage;
      
      // Apply glide path to market returns
      const bondReturn = 0.035; // 3.5% baseline bond return
      const adjustedMarketReturn = (equityPercentage * marketReturn) + (bondPercentage * bondReturn);
      
      // Add sequence of returns risk in early retirement
      const sequenceRiskAdjustment = yearsIntoRetirement < 5 ? 0.01 : 0;
      const finalReturn = Math.max(0.005, adjustedMarketReturn - sequenceRiskAdjustment); // Min 0.5% return
      
      const interestEarned = tempSavings * finalReturn;
      tempSavings = Math.max(0, tempSavings + interestEarned - yearlyWithdrawal);
    }
    
    yearlyBalances.push(tempSavings);
    yearIndex++;
  }
  
  return yearlyBalances;
}

// Main Monte Carlo simulation function
export function runMonteCarloSimulation(
  inputs: RetirementInputs,
  costOfLivingIndex: number,
  numberOfSimulations: number = 10000
): MonteCarloResults {
  const yearsToProject = inputs.lifeExpectancy - inputs.currentAge + 1;
  const scenarios: MonteCarloResults['scenarios'] = [];
  const yearlyData: Array<Array<number>> = Array.from({ length: yearsToProject }, () => []);
  
  // Run simulations
  for (let i = 0; i < numberOfSimulations; i++) {
    const marketScenario = generateMarketScenario(yearsToProject);
    const result = runSingleScenario(inputs, costOfLivingIndex, marketScenario, i);
    scenarios.push(result);
    
    // Store yearly data for percentile calculations using consistent logic
    const yearlyBalances = calculateYearlyScenario(inputs, costOfLivingIndex, marketScenario);
    
    for (let yearIndex = 0; yearIndex < yearlyBalances.length; yearIndex++) {
      yearlyData[yearIndex].push(yearlyBalances[yearIndex]);
    }
  }
  
  // Calculate statistics
  const successfulScenarios = scenarios.filter(s => s.success);
  const successProbability = (successfulScenarios.length / scenarios.length) * 100;
  
  const finalBalances = scenarios.map(s => s.finalBalance).sort((a, b) => a - b);
  const medianOutcome = finalBalances[Math.floor(finalBalances.length * 0.5)];
  const worstCase10th = finalBalances[Math.floor(finalBalances.length * 0.1)];
  const bestCase90th = finalBalances[Math.floor(finalBalances.length * 0.9)];
  
  const probabilityOfDepletion = ((scenarios.length - successfulScenarios.length) / scenarios.length) * 100;
  
  // Calculate confidence intervals
  const confidenceIntervals = [10, 25, 50, 75, 90].map(percentile => ({
    percentile,
    value: finalBalances[Math.floor(finalBalances.length * (percentile / 100))]
  }));
  
  // Calculate yearly projections with percentiles
  const yearlyProjections = yearlyData.map((yearData, index) => {
    const sortedData = [...yearData].sort((a, b) => a - b); // Create copy to avoid mutating original
    return {
      age: inputs.currentAge + index,
      percentile10: sortedData[Math.floor(sortedData.length * 0.1)] || 0,
      percentile25: sortedData[Math.floor(sortedData.length * 0.25)] || 0,
      median: sortedData[Math.floor(sortedData.length * 0.5)] || 0,
      percentile75: sortedData[Math.floor(sortedData.length * 0.75)] || 0,
      percentile90: sortedData[Math.floor(sortedData.length * 0.9)] || 0
    };
  });
  
  return {
    successProbability,
    medianOutcome,
    worstCase10th,
    bestCase90th,
    confidenceIntervals,
    probabilityOfDepletion,
    scenarios: scenarios.slice(0, 100), // Return sample for visualization
    yearlyProjections
  };
} 