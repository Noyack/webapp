// Type definitions for Retirement Calculator
export interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedAnnualReturn: number;
  expectedInflation: number;
  currentAnnualIncome: number;
  desiredIncomeReplacement: number;
  socialSecurityBenefits: number;
  otherIncome: number;
  state: string;
  city: string;
  monthlyExpenses: {
    housing: number;
    utilities: number;
    food: number;
    transportation: number;
    healthcare: number;
    entertainment: number;
    other: number;
  };
  estimatedTaxRate: number;
}

export interface RetirementResults {
  requiredSavings: number;
  projectedSavings: number;
  monthlyRetirementIncome: number;
  savingsShortfall: number;
  yearlySavingsChart: Array<{
    age: number;
    savings: number;
    contributions: number;
    interest: number;
    yearsInRetirement: number;
    realMonthlyReturn: number;
    totalExpenses: number;
  }>;
  retirementIncomeChart: Array<{
    age: number;
    income: number;
    expenses: number;
    savings: number;
  }>;
  retirementByCategory: Array<{
    name: string;
    value: number;
  }>;
  savingsNeededByExpense: Array<{
    expense: string;
    amountNeeded: number;
  }>;
  totalTaxPaid: number;
  totalExpenses: number;
}

export interface RetirementCalculatorProps {
  inputs: RetirementInputs;
  results: RetirementResults;
  onInputChange: <K extends keyof RetirementInputs>(field: K, value: RetirementInputs[K]) => void;
  onExpenseChange: (expenseType: keyof RetirementInputs['monthlyExpenses'], value: number) => void;
  onCalculate: () => void;
  costOfLivingIndex: number;
  availableCities: string[];
}

// Default values
export const DEFAULT_INPUTS: RetirementInputs = {
  currentAge: 35,
  retirementAge: 65,
  lifeExpectancy: 90,
  currentSavings: 100000,
  monthlyContribution: 1000,
  expectedAnnualReturn: 7,
  expectedInflation: 2.5,
  currentAnnualIncome: 80000,
  desiredIncomeReplacement: 80,
  socialSecurityBenefits: 1800,
  otherIncome: 0,
  state: 'CA',
  city: 'Los Angeles',
  monthlyExpenses: {
    housing: 2000,
    utilities: 200,
    food: 600,
    transportation: 400,
    healthcare: 500,
    entertainment: 300,
    other: 500
  },
  estimatedTaxRate: 20
};

export const EMPTY_RESULTS: RetirementResults = {
  requiredSavings: 0,
  projectedSavings: 0,
  monthlyRetirementIncome: 0,
  savingsShortfall: 0,
  yearlySavingsChart: [],
  retirementIncomeChart: [],
  retirementByCategory: [],
  savingsNeededByExpense: [],
  totalTaxPaid: 0,
  totalExpenses: 0
};

export const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1']; 