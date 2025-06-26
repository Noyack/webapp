// /monte-carlo-engine/adapters/FourOhOneKAdapter.ts

import {
  BaseSimulationInputs,
  BaseSimulationResults,
  MarketScenario,
  SimulationAdapter,
  SimulationParameters,
  AssetAllocation
} from '../core/types';
import { RISK_PROFILES, AssetAllocationCalculator, MarketParameterUtils } from '../config/MarketParameters';

// 401(k)-specific input interface
export interface FourOhOneKInputs extends BaseSimulationInputs {
  retirementAge: number;
  annualIncome: number;
  currentBalance: number;
  monthlyContribution: number;
  employerMatch: number; // percentage
  employerMatchLimit: number; // percentage of salary
  estimatedReturn: number;
  totalFees: number;
  includeInflation: boolean;
  inflationRate: number;
  incomeGrowthRate: number;
  riskProfile?: 'conservative' | 'moderate' | 'aggressive';
  assetAllocation?: AssetAllocation;
}

// 401(k)-specific results interface
export interface FourOhOneKResults extends BaseSimulationResults {
  totalEmployerMatch: number;
  totalContributions: number;
  totalGrowth: number;
  feeImpact: number;
  monthlyReplacementIncome: number;
  incomeReplacementRatio: number;
  maxEmployerMatch: number;
  employerMatchEfficiency: number;
  contributionRate: number;
  recommendations: string[];
}

export class FourOhOneKAdapter implements SimulationAdapter<FourOhOneKInputs, FourOhOneKResults> {
  
  prepareSimulationParameters(inputs: FourOhOneKInputs): SimulationParameters {
    // Determine asset allocation based on risk profile or age
    let assetAllocation: AssetAllocation;
    
    if (inputs.assetAllocation) {
      assetAllocation = inputs.assetAllocation;
    } else if (inputs.riskProfile) {
      assetAllocation = RISK_PROFILES[inputs.riskProfile.toUpperCase()].assetAllocation;
    } else {
      // Default: age-based allocation for 401(k)
      assetAllocation = AssetAllocationCalculator.calculateByAge(inputs.currentAge, 'moderate');
    }
    
    // Create market parameters based on user's expected return and fees
    const baseMarketParameters = MarketParameterUtils.blendMarketParameters(assetAllocation);
    
    // Override with user's expected return and adjust for fees
    const adjustedParameters = {
      ...baseMarketParameters,
      averageReturn: inputs.estimatedReturn / 100,
      standardDeviation: baseMarketParameters.standardDeviation, // Keep market volatility realistic
      averageInflation: inputs.inflationRate / 100,
      // Fees reduce net return
      bondReturn: Math.max(0.005, baseMarketParameters.bondReturn - inputs.totalFees / 100)
    };
    
    return {
      marketParameters: adjustedParameters,
      assetAllocation,
      riskAdjustments: {
        sequenceOfReturnsRisk: false, // Less relevant for accumulation phase
        longevityRisk: false,
        inflationRisk: inputs.includeInflation
      }
    };
  }
  
  runSingleScenario(
    inputs: FourOhOneKInputs,
    scenario: MarketScenario,
    scenarioId: number
  ): FourOhOneKResults['scenarios'][0] {
    let balance = inputs.currentBalance;
    let yearlyContribution = inputs.monthlyContribution * 12;
    let currentIncome = inputs.annualIncome;
    
    // Calculate employer match limits
    const maxEmployerMatch = (inputs.annualIncome * inputs.employerMatchLimit / 100) * (inputs.employerMatch / 100);
    let currentEmployerMatch = Math.min(
      yearlyContribution * (inputs.employerMatch / 100),
      maxEmployerMatch
    );
    
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    let totalContributions = inputs.currentBalance;
    let totalEmployerMatch = 0;
    let yearIndex = 0;
    
    for (let year = 1; year <= yearsToRetirement; year++) {
      // Get market return and inflation for this year
      const marketReturn = scenario.returns[yearIndex] || inputs.estimatedReturn / 100;
      const inflationRate = scenario.inflationRates[yearIndex] || inputs.inflationRate / 100;
      
      // Apply fees to the return
      const netReturn = marketReturn - (inputs.totalFees / 100);
      
      // Apply growth to existing balance
      balance = balance * (1 + netReturn);
      
      // Add contributions and employer match
      balance += yearlyContribution + currentEmployerMatch;
      totalContributions += yearlyContribution;
      totalEmployerMatch += currentEmployerMatch;
      
      // Apply income growth for next year if inflation is included
      if (inputs.includeInflation && year < yearsToRetirement) {
        const incomeGrowthRate = inputs.incomeGrowthRate / 100;
        currentIncome *= (1 + incomeGrowthRate);
        yearlyContribution *= (1 + incomeGrowthRate);
        
        // Recalculate employer match based on new income and contribution
        const newMaxEmployerMatch = (currentIncome * inputs.employerMatchLimit / 100) * (inputs.employerMatch / 100);
        currentEmployerMatch = Math.min(
          yearlyContribution * (inputs.employerMatch / 100),
          newMaxEmployerMatch
        );
      }
      
      yearIndex++;
    }
    
    const totalGrowth = balance - totalContributions - totalEmployerMatch;
    
    return {
      scenarioId,
      finalBalance: Math.max(0, balance),
      success: balance > 0, // Simple success criterion for 401(k)
      additionalMetrics: {
        totalContributions,
        totalEmployerMatch,
        totalGrowth,
        finalIncome: currentIncome
      }
    };
  }
  
