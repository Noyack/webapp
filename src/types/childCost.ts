export interface LocationData {
  state: string;
  costOfLivingIndex: number;
}

export interface ChildData {
  id: string;
  name: string;
  currentAge: number;
  birthYear?: number;
  education: {
    k12Type: 'public' | 'private';
    collegeType: 'none' | 'public' | 'private';
    gradSchool: boolean;
    collegeYears: number;
    gradYears: number;
  };
  additionalCosts: {
    extracurriculars: number;
    healthConditions: boolean;
    travel: number;
  };
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  basePercent: number;
  applyInflation: boolean;
  customBaseAmount?: number;
}

export interface YearlyCostData {
  year: number;
  childAge: number;
  totalCost: number;
  housing: number;
  food: number;
  childcare: number;
  transportation: number;
  healthcare: number;
  clothing: number;
  personal: number;
  education: number;
  stage: string;
}

export interface LifetimeSummary {
  totalCost: number;
  byCategory: {
    [key: string]: number;
  };
  byStage: {
    [key: string]: number;
  };
  collegeCost: number;
  gradSchoolCost: number;
}

export interface EducationCosts {
  publicK12: {
    annual: number;
    description: string;
  };
  privateK12: {
    annual: number;
    description: string;
  };
  publicCollege: {
    annual: number;
    description: string;
  };
  privateCollege: {
    annual: number;
    description: string;
  };
  gradSchool: {
    annual: number;
    description: string;
  };
}

export interface HouseholdData {
  income: number;
  additionalChildren: number;
  inflationRate: number;
  savingsRate: number;
  investmentReturn: number;
}

export interface ChildCostInputs {
  location: LocationData;
  household: HouseholdData;
  children: ChildData[];
  educationCosts: EducationCosts;
  expenseCategories: ExpenseCategory[];
  calculationType: 'current' | 'future';
  birthYear: number;
  selectedChild: string;
}

export interface CollegeFundProjection {
  totalCost: number;
  monthlyRequired: number;
  currentSavings: number;
  projectedBalance: number;
  shortfall: number;
}

// Default values - Updated with 2024-2025 academic year data
export const DEFAULT_EDUCATION_COSTS: EducationCosts = {
  publicK12: {
    annual: 1200, // Updated from $800 - includes supplies, activities, field trips
    description: 'Public K-12 education with standard extracurricular activities and supplies'
  },
  privateK12: {
    annual: 15000, // Updated from $12,000 - reflects current private school costs
    description: 'Private K-12 education with standard extracurricular activities'
  },
  publicCollege: {
    annual: 24920, // Updated with 2024-2025 data (in-state public)
    description: 'Public college (in-state) including tuition, fees, room, and board'
  },
  privateCollege: {
    annual: 58600, // Updated with 2024-2025 data
    description: 'Private college including tuition, fees, room, and board'
  },
  gradSchool: {
    annual: 35000, // Updated from $30,000 - reflects current graduate costs
    description: 'Graduate school (masters or professional degree) average costs'
  }
};

export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'food', name: 'Food', color: '#82ca9d', basePercent: 18, applyInflation: true },
  { id: 'childcare', name: 'Childcare & Education', color: '#ffc658', basePercent: 16, applyInflation: true },
  { id: 'transportation', name: 'Transportation', color: '#ff8042', basePercent: 15, applyInflation: true },
  { id: 'healthcare', name: 'Healthcare', color: '#d53e4f', basePercent: 9, applyInflation: true },
  { id: 'clothing', name: 'Clothing', color: '#66a4cd', basePercent: 6, applyInflation: true },
  { id: 'personal', name: 'Personal Care & Activities', color: '#f781bf', basePercent: 7, applyInflation: true }
];

export const AGE_STAGES = [
  { name: 'Infant (0-1)', description: 'First year of life, includes initial setup costs', startAge: 0, endAge: 1 },
  { name: 'Toddler (1-3)', description: 'Ages 1-3, rapid growth, childcare costs begin', startAge: 1, endAge: 3 },
  { name: 'Preschool (3-5)', description: 'Ages 3-5, early education and development', startAge: 3, endAge: 5 },
  { name: 'Elementary (6-11)', description: 'Elementary school years, more activities', startAge: 6, endAge: 11 },
  { name: 'Middle School (12-14)', description: 'Pre-teen years, increased food and activity costs', startAge: 12, endAge: 14 },
  { name: 'High School (15-18)', description: 'Teenage years, higher personal expenses', startAge: 15, endAge: 18 },
  { name: 'College (19-22)', description: 'Higher education years, if applicable', startAge: 19, endAge: 22 },
  { name: 'Graduate (23+)', description: 'Graduate education, if applicable', startAge: 23, endAge: 25 }
];

export const DEFAULT_CHILD_COST_INPUTS: ChildCostInputs = {
  location: {
    state: 'TX',
    costOfLivingIndex: 91.5
  },
  household: {
    income: 75000,
    additionalChildren: 0,
    inflationRate: 2.5,
    savingsRate: 10,
    investmentReturn: 7
  },
  children: [
    {
      id: 'child-1',
      name: 'Child 1',
      currentAge: 5,
      education: {
        k12Type: 'public',
        collegeType: 'public',
        gradSchool: false,
        collegeYears: 4,
        gradYears: 2
      },
      additionalCosts: {
        extracurriculars: 2000,
        healthConditions: false,
        travel: 1000
      }
    }
  ],
  educationCosts: DEFAULT_EDUCATION_COSTS,
  expenseCategories: DEFAULT_EXPENSE_CATEGORIES,
  calculationType: 'current',
  birthYear: new Date().getFullYear() + 1,
  selectedChild: 'child-1'
}; 