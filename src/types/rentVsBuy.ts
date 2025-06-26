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
  totalTaxSavings?: number; // Add actual total tax savings
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

// FIXED: Default values - all financial inputs set to 0, text inputs empty to force user entry
export const DEFAULT_RENT_VS_BUY_INPUTS: RentVsBuyInputs = {
  location: {
    city: '',
    state: '',
  },
  maritalStatus: 'single',
  annualIncome: 0,
  
  monthlyRent: 0,
  homePrice: 0,
  downPaymentPercent: 0,
  timeHorizon: 0,
  
  mortgageTerm: 0,
  interestRate: 0,
  
  homeInsuranceRate: 0,
  monthlyHOAFees: 0,
  annualMaintenancePercent: 0,
  monthlyAdditionalExpenses: 0,
  annualHomeValueIncrease: 0,
  
  annualRentIncrease: 0,
  monthlyRentersInsurance: 0,
  
  annualInflation: 0,
  annualReturnOnSavings: 0,
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
    totalTaxSavings: 0,
  },
  breakEvenYear: null,
};

// Chart colors for consistent theming
export const RENT_VS_BUY_CHART_COLORS = {
  primary: '#1f77b4',    // Blue
  secondary: '#ff7f0e',  // Orange  
  tertiary: '#2ca02c'    // Green
};