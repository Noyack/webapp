export interface JobExpenses {
  commuting: {
    dailyTransportCost: number;
    dailyCommutingTime: number; // minutes
    parkingCosts: number;
    vehicleWearAndTear: number;
    monthlyTransportPass: number;
  };
  workRelated: {
    annualClothing: number;
    dailyMeals: number;
    equipment: number;
    training: number;
    childcare: number;
    professionalDues: number;
  };
  preparation: {
    dailyPrepTime: number; // minutes
    weeklyPrepTime: number; // hours for things like meal prep, planning
  };
}

export interface WorkSchedule {
  hoursPerWeek: number;
  weeksPerYear: number;
  overtimeHours: number;
  overtimeMultiplier: number; // 1.5 for time and a half
  unpaidBreaks: number; // minutes per day
}

export interface TaxInformation {
  federalTaxRate: number;
  stateTaxRate: number;
  socialSecurityRate: number;
  medicareRate: number;
  stateDisabilityRate: number;
  unemploymentRate: number;
}

export interface Benefits {
  healthInsurance: number; // monthly premium
  retirement401k: number; // monthly contribution
  paidTimeOff: number; // days per year
  sickDays: number; // days per year
  otherBenefits: number; // monthly value
}

export interface RealWageCalculation {
  grossAnnualSalary: number;
  grossHourlyWage: number;
  netAnnualIncome: number;
  netHourlyWage: number;
  totalAnnualExpenses: number;
  totalTimeCommitment: number; // hours per year
  realHourlyWage: number;
  effectiveHourlyRate: number;
  expenseImpact: number;
  timeImpact: number;
}

export interface ExpenseBreakdown {
  category: string;
  subcategory: string;
  annualCost: number;
  dailyCost: number;
  hourlyImpact: number;
  percentage: number;
}

export interface TimeBreakdown {
  category: string;
  hoursPerWeek: number;
  hoursPerYear: number;
  percentage: number;
}

export interface RealHourlyWageInputs {
  salary: {
    annualSalary: number;
    salaryType: 'salary' | 'hourly';
    hourlyRate?: number;
  };
  schedule: WorkSchedule;
  expenses: JobExpenses;
  taxes: TaxInformation;
  benefits: Benefits;
  location: {
    state: string;
    city: string;
    costOfLivingIndex: number;
  };
}

export interface WageComparison {
  scenario: string;
  realHourlyWage: number;
  netAnnualIncome: number;
  timeCommitment: number;
  workLifeBalance: number;
}

// Default values
export const DEFAULT_TAX_RATES: TaxInformation = {
  federalTaxRate: 22, // Typical middle-class rate
  stateTaxRate: 5,   // Average state rate
  socialSecurityRate: 6.2,
  medicareRate: 1.45,
  stateDisabilityRate: 0.9,
  unemploymentRate: 0.3
};

export const DEFAULT_WORK_SCHEDULE: WorkSchedule = {
  hoursPerWeek: 40,
  weeksPerYear: 50, // Accounting for vacation
  overtimeHours: 0,
  overtimeMultiplier: 1.5,
  unpaidBreaks: 60 // 1 hour unpaid lunch
};

export const DEFAULT_JOB_EXPENSES: JobExpenses = {
  commuting: {
    dailyTransportCost: 15,
    dailyCommutingTime: 60,
    parkingCosts: 0,
    vehicleWearAndTear: 8,
    monthlyTransportPass: 0
  },
  workRelated: {
    annualClothing: 800,
    dailyMeals: 12,
    equipment: 200,
    training: 500,
    childcare: 0,
    professionalDues: 200
  },
  preparation: {
    dailyPrepTime: 30,
    weeklyPrepTime: 2
  }
};

export const DEFAULT_BENEFITS: Benefits = {
  healthInsurance: 200,
  retirement401k: 300,
  paidTimeOff: 15,
  sickDays: 5,
  otherBenefits: 100
};

export const DEFAULT_REAL_HOURLY_WAGE_INPUTS: RealHourlyWageInputs = {
  salary: {
    annualSalary: 60000,
    salaryType: 'salary'
  },
  schedule: DEFAULT_WORK_SCHEDULE,
  expenses: DEFAULT_JOB_EXPENSES,
  taxes: DEFAULT_TAX_RATES,
  benefits: DEFAULT_BENEFITS,
  location: {
    state: 'TX',
    city: 'Austin',
    costOfLivingIndex: 95
  }
}; 