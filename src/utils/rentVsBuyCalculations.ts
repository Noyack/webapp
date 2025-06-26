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
  // Updated PMI rates based on 2025 standards
  // Use 0.4% as standard rate for down payments 15-19%, 0.7% for 10-14%, 0.95% for 5-9%, 1.15% for 3-4%
  let pmiRate = 0.004; // 0.4%
  
  if (downPaymentPercent < 5) {
    pmiRate = 0.0115; // 1.15%
  } else if (downPaymentPercent < 10) {
    pmiRate = 0.0095; // 0.95%
  } else if (downPaymentPercent < 15) {
    pmiRate = 0.007; // 0.7%
  }
  
  const annualPMI = loanAmount * pmiRate;
  const monthlyPMI = parseFloat((annualPMI / 12).toFixed(2));
  
  return { monthlyPMI, annualPMI: parseFloat(annualPMI.toFixed(2)), pmiRequired: true };
};

// Get federal tax bracket based on income and filing status (2025 Tax Year)
function getFederalTaxBracket(income: number, filingStatus: 'single' | 'married'): number {
  const brackets = filingStatus === 'single' 
    ? [
        { min: 0, max: 11925, rate: 0.10 },
        { min: 11925, max: 48475, rate: 0.12 },
        { min: 48475, max: 103350, rate: 0.22 },
        { min: 103350, max: 197300, rate: 0.24 },
        { min: 197300, max: 250525, rate: 0.32 },
        { min: 250525, max: 626350, rate: 0.35 },
        { min: 626350, max: Infinity, rate: 0.37 }
      ]
    : [
        { min: 0, max: 23850, rate: 0.10 },
        { min: 23850, max: 96950, rate: 0.12 },
        { min: 96950, max: 206700, rate: 0.22 },
        { min: 206700, max: 394600, rate: 0.24 },
        { min: 394600, max: 501050, rate: 0.32 },
        { min: 501050, max: 751600, rate: 0.35 },
        { min: 751600, max: Infinity, rate: 0.37 }
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
  maritalStatus: 'single' | 'married',
  mortgageBalance: number = 0 // Use this for actual interest calculation
): { annualTaxSavings: number; marginalTaxRate: number; itemizedDeductions: number; standardDeduction: number } => {
  // Use actual mortgage balance for interest calculation, or calculate initial if not provided
  const actualMortgageBalance = mortgageBalance || (homePrice * (1 - downPaymentPercent / 100));
  const annualInterest = actualMortgageBalance * (interestRate / 100);
  const annualPropertyTax = homePrice * (propertyTaxRate / 100);
  
  // 2025 Standard deductions
  const standardDeduction = maritalStatus === 'married' ? 30000 : 15000;
  
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
    annualTaxSavings: parseFloat(annualTaxSavings.toFixed(2)), 
    marginalTaxRate, 
    itemizedDeductions: parseFloat(itemizedDeductions.toFixed(2)), 
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
  
  // Calculate homeowner's insurance (annual) - NOT subject to inflation
  const annualHomeInsurance = (homePrice * homeInsuranceRate) / 100;
  
  // Buying closing costs (estimated at 3-5% of home price, adjusted for location) - NOT subject to inflation
  const buyingClosingCosts = homePrice * 0.04 * costOfLivingAdjustment; // 4% estimate with location adjustment
  
  // Initialize results array and tracking variables
  const resultsData: ResultData[] = [];
  let totalTaxSavingsAccumulated = 0; // Track actual total tax savings
  
  // Track the mortgage balance for equity calculations
  let mortgageBalance = loanAmount;
  
  // FIXED: Investment account should ONLY track monthly differences, not down payment
  // Both scenarios start with same cash position - homeowner puts down payment into house,
  // renter keeps cash but doesn't get to "invest" the down payment as that's unfair comparison
  let investmentAccount = 0; // Start at zero, only add monthly differences
  
  // Track cumulative costs for both scenarios  
  let cumulativeBuyingCost = buyingClosingCosts + downPaymentAmount;
  let cumulativeRentingCost = 0;
  
  // Current home value (will appreciate over time)
  let currentHomeValue = homePrice;
  
  // Current monthly rent (will increase over time, adjusted for location)
  let currentMonthlyRent = monthlyRent;
  
  // Track when PMI is removed (when loan balance reaches 78% of original home value OR current home value)
  let pmiRemoved = false;

  // For each year in the time horizon, calculate costs and equity
  for (let year = 1; year <= timeHorizon; year++) {
    // BUYING SCENARIO
    
    // Annual mortgage payment (P&I)
    const annualMortgagePayment = monthlyMortgagePayment * 12;
    
    // Calculate actual interest paid this year (decreases over time)
    const interestPaid = mortgageBalance * (interestRate / 100);
    const principalPaid = annualMortgagePayment - interestPaid;
    mortgageBalance = Math.max(0, mortgageBalance - principalPaid);
    
    // Update home value with appreciation
    currentHomeValue *= (1 + annualHomeValueIncrease / 100);
    
    // Debug: Verify home value calculation for test case
    // For $1M at 3% over 20 years should be $1,806,111
    // console.log(`Year ${year}: Home value = ${currentHomeValue.toFixed(2)}`);
    
    // Check if PMI should be removed (when balance reaches 78% of EITHER original OR current home value)
    if (!pmiRemoved && (mortgageBalance <= homePrice * 0.78 || mortgageBalance <= currentHomeValue * 0.78)) {
      pmiRemoved = true;
    }
    
    // Calculate PMI for this year
    const currentYearPMI = (pmiRemoved || !pmiInfo.pmiRequired) ? 0 : pmiInfo.annualPMI;
    
    // FIXED: Apply inflation to maintenance costs based on CURRENT home value
    const currentYearMaintenance = (currentHomeValue * annualMaintenancePercent) / 100 * costOfLivingAdjustment * Math.pow(1 + annualInflation / 100, year - 1);
    
    // Apply inflation to additional expenses
    const currentYearAdditionalExpenses = (monthlyAdditionalExpenses * 12 * costOfLivingAdjustment) * Math.pow(1 + annualInflation / 100, year - 1);
    
    // Calculate tax benefits using actual interest paid this year
    const taxBenefits = calculateTaxBenefits(
      homePrice, downPaymentPercent, interestRate, 
      propertyTaxRate, annualIncome, maritalStatus, mortgageBalance
    );
    
    // Accumulate actual tax savings
    totalTaxSavingsAccumulated += taxBenefits.annualTaxSavings;
    
    // Calculate annual buying costs (with location adjustments and inflation where appropriate)
    const annualBuyingCosts = 
      annualMortgagePayment +                           // Mortgage P&I
      annualPropertyTax +                               // Property tax
      annualHomeInsurance +                             // Home insurance (NOT inflated)
      currentYearPMI +                                  // PMI (if applicable)
      (monthlyHOAFees * 12 * costOfLivingAdjustment) +  // HOA fees (NOT inflated per your request)
      currentYearMaintenance +                          // Maintenance (inflation applied)
      currentYearAdditionalExpenses -                   // Additional expenses (inflation applied)
      taxBenefits.annualTaxSavings;                     // Minus tax savings
    
    cumulativeBuyingCost += annualBuyingCosts;
    
    // Calculate equity (home value minus remaining mortgage balance)
    const currentEquity = currentHomeValue - mortgageBalance;
    
    // Calculate net buying cost (total cost minus current equity)
    const netBuyingCost = cumulativeBuyingCost - currentEquity;
    
    // RENTING SCENARIO
    
    // FIXED: Calculate annual renting costs (renter's insurance is completely flat - no adjustments)
    const annualRenterInsurance = monthlyRentersInsurance * 12; // Flat $360/year, no location adjustment
    const annualRentingCosts = (currentMonthlyRent * 12) + annualRenterInsurance;
    cumulativeRentingCost += annualRentingCosts;
    
    // FIXED: Investment logic - renter invests ONLY the monthly difference
    // This represents the cash flow advantage of renting vs buying each month
    const monthlyDifference = (annualBuyingCosts - annualRentingCosts) / 12;
    if (monthlyDifference > 0) {
      // If buying costs more monthly, renter can invest that difference
      investmentAccount += monthlyDifference * 12;
    }
    // Note: If renting costs more, renter has negative cash flow advantage (no additional investment)
    
    // Grow investment account with returns (only if there's something to grow)
    if (investmentAccount > 0) {
      investmentAccount *= (1 + annualReturnOnSavings / 100);
    }
    
    // Update rent for next year (apply ONLY rent increase, not inflation)
    currentMonthlyRent *= (1 + annualRentIncrease / 100);
    
    // Store results for this year (round to 2 decimal places)
    resultsData.push({
      year,
      buyingCost: parseFloat(cumulativeBuyingCost.toFixed(2)),
      rentingCost: parseFloat(cumulativeRentingCost.toFixed(2)),
      buyingEquity: parseFloat(currentEquity.toFixed(2)),
      buyingNetCost: parseFloat(netBuyingCost.toFixed(2))
    });
  }

  // Calculate final values
  const finalHomeValue = parseFloat(currentHomeValue.toFixed(2));
  const finalEquity = parseFloat((finalHomeValue - mortgageBalance).toFixed(2));
  
  // Add selling costs to final net buying cost (adjusted for location) - 6% is more realistic than 9%
  const sellingCosts = finalHomeValue * 0.06 * costOfLivingAdjustment;
  const finalNetBuyingCost = parseFloat((cumulativeBuyingCost - finalEquity + sellingCosts).toFixed(2));
  
  // Find break-even year (when net buying cost equals net renting cost)
  let breakEvenYear: number | null = null;
  for (const result of resultsData) {
    // Compare total costs fairly: buying total vs renting total + opportunity cost of not investing
    const totalRentingCost = result.rentingCost; // Just renting costs, no investment offset
    if (result.buyingNetCost <= totalRentingCost) {
      breakEvenYear = result.year;
      break;
    }
  }

  // Create summary (all values rounded to 2 decimal places)
  const summary: SummaryData = {
    totalBuyingCost: parseFloat(cumulativeBuyingCost.toFixed(2)),
    totalRentingCost: parseFloat(cumulativeRentingCost.toFixed(2)),
    finalHomeValue,
    finalEquity,
    netBuyingCost: finalNetBuyingCost,
    savingsAfterTimePeriod: parseFloat(investmentAccount.toFixed(2)),
    totalTaxSavings: parseFloat(totalTaxSavingsAccumulated.toFixed(2)), // Add actual total
  };

  return {
    results: resultsData,
    summary,
    breakEvenYear
  };
};