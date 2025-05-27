// Financial optimization constants
export const RISK_PROFILES = [
    { id: 'conservative', name: 'Conservative', stockAllocation: 30, bondAllocation: 60, cashAllocation: 10 },
    { id: 'moderate', name: 'Moderate', stockAllocation: 60, bondAllocation: 30, cashAllocation: 10 },
    { id: 'aggressive', name: 'Aggressive', stockAllocation: 80, bondAllocation: 15, cashAllocation: 5 },
    { id: 'custom', name: 'Custom', stockAllocation: 50, bondAllocation: 40, cashAllocation: 10 }
  ];
  
  // Debt types with interest rates and prioritization score
  export const DEBT_TYPES = [
    { id: 'creditCard', name: 'Credit Card', typicalRate: 18.0, priorityScore: 5 },
    { id: 'personalLoan', name: 'Personal Loan', typicalRate: 10.0, priorityScore: 4 },
    { id: 'autoLoan', name: 'Auto Loan', typicalRate: 4.5, priorityScore: 3 },
    { id: 'studentLoan', name: 'Student Loan', typicalRate: 4.0, priorityScore: 2 },
    { id: 'mortgage', name: 'Mortgage', typicalRate: 3.5, priorityScore: 1 }
  ];
  
  // Investment vehicles with tax advantages and growth assumptions
  export const INVESTMENT_VEHICLES = [
    { 
      id: 'emergencyFund', 
      name: 'Emergency Fund', 
      taxAdvantaged: false, 
      expectedReturn: 1.5, 
      liquidityScore: 5, 
      description: 'Cash reserve for unexpected expenses, typically 3-6 months of expenses'
    },
    { 
      id: 'taxableAccount', 
      name: 'Taxable Brokerage Account', 
      taxAdvantaged: false, 
      expectedReturn: 7.0, 
      liquidityScore: 4, 
      description: 'General investment account without specific tax advantages'
    },
    { 
      id: 'roth401k', 
      name: 'Roth 401(k)/403(b)', 
      taxAdvantaged: true, 
      expectedReturn: 7.0, 
      liquidityScore: 2, 
      description: 'Employer-sponsored retirement account with tax-free growth'
    },
    { 
      id: 'traditional401k', 
      name: 'Traditional 401(k)/403(b)', 
      taxAdvantaged: true, 
      expectedReturn: 7.0, 
      liquidityScore: 2, 
      description: 'Employer-sponsored retirement account with tax-deferred growth'
    },
    { 
      id: 'rothIRA', 
      name: 'Roth IRA', 
      taxAdvantaged: true, 
      expectedReturn: 7.0, 
      liquidityScore: 3, 
      description: 'Individual retirement account with tax-free growth'
    },
    { 
      id: 'traditionalIRA', 
      name: 'Traditional IRA', 
      taxAdvantaged: true, 
      expectedReturn: 7.0, 
      liquidityScore: 3, 
      description: 'Individual retirement account with tax-deferred growth'
    },
    { 
      id: 'hsa', 
      name: 'Health Savings Account (HSA)', 
      taxAdvantaged: true, 
      expectedReturn: 5.0, 
      liquidityScore: 3, 
      description: 'Tax-advantaged medical savings account for qualified medical expenses'
    },
    { 
      id: '529', 
      name: '529 College Savings Plan', 
      taxAdvantaged: true, 
      expectedReturn: 6.0, 
      liquidityScore: 2, 
      description: 'Tax-advantaged investment vehicle for education expenses'
    }
  ];
  
  // Financial goal types
  export const FINANCIAL_GOALS = [
    { id: 'debtFreedom', name: 'Debt Freedom', timeHorizonScore: 3 },
    { id: 'homeOwnership', name: 'Home Ownership', timeHorizonScore: 4 },
    { id: 'retirement', name: 'Retirement', timeHorizonScore: 5 },
    { id: 'education', name: 'Education Funding', timeHorizonScore: 4 },
    { id: 'travel', name: 'Travel/Lifestyle', timeHorizonScore: 2 },
    { id: 'business', name: 'Business Investment', timeHorizonScore: 4 },
    { id: 'charity', name: 'Charitable Giving', timeHorizonScore: 1 }
  ];
  
  // Large purchase types
  export const LARGE_PURCHASES = [
    { id: 'home', name: 'Home', timeHorizon: '5-10 years' },
    { id: 'vehicle', name: 'Vehicle', timeHorizon: '1-5 years' },
    { id: 'renovation', name: 'Home Renovation', timeHorizon: '1-3 years' },
    { id: 'travel', name: 'Major Travel', timeHorizon: '1-2 years' },
    { id: 'education', name: 'Education', timeHorizon: '1-10 years' }
  ];
  
  // Category colors for charts
  export const CATEGORY_COLORS = {
    'Emergency Fund': '#4472C4',
    'Debt Reduction': '#ED7D31',
    'Retirement': '#A5A5A5',
    'Education': '#FFC000',
    'Short-Term Goals': '#5B9BD5',
    'Long-Term Growth': '#70AD47',
    'Cash Reserve': '#7030A0'
  };