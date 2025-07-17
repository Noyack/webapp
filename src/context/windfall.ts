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
    // ...other investment vehicles
  ];
  
  // Financial goal types
  export const FINANCIAL_GOALS = [
    { id: 'debtFreedom', name: 'Debt Freedom', timeHorizonScore: 3 },
    { id: 'homeOwnership', name: 'Home Ownership', timeHorizonScore: 4 },
    // ...other financial goals
  ];
  
  // Large purchase types
  export const LARGE_PURCHASES = [
    { id: 'home', name: 'Home', timeHorizon: '5-10 years' },
    { id: 'vehicle', name: 'Vehicle', timeHorizon: '1-5 years' },
    // ...other large purchases
  ];