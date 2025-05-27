/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './api-client';
import { 
  BaseDebt,
  DebtProfileForm,
  Mortgage,
  AutoLoan,
  StudentLoan,
  CreditCard,
  PersonalLoan,
  OtherDebt
} from '../types';

/**
 * Service for debt-related operations
 */
export class DebtService {
    
  /**
   * Utility function to remove timestamp fields from an object
   * This prevents errors when sending dates to the backend
   */
  private removeTimestampFields(obj: any): any {
    if (!obj) return obj;
    
    const cleaned = { ...obj };
    // Remove timestamp fields that should be handled by the backend
    delete cleaned.createdAt;
    delete cleaned.updatedAt;
    delete cleaned.created_at;
    delete cleaned.updated_at;
    
    return cleaned;
  }

  /**
   * Get all debts for a user
   */
  async getDebts(userId: string, debtType?: string): Promise<BaseDebt[]> {
    const params = debtType ? { type: debtType } : {};
    const response = await apiClient.get<BaseDebt[]>(`/v1/users/${userId}/debts`, { params });
    return response.data;
  }

  /**
   * Get a specific debt by ID
   */
  async getDebt(id: string): Promise<BaseDebt> {
    const response = await apiClient.get<BaseDebt>(`/v1/debts/${id}`);
    return response.data;
  }

  /**
   * Create a new debt
   */
  async createDebt(userId: string, debtData: any): Promise<BaseDebt> {
    // Clean timestamp fields
    const cleanData = this.removeTimestampFields(debtData);
    
    // Extract any debt-type specific fields into the extra JSON field
    const processedData = this.processDebtData(cleanData);
    
    const response = await apiClient.post<BaseDebt>(`/v1/users/${userId}/debts`, processedData);
    return response.data;
  }

  /**
   * Update an existing debt
   */
  async updateDebt(id: string, debtData: any): Promise<BaseDebt> {
    // Clean timestamp fields
    const cleanData = this.removeTimestampFields(debtData);
    
    // Extract any debt-type specific fields into the extra JSON field
    const processedData = this.processDebtData(cleanData);
    
    const response = await apiClient.patch<BaseDebt>(`/v1/debts/${id}`, processedData);
    return response.data;
  }

  /**
   * Process debt data to move specialized fields into the extra property
   */
  private processDebtData(debtData: any): any {
    // Base fields that are directly stored in the debts table
    const baseFields = [
      'id', 'userId', 'debtType', 'lender', 'accountLast4', 'originalAmount',
      'currentBalance', 'interestRate', 'monthlyPayment', 'remainingTerm',
      'originalTerm', 'isJoint', 'status', 'hasCollateral', 'collateralDescription',
      'hasCosigner', 'cosignerName', 'extra', 'createdAt', 'updatedAt'
    ];
    
    // Create a new object with base fields
    const result: any = {};
    const extra: any = {};
    
    // Copy all properties, putting non-base fields into extra
    for (const [key, value] of Object.entries(debtData)) {
      if (baseFields.includes(key)) {
        result[key] = value;
      } else {
        extra[key] = value;
      }
    }
    
    // Merge with any existing extra data
    result.extra = { ...(debtData.extra || {}), ...extra };
    
    return result;
  }

  /**
   * Delete a debt
   */
  async deleteDebt(id: string): Promise<void> {
    await apiClient.delete(`/v1/debts/${id}`);
  }

  /**
   * Get debt strategy for a user
   */
  
