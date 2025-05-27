import { RentVsBuyInputs, ResultData, SummaryData } from '../types/rentVsBuy';
import { costOfLivingByState } from '../utils/locationData';

// Helper function for formatting currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

// Helper function for formatting percentage
export const formatPercent = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

// Get cost of living adjustment factor for location
export const getCostOfLivingAdjustment = (state: string): number => {
  const costData = costOfLivingByState.find(item => item.state === state);
  return costData ? costData.index / 100 : 1.0; // Default to 1.0 (100%) if not found
};

// Calculate monthly mortgage payment
export const calculateMonthlyMortgage = (homePrice: number, downPaymentPercent: number, interestRate: number, mortgageTerm: number): number => {
  const loanAmount = homePrice * (1 - downPaymentPercent / 100);
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = mortgageTerm * 12;
  
  if (monthlyInterestRate === 0) {
    return loanAmount / numberOfPayments;
  }
  
  const monthlyPayment = loanAmount * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  
  return monthlyPayment;
};

// Calculate PMI (Private Mortgage Insurance)
export const calculatePMI = (homePrice: number, downPaymentPercent: number): { monthlyPMI: number; annualPMI: number; pmiRequired: boolean } => {
  const pmiRequired = downPaymentPercent < 20;
  
  if (!pmiRequired) {
    return { monthlyPMI: 0, annualPMI: 0, pmiRequired: false };
  }
  
  const loanAmount = homePrice * (1 - downPaymentPercent / 100);
  // PMI typically ranges from 0.2% to 2% of loan amount annually
  // Use 0.5% as standard rate for down payments 10-19%, 0.85% for 5-9%, 1.15% for 3-4%
  let pmiRate = 0.005; // 0.5%
  
  if (downPaymentPercent < 5) {
    pmiRate = 0.0115; // 1.15%
  } else if (downPaymentPercent < 10) {
    pmiRate = 0.0085; // 0.85%
  }
  
  const annualPMI = loanAmount * pmiRate;
  const monthlyPMI = annualPMI / 12;
  
  return { monthlyPMI, annualPMI, pmiRequired: true };
};

// Get federal tax bracket based on income and filing status
function getFederalTaxBracket(income: number, filingStatus: 'single' | 'married'): number {
  const brackets = filingStatus === 'single' 
    ? [
        { min: 0, max: 11000, rate: 0.10 },
        { min: 11000, max: 44725, rate: 0.12 },
        { min: 44725, max: 95375, rate: 0.22 },
        { min: 95375, max: 182050, rate: 0.24 },
        { min: 182050, max: 231250, rate: 0.32 },
        { min: 231250, max: 578125, rate: 0.35 },
        { min: 578125, max: Infinity, rate: 0.37 }
      ]
    : [
        { min: 0, max: 22000, rate: 0.10 },
        { min: 22000, max: 89450, rate: 0.12 },
        { min: 89450, max: 190750, rate: 0.22 },
        { min: 190750, max: 364200, rate: 0.24 },
        { min: 364200, max: 462500, rate: 0.32 },
        { min: 462500, max: 693750, rate: 0.35 },
        { min: 693750, max: Infinity, rate: 0.37 }
      ];

  const bracket = brackets.find(b => income >= b.min && income < b.max);
  return bracket ? bracket.rate : 0.37;
}

// Calculate comprehensive tax benefits for homeownership
export const calculateTaxBenefits = (
  homePrice: number,
  downPaymentPercent: number,
  interestRate: number,
  propertyTaxRate: number,
  annualIncome: number,
  maritalStatus: 'single' | 'married'
): { annualTaxSavings: number; marginalTaxRate: number; itemizedDeductions: number; standardDeduction: number } => {
  const loanAmount = homePrice * (1 - downPaymentPercent / 100);
  const annualInterest = loanAmount * (interestRate / 100);
  const annualPropertyTax = homePrice * (propertyTaxRate / 100);
  
  // Standard deduction for 2024
  const standardDeduction = maritalStatus === 'married' ? 29200 : 14600;
  
  // SALT cap (State And Local Tax deduction cap)
  const saltCap = 10000;
  const deductiblePropertyTax = Math.min(annualPropertyTax, saltCap);
  
  // Total itemized deductions (mortgage interest + property tax)
  const itemizedDeductions = annualInterest + deductiblePropertyTax;
  
  // Get marginal tax rate
  const marginalTaxRate = getFederalTaxBracket(annualIncome, maritalStatus);
  
  // Calculate tax savings
  let annualTaxSavings = 0;
  if (itemizedDeductions > standardDeduction) {
    const additionalDeduction = itemizedDeductions - standardDeduction;
    annualTaxSavings = additionalDeduction * marginalTaxRate;
  }
  
  return { 
    annualTaxSavings, 
    marginalTaxRate, 
    itemizedDeductions, 
    standardDeduction 
  };
};

