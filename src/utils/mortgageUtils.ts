// Enhanced mortgage calculation utilities with 2 decimal place restrictions
// This file provides improved calculation functions for the mortgage calculator

export interface MortgageCalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayments: number;
  monthlyPMI: number;
  loanToValue: number;
}

export interface AmortizationScheduleItem {
  month: number;
  year: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface PayoffAnalysis {
  standardPayoffMonths: number;
  extraPaymentPayoffMonths: number;
  monthsSaved: number;
  yearsSaved: number;
  interestSaved: number;
  totalInterestWithoutExtra: number;
  totalInterestWithExtra: number;
}

/**
 * Round number to exactly 2 decimal places
 */
export function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate monthly mortgage payment using standard amortization formula
 */
export function calculateMonthlyPayment(
  principal: number,
  annualInterestRate: number,
  loanTermYears: number
): number {
  if (principal <= 0 || annualInterestRate < 0 || loanTermYears <= 0) {
    return 0;
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  // Handle zero interest rate case
  if (monthlyRate === 0) {
    return roundToTwoDecimals(principal / numberOfPayments);
  }

  const monthlyPayment = (
    principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))
  ) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return roundToTwoDecimals(monthlyPayment);
}

/**
 * Calculate PMI based on 2025 industry standards
 */
export function calculatePMI(
  loanAmount: number,
  downPaymentPercent: number,
  homePrice: number
): { monthlyPMI: number; annualPMI: number; pmiRequired: boolean; pmiRate: number } {
  const pmiRequired = downPaymentPercent < 20;
  
  if (!pmiRequired) {
    return { monthlyPMI: 0, annualPMI: 0, pmiRequired: false, pmiRate: 0 };
  }

  // 2025 PMI rates based on down payment percentage
  let pmiRate = 0.004; // 0.4% for 15-19% down payment
  
  if (downPaymentPercent < 5) {
    pmiRate = 0.0115; // 1.15% for 3-4% down payment
  } else if (downPaymentPercent < 10) {
    pmiRate = 0.0095; // 0.95% for 5-9% down payment
  } else if (downPaymentPercent < 15) {
    pmiRate = 0.007; // 0.7% for 10-14% down payment
  }

  const annualPMI = loanAmount * pmiRate;
  const monthlyPMI = annualPMI / 12;

  return {
    monthlyPMI: roundToTwoDecimals(monthlyPMI),
    annualPMI: roundToTwoDecimals(annualPMI),
    pmiRequired: true,
    pmiRate: roundToTwoDecimals(pmiRate * 100) / 100
  };
}

/**
 * Generate complete amortization schedule
 */
export function generateAmortizationSchedule(
  principal: number,
  annualInterestRate: number,
  loanTermYears: number,
  extraMonthlyPayment: number = 0,
  extraAnnualPayment: number = 0
): AmortizationScheduleItem[] {
  const monthlyPayment = calculateMonthlyPayment(principal, annualInterestRate, loanTermYears);
  const monthlyRate = annualInterestRate / 100 / 12;
  
  const schedule: AmortizationScheduleItem[] = [];
  let remainingBalance = principal;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  let month = 0;

  while (remainingBalance > 0.01 && month < 500) { // Safety limit
    month++;
    const year = Math.ceil(month / 12);
    
    // Calculate interest for this month
    const interestPayment = remainingBalance * monthlyRate;
    
    // Calculate principal payment (base + extra payments)
    let principalPayment = monthlyPayment - interestPayment + extraMonthlyPayment;
    
    // Add annual extra payment in January
    if (month % 12 === 1 && month > 1) {
      principalPayment += extraAnnualPayment;
    }
    
    // Don't pay more principal than remaining balance
    if (principalPayment > remainingBalance) {
      principalPayment = remainingBalance;
    }
    
    // Update running totals
    remainingBalance -= principalPayment;
    cumulativeInterest += interestPayment;
    cumulativePrincipal += principalPayment;
    
    schedule.push({
      month,
      year,
      principalPayment: roundToTwoDecimals(principalPayment),
      interestPayment: roundToTwoDecimals(interestPayment),
      remainingBalance: roundToTwoDecimals(remainingBalance),
      cumulativeInterest: roundToTwoDecimals(cumulativeInterest),
      cumulativePrincipal: roundToTwoDecimals(cumulativePrincipal)
    });
    
    if (remainingBalance <= 0) break;
  }

  return schedule;
}

