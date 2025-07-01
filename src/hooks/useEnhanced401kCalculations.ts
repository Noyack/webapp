// src/hooks/useEnhanced401kCalculations.ts
// Custom hook for all 401(k) calculations with performance optimization

import { useCallback, useMemo } from 'react';
import { 
  FourOhOneKData, 
  EnhancedCalculations, 
  RetirementIncome, 
  SavingsAssessment,
  NATIONAL_AVERAGES,
  CONTRIBUTION_LIMITS,
  formatCurrency,
  getAgeGroup,
  calculateMarginalTaxRate
} from '../utils/fourOhOneK';

export const useEnhanced401kCalculations = (data: FourOhOneKData) => {
  
  // Main calculations with memoization
  const calculations = useMemo((): EnhancedCalculations => {
    const yearsToRetirement = Math.max(0, data.retirementAge - data.currentAge);
    const monthlyIncome = data.annualIncome / 12;
    
    // Calculate contribution percent more safely
    const contributionPercent = data.annualIncome > 0 ? 
      (data.monthlyContribution * 12) / data.annualIncome * 100 : 0;
    
    // Enhanced employer match with catch-up
    const baseContribution = data.monthlyContribution * 12;
    const catchUpContribution = data.includeCatchUp && data.currentAge >= 50 ? CONTRIBUTION_LIMITS.catchUp : 0;
    const totalAnnualContribution = baseContribution + catchUpContribution;
    
    const maxEmployerMatch = data.annualIncome > 0 ? 
      (data.annualIncome * data.employerMatchLimit / 100) * (data.employerMatch / 100) : 0;
    const currentEmployerMatch = Math.min(
      baseContribution * (data.employerMatch / 100),
      maxEmployerMatch
    );
    const monthlyEmployerMatch = currentEmployerMatch / 12;
    
    // Enhanced projections with account type considerations
    const calculateFutureValue = () => {
      if (yearsToRetirement <= 0) {
        return {
          projections: [],
          totalTradContributions: 0,
          totalRothContributions: 0,
          totalEmployerMatch: 0
        };
      }

      let balance = data.currentBalance;
      let yearlyContribution = totalAnnualContribution;
      let yearlyEmployerMatch = currentEmployerMatch;
      const netReturn = Math.max(0, (data.estimatedReturn - data.totalFees) / 100);
      
      const projections = [];
      let totalTradContributions = 0;
      let totalRothContributions = 0;
      let totalEmployerMatchAccumulated = 0;
      
      for (let year = 1; year <= yearsToRetirement; year++) {
        // Apply growth to existing balance
        balance = balance * (1 + netReturn);
        
        // Calculate Roth vs Traditional split
        const rothAmount = data.accountType === 'roth' ? yearlyContribution : 
                          data.accountType === 'mixed' ? yearlyContribution * (data.rothPercentage / 100) : 0;
        const traditionalAmount = yearlyContribution - rothAmount;
        
        // Add contributions and employer match
        balance += yearlyContribution + yearlyEmployerMatch;
        
        totalTradContributions += traditionalAmount;
        totalRothContributions += rothAmount;
        totalEmployerMatchAccumulated += yearlyEmployerMatch;
        
        const age = data.currentAge + year;
        const cumulativeContributions = totalTradContributions + totalRothContributions;
        const totalGrowth = balance - data.currentBalance - cumulativeContributions - totalEmployerMatchAccumulated;
        
        projections.push({
          year,
          age,
          balance,
          yearlyContribution,
          yearlyEmployerMatch,
          cumulativeContributions,
          cumulativeEmployerMatch: totalEmployerMatchAccumulated,
          totalGrowth,
          rothBalance: totalRothContributions > 0 ? 
            (totalRothContributions * Math.pow(1 + netReturn, year)) : 0,
          traditionalBalance: balance - (totalRothContributions > 0 ? 
            (totalRothContributions * Math.pow(1 + netReturn, year)) : 0)
        });
        
        // Apply income growth for next year
        if (data.includeInflation && data.incomeGrowthRate > 0) {
          const growthRate = data.incomeGrowthRate / 100;
          yearlyContribution *= (1 + growthRate);
          yearlyEmployerMatch *= (1 + growthRate);
        }
      }
      
      return { 
        projections, 
        totalTradContributions, 
        totalRothContributions, 
        totalEmployerMatch: totalEmployerMatchAccumulated 
      };
    };

    const { projections, totalTradContributions, totalRothContributions, totalEmployerMatch } = calculateFutureValue();
    const finalBalance = projections.length > 0 ? projections[projections.length - 1].balance : data.currentBalance;
    const totalContributions = totalTradContributions + totalRothContributions;
    const totalGrowth = finalBalance - data.currentBalance - totalContributions - totalEmployerMatch;

    // Tax considerations
    const calculateTaxBenefits = () => {
      const currentTaxRate = calculateMarginalTaxRate(data.annualIncome);
      const retirementTaxRate = Math.max(0.1, currentTaxRate - 0.04); // Assume lower bracket in retirement
      
      const traditionalSavings = totalTradContributions * currentTaxRate;
      const rothCost = totalRothContributions * currentTaxRate; // Tax paid upfront
      const traditionalTaxOwed = (finalBalance - totalRothContributions) * retirementTaxRate;
      
      return {
        traditionalSavings,
        rothCost,
        traditionalTaxOwed,
        netTaxAdvantage: traditionalSavings - rothCost - traditionalTaxOwed
      };
    };

    const taxBenefits = calculateTaxBenefits();

    // National comparison
    const ageGroup = getAgeGroup(data.currentAge);
    const averageBalanceForAge = NATIONAL_AVERAGES.averageBalance[ageGroup];
    
    const nationalComparison = {
      balancePercentile: averageBalanceForAge > 0 ? 
        Math.min(100, (data.currentBalance / averageBalanceForAge) * 50) : 50,
      contributionPercentile: NATIONAL_AVERAGES.contributionRate > 0 ? 
        Math.min(100, (contributionPercent / NATIONAL_AVERAGES.contributionRate) * 50) : 50
    };

    return {
      yearsToRetirement,
      monthlyIncome,
      contributionPercent,
      totalAnnualContribution,
      catchUpContribution,
      maxEmployerMatch,
      currentEmployerMatch,
      monthlyEmployerMatch,
      projections,
      finalBalance,
      totalContributions,
      totalTradContributions,
      totalRothContributions,
      totalEmployerMatch,
      totalGrowth,
      taxBenefits,
      nationalComparison
    };
  }, [data]);

  // Retirement income calculation
  const retirementIncome = useMemo((): RetirementIncome => {
    const monthlyWithdrawal = (calculations.finalBalance * 0.04) / 12; // 4% rule
    const totalMonthlyIncome = monthlyWithdrawal + data.socialSecurityEstimate;
    const replacementRatio = data.annualIncome > 0 ? 
      (totalMonthlyIncome * 12) / data.annualIncome * 100 : 0;
    
    return {
      monthlyWithdrawal,
      totalMonthlyIncome,
      replacementRatio,
      socialSecurityPortion: totalMonthlyIncome > 0 ? 
        (data.socialSecurityEstimate / totalMonthlyIncome) * 100 : 0
    };
  }, [calculations.finalBalance, data.socialSecurityEstimate, data.annualIncome]);

  // Savings assessment
  const savingsAssessment = useMemo((): SavingsAssessment => {
    const { contributionPercent } = calculations;
    const isOver50 = data.currentAge >= 50;
    const recommendedRate = isOver50 ? 20 : 15;
    
    if (contributionPercent >= recommendedRate) return { 
      level: 'Excellent', 
      color: 'success', 
      message: `Outstanding! You're saving ${contributionPercent.toFixed(1)}% - well above the ${recommendedRate}% target.`
    };
    if (contributionPercent >= 12) return { 
      level: 'Good', 
      color: 'success', 
      message: `Good progress at ${contributionPercent.toFixed(1)}%. Consider increasing to ${recommendedRate}% for optimal results.`
    };
    if (contributionPercent >= data.employerMatchLimit && data.employerMatchLimit > 0) return { 
      level: 'Fair', 
      color: 'warning', 
      message: `You're capturing the employer match. Try to increase beyond ${contributionPercent.toFixed(1)}%.`
    };
    if (contributionPercent >= 3) return { 
      level: 'Needs Improvement', 
      color: 'warning', 
      message: `At ${contributionPercent.toFixed(1)}%, you're under-saving. Aim for at least ${data.employerMatchLimit}% to get full employer match.`
    };
    return { 
      level: 'Critical', 
      color: 'error', 
      message: `Critical: ${contributionPercent.toFixed(1)}% is far below recommended levels. Start with ${data.employerMatchLimit}% for employer match.`
    };
  }, [calculations.contributionPercent, data.currentAge, data.employerMatchLimit]);

  // Chart data for visualizations
  const chartData = useMemo(() => {
    return calculations.projections.map(projection => ({
      ...projection,
      contributionGrowth: projection.cumulativeContributions,
      employerMatchGrowth: projection.cumulativeEmployerMatch,
      investmentGrowth: projection.totalGrowth,
      totalValue: projection.balance
    }));
  }, [calculations.projections]);

  // Helper function for fee calculations
  const calculateFutureValueWithFees = useCallback((feeRate: number) => {
    if (calculations.yearsToRetirement <= 0) return data.currentBalance;
    
    let balance = data.currentBalance;
    let yearlyContribution = data.monthlyContribution * 12;
    const netReturn = Math.max(0, (data.estimatedReturn - feeRate) / 100);
    const yearsToRetirement = data.retirementAge - data.currentAge;
    
    // Calculate employer match
    const baseContribution = data.monthlyContribution * 12;
    const maxEmployerMatch = data.annualIncome > 0 ? 
      (data.annualIncome * data.employerMatchLimit / 100) * (data.employerMatch / 100) : 0;
    const currentEmployerMatch = Math.min(
      baseContribution * (data.employerMatch / 100),
      maxEmployerMatch
    );
    
    for (let year = 1; year <= yearsToRetirement; year++) {
      balance = balance * (1 + netReturn);
      balance += yearlyContribution + currentEmployerMatch;
      
      if (data.includeInflation && data.incomeGrowthRate > 0) {
        yearlyContribution *= (1 + data.incomeGrowthRate / 100);
      }
    }
    
    return balance;
  }, [data, calculations.yearsToRetirement]);

  // Fee impact analysis
  const feeImpact = useMemo(() => {
    const withoutFees = calculateFutureValueWithFees(0);
    const withFees = calculations.finalBalance;
    return Math.max(0, withoutFees - withFees);
  }, [calculateFutureValueWithFees, calculations.finalBalance]);

  // Generate recommendations
  const recommendations = useMemo(() => {
    const recs = [];
    
    // Contribution rate recommendations
    if (calculations.contributionPercent < 15) {
      recs.push({
        type: 'contribution',
        priority: 'high',
        message: `Increase contribution rate to 15%+ for optimal retirement savings (currently ${calculations.contributionPercent.toFixed(1)}%)`
      });
    }
    
    // Employer match recommendations
    if (calculations.currentEmployerMatch < calculations.maxEmployerMatch && calculations.maxEmployerMatch > 0) {
      const missedAmount = calculations.maxEmployerMatch - calculations.currentEmployerMatch;
      recs.push({
        type: 'employer_match',
        priority: 'critical',
        message: `Missing ${missedAmount.toLocaleString()} in annual employer match - increase contribution to ${data.employerMatchLimit}%`
      });
    }
    
    // Fee recommendations
    if (data.totalFees > 1.5) {
      recs.push({
        type: 'fees',
        priority: 'medium',
        message: `High fees (${data.totalFees}%) could cost ${feeImpact.toLocaleString()} over time - consider lower-cost funds`
      });
    }
    
    // Income replacement recommendations
    if (retirementIncome.replacementRatio < 70) {
      recs.push({
        type: 'income_replacement',
        priority: 'high',
        message: `Projected ${retirementIncome.replacementRatio.toFixed(0)}% income replacement may be insufficient (target: 70-80%)`
      });
    }
    
    // Catch-up contribution recommendations
    if (data.currentAge >= 50 && !data.includeCatchUp) {
      recs.push({
        type: 'catch_up',
        priority: 'medium',
        message: `Consider catch-up contributions - you can contribute an extra ${CONTRIBUTION_LIMITS.catchUp.toLocaleString()} annually`
      });
    }
    
    // National comparison recommendations
    if (calculations.nationalComparison.balancePercentile < 50) {
      recs.push({
        type: 'balance',
        priority: 'medium',
        message: 'Your balance is below national average for your age group - consider increasing contributions'
      });
    }
    
    // Tax strategy recommendations
    if (data.accountType === 'traditional' && data.currentAge < 40 && data.annualIncome < 100000) {
      recs.push({
        type: 'tax_strategy',
        priority: 'low',
        message: 'Consider Roth 401(k) for tax diversification - pay taxes now while in a lower bracket'
      });
    }
    
    // High earner recommendations
    if (data.annualIncome > 150000 && calculations.contributionPercent < 20) {
      recs.push({
        type: 'high_earner',
        priority: 'medium',
        message: 'As a high earner, consider maximizing 401(k) contributions for significant tax benefits'
      });
    }
    
    return recs;
  }, [calculations, data, retirementIncome, feeImpact]);

  // Scenario analysis
  const scenarioAnalysis = useMemo(() => {
    const scenarios = [];
    
    // Increase contribution by 1%
    const increaseContribution = {
      name: 'Increase contribution by 1%',
      change: '+1% contribution',
      impact: calculateFutureValueWithFees(data.totalFees) * 0.15, // Rough estimate
      description: 'Small increase with significant long-term impact'
    };
    scenarios.push(increaseContribution);
    
    // Maximize employer match
    if (calculations.currentEmployerMatch < calculations.maxEmployerMatch) {
      const maximizeMatch = {
        name: 'Maximize employer match',
        change: `Contribute ${data.employerMatchLimit}%`,
        impact: (calculations.maxEmployerMatch - calculations.currentEmployerMatch) * calculations.yearsToRetirement * 2,
        description: 'Free money from your employer'
      };
      scenarios.push(maximizeMatch);
    }
    
    // Reduce fees by 0.5%
    if (data.totalFees > 1) {
      const reduceFees = {
        name: 'Reduce fees by 0.5%',
        change: 'Switch to lower-cost funds',
        impact: feeImpact * 0.5,
        description: 'Lower costs mean more money working for you'
      };
      scenarios.push(reduceFees);
    }
    
    return scenarios;
  }, [calculations, data, feeImpact, calculateFutureValueWithFees]);

  return {
    calculations,
    retirementIncome,
    savingsAssessment,
    chartData,
    feeImpact,
    recommendations,
    scenarioAnalysis,
    calculateFutureValueWithFees
  };
};