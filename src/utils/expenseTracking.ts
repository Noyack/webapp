// Utility functions for expense tracking

import { ExpenseInfoForm, ExpenseItem } from '../types';

// Generate unique ID for expense entries
export const generateId = (): string => `expense_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Calculate monthly equivalent for different frequencies
export const calculateMonthlyEquivalent = (amount: number, frequency: string): number => {
  // Ensure amount is a number to prevent string concatenation issues
  const numAmount = Number(amount);
  
  switch(frequency) {
    case "Daily": return numAmount * 30.42; // Average days per month
    case "Weekly": return numAmount * 4.35; // Average weeks per month
    case "Bi-weekly": return numAmount * 2.17; // Average fortnights per month
    case "Monthly": return numAmount;
    case "Quarterly": return numAmount / 3;
    case "Semi-annually": return numAmount / 6;
    case "Annually": return numAmount / 12;
    default: return numAmount;
  }
};

// Get all expenses as a flat array
export const getAllExpenses = (expenses: ExpenseInfoForm): ExpenseItem[] => {
  const allExpenses: ExpenseItem[] = [];
  Object.values(expenses).forEach(category => {
    allExpenses.push(...category.items);
  });
  return allExpenses;
};

// Calculate total monthly expenses
export const calculateTotalMonthly = (expenses: ExpenseInfoForm): number => {
  let total = 0;
  
  Object.values(expenses).forEach(category => {
    category.items.forEach(expense => {
      // Ensure explicit number conversion to prevent string concatenation
      total = Number(total) + Number(calculateMonthlyEquivalent(expense.amount, expense.frequency));
    });
  });
  
  return total;
};

// Get category key from display name
export const getCategoryKey = (displayName: string): keyof ExpenseInfoForm => {
  const keyMap: Record<string, keyof ExpenseInfoForm> = {
    "Housing": "housing",
    "Utilities": "utilities",
    "Food": "food",
    "Transportation": "transportation",
    "Insurance": "insurance",
    "Healthcare": "healthcare",
    "Dependent Care": "dependentCare",
    "Debt Payments": "debtPayments",
    "Discretionary": "discretionary",
    "Financial Goals": "financialGoals",
    "Periodic Expenses": "periodicExpenses",
    "Business Expenses": "businessExpenses"
  };
  return keyMap[displayName] || "housing";
};

// Count expenses by priority
export const countByPriority = (expenses: ExpenseInfoForm): Record<string, { count: number, total: number }> => {
  const result: Record<string, { count: number, total: number }> = {
    "Essential": { count: 0, total: 0 },
    "Important": { count: 0, total: 0 },
    "Nice to Have": { count: 0, total: 0 },
    "Optional": { count: 0, total: 0 }
  };

  Object.values(expenses).forEach(category => {
    category.items.forEach(expense => {
      if (expense.priority) {
        result[expense.priority].count++;
        // Ensure explicit number conversion
        result[expense.priority].total = Number(result[expense.priority].total) + 
                                         Number(calculateMonthlyEquivalent(expense.amount, expense.frequency));
      }
    });
  });

  return result;
};

// Calculate tax deductible expenses
export const calculateTaxDeductible = (expenses: ExpenseInfoForm): { count: number, total: number } => {
  let count = 0;
  let total = 0;
  
  Object.values(expenses).forEach(category => {
    category.items.forEach(expense => {
      if (expense.isTaxDeductible) {
        count++;
        // Ensure explicit number conversion
        total = Number(total) + Number(calculateMonthlyEquivalent(expense.amount, expense.frequency));
      }
    });
  });
  
  return { count, total };
};

// Calculate category totals
export const calculateCategoryTotals = (expenses: ExpenseInfoForm) => {
  const totalMonthly = calculateTotalMonthly(expenses);
  
  return Object.entries(expenses).map(([key, category]) => {
    const total = category.items.reduce((sum, expense) => {
      // Ensure explicit number conversion
      return Number(sum) + Number(calculateMonthlyEquivalent(expense.amount, expense.frequency));
    }, 0);
    
    return {
      name: key.replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to spaces
      total,
      percentage: totalMonthly > 0 ? (total / totalMonthly) * 100 : 0,
      count: category.items.length
    };
  }).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total);
};