  calculateYearlyProgression(inputs: FourOhOneKInputs, scenario: MarketScenario): number[] {
    let balance = inputs.currentBalance;
    let yearlyContribution = inputs.monthlyContribution * 12;
    let currentIncome = inputs.annualIncome;
    
    // Calculate employer match
    const maxEmployerMatch = (inputs.annualIncome * inputs.employerMatchLimit / 100) * (inputs.employerMatch / 100);
    let currentEmployerMatch = Math.min(
      yearlyContribution * (inputs.employerMatch / 100),
      maxEmployerMatch
    );
    
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const yearlyBalances: number[] = [];
    let yearIndex = 0;
    
    for (let year = 1; year <= yearsToRetirement; year++) {
      // Get market return for this year
      const marketReturn = scenario.returns[yearIndex] || inputs.estimatedReturn / 100;
      const inflationRate = scenario.inflationRates[yearIndex] || inputs.inflationRate / 100;
      
      // Apply fees to the return
      const netReturn = marketReturn - (inputs.totalFees / 100);
      
      // Apply growth to existing balance
      balance = balance * (1 + netReturn);
      
      // Add contributions and employer match
      balance += yearlyContribution + currentEmployerMatch;
      
      yearlyBalances.push(balance);
      
      // Apply income growth for next year if inflation is included
      if (inputs.includeInflation && year < yearsToRetirement) {
        const incomeGrowthRate = inputs.incomeGrowthRate / 100;
        currentIncome *= (1 + incomeGrowthRate);
        yearlyContribution *= (1 + incomeGrowthRate);
        
        // Recalculate employer match
        const newMaxEmployerMatch = (currentIncome * inputs.employerMatchLimit / 100) * (inputs.employerMatch / 100);
        currentEmployerMatch = Math.min(
          yearlyContribution * (inputs.employerMatch / 100),
          newMaxEmployerMatch
        );
      }
      
      yearIndex++;
    }
    
    return yearlyBalances;
  }
  
  evaluateSuccess(finalBalance: number, inputs: FourOhOneKInputs): boolean {
    // For 401(k), success is simply having a positive balance
    // Could be enhanced with target balance goals
    return finalBalance > 0;
  }
  
  generateRecommendations(results: FourOhOneKResults, inputs: FourOhOneKInputs): string[] {
    const recommendations: string[] = [];
    
    // Contribution rate recommendations
    if (results.contributionRate < 15) {
      recommendations.push(`Consider increasing your contribution rate to at least 15% for optimal retirement savings. You're currently at ${results.contributionRate.toFixed(1)}%.`);
    }
    
    // Employer match efficiency
    if (results.employerMatchEfficiency < 100) {
      const missedMatch = results.maxEmployerMatch - (results.totalEmployerMatch / (inputs.retirementAge - inputs.currentAge));
      recommendations.push(`You're missing out on $${missedMatch.toLocaleString()} in free employer matching annually. Consider increasing contributions to ${inputs.employerMatchLimit}%.`);
    } else {
      recommendations.push("Great! You're maximizing your employer match - free money!");
    }
    
    // Fee impact recommendations
    if (inputs.totalFees > 1.5) {
      recommendations.push(`High fees (${inputs.totalFees}%) can significantly impact long-term growth. Consider reviewing your fund choices for lower-cost options.`);
    }
    
    // Income replacement recommendations
    if (results.incomeReplacementRatio < 70) {
      recommendations.push(`Your projected retirement income may not be sufficient. You're on track for ${results.incomeReplacementRatio.toFixed(0)}% income replacement. Aim for 70-90%.`);
    }
    
    // Age-based recommendations
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    if (yearsToRetirement > 10) {
      recommendations.push("With over 10 years to retirement, time is your ally. Consistent contributions and staying invested through market volatility will benefit you.");
    }
    
    if (inputs.currentAge >= 50) {
      recommendations.push("You're eligible for catch-up contributions! You can contribute an additional $7,500 annually (2024 limits).");
    }
    
    // Asset allocation recommendations
    if (inputs.riskProfile === 'conservative' && yearsToRetirement > 15) {
      recommendations.push("With many years until retirement, consider a more aggressive investment approach to maximize growth potential.");
    }
    
    if (inputs.riskProfile === 'aggressive' && yearsToRetirement < 5) {
      recommendations.push("As retirement approaches, consider gradually reducing portfolio risk to protect your accumulated savings.");
    }
    
    return recommendations;
  }
  
