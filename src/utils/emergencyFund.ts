// src/components/EmergencyFunds/utils/calculations.ts
import { EmergencySavingsAccount, SafetyNet } from '../types';

// Calculate total emergency savings
export const calculateTotalSavings = (accounts: EmergencySavingsAccount[]): number => {
  return accounts.reduce((total, account) => total + account.amount, 0);
};

// Calculate months of coverage
export const calculateCoverageMonths = (totalSavings: number, monthlyExpenses: number): number => {
  if (monthlyExpenses <= 0) return 0;
  return totalSavings / monthlyExpenses;
};

// Calculate emergency fund target
export const calculateEmergencyFundTarget = (monthlyExpenses: number, targetMonths: number): number => {
  return monthlyExpenses * targetMonths;
};

// Calculate funding gap
export const calculateFundingGap = (targetAmount: number, totalSavings: number): number => {
  return Math.max(0, targetAmount - totalSavings);
};

// Calculate months to complete emergency fund
export const calculateMonthsToComplete = (fundingGap: number, monthlyContribution: number): number => {
  if (fundingGap <= 0 || monthlyContribution <= 0) return 0;
  return Math.ceil(fundingGap / monthlyContribution);
};

// Calculate total available credit
export const calculateTotalAvailableCredit = (creditLines: SafetyNet[]): number => {
  return creditLines.reduce((total, credit) => total + (credit.available || 0), 0);
};

// src/components/EmergencyFunds/utils/formatting.ts

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Generate unique ID for items
export const generateId = (): string => {
  return `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};