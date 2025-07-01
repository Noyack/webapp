// src/utils/fourOhOneK.ts
// Shared types and constants for the enhanced 401(k) calculator

export interface FourOhOneKData {
  // Personal details
  currentAge: number;
  retirementAge: number;
  annualIncome: number;
  
  // Investment details
  currentBalance: number;
  monthlyContribution: number;
  contributionPercent: number;
  employerMatch: number;
  employerMatchLimit: number;
  estimatedReturn: number;
  totalFees: number;
  
  // Enhanced settings
  includeInflation: boolean;
  inflationRate: number;
  incomeGrowthRate: number;
  
  // New features
  includeCatchUp: boolean;
  accountType: 'traditional' | 'roth' | 'mixed';
  rothPercentage: number;
  socialSecurityEstimate: number;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
}

export interface EnhancedCalculations {
  yearsToRetirement: number;
  monthlyIncome: number;
  contributionPercent: number;
  totalAnnualContribution: number;
  catchUpContribution: number;
  maxEmployerMatch: number;
  currentEmployerMatch: number;
  monthlyEmployerMatch: number;
  projections: ProjectionYear[];
  finalBalance: number;
  totalContributions: number;
  totalTradContributions: number;
  totalRothContributions: number;
  totalEmployerMatch: number;
  totalGrowth: number;
  taxBenefits: TaxBenefits;
  nationalComparison: NationalComparison;
}

export interface ProjectionYear {
  year: number;
  age: number;
  balance: number;
  yearlyContribution: number;
  yearlyEmployerMatch: number;
  cumulativeContributions: number;
  cumulativeEmployerMatch: number;
  totalGrowth: number;
  rothBalance: number;
  traditionalBalance: number;
}

export interface TaxBenefits {
  traditionalSavings: number;
  rothCost: number;
  traditionalTaxOwed: number;
  netTaxAdvantage: number;
}

export interface NationalComparison {
  balancePercentile: number;
  contributionPercentile: number;
}

export interface RetirementIncome {
  monthlyWithdrawal: number;
  totalMonthlyIncome: number;
  replacementRatio: number;
  socialSecurityPortion: number;
}

export interface SavingsAssessment {
  level: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' | 'Critical';
  color: 'success' | 'warning' | 'error';
  message: string;
}

// Constants
export const NATIONAL_AVERAGES = {
  contributionRate: 8.3,
  averageBalance: {
    '20s': 16000,
    '30s': 45000,
    '40s': 63000,
    '50s': 117000,
    '60s': 172000
  },
  employerMatch: 4.7
};

export const CONTRIBUTION_LIMITS = {
  annual: 23000,
  catchUp: 7500,
  total: 30500 // For 50+
};

export const PRESET_SCENARIOS = {
  conservative: {
    estimatedReturn: 6,
    totalFees: 0.5,
    contributionPercent: 10,
    riskProfile: 'conservative' as const
  },
  moderate: {
    estimatedReturn: 7,
    totalFees: 0.75,
    contributionPercent: 12,
    riskProfile: 'moderate' as const
  },
  aggressive: {
    estimatedReturn: 9,
    totalFees: 1.0,
    contributionPercent: 15,
    riskProfile: 'aggressive' as const
  }
};

// Updated validation utility - now allows users to enter 0 and prevents negatives
export const validateAndFormat = (value: number, type: 'currency' | 'percentage' | 'age' | 'years'): number => {
  if (isNaN(value)) return 0;
  
  switch (type) {
    case 'percentage':
      // Allow 0-100, no negatives
      return Math.max(0, Math.min(Math.round(value * 100) / 100, 100));
    case 'age':
      // Changed: Allow 1-120 instead of 18-75, no negatives
      return Math.max(1, Math.min(Math.round(value), 120));
    case 'years':
      // Allow reasonable retirement ages
      return Math.max(50, Math.min(Math.round(value), 120));
    case 'currency':
      // Allow 0 and positive values, no negatives
      return Math.max(0, Math.round(value * 100) / 100);
    default:
      // Default: no negatives
      return Math.max(0, Math.round(value * 100) / 100);
  }
};

// Format currency utility
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format percentage utility
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Calculate age group for national comparisons
export const getAgeGroup = (age: number): keyof typeof NATIONAL_AVERAGES.averageBalance => {
  if (age < 30) return '20s';
  if (age < 40) return '30s';
  if (age < 50) return '40s';
  if (age < 60) return '50s';
  return '60s';
};

