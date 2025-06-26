// /monte-carlo-engine/adapters/RetirementAdapter.ts

import {
  BaseSimulationInputs,
  BaseSimulationResults,
  MarketScenario,
  SimulationAdapter,
  SimulationParameters,
  AssetAllocation
} from '../core/types';
import { RISK_PROFILES, AssetAllocationCalculator, MarketParameterUtils } from '../config/MarketParameters';

// Retirement-specific input interface (compatible with your existing RetirementInputs)
export interface RetirementInputs extends BaseSimulationInputs {
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  currentAnnualIncome: number;
  desiredIncomeReplacement: number;
  socialSecurityBenefits: number;
  otherIncome: number;
  monthlyExpenses: Record<string, number>;
  expectedInflation?: number;
  riskProfile?: 'conservative' | 'moderate' | 'aggressive';
  assetAllocation?: AssetAllocation;
}

// Retirement-specific results interface
export interface RetirementResults extends BaseSimulationResults {
  expectedMonthlyIncome: number;
  incomeReplacementRatio: number;
  socialSecurityCoverage: number;
  shortfallProbability: number;
  averageYearsUntilDepletion?: number;
  recommendations: string[];
}

export class RetirementAdapter implements SimulationAdapter<RetirementInputs, RetirementResults> {
  
  prepareSimulationParameters(inputs: RetirementInputs): SimulationParameters {
    // Determine asset allocation
    let assetAllocation: AssetAllocation;
    
    if (inputs.assetAllocation) {
      assetAllocation = inputs.assetAllocation;
    } else if (inputs.riskProfile) {
      assetAllocation = RISK_PROFILES[inputs.riskProfile.toUpperCase()].assetAllocation;
    } else {
      // Default: age-based allocation
      assetAllocation = AssetAllocationCalculator.calculateByAge(inputs.currentAge, 'moderate');
    }
    
    // Blend market parameters based on asset allocation
    const marketParameters = MarketParameterUtils.blendMarketParameters(assetAllocation);
    
    // Adjust for retirement time horizon
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const adjustedParameters = MarketParameterUtils.adjustForTimePeriod(marketParameters, yearsToRetirement);
    
    return {
      marketParameters: adjustedParameters,
      assetAllocation,
      riskAdjustments: {
        sequenceOfReturnsRisk: true,
        longevityRisk: true,
        inflationRisk: true
      }
    };
  }
  
