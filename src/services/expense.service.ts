/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import apiClient from './api-client';
import { 
  ExpenseInfoForm, 
  ExpenseItem,
  ExpenseCategoryItem
} from '../types';

// Backend models
interface ExpenseCategoryDB {
  id?: string;
  userId?: string;
  name: string;
  totalMonthly: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ExpenseItemDB {
  id?: string;
  categoryId: string;
  subcategory: string;
  description?: string;
  amount: string;
  frequency: string;
  isVariable: boolean;
  variableMin?: string;
  variableMax?: string;
  isTaxDeductible: boolean;
  priority: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to convert ExpenseItem to ExpenseItemDB
const mapExpenseItemToBackend = (
  item: ExpenseItem,
  categoryId: string
): ExpenseItemDB => {
  return {
    id: item.id,
    categoryId,
    subcategory: item.subcategory,
    description: item.description || '',
    amount: item.amount.toString(),
    frequency: mapFrequencyToBackend(item.frequency),
    isVariable: item.isVariable,
    variableMin: item.variableRange?.min?.toString(),
    variableMax: item.variableRange?.max?.toString(),
    isTaxDeductible: item.isTaxDeductible,
    priority: mapPriorityToBackend(item.priority),
    notes: item.notes
  };
};

// Map frontend frequency to backend values
const mapFrequencyToBackend = (frequency: string): string => {
  // Map frontend frequency values to backend enum values
  switch (frequency) {
    case 'Daily': return 'daily';
    case 'Weekly': return 'weekly';
    case 'Bi-weekly': return 'biweekly';
    case 'Monthly': return 'monthly';
    case 'Quarterly': return 'quarterly';
    case 'Yearly': return 'annual';
    case 'One Time': return 'one_time';
    default: return 'monthly'; // Default to monthly
  }
};

// Map frontend priority to backend values
const mapPriorityToBackend = (priority: string): string => {
  // Map frontend priority values to backend enum values
  switch (priority) {
    case 'Essential': return 'essential';
    case 'Important': return 'important';
    case 'Nice to Have': return 'discretionary';
    case 'Optional': return 'luxury';
    default: return 'discretionary'; // Default to discretionary
  }
};

// Map backend frequency to frontend values
const mapFrequencyToFrontend = (frequency: string): string => {
  switch (frequency) {
    case 'daily': return 'Daily';
    case 'weekly': return 'Weekly';
    case 'biweekly': return 'Bi-weekly';
    case 'monthly': return 'Monthly';
    case 'quarterly': return 'Quarterly';
    case 'annual': return 'Yearly';
    case 'one_time': return 'One Time';
    default: return 'Monthly'; // Default to monthly
  }
};

// Map backend priority to frontend values
const mapPriorityToFrontend = (priority: string): string => {
  switch (priority) {
    case 'essential': return 'Essential';
    case 'important': return 'Important';
    case 'discretionary': return 'Nice to Have';
    case 'luxury': return 'Optional';
    default: return 'Nice to Have'; // Default to discretionary
  }
};

// Map backend expense item to frontend model
const mapExpenseItemToFrontend = (item: any): ExpenseItem => {
  return {
    id: item.id,
    category: item.categoryName,
    subcategory: item.subcategory,
    description: item.description || '',
    amount: Number(item.amount),
    frequency: mapFrequencyToFrontend(item.frequency),
    isVariable: item.isVariable,
    variableRange: item.isVariable ? {
      min: Number(item.variableMin) || 0,
      max: Number(item.variableMax) || 0
    } : undefined,
    isTaxDeductible: item.isTaxDeductible,
    priority: mapPriorityToFrontend(item.priority),
    notes: item.notes || ''
  };
};

export const expenseService = {
  // Get all expense data for a user
  async getUserExpenses(userId: string): Promise<ExpenseInfoForm> {
    try {
      // Initialize with empty categories
      const result: ExpenseInfoForm = {
        housing: { totalMonthly: 0, items: [] },
        utilities: { totalMonthly: 0, items: [] },
        food: { totalMonthly: 0, items: [] },
        transportation: { totalMonthly: 0, items: [] },
        insurance: { totalMonthly: 0, items: [] },
        healthcare: { totalMonthly: 0, items: [] },
        dependentCare: { totalMonthly: 0, items: [] },
        debtPayments: { totalMonthly: 0, items: [] },
        discretionary: { totalMonthly: 0, items: [] },
        financialGoals: { totalMonthly: 0, items: [] },
        periodicExpenses: { totalMonthly: 0, items: [] },
        businessExpenses: { totalMonthly: 0, items: [] }
      };

      // Get expense categories for this user
      const categoriesResponse = await apiClient.get(`/v1/users/${userId}/expense-categories`);
      const categories = categoriesResponse.data;

      if (!categories || categories.length === 0) {
        return result; // Return empty result if no categories
      }

      // Get all expense items for this user
      const itemsResponse = await apiClient.get(`/v1/users/${userId}/expense-items`);
      const items = itemsResponse.data;

      // Map items to their categories
      if (items && items.length > 0) {
        items.forEach(item => {
          const frontendItem = mapExpenseItemToFrontend(item);
          
          // Find the correct category key
          let categoryKey: keyof ExpenseInfoForm;
          
          switch(frontendItem.category.toLowerCase()) {
            case 'housing': 
              categoryKey = 'housing'; 
              break;
            case 'utilities': 
              categoryKey = 'utilities'; 
              break;
            case 'food': 
              categoryKey = 'food'; 
              break;
            case 'transportation': 
              categoryKey = 'transportation'; 
              break;
            case 'insurance': 
              categoryKey = 'insurance'; 
              break;
            case 'healthcare': 
              categoryKey = 'healthcare'; 
              break;
            case 'dependent care': 
              categoryKey = 'dependentCare'; 
              break;
            case 'debt payments': 
              categoryKey = 'debtPayments'; 
              break;
            case 'discretionary': 
              categoryKey = 'discretionary'; 
              break;
            case 'financial goals': 
              categoryKey = 'financialGoals'; 
              break;
            case 'periodic expenses': 
              categoryKey = 'periodicExpenses'; 
              break;
            case 'business expenses': 
              categoryKey = 'businessExpenses'; 
              break;
            default:
              categoryKey = 'discretionary'; // Default
          }
          
          result[categoryKey].items.push(frontendItem);
        });
      }

      // Set category totals
      categories.forEach(category => {
        let categoryKey: keyof ExpenseInfoForm;
        
        switch(category.name.toLowerCase()) {
          case 'housing': 
            categoryKey = 'housing'; 
            break;
          case 'utilities': 
            categoryKey = 'utilities'; 
            break;
          case 'food': 
            categoryKey = 'food'; 
            break;
          case 'transportation': 
            categoryKey = 'transportation'; 
            break;
          case 'insurance': 
            categoryKey = 'insurance'; 
            break;
          case 'healthcare': 
            categoryKey = 'healthcare'; 
            break;
          case 'dependent care': 
            categoryKey = 'dependentCare'; 
            break;
          case 'debt payments': 
            categoryKey = 'debtPayments'; 
            break;
          case 'discretionary': 
            categoryKey = 'discretionary'; 
            break;
          case 'financial goals': 
            categoryKey = 'financialGoals'; 
            break;
          case 'periodic expenses': 
            categoryKey = 'periodicExpenses'; 
            break;
          case 'business expenses': 
            categoryKey = 'businessExpenses'; 
            break;
          default:
            categoryKey = 'discretionary'; // Default
        }
        
        result[categoryKey].totalMonthly = Number(category.totalMonthly);
      });

      return result;
    } catch (error) {
      console.error('Error fetching user expenses:', error);
      throw new Error('Failed to load expense data. Please try again later.');
    }
  },

  // Save all expense data
  async saveExpenseData(userId: string, formData: ExpenseInfoForm): Promise<void> {
    try {
      // 1. Get existing categories
      const existingCategoriesResponse = await apiClient.get(`/v1/users/${userId}/expense-categories`);
      const existingCategories = existingCategoriesResponse.data || [];
      
      const categoryMap = new Map();
      existingCategories.forEach(cat => {
        categoryMap.set(cat.name.toLowerCase(), cat);
      });
      
      // 2. Get existing expense items
      const existingItemsResponse = await apiClient.get(`/v1/users/${userId}/expense-items`);
      const existingItems = existingItemsResponse.data || [];
      
      const existingItemMap = new Map();
      existingItems.forEach(item => {
        existingItemMap.set(item.id, item);
      });
      
      // 3. Process each category
      const categoryPromises = [];
      
      // Process categories
      for (const [categoryKey, categoryData] of Object.entries(formData)) {
        const categoryName = this.getCategoryNameFromKey(categoryKey);
        
        // Find if category exists or create it
        let categoryId;
        const existingCategory = categoryMap.get(categoryName.toLowerCase());
        
        if (existingCategory) {
          // Update existing category
          categoryId = existingCategory.id;
          categoryPromises.push(
            apiClient.patch(`/v1/expense-categories/${categoryId}`, {
              totalMonthly: categoryData.totalMonthly.toString()
            })
          );
        } else if (categoryData.items.length > 0) {
          // Only create category if it has items
          const newCategory = {
            userId,
            name: categoryName,
            totalMonthly: categoryData.totalMonthly.toString()
          };
          
          // Create a new category for this user
          const response = await apiClient.post(`/v1/users/${userId}/expense-categories`, newCategory);
          categoryId = response.data.id;
          categoryMap.set(categoryName.toLowerCase(), { id: categoryId, name: categoryName });
        } else {
          // Skip if no items and category doesn't exist
          continue;
        }
        
        // Process items for this category
        const newItems = [];
        const updateItems = [];
        const existingItemIds = new Set();
        
        for (const item of categoryData.items) {
          if (item.id && existingItemMap.has(item.id)) {
            // Update existing item
            updateItems.push({
              id: item.id,
              item: mapExpenseItemToBackend(item, categoryId)
            });
            existingItemIds.add(item.id);
          } else {
            // Create new item
            newItems.push(mapExpenseItemToBackend(item, categoryId));
          }
        }
        
        // Find items to delete (existing items not in the current list)
        const deleteItemIds = [];
        existingItems.forEach(item => {
          // Only consider items from this category
          const existingCategoryId = categoryMap.get(categoryName.toLowerCase())?.id;
          if (item.categoryId === existingCategoryId && !existingItemIds.has(item.id)) {
            deleteItemIds.push(item.id);
          }
        });
        
        // Execute item operations
        const itemPromises = [];
        
        // Create new items
        for (const newItem of newItems) {
          itemPromises.push(
            apiClient.post(`/v1/expense-categories/${categoryId}/items`, newItem)
          );
        }
        
        // Update existing items
        for (const { id, item } of updateItems) {
          itemPromises.push(
            apiClient.patch(`/v1/expense-items/${id}`, item)
          );
        }
        
        // Delete items
        for (const id of deleteItemIds) {
          itemPromises.push(
            apiClient.delete(`/v1/expense-items/${id}`)
          );
        }
        
        await Promise.all(itemPromises);
      }
      
      await Promise.all(categoryPromises);
      
    } catch (error) {
      console.error('Error saving expense data:', error);
      throw new Error('Failed to save expense data. Please try again later.');
    }
  },
  
  // Helper method to get full category name from key
  getCategoryNameFromKey(key: string): string {
    switch(key) {
      case 'housing': return 'Housing';
      case 'utilities': return 'Utilities';
      case 'food': return 'Food';
      case 'transportation': return 'Transportation';
      case 'insurance': return 'Insurance';
      case 'healthcare': return 'Healthcare';
      case 'dependentCare': return 'Dependent Care';
      case 'debtPayments': return 'Debt Payments';
      case 'discretionary': return 'Discretionary';
      case 'financialGoals': return 'Financial Goals';
      case 'periodicExpenses': return 'Periodic Expenses';
      case 'businessExpenses': return 'Business Expenses';
      default: return key;
    }
  }
};

export default expenseService;