/**
 * Calculate payoff analysis with and without extra payments
 */
export function calculatePayoffAnalysis(
  principal: number,
  annualInterestRate: number,
  loanTermYears: number,
  extraMonthlyPayment: number = 0,
  extraAnnualPayment: number = 0
): PayoffAnalysis {
  // Standard schedule without extra payments
  const standardSchedule = generateAmortizationSchedule(principal, annualInterestRate, loanTermYears);
  const standardPayoffMonths = standardSchedule.length;
  const totalInterestWithoutExtra = standardSchedule[standardSchedule.length - 1]?.cumulativeInterest || 0;

  // Schedule with extra payments
  const extraSchedule = generateAmortizationSchedule(
    principal, 
    annualInterestRate, 
    loanTermYears, 
    extraMonthlyPayment, 
    extraAnnualPayment
  );
  const extraPaymentPayoffMonths = extraSchedule.length;
  const totalInterestWithExtra = extraSchedule[extraSchedule.length - 1]?.cumulativeInterest || 0;

  const monthsSaved = standardPayoffMonths - extraPaymentPayoffMonths;
  const yearsSaved = Math.floor(monthsSaved / 12);
  const interestSaved = totalInterestWithoutExtra - totalInterestWithExtra;

  return {
    standardPayoffMonths,
    extraPaymentPayoffMonths,
    monthsSaved,
    yearsSaved,
    interestSaved: roundToTwoDecimals(interestSaved),
    totalInterestWithoutExtra: roundToTwoDecimals(totalInterestWithoutExtra),
    totalInterestWithExtra: roundToTwoDecimals(totalInterestWithExtra)
  };
}

/**
 * Find key loan milestones (50% paid off, 80% equity, etc.)
 */
export function findLoanMilestones(
  schedule: AmortizationScheduleItem[],
  originalPrincipal: number
): {
  fiftyPercentPaidMonth: number;
  eightyPercentEquityMonth: number;
  pmiRemovalMonth: number;
} {
  let fiftyPercentPaidMonth = 0;
  let eightyPercentEquityMonth = 0; // 80% equity = 20% remaining balance
  let pmiRemovalMonth = 0; // PMI removed at 78% of original value

  for (const payment of schedule) {
    // 50% of principal paid off
    if (!fiftyPercentPaidMonth && payment.remainingBalance <= originalPrincipal * 0.5) {
      fiftyPercentPaidMonth = payment.month;
    }
    
    // 80% equity reached (20% remaining balance)
    if (!eightyPercentEquityMonth && payment.remainingBalance <= originalPrincipal * 0.2) {
      eightyPercentEquityMonth = payment.month;
    }
    
    // PMI removal (78% of original loan value)
    if (!pmiRemovalMonth && payment.remainingBalance <= originalPrincipal * 0.78) {
      pmiRemovalMonth = payment.month;
    }
  }

  return {
    fiftyPercentPaidMonth,
    eightyPercentEquityMonth,
    pmiRemovalMonth
  };
}

/**
 * Calculate refinancing analysis
 */
