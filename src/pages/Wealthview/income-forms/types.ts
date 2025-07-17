// types/income.types.ts
export interface PrimaryIncome {
    salary: number;
    paymentFrequency: string;
    stabilityType: string;
    annualGrowthRate: number;
    futureChanges: string;
    futureChangeTimeframe: number;
    bonusStructure: string;
    averageBonus: number;
  }
  
  export interface IncomeSource {
    id?: string;
    type: string;
    name: string;
    amount: number;
    frequency: string;
    duration: string;
    taxStatus: string;
    growthRate: number;
    notes: string;
    isPrimary?: boolean;
  }
  
  export interface IncomeInfoForm {
    employmentStatus: string;
    primaryIncome: PrimaryIncome;
    additionalIncomes: IncomeSource[];
  }
  
  // Constants for dropdown options
  export const employmentStatusOptions = ["Employed", "Self-employed", "Unemployed", "Retired", "Student"];
  export const frequencyOptions = ["Weekly", "Bi-weekly", "Bi-monthly", "Monthly", "Quarterly", "Semi-annually", "Annually", "Irregular"];
  export const stabilityOptions = ["Fixed salary", "Hourly with stable hours", "Hourly with variable hours", "Commission-based", "Base + Commission", "Contract work", "Variable/Seasonal"];
  export const futureChangeOptions = ["No anticipated changes", "Expected promotion", "Expected career change", "Potential layoff risk", "Planning to reduce hours", "Planning to retire", "Sabbatical/Break planned"];
  export const incomeTypeOptions = [
    "Secondary employment", 
    "Freelance work", 
    "Consulting", 
    "Rental property", 
    "Dividends", 
    "Interest", 
    "Royalties", 
    "Business distribution", 
    "Pension", 
    "Social Security", 
    "Annuity", 
    "Required Minimum Distribution", 
    "Capital gains", 
    "Inheritance", 
    "Alimony/Child support", 
    "Government benefits",
    "Other"
  ];
  export const durationOptions = ["Ongoing/Indefinite", "1-3 years", "3-5 years", "5-10 years", "10+ years", "One-time", "Sporadic"];
  export const taxStatusOptions = ["Fully taxable", "Partially taxable", "Tax-deferred", "Tax-free"];
  
  // Helper functions
  export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  export const calculateAnnualEquivalent = (amount: number, frequency: string): number => {
    // Convert string to number to ensure proper calculations
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Return 0 if amount is NaN, null, undefined, or negative
    if (isNaN(numAmount) || numAmount === null || numAmount === undefined || numAmount < 0) {
      return 0;
    }
    
    // For bi-weekly payments, we need to interpret the amount correctly
    if (frequency === "Bi-weekly" && numAmount > 10000) {
      // This is likely an annual salary input, not a per-paycheck amount
      return numAmount;
    }
    
    switch(frequency) {
      case "Weekly": return numAmount * 52;
      case "Bi-weekly": return numAmount * 26;
      case "Bi-monthly": return numAmount * 24;
      case "Monthly": return numAmount * 12;
      case "Quarterly": return numAmount * 4;
      case "Semi-annually": return numAmount * 2;
      case "Annually": return numAmount;
      case "Irregular": return numAmount;
      default: return numAmount;
    }
  };