  // Calculate 401(k)-specific metrics
  calculate401kMetrics(results: BaseSimulationResults, inputs: FourOhOneKInputs): FourOhOneKResults {
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    
    // Calculate total employer match (based on median scenario)
    const yearlyEmployerMatch = Math.min(
      (inputs.monthlyContribution * 12) * (inputs.employerMatch / 100),
      (inputs.annualIncome * inputs.employerMatchLimit / 100) * (inputs.employerMatch / 100)
    );
    
    // Estimate total employer match over career (simplified)
    let totalEmployerMatch = 0;
    let projectedContribution = inputs.monthlyContribution * 12;
    for (let year = 0; year < yearsToRetirement; year++) {
      totalEmployerMatch += Math.min(
        projectedContribution * (inputs.employerMatch / 100),
        yearlyEmployerMatch
      );
      if (inputs.includeInflation) {
        projectedContribution *= (1 + inputs.incomeGrowthRate / 100);
      }
    }
    
    // Calculate total contributions
    let totalContributions = inputs.currentBalance;
    let contribution = inputs.monthlyContribution * 12;
    for (let year = 0; year < yearsToRetirement; year++) {
      totalContributions += contribution;
      if (inputs.includeInflation) {
        contribution *= (1 + inputs.incomeGrowthRate / 100);
      }
    }
    
    // Calculate total growth
    const totalGrowth = results.medianOutcome - totalContributions - totalEmployerMatch;
    
    // Calculate fee impact (compare with 0% fees)
    const feeImpact = this.calculateFeeImpact(inputs, yearsToRetirement);
    
    // Calculate replacement income (4% rule)
    const monthlyReplacementIncome = (results.medianOutcome * 0.04) / 12;
    const incomeReplacementRatio = (monthlyReplacementIncome * 12) / inputs.annualIncome * 100;
    
    // Calculate max employer match and efficiency
    const maxEmployerMatch = (inputs.annualIncome * inputs.employerMatchLimit / 100) * (inputs.employerMatch / 100);
    const currentAnnualEmployerMatch = Math.min(
      (inputs.monthlyContribution * 12) * (inputs.employerMatch / 100),
      maxEmployerMatch
    );
    const employerMatchEfficiency = (currentAnnualEmployerMatch / maxEmployerMatch) * 100;
    
    // Calculate contribution rate
    const contributionRate = (inputs.monthlyContribution * 12) / inputs.annualIncome * 100;
    
    const recommendations = this.generateRecommendations({
      ...results,
      totalEmployerMatch,
      totalContributions,
      totalGrowth,
      feeImpact,
      monthlyReplacementIncome,
      incomeReplacementRatio,
      maxEmployerMatch,
      employerMatchEfficiency,
      contributionRate,
      recommendations: []
    } as FourOhOneKResults, inputs);
    
    return {
      ...results,
      totalEmployerMatch,
      totalContributions,
      totalGrowth,
      feeImpact,
      monthlyReplacementIncome,
      incomeReplacementRatio,
      maxEmployerMatch,
      employerMatchEfficiency,
      contributionRate,
      recommendations
    };
  }
  
  // Calculate the impact of fees over time
  private calculateFeeImpact(inputs: FourOhOneKInputs, yearsToRetirement: number): number {
    // Calculate future value with current fees
    const withFees = this.calculateFutureValue(inputs, inputs.totalFees);
    
    // Calculate future value without fees
    const withoutFees = this.calculateFutureValue(inputs, 0);
    
    return withoutFees - withFees;
  }
  
  // Simple future value calculation for fee comparison
  private calculateFutureValue(inputs: FourOhOneKInputs, feeRate: number): number {
    let balance = inputs.currentBalance;
    let yearlyContribution = inputs.monthlyContribution * 12;
    const netReturn = (inputs.estimatedReturn - feeRate) / 100;
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    
    // Calculate employer match
    const maxEmployerMatch = (inputs.annualIncome * inputs.employerMatchLimit / 100) * (inputs.employerMatch / 100);
    let yearlyEmployerMatch = Math.min(
      yearlyContribution * (inputs.employerMatch / 100),
      maxEmployerMatch
    );
    
    for (let year = 1; year <= yearsToRetirement; year++) {
      // Apply growth to existing balance
      balance = balance * (1 + netReturn);
      
      // Add contributions and employer match
      balance += yearlyContribution + yearlyEmployerMatch;
      
      // Apply income growth for next year if inflation is included
      if (inputs.includeInflation) {
        yearlyContribution *= (1 + inputs.incomeGrowthRate / 100);
        const newMaxEmployerMatch = maxEmployerMatch * Math.pow(1 + inputs.incomeGrowthRate / 100, year);
        yearlyEmployerMatch = Math.min(
          yearlyContribution * (inputs.employerMatch / 100),
          newMaxEmployerMatch
        );
      }
    }
    
    return balance;
  }
}