export function calculateRefinancingAnalysis(
  currentBalance: number,
  currentInterestRate: number,
  currentRemainingTerm: number,
  newInterestRate: number,
  newLoanTerm: number,
  refinancingCosts: number
): {
  currentMonthlyPayment: number;
  newMonthlyPayment: number;
  monthlySavings: number;
  annualSavings: number;
  breakEvenMonths: number | null;
  totalSavingsOverNewTerm: number;
  refinancingRecommended: boolean;
} {
  const currentMonthlyPayment = calculateMonthlyPayment(
    currentBalance,
    currentInterestRate,
    currentRemainingTerm
  );
  
  const newMonthlyPayment = calculateMonthlyPayment(
    currentBalance,
    newInterestRate,
    newLoanTerm
  );

  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
  const annualSavings = monthlySavings * 12;
  
  // Calculate break-even point
  const breakEvenMonths = monthlySavings > 0 ? refinancingCosts / monthlySavings : null;
  
  // Calculate total savings over the new loan term
  const currentTotalCost = currentMonthlyPayment * currentRemainingTerm * 12;
  const newTotalCost = (newMonthlyPayment * newLoanTerm * 12) + refinancingCosts;
  const totalSavingsOverNewTerm = currentTotalCost - newTotalCost;
  
  // Recommendation logic
  const refinancingRecommended = 
    monthlySavings > 0 && 
    breakEvenMonths !== null && 
    breakEvenMonths <= 36 && // Break even within 3 years
    totalSavingsOverNewTerm > 0;

  return {
    currentMonthlyPayment: roundToTwoDecimals(currentMonthlyPayment),
    newMonthlyPayment: roundToTwoDecimals(newMonthlyPayment),
    monthlySavings: roundToTwoDecimals(monthlySavings),
    annualSavings: roundToTwoDecimals(annualSavings),
    breakEvenMonths: breakEvenMonths ? roundToTwoDecimals(breakEvenMonths) : null,
    totalSavingsOverNewTerm: roundToTwoDecimals(totalSavingsOverNewTerm),
    refinancingRecommended
  };
}

/**
 * Calculate debt-to-income ratio and affordability assessment
 */
export function calculateAffordabilityAssessment(
  totalMonthlyPayment: number,
  monthlyIncome: number
): {
  housingRatio: number;
  level: 'Excellent' | 'Good' | 'Moderate' | 'Caution' | 'High Risk' | 'Enter Salary';
  color: 'success' | 'warning' | 'error' | 'info';
  message: string;
  recommended: boolean;
} {
  if (monthlyIncome <= 0) {
    return {
      housingRatio: 0,
      level: 'Enter Salary',
      color: 'info',
      message: 'Please enter your annual salary for assessment',
      recommended: false
    };
  }

  const housingRatio = (totalMonthlyPayment / monthlyIncome) * 100;

  if (housingRatio <= 20) {
    return {
      housingRatio,
      level: 'Excellent',
      color: 'success',
      message: `${housingRatio.toFixed(1)}% of income - Very affordable`,
      recommended: true
    };
  } else if (housingRatio <= 28) {
    return {
      housingRatio,
      level: 'Good',
      color: 'success',
      message: `${housingRatio.toFixed(1)}% of income - Within recommended guidelines`,
      recommended: true
    };
  } else if (housingRatio <= 33) {
    return {
      housingRatio,
      level: 'Moderate',
      color: 'warning',
      message: `${housingRatio.toFixed(1)}% of income - Reasonable but monitor budget`,
      recommended: true
    };
  } else if (housingRatio <= 40) {
    return {
      housingRatio,
      level: 'Caution',
      color: 'warning',
      message: `${housingRatio.toFixed(1)}% of income - Higher payment, review carefully`,
      recommended: false
    };
  } else {
    return {
      housingRatio,
      level: 'High Risk',
      color: 'error',
      message: `${housingRatio.toFixed(1)}% of income - May strain finances significantly`,
      recommended: false
    };
  }
}

/**
 * Validate mortgage input values
 */