  runSingleScenario(
    inputs: RetirementInputs,
    scenario: MarketScenario,
    scenarioId: number
  ): RetirementResults['scenarios'][0] {
    let currentSavingsValue = inputs.currentSavings;
    let yearIndex = 0;
    let success = true;
    let yearsDepleted: number | undefined;
    let cumulativeInflation = 1.0;
    
    // Calculate withdrawal strategies (same as your original logic)
    const baseTargetAnnualIncome = (inputs.currentAnnualIncome * inputs.desiredIncomeReplacement / 100);
    const socialSecurityAnnual = inputs.socialSecurityBenefits * 12;
    const otherIncomeAnnual = inputs.otherIncome * 12;
    const incomeBasedNeeds = Math.max(0, baseTargetAnnualIncome - socialSecurityAnnual - otherIncomeAnnual);
    
    // Expense-based approach
    const currentTotalExpenses = Object.values(inputs.monthlyExpenses).reduce((sum, expense) => sum + expense, 0) * 12;
    const inflationAdjustedExpenses = currentTotalExpenses * Math.pow(1 + (inputs.expectedInflation || 2.5) / 100, inputs.retirementAge - inputs.currentAge);
    const expenseBasedNeeds = Math.max(0, inflationAdjustedExpenses - socialSecurityAnnual - otherIncomeAnnual);
    
    // Use the higher of the two approaches
    const baseNeededFromSavings = Math.max(incomeBasedNeeds, expenseBasedNeeds);
    
    for (let age = inputs.currentAge; age <= inputs.lifeExpectancy; age++) {
      const marketReturn = scenario.returns[yearIndex] || 0.07;
      const inflationRate = scenario.inflationRates[yearIndex] || 0.025;
      const bondReturn = scenario.bondReturns?.[yearIndex] || 0.035;
      
      if (age < inputs.retirementAge) {
        // Accumulation phase
        const contributions = inputs.monthlyContribution * 12;
        const interestEarned = currentSavingsValue * marketReturn;
        currentSavingsValue = currentSavingsValue + interestEarned + contributions;
      } else {
        // Withdrawal phase
        if (age === inputs.retirementAge) {
          cumulativeInflation = 1.0;
        } else {
          cumulativeInflation *= (1 + inflationRate);
        }
        
        const yearlyWithdrawal = baseNeededFromSavings * cumulativeInflation;
        
        // Dynamic asset allocation based on age
        const yearsIntoRetirement = age - inputs.retirementAge;
        const equityPercentage = Math.max(20, Math.min(80, 110 - age)) / 100;
        const bondPercentage = 1 - equityPercentage;
        
        // Blended return based on allocation
        const adjustedMarketReturn = (equityPercentage * marketReturn) + (bondPercentage * bondReturn);
        
        // Sequence of returns risk in early retirement
        const sequenceRiskAdjustment = yearsIntoRetirement < 5 ? 0.01 : 0;
        const finalReturn = Math.max(0.005, adjustedMarketReturn - sequenceRiskAdjustment);
        
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
      yearsDepleted,
      additionalMetrics: {
        baseWithdrawalNeed: baseNeededFromSavings,
        finalCumulativeInflation: cumulativeInflation
      }
    };
  }
  
  calculateYearlyProgression(inputs: RetirementInputs, scenario: MarketScenario): number[] {
    let tempSavings = inputs.currentSavings;
    let cumulativeInflation = 1.0;
    const yearlyBalances: number[] = [];
    
    // Same withdrawal calculation logic as runSingleScenario
    const baseTargetAnnualIncome = (inputs.currentAnnualIncome * inputs.desiredIncomeReplacement / 100);
    const socialSecurityAnnual = inputs.socialSecurityBenefits * 12;
    const otherIncomeAnnual = inputs.otherIncome * 12;
    const incomeBasedNeeds = Math.max(0, baseTargetAnnualIncome - socialSecurityAnnual - otherIncomeAnnual);
    
    const currentTotalExpenses = Object.values(inputs.monthlyExpenses).reduce((sum, expense) => sum + expense, 0) * 12;
    const inflationAdjustedExpenses = currentTotalExpenses * Math.pow(1 + (inputs.expectedInflation || 2.5) / 100, inputs.retirementAge - inputs.currentAge);
    const expenseBasedNeeds = Math.max(0, inflationAdjustedExpenses - socialSecurityAnnual - otherIncomeAnnual);
    
    const baseNeededFromSavings = Math.max(incomeBasedNeeds, expenseBasedNeeds);
    
    let yearIndex = 0;
    
    for (let age = inputs.currentAge; age <= inputs.lifeExpectancy; age++) {
      const marketReturn = scenario.returns[yearIndex] || 0.07;
      const inflationRate = scenario.inflationRates[yearIndex] || 0.025;
      const bondReturn = scenario.bondReturns?.[yearIndex] || 0.035;
      
      if (age < inputs.retirementAge) {
        // Accumulation phase
        const contributions = inputs.monthlyContribution * 12;
        const interestEarned = tempSavings * marketReturn;
        tempSavings = tempSavings + interestEarned + contributions;
      } else {
        // Withdrawal phase
        if (age === inputs.retirementAge) {
          cumulativeInflation = 1.0;
        } else {
          cumulativeInflation *= (1 + inflationRate);
        }
        
        const yearlyWithdrawal = baseNeededFromSavings * cumulativeInflation;
        
        // Dynamic asset allocation
        const yearsIntoRetirement = age - inputs.retirementAge;
        const equityPercentage = Math.max(20, Math.min(80, 110 - age)) / 100;
        const bondPercentage = 1 - equityPercentage;
        
        const adjustedMarketReturn = (equityPercentage * marketReturn) + (bondPercentage * bondReturn);
        const sequenceRiskAdjustment = yearsIntoRetirement < 5 ? 0.01 : 0;
        const finalReturn = Math.max(0.005, adjustedMarketReturn - sequenceRiskAdjustment);
        
        const interestEarned = tempSavings * finalReturn;
        tempSavings = Math.max(0, tempSavings + interestEarned - yearlyWithdrawal);
      }
      
      yearlyBalances.push(tempSavings);
      yearIndex++;
    }
    
    return yearlyBalances;
  }
  
  evaluateSuccess(finalBalance: number, inputs: RetirementInputs): boolean {
    return finalBalance > 0;
  }
  
  generateRecommendations(results: RetirementResults, inputs: RetirementInputs): string[] {
    const recommendations: string[] = [];
    
    // Success probability recommendations
    if (results.successProbability < 70) {
      recommendations.push(`Your plan has a ${results.successProbability.toFixed(1)}% success rate. Consider increasing monthly contributions or delaying retirement.`);
    }
    
    if (results.successProbability < 50) {
      recommendations.push("Critical: Major adjustments needed. Consider working 2-3 additional years or doubling your monthly contributions.");
    }
    
    // Income replacement recommendations
    if (results.incomeReplacementRatio < 70) {
      recommendations.push("Your projected retirement income may not maintain your current lifestyle. Aim for 70-90% income replacement.");
    }
    
    // Social Security optimization
    if (results.socialSecurityCoverage < 40) {
      recommendations.push("Consider maximizing Social Security benefits by delaying retirement until full retirement age or beyond.");
    }
    
    // Asset allocation recommendations
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    if (yearsToRetirement > 10 && inputs.riskProfile === 'conservative') {
      recommendations.push("With over 10 years to retirement, consider a more aggressive investment approach to maximize growth potential.");
    }
    
    if (yearsToRetirement < 5 && inputs.riskProfile === 'aggressive') {
      recommendations.push("As retirement approaches, consider reducing portfolio risk to protect against sequence of returns risk.");
    }
    
    // Contribution recommendations
    const currentContributionRate = (inputs.monthlyContribution * 12) / inputs.currentAnnualIncome;
    if (currentContributionRate < 0.15) {
      recommendations.push(`Consider increasing your savings rate. You're currently saving ${(currentContributionRate * 100).toFixed(1)}% of income. Aim for 15-20%.`);
    }
    
    // Emergency fund
    const monthlyExpenses = Object.values(inputs.monthlyExpenses).reduce((sum, expense) => sum + expense, 0);
    const emergencyFundMonths = inputs.currentSavings / monthlyExpenses;
    if (emergencyFundMonths < 6) {
      recommendations.push("Build an emergency fund of 6-12 months of expenses before increasing retirement contributions.");
    }
    
    return recommendations;
  }
  
  // Additional retirement-specific calculations
  calculateRetirementMetrics(results: BaseSimulationResults, inputs: RetirementInputs): RetirementResults {
    // Calculate expected monthly income using 4% rule
    const expectedMonthlyIncome = (results.medianOutcome * 0.04) / 12;
    
    // Calculate income replacement ratio
    const currentMonthlyIncome = inputs.currentAnnualIncome / 12;
    const incomeReplacementRatio = (expectedMonthlyIncome / currentMonthlyIncome) * 100;
    
    // Calculate Social Security coverage
    const socialSecurityCoverage = (inputs.socialSecurityBenefits / currentMonthlyIncome) * 100;
    
    // Calculate shortfall probability
    const shortfallProbability = results.probabilityOfDepletion;
    
    // Calculate average years until depletion for failed scenarios
    const failedScenarios = results.scenarios.filter(s => !s.success && s.yearsDepleted);
    const averageYearsUntilDepletion = failedScenarios.length > 0 
      ? failedScenarios.reduce((sum, s) => sum + (s.yearsDepleted! - inputs.retirementAge), 0) / failedScenarios.length
      : undefined;
    
    const recommendations = this.generateRecommendations({
      ...results,
      expectedMonthlyIncome,
      incomeReplacementRatio,
      socialSecurityCoverage,
      shortfallProbability,
      averageYearsUntilDepletion,
      recommendations: []
    } as RetirementResults, inputs);
    
    return {
      ...results,
      expectedMonthlyIncome,
      incomeReplacementRatio,
      socialSecurityCoverage,
      shortfallProbability,
      averageYearsUntilDepletion,
      recommendations
    };
  }
}