// Input validation function
export const validateInputs = (inputs: RentVsBuyInputs): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Basic financial validations
  if (inputs.monthlyRent <= 0) errors.push("Monthly rent must be greater than $0");
  if (inputs.homePrice <= 0) errors.push("Home price must be greater than $0");
  if (inputs.annualIncome <= 0) errors.push("Annual income must be greater than $0");
  
  // Percentage validations
  if (inputs.downPaymentPercent < 0 || inputs.downPaymentPercent > 100) 
    errors.push("Down payment must be between 0% and 100%");
  if (inputs.interestRate < 0 || inputs.interestRate > 30) 
    errors.push("Interest rate must be between 0% and 30%");
  if (inputs.annualHomeValueIncrease < -10 || inputs.annualHomeValueIncrease > 20) 
    errors.push("Home value increase must be between -10% and 20%");
  if (inputs.annualRentIncrease < 0 || inputs.annualRentIncrease > 20) 
    errors.push("Rent increase must be between 0% and 20%");
  if (inputs.annualInflation < 0 || inputs.annualInflation > 15) 
    errors.push("Inflation rate must be between 0% and 15%");
  if (inputs.annualReturnOnSavings < 0 || inputs.annualReturnOnSavings > 30) 
    errors.push("Investment return must be between 0% and 30%");
  
  // Logical validations
  if (inputs.timeHorizon < 1 || inputs.timeHorizon > 50) 
    errors.push("Time horizon must be between 1 and 50 years");
  if (inputs.mortgageTerm < 5 || inputs.mortgageTerm > 50) 
    errors.push("Mortgage term must be between 5 and 50 years");
  
  // Affordability checks
  const monthlyIncome = inputs.annualIncome / 12;
  const totalMonthlyHousingCost = calculateMonthlyMortgage(inputs.homePrice, inputs.downPaymentPercent, inputs.interestRate, inputs.mortgageTerm) +
    (inputs.homePrice * ((inputs.location.propertyTaxRate || 1.1) / 100) / 12) +
    (inputs.homePrice * (inputs.homeInsuranceRate / 100) / 12) +
    inputs.monthlyHOAFees +
    inputs.monthlyAdditionalExpenses +
    calculatePMI(inputs.homePrice, inputs.downPaymentPercent).monthlyPMI;
  
  const housingRatio = (totalMonthlyHousingCost / monthlyIncome) * 100;
  if (housingRatio > 45) {
    errors.push(`Total housing costs (${formatPercent(housingRatio)}) exceed recommended 45% of income`);
  }
  
  const rentRatio = (inputs.monthlyRent / monthlyIncome) * 100;
  if (rentRatio > 35) {
    errors.push(`Monthly rent (${formatPercent(rentRatio)}) exceeds recommended 35% of income`);
  }
  
  return { isValid: errors.length === 0, errors };
};