export function validateMortgageInput(
  field: string,
  value: number
): { isValid: boolean; errorMessage?: string; correctedValue?: number } {
  const validationRules: Record<string, { min: number; max: number; message: string }> = {
    homePrice: { min: 50000, max: 10000000, message: 'Home price must be between $50,000 and $10,000,000' },
    downPayment: { min: 0, max: 9999999, message: 'Down payment cannot be negative' },
    downPaymentPercent: { min: 0, max: 100, message: 'Down payment percentage must be between 0% and 100%' },
    interestRate: { min: 0.1, max: 20, message: 'Interest rate must be between 0.1% and 20%' },
    loanTerm: { min: 5, max: 50, message: 'Loan term must be between 5 and 50 years' },
    annualSalary: { min: 0, max: 99999999, message: 'Annual salary cannot be negative' },
    propertyTax: { min: 0, max: 999999, message: 'Property tax cannot be negative' },
    homeInsurance: { min: 0, max: 99999, message: 'Home insurance cannot be negative' },
    hoaDues: { min: 0, max: 9999, message: 'HOA dues cannot be negative' },
    extraMonthlyPayment: { min: 0, max: 99999, message: 'Extra monthly payment cannot be negative' },
    extraAnnualPayment: { min: 0, max: 999999, message: 'Extra annual payment cannot be negative' },
    refinancingCosts: { min: 0, max: 99999, message: 'Refinancing costs cannot be negative' }
  };

  const rule = validationRules[field];
  if (!rule) {
    return { isValid: true };
  }

  if (isNaN(value)) {
    return { isValid: false, errorMessage: 'Please enter a valid number', correctedValue: rule.min };
  }

  if (value < rule.min) {
    return { isValid: false, errorMessage: rule.message, correctedValue: rule.min };
  }

  if (value > rule.max) {
    return { isValid: false, errorMessage: rule.message, correctedValue: rule.max };
  }

  return { isValid: true };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate loan-to-value ratio
 */
export function calculateLoanToValue(loanAmount: number, homePrice: number): number {
  if (homePrice <= 0) return 0;
  return (loanAmount / homePrice) * 100;
}

/**
 * Get specific months for amortization schedule display (1, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60)
 */
export function getSpecificMonthsSchedule(
  schedule: AmortizationScheduleItem[],
  months: number[] = [1, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60]
): AmortizationScheduleItem[] {
  return schedule.filter(payment => months.includes(payment.month));
}

/**
 * Calculate interest vs principal percentages over loan lifetime
 */
export function calculateInterestPrincipalRatio(
  principal: number,
  totalInterest: number
): { interestPercent: number; principalPercent: number; totalPaid: number } {
  const totalPaid = principal + totalInterest;
  const interestPercent = (totalInterest / totalPaid) * 100;
  const principalPercent = (principal / totalPaid) * 100;

  return {
    interestPercent: parseFloat(interestPercent.toFixed(1)),
    principalPercent: parseFloat(principalPercent.toFixed(1)),
    totalPaid: parseFloat(totalPaid.toFixed(2))
  };
}

/**
 * Generate mortgage recommendations based on loan parameters
 */
export function generateMortgageRecommendations(
  data: {
    downPaymentPercent: number;
    affordabilityLevel: string;
    affordabilityMessage: string;
    extraMonthlyPayment: number;
    extraPaymentSavings: number;
    monthlySavings: number;
    yearsSaved: number;
  }
): string[] {
  const recommendations: string[] = [];

  // Down payment recommendation
  if (data.downPaymentPercent < 20) {
    recommendations.push(
      `Consider saving for a larger down payment to avoid PMI. You're currently at ${data.downPaymentPercent.toFixed(1)}% - reaching 20% would eliminate PMI costs.`
    );
  } else {
    recommendations.push(
      `Excellent! Your ${data.downPaymentPercent.toFixed(1)}% down payment avoids PMI and demonstrates strong financial preparation.`
    );
  }

  // Affordability recommendation
  recommendations.push(
    `Your ${data.affordabilityLevel.toLowerCase()} affordability level suggests ${data.affordabilityMessage.toLowerCase()}`
  );

  // Extra payment recommendation
  if (data.extraMonthlyPayment > 0) {
    recommendations.push(
      `Great strategy! Your extra payments will save you ${data.yearsSaved} years and ${data.extraPaymentSavings.toFixed(2)} in interest over the life of the loan.`
    );
  } else {
    recommendations.push(
      'Consider making extra principal payments to significantly reduce your total interest cost and pay off your mortgage faster.'
    );
  }

  // Refinancing recommendation
  if (data.monthlySavings > 0) {
    recommendations.push(
      `Refinancing could save you ${data.monthlySavings.toFixed(2)} per month. Shop around with multiple lenders to ensure you get the best rate.`
    );
  } else {
    recommendations.push(
      'Your current interest rate appears competitive. Continue monitoring rates and consider refinancing if they drop by 0.5% or more.'
    );
  }

  // General recommendations
  recommendations.push(
    'Shop around with at least 3-5 lenders to compare rates, fees, and terms before making your final decision.'
  );

  recommendations.push(
    'Remember to budget for the total cost of homeownership including maintenance (1-3% of home value annually), utilities, property taxes, and potential HOA fees.'
  );

  return recommendations;
}