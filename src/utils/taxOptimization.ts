import { RetirementInputs } from '../types/retirement';

export interface AdvancedRetirementInputs extends RetirementInputs {
  accounts: {
    traditional401k: number;
    roth401k: number;
    traditionalIRA: number;
    rothIRA: number;
    taxableAccounts: number;
    hsa: number;
  };
  employerMatch: {
    percentage: number;
    maxMatchAmount: number;
  };
  taxBrackets: Array<{
    min: number;
    max: number;
    rate: number;
  }>;
  rothConversionStrategy: {
    enabled: boolean;
    targetBracket: number;
    maxAnnualConversion: number;
  };
}

export interface TaxOptimizationResults {
  optimalContributionStrategy: {
    traditional401k: number;
    roth401k: number;
    traditionalIRA: number;
    rothIRA: number;
    hsa: number;
    taxable: number;
  };
  rothConversionRecommendations: Array<{
    age: number;
    conversionAmount: number;
    taxCost: number;
    netBenefit: number;
  }>;
  withdrawalStrategy: Array<{
    age: number;
    traditional: number;
    roth: number;
    taxable: number;
    hsa: number;
    totalTax: number;
  }>;
  taxSavingsAnalysis: {
    lifetimeTaxSavings: number;
    currentYearSavings: number;
    retirementTaxSavings: number;
  };
  hsaAdvantage: {
    tripleAdvantage: number;
    versusTraditional401k: number;
  };
}

// Current tax brackets (2024 - simplified single filer)
const DEFAULT_TAX_BRACKETS = [
  { min: 0, max: 11000, rate: 0.10 },
  { min: 11001, max: 44725, rate: 0.12 },
  { min: 44726, max: 95375, rate: 0.22 },
  { min: 95376, max: 182050, rate: 0.24 },
  { min: 182051, max: 231250, rate: 0.32 },
  { min: 231251, max: 578125, rate: 0.35 },
  { min: 578126, max: Infinity, rate: 0.37 }
];

// Calculate tax on given income
function calculateTax(income: number, taxBrackets = DEFAULT_TAX_BRACKETS): number {
  let tax = 0;
  let remainingIncome = income;
  
  for (const bracket of taxBrackets) {
    if (remainingIncome <= 0) break;
    
    const taxableInThisBracket = Math.min(
      remainingIncome, 
      bracket.max - bracket.min + 1
    );
    
    tax += taxableInThisBracket * bracket.rate;
    remainingIncome -= taxableInThisBracket;
  }
  
  return tax;
}

// Calculate marginal tax rate
function getMarginalTaxRate(income: number, taxBrackets = DEFAULT_TAX_BRACKETS): number {
  for (const bracket of taxBrackets) {
    if (income >= bracket.min && income <= bracket.max) {
      return bracket.rate;
    }
  }
  return taxBrackets[taxBrackets.length - 1].rate;
}

// Optimize current year contributions
export function optimizeContributions(
  inputs: AdvancedRetirementInputs,
  availableContribution: number
): TaxOptimizationResults['optimalContributionStrategy'] {
  const currentMarginalRate = getMarginalTaxRate(inputs.currentAnnualIncome);
  
  // Priority order based on tax efficiency
  const strategy = {
    traditional401k: 0,
    roth401k: 0,
    traditionalIRA: 0,
    rothIRA: 0,
    hsa: 0,
    taxable: 0
  };
  
  let remaining = availableContribution;
  
  // 1. HSA first (triple tax advantage) - 2024 limit $4,150 individual
  const hsaLimit = 4150;
  const hsaContribution = Math.min(remaining, hsaLimit - inputs.accounts.hsa);
  strategy.hsa = Math.max(0, hsaContribution);
  remaining -= strategy.hsa;
  
  // 2. Get full employer match
  const employerMatchLimit = Math.min(
    inputs.currentAnnualIncome * (inputs.employerMatch.percentage / 100),
    inputs.employerMatch.maxMatchAmount
  );
  const matchContribution = Math.min(remaining, employerMatchLimit);
  
  // Use traditional 401k for match if in high tax bracket (22%+)
  if (currentMarginalRate >= 0.22) {
    strategy.traditional401k = matchContribution;
  } else {
    strategy.roth401k = matchContribution;
  }
  remaining -= matchContribution;
  
  // 3. IRA contributions (better investment options than 401k)
  const iraLimit = 7000; // 2024 limit
  if (remaining > 0) {
    const iraContribution = Math.min(remaining, iraLimit);
    
    // Use Roth IRA if in lower brackets (12% or below)
    if (currentMarginalRate <= 0.12) {
      strategy.rothIRA = iraContribution;
    } else {
      strategy.traditionalIRA = iraContribution;
    }
    remaining -= iraContribution;
  }
  
  // 4. Max out 401k - 2024 limit $23,000
  const total401kLimit = 23000;
  const current401k = strategy.traditional401k + strategy.roth401k;
  const additional401k = Math.min(remaining, total401kLimit - current401k);
  
  if (additional401k > 0) {
    // Split based on current vs expected retirement tax rate
    const expectedRetirementRate = 0.12; // Assume lower bracket in retirement
    
    if (currentMarginalRate > expectedRetirementRate + 0.05) {
      strategy.traditional401k += additional401k;
    } else {
      strategy.roth401k += additional401k;
    }
    remaining -= additional401k;
  }
  
  // 5. Remaining goes to taxable
  strategy.taxable = remaining;
  
  return strategy;
}

