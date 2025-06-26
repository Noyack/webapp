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

// Validation utility
export const validateAndFormat = (value: number, type: 'currency' | 'percentage' | 'age' | 'years'): number => {
  if (isNaN(value) || value < 0) return 0;
  
  switch (type) {
    case 'percentage':
      return Math.min(Math.round(value * 100) / 100, 100);
    case 'age':
      return Math.min(Math.max(Math.round(value), 18), 75);
    case 'years':
      return Math.min(Math.max(Math.round(value), 50), 75);
    case 'currency':
      return Math.round(value * 100) / 100;
    default:
      return Math.round(value * 100) / 100;
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