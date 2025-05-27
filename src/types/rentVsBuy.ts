// Location data interface
export interface LocationData {
  city: string;
  state: string;
  medianHomePrice?: number;
  medianRent?: number;
  propertyTaxRate?: number;
  homeInsuranceRate?: number;
}

// Result data for yearly projections
export interface ResultData {
  year: number;
  buyingCost: number;
  rentingCost: number;
  buyingEquity: number;
  buyingNetCost: number;
}

// Summary data interface
export interface SummaryData {
  totalBuyingCost: number;
  totalRentingCost: number;
  finalHomeValue: number;
  finalEquity: number;
  netBuyingCost: number;
  savingsAfterTimePeriod: number;
}

// Main input interface for all calculator inputs
export interface RentVsBuyInputs {
  // Location & Personal
  location: LocationData;
  maritalStatus: 'single' | 'married';
  annualIncome: number;
  
  // Basic Inputs
  monthlyRent: number;
  homePrice: number;
  downPaymentPercent: number;
  timeHorizon: number;
  
  // Mortgage Details
  mortgageTerm: number;
  interestRate: number;
  
  // Home Expenses
  homeInsuranceRate: number;
  monthlyHOAFees: number;
  annualMaintenancePercent: number;
  monthlyAdditionalExpenses: number;
  annualHomeValueIncrease: number;
  
  // Rent Details
  annualRentIncrease: number;
  monthlyRentersInsurance: number;
  
  // Advanced Settings
  annualInflation: number;
  annualReturnOnSavings: number;
}

// Default values for all inputs
export const DEFAULT_RENT_VS_BUY_INPUTS: RentVsBuyInputs = {
  location: {
    city: '',
    state: '',
  },
  maritalStatus: 'single',
  annualIncome: 100000,
  
  monthlyRent: 2000,
  homePrice: 400000,
  downPaymentPercent: 20,
  timeHorizon: 10,
  
  mortgageTerm: 30,
  interestRate: 5.5,
  
  homeInsuranceRate: 0.5,
  monthlyHOAFees: 200,
  annualMaintenancePercent: 1,
  monthlyAdditionalExpenses: 100,
  annualHomeValueIncrease: 3,
  
  annualRentIncrease: 3,
  monthlyRentersInsurance: 30,
  
  annualInflation: 2,
  annualReturnOnSavings: 7,
};

// Empty results for initial state
export const EMPTY_RENT_VS_BUY_RESULTS: { results: ResultData[]; summary: SummaryData; breakEvenYear: number | null } = {
  results: [],
  summary: {
    totalBuyingCost: 0,
    totalRentingCost: 0,
    finalHomeValue: 0,
    finalEquity: 0,
    netBuyingCost: 0,
    savingsAfterTimePeriod: 0,
  },
  breakEvenYear: null,
};

// Chart colors for consistent theming
export const RENT_VS_BUY_CHART_COLORS = {
  primary: '#1f77b4',    // Blue
  secondary: '#ff7f0e',  // Orange  
  tertiary: '#2ca02c'    // Green
}; 