// Calculate optimal Roth conversion strategy
export function calculateRothConversions(
  inputs: AdvancedRetirementInputs
): TaxOptimizationResults['rothConversionRecommendations'] {
  const recommendations: TaxOptimizationResults['rothConversionRecommendations'] = [];
  
  if (!inputs.rothConversionStrategy.enabled) {
    return recommendations;
  }
  
  const targetBracketRate = inputs.rothConversionStrategy.targetBracket / 100;
  const maxAnnualConversion = inputs.rothConversionStrategy.maxAnnualConversion;
  
  // Conversion window typically between retirement and RMD (age 73)
  const startAge = inputs.retirementAge;
  const endAge = Math.min(73, inputs.lifeExpectancy);
  
  for (let age = startAge; age < endAge; age++) {
    // Calculate income without conversion
    const retirementIncome = (inputs.socialSecurityBenefits + inputs.otherIncome) * 12;
    const currentMarginalRate = getMarginalTaxRate(retirementIncome);
    
    // Only convert if current rate is lower than target
    if (currentMarginalRate <= targetBracketRate) {
      // Calculate room in target bracket
      const targetBracket = DEFAULT_TAX_BRACKETS.find(b => b.rate === targetBracketRate);
      if (targetBracket) {
        const roomInBracket = targetBracket.max - retirementIncome;
        const conversionAmount = Math.min(maxAnnualConversion, roomInBracket);
        
        if (conversionAmount > 1000) { // Minimum conversion threshold
          const taxCost = conversionAmount * currentMarginalRate;
          
          // Estimate net benefit (simplified)
          const futureRate = 0.22; // Assume higher RMD tax rate
          const yearsToGrow = inputs.lifeExpectancy - age;
          const growthFactor = Math.pow(1.07, yearsToGrow); // 7% growth
          const netBenefit = conversionAmount * (futureRate - currentMarginalRate) * growthFactor;
          
          recommendations.push({
            age,
            conversionAmount,
            taxCost,
            netBenefit
          });
        }
      }
    }
  }
  
  return recommendations;
}

// Calculate optimal withdrawal strategy
export function calculateWithdrawalStrategy(
  inputs: AdvancedRetirementInputs
): TaxOptimizationResults['withdrawalStrategy'] {
  const strategy: TaxOptimizationResults['withdrawalStrategy'] = [];
  
  // Track account balances
  let traditionalBalance = inputs.accounts.traditional401k + inputs.accounts.traditionalIRA;
  let rothBalance = inputs.accounts.roth401k + inputs.accounts.rothIRA;
  let taxableBalance = inputs.accounts.taxableAccounts;
  let hsaBalance = inputs.accounts.hsa;
  
  for (let age = inputs.retirementAge; age <= inputs.lifeExpectancy; age++) {
    const yearlyExpenses = inputs.currentAnnualIncome * (inputs.desiredIncomeReplacement / 100);
    const socialSecurityIncome = inputs.socialSecurityBenefits * 12;
    const otherIncome = inputs.otherIncome * 12;
    const neededFromSavings = Math.max(0, yearlyExpenses - socialSecurityIncome - otherIncome);
    
    let remainingNeeded = neededFromSavings;
    let traditional = 0;
    let roth = 0;
    let taxable = 0;
    let hsa = 0;
    
    // Withdrawal priority:
    // 1. Taxable accounts first (most flexible)
    if (remainingNeeded > 0 && taxableBalance > 0) {
      taxable = Math.min(remainingNeeded, taxableBalance);
      taxableBalance -= taxable;
      remainingNeeded -= taxable;
    }
    
    // 2. Traditional accounts (forced RMDs after 73)
    if (age >= 73) {
      const rmdAmount = traditionalBalance * 0.0366; // Simplified RMD calculation
      traditional = Math.max(rmdAmount, Math.min(remainingNeeded, traditionalBalance));
    } else if (remainingNeeded > 0) {
      // Before RMDs, use traditional if in low tax bracket
      const currentIncome = socialSecurityIncome + otherIncome + taxable;
      const marginalRate = getMarginalTaxRate(currentIncome);
      
      if (marginalRate <= 0.12 && traditionalBalance > 0) {
        traditional = Math.min(remainingNeeded, traditionalBalance);
      }
    }
    
    traditionalBalance -= traditional;
    remainingNeeded -= traditional;
    
    // 3. Roth accounts (tax-free, no RMDs)
    if (remainingNeeded > 0 && rothBalance > 0) {
      roth = Math.min(remainingNeeded, rothBalance);
      rothBalance -= roth;
      remainingNeeded -= roth;
    }
    
    // 4. HSA for medical expenses (or penalty-free after 65)
    if (remainingNeeded > 0 && hsaBalance > 0 && age >= 65) {
      hsa = Math.min(remainingNeeded, hsaBalance);
      hsaBalance -= hsa;
    }
    
    // Calculate taxes
    const taxableIncome = traditional + (age >= 65 ? hsa : 0) + 
                         (socialSecurityIncome * 0.85); // Simplified SS taxation
    const totalTax = calculateTax(taxableIncome);
    
    strategy.push({
      age,
      traditional,
      roth,
      taxable,
      hsa,
      totalTax
    });
    
    // Grow remaining balances
    const growthRate = 0.06; // Conservative growth in retirement
    traditionalBalance *= (1 + growthRate);
    rothBalance *= (1 + growthRate);
    taxableBalance *= (1 + growthRate);
    hsaBalance *= (1 + growthRate);
  }
  
  return strategy;
}