  async getDebtStrategy(userId: string): Promise<any> {
    try {
      const response = await apiClient.get<Record<string, any>>(`/v1/users/${userId}/debt-strategy`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          currentStrategy: 'none',
          consolidationPlans: '',
          bankruptcyHistory: false,
          debtSettlementActivities: ''
        };
      }
      throw error;
    }
  }

  /**
   * Create a debt strategy
   */
  async createDebtStrategy(userId: string, strategyData: Record<string, any>): Promise<Record<string, any>> {
    // Clean timestamp fields
    const cleanData = this.removeTimestampFields(strategyData);
    const response = await apiClient.post<Record<string, any>>(`/v1/users/${userId}/debt-strategy`, cleanData);
    return response.data;
  }

  /**
   * Update an existing debt strategy
   */
  async updateDebtStrategy(id: string, strategyData: Record<string, any>): Promise<Record<string, any>> {
    // Clean timestamp fields
    const cleanData = this.removeTimestampFields(strategyData);
    const response = await apiClient.patch<Record<string, any>>(`/v1/debt-strategy/${id}`, cleanData);
    return response.data;
  }

  /**
   * Save a single debt (create or update)
   */
  async saveSingleDebt(userId: string, debt: any, debtType: string): Promise<BaseDebt> {
    // Add the debt type and clean timestamp fields
    const debtWithType = { ...this.removeTimestampFields(debt), debtType };
    
    // If debt has an ID, update it; otherwise create a new one
    if (debt.id) {
      return await this.updateDebt(debt.id, debtWithType);
    } else {
      return await this.createDebt(userId, debtWithType);
    }
  }

  /**
   * Save complete debt profile (multiple debts and strategy)
   */
  async saveDebtProfile(userId: string, debtProfile: DebtProfileForm): Promise<void> {
    // For each debt type that has been changed
    // We'll handle each debt type individually to avoid cross-type modifications
    
    // Handle mortgages
    for (const mortgage of debtProfile.mortgages || []) {
      await this.saveSingleDebt(userId, mortgage, 'mortgage');
    }
    
    // Handle auto loans
    for (const autoLoan of debtProfile.autoLoans || []) {
      await this.saveSingleDebt(userId, autoLoan, 'auto_loan');
    }
    
    // Handle student loans
    for (const studentLoan of debtProfile.studentLoans || []) {
      await this.saveSingleDebt(userId, studentLoan, 'student_loan');
    }
    
    // Handle credit cards
    for (const creditCard of debtProfile.creditCards || []) {
      await this.saveSingleDebt(userId, creditCard, 'credit_card');
    }
    
    // Handle personal loans
    for (const personalLoan of debtProfile.personalLoans || []) {
      await this.saveSingleDebt(userId, personalLoan, 'personal_loan');
    }
    
    // Handle other debts
    for (const otherDebt of debtProfile.otherDebts || []) {
      await this.saveSingleDebt(userId, otherDebt, 'other');
    }

    // Create/update debt strategy if provided
    if (debtProfile.debtStrategy) {
      try {
        // First try to get existing strategy
        let existingStrategy;
        try {
          existingStrategy = await this.getDebtStrategy(userId);
        } catch (error) {
            console.error(error)
          // If no strategy exists, continue with creation
        }

        if (existingStrategy && existingStrategy.id) {
          await this.updateDebtStrategy(existingStrategy.id, debtProfile.debtStrategy);
        } else {
          await this.createDebtStrategy(userId, debtProfile.debtStrategy);
        }
      } catch (error: any) {
        // If error contains existing ID, update instead
        if (error.response?.data?.existingId) {
          await this.updateDebtStrategy(error.response.data.existingId, debtProfile.debtStrategy);
        } else {
          throw error;
        }
      }
    }
  }

  /**
   * Save only modified debts, comparing with original data
   */
  async saveModifiedDebts(userId: string, originalData: DebtProfileForm, newData: DebtProfileForm): Promise<void> {
    // Compare and process modified debts for each category
    await this.processModifiedCategory(userId, 'mortgage', originalData.mortgages, newData.mortgages);
    await this.processModifiedCategory(userId, 'auto_loan', originalData.autoLoans, newData.autoLoans);
    await this.processModifiedCategory(userId, 'student_loan', originalData.studentLoans, newData.studentLoans);
    await this.processModifiedCategory(userId, 'credit_card', originalData.creditCards, newData.creditCards);
    await this.processModifiedCategory(userId, 'personal_loan', originalData.personalLoans, newData.personalLoans);
    await this.processModifiedCategory(userId, 'other', originalData.otherDebts, newData.otherDebts);
    
    // Process debt strategy
    const originalStrategyString = JSON.stringify(this.removeTimestampFields(originalData.debtStrategy));
    const newStrategyString = JSON.stringify(this.removeTimestampFields(newData.debtStrategy));
    
    if (originalStrategyString !== newStrategyString) {
      // Strategy has changed - update it
      try {
        let existingStrategy;
        try {
          existingStrategy = await this.getDebtStrategy(userId);
        } catch (error) {
          // If no strategy exists, continue with creation
          console.error(error)

        }

        if (existingStrategy && existingStrategy.id) {
          await this.updateDebtStrategy(existingStrategy.id, newData.debtStrategy);
        } else {
          await this.createDebtStrategy(userId, newData.debtStrategy);
        }
      } catch (error: any) {
        // If error contains existing ID, update instead
        if (error.response?.data?.existingId) {
          await this.updateDebtStrategy(error.response.data.existingId, newData.debtStrategy);
        } else {
          throw error;
        }
      }
    }
  }

  /**
   * Process modified debts for a specific category
   */
  private async processModifiedCategory(
    userId: string, 
    debtType: string, 
    originalDebts: any[], 
    newDebts: any[]
  ): Promise<void> {
    // Map original debts by ID for easy lookup
    const originalDebtsMap = new Map<string, any>();
    originalDebts?.forEach(debt => {
      if (debt.id) {
        // Clean timestamps from original data for comparison
        originalDebtsMap.set(debt.id, this.removeTimestampFields(debt));
      }
    });
    
    // Set of processed IDs to track deletions
    const processedIds = new Set<string>();
    
    // Process each new debt
    for (const debt of newDebts || []) {
      // Clean the debt for comparison and submission
      const cleanDebt = this.removeTimestampFields(debt);
      
      // Add proper debt type
      const debtWithType = { ...cleanDebt, debtType };
      
      if (debt.id) {
        // Mark as processed
        processedIds.add(debt.id);
        
        // Check if it existed before
        const originalDebt = originalDebtsMap.get(debt.id);
        if (originalDebt) {
          // It existed - check if it changed (excluding timestamps)
          // We need to make sure we're comparing the same properties
          const originalForComparison = { ...originalDebt, debtType };
          if (JSON.stringify(originalForComparison) !== JSON.stringify(debtWithType)) {
            // It changed - update it
            await this.updateDebt(debt.id, debtWithType);
          }
          // Otherwise it didn't change - do nothing
        } else {
          // It has an ID but didn't exist in original data
          // This shouldn't normally happen, but handle it by creating as new
          delete debtWithType.id; // Remove the ID to let server generate a new one
          await this.createDebt(userId, debtWithType);
        }
      } else {
        // No ID - it's a new debt
        await this.createDebt(userId, debtWithType);
      }
    }
    
    // Check for deleted debts
    for (const originalDebt of originalDebts || []) {
      if (originalDebt.id && !processedIds.has(originalDebt.id)) {
        // This debt was in the original data but not in the new data - delete it
        await this.deleteDebt(originalDebt.id);
      }
    }
  }

  /**
   * Load complete debt profile for a user
   */
  async loadDebtProfile(userId: string): Promise<DebtProfileForm> {
    const debtProfile: DebtProfileForm = {
      mortgages: [],
      autoLoans: [],
      studentLoans: [],
      creditCards: [],
      personalLoans: [],
      otherDebts: [],
      debtStrategy: {
          currentStrategy: 'none',
          customStrategy: '',
          consolidationPlans: '',
          priorityDebtId: '', // ID of the debt with highest payoff priority
          bankruptcyHistory: false,
          bankruptcyDetails: '',
          debtSettlementActivities: '',

      }
    };

    // Load mortgages
    try {
      const mortgages = await this.getDebts(userId, 'mortgage') as Mortgage[];
      debtProfile.mortgages = this.processLoadedDebts(mortgages, 'mortgage');
    } catch (error) {
      console.error('Error loading mortgages:', error);
    }

    // Load auto loans
    try {
      const autoLoans = await this.getDebts(userId, 'auto_loan') as AutoLoan[];
      debtProfile.autoLoans = this.processLoadedDebts(autoLoans, 'auto_loan');
    } catch (error) {
      console.error('Error loading auto loans:', error);
    }

    // Load student loans
    try {
      const studentLoans = await this.getDebts(userId, 'student_loan') as StudentLoan[];
      debtProfile.studentLoans = this.processLoadedDebts(studentLoans, 'student_loan');
    } catch (error) {
      console.error('Error loading student loans:', error);
    }

    // Load credit cards
    try {
      const creditCards = await this.getDebts(userId, 'credit_card') as CreditCard[];
      debtProfile.creditCards = this.processLoadedDebts(creditCards, 'credit_card');
    } catch (error) {
      console.error('Error loading credit cards:', error);
    }

    // Load personal loans
    try {
      const personalLoans = await this.getDebts(userId, 'personal_loan') as PersonalLoan[];
      debtProfile.personalLoans = this.processLoadedDebts(personalLoans, 'personal_loan');
    } catch (error) {
      console.error('Error loading personal loans:', error);
    }

    // Load other debts
    try {
      const otherDebts = await this.getDebts(userId, 'other') as OtherDebt[];
      debtProfile.otherDebts = this.processLoadedDebts(otherDebts, 'other');
    } catch (error) {
      console.error('Error loading other debts:', error);
    }

    // Load debt strategy
    try {
      const debtStrategy = await this.getDebtStrategy(userId);
      if (debtStrategy) {
        debtProfile.debtStrategy = debtStrategy;
      }
    } catch (error) {
      console.error('Error loading debt strategy:', error);
    }

    return debtProfile;
  }

  /**
   * Process loaded debts to expand the extra field properties
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private processLoadedDebts<T extends BaseDebt>(debts: T[], _debtType: string): T[] {
    return debts.map(debt => {
      // Expand any properties in the extra field to the top level
      const result = { ...debt } as any;
      
      if (debt.extra) {
        // Copy all properties from extra to the main object
        Object.assign(result, debt.extra);
      }
      
      return result as T;
    });
  }
}

// Create a singleton instance
export const debtService = new DebtService();

export default debtService;