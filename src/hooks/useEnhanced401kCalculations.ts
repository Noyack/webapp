// hooks/useEnhanced401kCalculations.ts
// Custom hook for all 401(k) calculations with performance optimization

import { useCallback, useMemo } from 'react';
import { 
  FourOhOneKData, 
  EnhancedCalculations, 
  RetirementIncome, 
  SavingsAssessment,
  NATIONAL_AVERAGES,
  CONTRIBUTION_LIMITS,
  formatCurrency
} from '../utils/fourOhOneK';

export const useEnhanced401kCalculations = (data: FourOhOneKData) => {
  
  // Main calculations with memoization
  const calculations = useMemo((): EnhancedCalculations => {
    const yearsToRetirement = data.retirementAge - data.currentAge;
    const monthlyIncome = data.annualIncome / 12;
    const contributionPercent = (data.monthlyContribution * 12) / data.annualIncome * 100;
    
    // Enhanced employer match with catch-up
    const baseContribution = data.monthlyContribution * 12;
    const catchUpContribution = data.includeCatchUp && data.currentAge >= 50 ? CONTRIBUTION_LIMITS.catchUp : 0;
    const totalAnnualContribution = baseContribution + catchUpContribution;
    
    const maxEmployerMatch = (data.annualIncome * data.employerMatchLimit / 100) * (data.employerMatch / 100);
    const currentEmployerMatch = Math.min(
      baseContribution * (data.employerMatch / 100),
      maxEmployerMatch
    );
    const monthlyEmployerMatch = currentEmployerMatch / 12;
    
    // Enhanced projections with account type considerations
    const calculateFutureValue = () => {
      let balance = data.currentBalance;
      let yearlyContribution = totalAnnualContribution;
      let yearlyEmployerMatch = currentEmployerMatch;
      const netReturn = (data.estimatedReturn - data.totalFees) / 100;
      
      const projections = [];
      let totalTradContributions = 0;
      let totalRothContributions = 0;
      let totalEmployerMatch = 0;
      
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
        totalEmployerMatch += yearlyEmployerMatch;
        
        const age = data.currentAge + year;
        const cumulativeContributions = data.currentBalance + (totalTradContributions + totalRothContributions);
        const totalGrowth = balance - cumulativeContributions - totalEmployerMatch;
        
        projections.push({
          year,
          age,
          balance,
          yearlyContribution,
          yearlyEmployerMatch,
          cumulativeContributions,
          cumulativeEmployerMatch: totalEmployerMatch,
          totalGrowth,
          rothBalance: rothAmount > 0 ? (rothAmount * year * (1 + netReturn)) : 0,
          traditionalBalance: balance - (rothAmount > 0 ? (rothAmount * year * (1 + netReturn)) : 0)
        });
        
        // Apply income growth for next year
        if (data.includeInflation) {
          yearlyContribution *= (1 + data.incomeGrowthRate / 100);
          yearlyEmployerMatch *= (1 + data.incomeGrowthRate / 100);
        }
      }
      
      return { projections, totalTradContributions, totalRothContributions, totalEmployerMatch };
    };

    const { projections, totalTradContributions, totalRothContributions, totalEmployerMatch } = calculateFutureValue();
    const finalBalance = projections.length > 0 ? projections[projections.length - 1].balance : data.currentBalance;
    const totalContributions = totalTradContributions + totalRothContributions;
    const totalGrowth = finalBalance - totalContributions - totalEmployerMatch;

    // Tax considerations
    const calculateTaxBenefits = () => {
      const currentTaxRate = 0.22; // Assume 22% bracket
      const retirementTaxRate = 0.18; // Assume lower bracket in retirement
      
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
    const getAgeGroup = (age: number): keyof typeof NATIONAL_AVERAGES.averageBalance => {
      if (age < 30) return '20s';
      if (age < 40) return '30s';
      if (age < 50) return '40s';
      if (age < 60) return '50s';
      return '60s';
    };

    const nationalComparison = {
      balancePercentile: (data.currentBalance / NATIONAL_AVERAGES.averageBalance[getAgeGroup(data.currentAge)]) * 100,
      contributionPercentile: (contributionPercent / NATIONAL_AVERAGES.contributionRate) * 100
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
    const replacementRatio = (totalMonthlyIncome * 12) / data.annualIncome * 100;
    
    return {
      monthlyWithdrawal,
      totalMonthlyIncome,
      replacementRatio,
      socialSecurityPortion: (data.socialSecurityEstimate / totalMonthlyIncome) * 100
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
    if (contributionPercent >= data.employerMatchLimit) return { 
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
    let balance = data.currentBalance;
    let yearlyContribution = data.monthlyContribution * 12;
    const netReturn = (data.estimatedReturn - feeRate) / 100;
    const yearsToRetirement = data.retirementAge - data.currentAge;
    
    // Calculate employer match
    const baseContribution = data.monthlyContribution * 12;
    const maxEmployerMatch = (data.annualIncome * data.employerMatchLimit / 100) * (data.employerMatch / 100);
    const currentEmployerMatch = Math.min(
      baseContribution * (data.employerMatch / 100),
      maxEmployerMatch
    );
    
    for (let year = 1; year <= yearsToRetirement; year++) {
      balance = balance * (1 + netReturn);
      balance += yearlyContribution + currentEmployerMatch;
      
      if (data.includeInflation) {
        yearlyContribution *= (1 + data.incomeGrowthRate / 100);
      }
    }
    
    return balance;
  }, [data.currentBalance, data.monthlyContribution, data.estimatedReturn, data.retirementAge, data.currentAge, data.annualIncome, data.employerMatchLimit, data.employerMatch, data.includeInflation, data.incomeGrowthRate]);

  // Fee impact analysis
  const feeImpact = useMemo(() => {
    const withoutFees = calculateFutureValueWithFees(0);
    const withFees = calculations.finalBalance;
    return withoutFees - withFees;
  }, [calculateFutureValueWithFees, calculations.finalBalance]);

  // Generate recommendations
  const recommendations = useMemo(() => {
    const recs = [];
    
    if (calculations.contributionPercent < 15) {
      recs.push(`Increase contribution rate to 15%+ for optimal retirement savings (currently ${calculations.contributionPercent.toFixed(1)}%)`);
    }
    
    if (calculations.currentEmployerMatch < calculations.maxEmployerMatch) {
      recs.push(`Missing $${(calculations.maxEmployerMatch - calculations.currentEmployerMatch).toLocaleString()} in annual employer match`);
    }
    
    if (data.totalFees > 1.5) {
      recs.push(`High fees (${data.totalFees}%) - consider lower-cost funds`);
    }
    
    if (retirementIncome.replacementRatio < 70) {
      recs.push(`Projected ${retirementIncome.replacementRatio.toFixed(0)}% income replacement may be insufficient`);
    }
    
    if (data.currentAge >= 50 && !data.includeCatchUp) {
      recs.push('Consider catch-up contributions - you can contribute an extra $7,500 annually');
    }
    
    if (calculations.nationalComparison.balancePercentile < 50) {
      recs.push('Your balance is below national average for your age group');
    }
    
    if (data.accountType === 'traditional' && data.currentAge < 40) {
      recs.push('Consider Roth 401(k) for tax diversification');
    }
    
    return recs;
  }, [calculations, data, retirementIncome]);

  return {
    calculations,
    retirementIncome,
    savingsAssessment,
    chartData,
    feeImpact,
    recommendations,
    calculateFutureValueWithFees
  };
};