// Calculate percentile rank
export const calculatePercentile = (value: number, dataset: number[]): number => {
  const sorted = [...dataset].sort((a, b) => a - b);
  const index = sorted.findIndex(x => x >= value);
  if (index === -1) return 100;
  return Math.round((index / sorted.length) * 100);
};

// Tax bracket calculations (simplified)
export const TAX_BRACKETS_2024 = {
  single: [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578125, rate: 0.35 },
    { min: 578125, max: Infinity, rate: 0.37 }
  ]
};

// Calculate marginal tax rate
export const calculateMarginalTaxRate = (income: number): number => {
  const brackets = TAX_BRACKETS_2024.single;
  for (const bracket of brackets) {
    if (income >= bracket.min && income < bracket.max) {
      return bracket.rate;
    }
  }
  return 0.37; // Top bracket
};

// Calculate effective tax rate
export const calculateEffectiveTaxRate = (income: number): number => {
  const brackets = TAX_BRACKETS_2024.single;
  let totalTax = 0;
  
  for (const bracket of brackets) {
    if (income <= bracket.min) break;
    
    const taxableInBracket = Math.min(income, bracket.max) - bracket.min;
    totalTax += taxableInBracket * bracket.rate;
  }
  
  return income > 0 ? totalTax / income : 0;
};

// Risk profile return expectations
export const RISK_PROFILES = {
  conservative: { expectedReturn: 5.5, volatility: 8 },
  moderate: { expectedReturn: 7.5, volatility: 12 },
  aggressive: { expectedReturn: 9.5, volatility: 18 }
};

// Fee impact calculator
export const calculateFeeImpact = (
  initialAmount: number,
  monthlyContribution: number,
  years: number,
  returnRate: number,
  feeRate: number
): { withFees: number; withoutFees: number; feeImpact: number } => {
  const netReturn = returnRate - feeRate;
  const monthlyReturn = netReturn / 100 / 12;
  const monthlyReturnNoFees = returnRate / 100 / 12;
  const totalMonths = years * 12;
  
  // Future value with fees
  const withFees = initialAmount * Math.pow(1 + netReturn / 100, years) +
    monthlyContribution * (Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn;
  
  // Future value without fees
  const withoutFees = initialAmount * Math.pow(1 + returnRate / 100, years) +
    monthlyContribution * (Math.pow(1 + monthlyReturnNoFees, totalMonths) - 1) / monthlyReturnNoFees;
  
  return {
    withFees,
    withoutFees,
    feeImpact: withoutFees - withFees
  };
};

// Social Security benefit estimation (simplified)
export const estimateSocialSecurityBenefit = (
  annualIncome: number,
  currentAge: number,
  retirementAge: number
): number => {
  // Very simplified calculation - real calculation requires full earnings history
  const workingYears = Math.min(35, retirementAge - 22);
  const averageIndexedEarnings = Math.min(annualIncome, 160200); // 2023 wage base
  const primaryInsuranceAmount = averageIndexedEarnings * 0.9 * 0.32; // Simplified PIA calculation
  
  // Adjust for early/late retirement
  let adjustmentFactor = 1;
  if (retirementAge < 67) {
    adjustmentFactor = 0.75 + (retirementAge - 62) * 0.05;
  } else if (retirementAge > 67) {
    adjustmentFactor = 1 + (retirementAge - 67) * 0.08;
  }
  
  return primaryInsuranceAmount * adjustmentFactor;
};

// Retirement readiness assessment
export const assessRetirementReadiness = (
  finalBalance: number,
  annualIncome: number,
  socialSecurityBenefit: number
): SavingsAssessment => {
  const monthlyRetirementIncome = (finalBalance * 0.04 / 12) + socialSecurityBenefit;
  const replacementRatio = annualIncome > 0 ? (monthlyRetirementIncome * 12) / annualIncome * 100 : 0;
  
  if (replacementRatio >= 80) {
    return {
      level: 'Excellent',
      color: 'success',
      message: 'You\'re on track for a comfortable retirement!'
    };
  } else if (replacementRatio >= 70) {
    return {
      level: 'Good',
      color: 'success',
      message: 'Good progress toward retirement goals.'
    };
  } else if (replacementRatio >= 60) {
    return {
      level: 'Fair',
      color: 'warning',
      message: 'Consider increasing contributions to improve retirement security.'
    };
  } else if (replacementRatio >= 40) {
    return {
      level: 'Needs Improvement',
      color: 'warning',
      message: 'Significant increases in savings are recommended.'
    };
  } else {
    return {
      level: 'Critical',
      color: 'error',
      message: 'Immediate action needed to avoid retirement shortfall.'
    };
  }
};