// Main calculation function with enhanced PMI and tax benefits
export const calculateRentVsBuy = (inputs: RentVsBuyInputs): { results: ResultData[]; summary: SummaryData; breakEvenYear: number | null } => {
  const {
    location,
    maritalStatus,
    annualIncome,
    monthlyRent,
    homePrice,
    downPaymentPercent,
    timeHorizon,
    mortgageTerm,
    interestRate,
    homeInsuranceRate,
    monthlyHOAFees,
    annualMaintenancePercent,
    monthlyAdditionalExpenses,
    annualHomeValueIncrease,
    annualRentIncrease,
    monthlyRentersInsurance,
    annualInflation,
    annualReturnOnSavings
  } = inputs;

  // Get cost of living adjustment for the location
  const costOfLivingAdjustment = getCostOfLivingAdjustment(location.state);

  // Calculate key values
  const downPaymentAmount = (homePrice * downPaymentPercent) / 100;
  const loanAmount = homePrice - downPaymentAmount;
  
  // Calculate monthly mortgage payment (P&I)
  const monthlyMortgagePayment = calculateMonthlyMortgage(homePrice, downPaymentPercent, interestRate, mortgageTerm);
  
  // Calculate PMI
  const pmiInfo = calculatePMI(homePrice, downPaymentPercent);
  
  // Calculate property tax (annual, based on location or default)
  const propertyTaxRate = location.propertyTaxRate || 1.1; // Default 1.1% if not provided
  const annualPropertyTax = (homePrice * propertyTaxRate) / 100;
  
  // Calculate homeowner's insurance (annual)
  const annualHomeInsurance = (homePrice * homeInsuranceRate) / 100;
  
  // Annual maintenance (adjusted for cost of living)
  const annualMaintenance = (homePrice * annualMaintenancePercent) / 100 * costOfLivingAdjustment;
  
  // Calculate tax benefits
  const taxBenefits = calculateTaxBenefits(
    homePrice, downPaymentPercent, interestRate, 
    propertyTaxRate, annualIncome, maritalStatus
  );
  
  // Buying closing costs (estimated at 3-5% of home price, adjusted for location)
  const buyingClosingCosts = homePrice * 0.04 * costOfLivingAdjustment; // 4% estimate with location adjustment
  
  // Initialize results array
  const resultsData: ResultData[] = [];
  
  // Track the mortgage balance for equity calculations
  let mortgageBalance = loanAmount;
  
  // Investment account for the difference between renting and buying upfront costs
  let investmentAccount = downPaymentAmount + buyingClosingCosts;
  
  // Track cumulative costs for both scenarios
  let cumulativeBuyingCost = buyingClosingCosts + downPaymentAmount;
  let cumulativeRentingCost = 0;
  
  // Current home value (will appreciate over time)
  let currentHomeValue = homePrice;
  
  // Current monthly rent (will increase over time, adjusted for location)
  let currentMonthlyRent = monthlyRent;
  
  // Track when PMI is removed (when loan balance reaches 78% of original home value)
  let pmiRemoved = false;

  // For each year in the time horizon, calculate costs and equity
  for (let year = 1; year <= timeHorizon; year++) {
    // BUYING SCENARIO
    
    // Annual mortgage payment (P&I)
    const annualMortgagePayment = monthlyMortgagePayment * 12;
    
    // Recalculate mortgage balance after year's payments
    const interestPaid = mortgageBalance * (interestRate / 100);
    const principalPaid = annualMortgagePayment - interestPaid;
    mortgageBalance = Math.max(0, mortgageBalance - principalPaid);
    
    // Update home value with appreciation
    currentHomeValue *= (1 + annualHomeValueIncrease / 100);
    
    // Check if PMI should be removed (when balance reaches 78% of original home value)
    if (!pmiRemoved && mortgageBalance <= homePrice * 0.78) {
      pmiRemoved = true;
    }
    
    // Calculate PMI for this year
    const currentYearPMI = (pmiRemoved || !pmiInfo.pmiRequired) ? 0 : pmiInfo.annualPMI;
    
    // Calculate annual buying costs (with location adjustments)
    const annualBuyingCosts = 
      annualMortgagePayment +                           // Mortgage P&I
      annualPropertyTax +                               // Property tax
      annualHomeInsurance +                             // Home insurance
      currentYearPMI +                                  // PMI (if applicable)
      (monthlyHOAFees * 12 * costOfLivingAdjustment) +  // HOA fees (location adjusted)
      annualMaintenance +                               // Maintenance (already location adjusted)
      (monthlyAdditionalExpenses * 12 * costOfLivingAdjustment) - // Additional expenses (location adjusted)
      taxBenefits.annualTaxSavings;                     // Minus tax savings
    
    cumulativeBuyingCost += annualBuyingCosts;
    
    // Calculate equity (home value minus remaining mortgage balance)
    const currentEquity = currentHomeValue - mortgageBalance;
    
    // Calculate net buying cost (total cost minus current equity)
    const netBuyingCost = cumulativeBuyingCost - currentEquity;
    
    // RENTING SCENARIO
    
    // Calculate annual renting costs (renter's insurance adjusted for location)
    const annualRentingCosts = (currentMonthlyRent * 12) + (monthlyRentersInsurance * 12 * costOfLivingAdjustment);
    cumulativeRentingCost += annualRentingCosts;
    
    // Update investment account with the difference in upfront costs
    if (year === 1) {
      // In the first year, we invest the down payment and closing costs
      investmentAccount = downPaymentAmount + buyingClosingCosts;
    }
    
    // Add monthly investment (difference between buying and renting costs)
    const monthlyDifference = (annualBuyingCosts - annualRentingCosts) / 12;
    if (monthlyDifference < 0) {
      // If renting costs more, add the difference to investment account monthly
      investmentAccount += Math.abs(monthlyDifference) * 12;
    }
    
    // Grow investment account with returns
    investmentAccount *= (1 + annualReturnOnSavings / 100);
    
    // Update rent for next year (may vary by location's rental market)
    currentMonthlyRent *= (1 + annualRentIncrease / 100);
    
    // Store results for this year
    resultsData.push({
      year,
      buyingCost: cumulativeBuyingCost,
      rentingCost: cumulativeRentingCost,
      buyingEquity: currentEquity,
      buyingNetCost: netBuyingCost
    });
  }

  // Calculate final values
  const finalHomeValue = currentHomeValue;
  const finalEquity = finalHomeValue - mortgageBalance;
  const finalNetBuyingCost = cumulativeBuyingCost - finalEquity;
  
  // Add selling costs to final net buying cost (adjusted for location)
  const finalNetBuyingCostWithSelling = finalNetBuyingCost + (finalHomeValue * 0.09 * costOfLivingAdjustment); // 9% selling costs with location adjustment
  
  // Find break-even year (when net buying cost equals renting cost)
  let breakEvenYear: number | null = null;
  for (const result of resultsData) {
    if (result.buyingNetCost <= result.rentingCost) {
      breakEvenYear = result.year;
      break;
    }
  }

  // Create summary
  const summary: SummaryData = {
    totalBuyingCost: cumulativeBuyingCost,
    totalRentingCost: cumulativeRentingCost,
    finalHomeValue,
    finalEquity,
    netBuyingCost: finalNetBuyingCostWithSelling,
    savingsAfterTimePeriod: investmentAccount,
  };

  return {
    results: resultsData,
    summary,
    breakEvenYear
  };
}; 