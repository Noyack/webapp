import { Debt, AssetAllocation, Projection } from '../types';
import { RISK_PROFILES, CATEGORY_COLORS } from '../constants/constant';

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value}%`;
};

// Calculate debt priority
export const calculateDebtPriority = (debt: Debt): number => {
  // Higher interest rate means higher priority
  return debt.interestRate;
};

// Calculate emergency fund needs
export const calculateEmergencyFundNeeds = (monthlyExpenses: number, currentEmergencyFund: number): number => {
  const targetMonths = 6;
  const targetEmergencyFund = monthlyExpenses * targetMonths;
  
  return Math.max(0, targetEmergencyFund - currentEmergencyFund);
};

// Check retirement contribution status
export const checkRetirementMaxed = (): boolean => {
  // Simplified check - in a real app would have more complex logic
  return false;
};

// Generate investment allocation based on risk profile
export const generateInvestmentAllocation = (
  riskTolerance: string, 
  customAllocation: AssetAllocation
): AssetAllocation => {
  const riskProfile = RISK_PROFILES.find(profile => profile.id === riskTolerance);
  
  if (riskTolerance === 'custom') {
    return {
      stocks: customAllocation.stocks,
      bonds: customAllocation.bonds,
      cash: customAllocation.cash,
      alternatives: customAllocation.alternatives
    };
  }
  
  return {
    stocks: riskProfile?.stockAllocation || 0,
    bonds: riskProfile?.bondAllocation || 0,
    cash: riskProfile?.cashAllocation || 0,
    alternatives: 0
  };
};

// Calculate potential growth projections
export const calculateProjections = (allocation: AssetAllocation, amount: number): Projection[] => {
  const projections: Projection[] = [];
  const years = 30;
  
  // Fixed, consistent return rates
  const STOCK_RETURN = 0.08;    // 8% annual return for stocks
  const BOND_RETURN = 0.035;    // 3.5% annual return for bonds
  const CASH_RETURN = 0.01;     // 1% annual return for cash
  const ALT_RETURN = 0.06;      // 6% annual return for alternatives
  
  // Ensure we're working with clean, rounded percentages to avoid floating point issues
  const stockAlloc = Math.round(allocation.stocks);
  const bondAlloc = Math.round(allocation.bonds);
  const cashAlloc = Math.round(allocation.cash);
  const altAlloc = Math.round(allocation.alternatives);
  
  // Weighted average return based on allocation (as decimal)
  const expectedAnnualReturn = (
    (stockAlloc / 100 * STOCK_RETURN) + 
    (bondAlloc / 100 * BOND_RETURN) + 
    (cashAlloc / 100 * CASH_RETURN) + 
    (altAlloc / 100 * ALT_RETURN)
  );
  
  // Use exact math with a fresh base amount
  const currentValue = Math.round(amount);
  
  for (let i = 0; i <= years; i += 5) {
    // For year 0, use the exact initial amount without any growth
    if (i === 0) {
      projections.push({
        year: 0,
        value: currentValue,
        conservativeValue: Math.round(currentValue * 0.8),
        aggressiveValue: Math.round(currentValue * 1.2)
      });
    } else {
      // Calculate growth using precise compound interest formula
      const growthFactor = Math.pow(1 + expectedAnnualReturn, i);
      const projectedValue = Math.round(amount * growthFactor);
      
      projections.push({
        year: i,
        value: projectedValue,
        conservativeValue: Math.round(projectedValue * 0.8),
        aggressiveValue: Math.round(projectedValue * 1.2)
      });
    }
  }
  
  return projections;
};

// Calculate interest saved by paying off debt early
export const calculateInterestSaved = (debt: Debt, amountPaid: number): number => {
  // Simplified calculation
  // In a real app would be more complex based on payment schedule
  const yearsToPayoff = debt.balance / debt.minimumPayment / 12;
  return (amountPaid * debt.interestRate / 100 * yearsToPayoff);
};

// Calculate tax impact of the windfall
export const calculateTaxImpact = (amount: number, taxable: boolean, taxBracket: number): number => {
  if (!taxable) return 0;
  
  // Simplified calculation
  return amount * (taxBracket / 100);
};

// Get color based on category
export const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#000000';
};