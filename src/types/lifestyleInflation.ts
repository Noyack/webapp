export interface SpendingCategory {
  name: string;
  currentMonthlyAmount: number;
  inflationRate: number; // Percentage increase per income raise
  isNecessary: boolean;
  description: string;
}

export interface IncomeScenario {
  year: number;
  annualIncome: number;
  monthlyIncome: number;
  raisePercentage?: number;
}

export interface LifestyleInflationInputs {
  currentIncome: {
    annual: number;
    monthly: number;
  };
  expectedRaises: {
    frequency: number; // years between raises
    averagePercentage: number; // average raise percentage
    yearsToProject: number; // how many years to calculate
  };
  spendingCategories: SpendingCategory[];
  savingsGoals: {
    currentSavingsRate: number; // percentage of income saved
    targetSavingsRate: number; // ideal savings rate to maintain
    emergencyFund: number; // target emergency fund amount
  };
  investmentAssumptions: {
    expectedReturn: number; // annual investment return percentage
    inflationRate: number; // general inflation rate
  };
}

export interface YearlyProjection {
  year: number;
  income: number;
  totalSpending: number;
  spendingByCategory: { [categoryName: string]: number };
  actualSavings: number;
  actualSavingsRate: number;
  targetSavings: number;
  savingsShortfall: number;
  cumulativeWealthLoss: number;
  lifestyleInflationAmount: number;
}

export interface LifestyleInflationResults {
  projections: YearlyProjection[];
  summary: {
    totalIncomeIncrease: number;
    totalSpendingIncrease: number;
    finalSavingsRate: number;
    totalWealthLoss: number;
    compoundedWealthLoss: number;
    yearsToFinancialGoal: {
      withInflation: number;
      withoutInflation: number;
      difference: number;
    };
  };
  recommendations: string[];
}

export interface CategoryComparison {
  category: string;
  yearOne: number;
  finalYear: number;
  totalIncrease: number;
  percentageIncrease: number;
  inflationRate: number;
}

// Default spending categories with typical lifestyle inflation rates
export const DEFAULT_SPENDING_CATEGORIES: SpendingCategory[] = [
  {
    name: "Housing",
    currentMonthlyAmount: 2000,
    inflationRate: 15, // 15% increase per raise
    isNecessary: true,
    description: "Rent/mortgage, utilities, maintenance"
  },
  {
    name: "Transportation",
    currentMonthlyAmount: 600,
    inflationRate: 25, // 25% increase per raise (car upgrades)
    isNecessary: true,
    description: "Car payments, gas, insurance, maintenance"
  },
  {
    name: "Food & Dining",
    currentMonthlyAmount: 800,
    inflationRate: 30, // 30% increase per raise
    isNecessary: true,
    description: "Groceries, restaurants, delivery"
  },
  {
    name: "Shopping & Lifestyle",
    currentMonthlyAmount: 500,
    inflationRate: 50, // 50% increase per raise
    isNecessary: false,
    description: "Clothes, gadgets, subscriptions, hobbies"
  },
  {
    name: "Travel & Entertainment",
    currentMonthlyAmount: 400,
    inflationRate: 60, // 60% increase per raise
    isNecessary: false,
    description: "Vacations, entertainment, experiences"
  },
  {
    name: "Health & Fitness",
    currentMonthlyAmount: 200,
    inflationRate: 40, // 40% increase per raise
    isNecessary: true,
    description: "Healthcare, gym, wellness services"
  },
  {
    name: "Personal Care",
    currentMonthlyAmount: 150,
    inflationRate: 35, // 35% increase per raise
    isNecessary: false,
    description: "Grooming, beauty, personal services"
  }
];

export const DEFAULT_LIFESTYLE_INFLATION_INPUTS: LifestyleInflationInputs = {
  currentIncome: {
    annual: 75000,
    monthly: 6250
  },
  expectedRaises: {
    frequency: 2, // raise every 2 years
    averagePercentage: 8, // 8% average raise
    yearsToProject: 20 // project 20 years
  },
  spendingCategories: DEFAULT_SPENDING_CATEGORIES,
  savingsGoals: {
    currentSavingsRate: 15, // saving 15% currently
    targetSavingsRate: 20, // want to save 20%
    emergencyFund: 25000 // $25k emergency fund target
  },
  investmentAssumptions: {
    expectedReturn: 7, // 7% annual return
    inflationRate: 3 // 3% general inflation
  }
};

// Lifestyle inflation severity levels
export const INFLATION_SEVERITY = {
  LOW: { min: 0, max: 20, label: "Conservative", color: "success" },
  MODERATE: { min: 21, max: 40, label: "Moderate", color: "warning" },
  HIGH: { min: 41, max: 60, label: "Aggressive", color: "error" },
  EXTREME: { min: 61, max: 100, label: "Extreme", color: "error" }
} as const;

export type InflationSeverity = keyof typeof INFLATION_SEVERITY; 