// Calculate tax savings analysis
export function calculateTaxSavings(
  inputs: AdvancedRetirementInputs,
  optimizedStrategy: TaxOptimizationResults['optimalContributionStrategy']
): TaxOptimizationResults['taxSavingsAnalysis'] {
  // Current year savings
  const currentMarginalRate = getMarginalTaxRate(inputs.currentAnnualIncome);
  const traditionalContributions = optimizedStrategy.traditional401k + 
                                  optimizedStrategy.traditionalIRA;
  const hsaContributions = optimizedStrategy.hsa;
  
  const currentYearSavings = (traditionalContributions + hsaContributions) * currentMarginalRate;
  
  // Lifetime savings (simplified calculation)
  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
  const lifetimeTaxSavings = currentYearSavings * yearsToRetirement;
  
  // Retirement tax savings (from Roth and HSA advantages)
  const rothContributions = optimizedStrategy.roth401k + optimizedStrategy.rothIRA;
  const retirementTaxSavings = rothContributions * 0.12 * 20; // Simplified 20-year benefit
  
  return {
    lifetimeTaxSavings,
    currentYearSavings,
    retirementTaxSavings
  };
}

// Calculate HSA advantage
export function calculateHSAAdvantage(
  hsaContribution: number,
  marginalTaxRate: number
): TaxOptimizationResults['hsaAdvantage'] {
  // Triple tax advantage: deductible, growth, tax-free medical withdrawals
  const immediateDeduction = hsaContribution * marginalTaxRate;
  const growthAdvantage = hsaContribution * 0.07 * 20; // 20 years growth
  const withdrawalAdvantage = (hsaContribution + growthAdvantage) * marginalTaxRate;
  
  const tripleAdvantage = immediateDeduction + withdrawalAdvantage;
  
  // vs Traditional 401k (only gets deduction + growth, but taxed on withdrawal)
  const traditional401kBenefit = immediateDeduction;
  const versusTraditional401k = tripleAdvantage - traditional401kBenefit;
  
  return {
    tripleAdvantage,
    versusTraditional401k
  };
}

// Main tax optimization function
export function optimizeTaxStrategy(inputs: AdvancedRetirementInputs): TaxOptimizationResults {
  const availableContribution = inputs.monthlyContribution * 12;
  
  const optimalContributionStrategy = optimizeContributions(inputs, availableContribution);
  const rothConversionRecommendations = calculateRothConversions(inputs);
  const withdrawalStrategy = calculateWithdrawalStrategy(inputs);
  const taxSavingsAnalysis = calculateTaxSavings(inputs, optimalContributionStrategy);
  const hsaAdvantage = calculateHSAAdvantage(
    optimalContributionStrategy.hsa,
    getMarginalTaxRate(inputs.currentAnnualIncome)
  );
  
  return {
    optimalContributionStrategy,
    rothConversionRecommendations,
    withdrawalStrategy,
    taxSavingsAnalysis,
    hsaAdvantage
  };
} 