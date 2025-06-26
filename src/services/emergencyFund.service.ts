// @ts-nocheck

import apiClient from './api-client';
import { EmergencyFundsForm, EmergencySavingsAccount } from '../types';

// Backend Emergency Fund Model (matches your backend schema)
export interface EmergencyFundDB {
  id?: string;
  userId?: string;
  totalEmergencySavings?: string;
  monthlyEssentialExpenses?: string;
  targetCoverageMonths?: number;
  hasUsedEmergencyFunds?: boolean;
  hasLineOfCredit?: boolean;
  hasInsuranceCoverage?: boolean;
  hasFamilySupport?: boolean;
  familySupportDetails?: string;
  otherLiquidAssets?: string;
  monthlyContribution?: string;
  targetCompletionDate?: string;
  jobSecurityLevel?: number;
  healthConsiderations?: string;
  majorUpcomingExpenses?: string;
  dependentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Backend Emergency Savings Account Model
export interface EmergencySavingsAccountDB {
  id?: string;
  fundId?: string;
  accountType: string;
  institution?: string;
  amount: string;
  interestRate?: string;
  liquidityPeriod?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Partial update type for only sending changed fields
export interface PartialEmergencyFundUpdate {
  totalEmergencySavings?: string;
  monthlyEssentialExpenses?: string;
  targetCoverageMonths?: number;
  hasUsedEmergencyFunds?: boolean;
  hasLineOfCredit?: boolean;
  hasInsuranceCoverage?: boolean;
  hasFamilySupport?: boolean;
  familySupportDetails?: string;
  otherLiquidAssets?: string;
  monthlyContribution?: string;
  targetCompletionDate?: string;
  jobSecurityLevel?: number;
  healthConsiderations?: string;
  majorUpcomingExpenses?: string;
  dependentCount?: number;
}

// Map frontend form to backend model
const mapToBackendModel = (formData: EmergencyFundsForm, userId: string): EmergencyFundDB => {
  return {
    userId,
    totalEmergencySavings: formData.totalEmergencySavings.toString(),
    monthlyEssentialExpenses: formData.monthlyEssentialExpenses.toString(),
    targetCoverageMonths: formData.targetCoverageMonths,
    hasUsedEmergencyFunds: formData.hasUsedEmergencyFunds,
    hasLineOfCredit: formData.hasLineOfCredit,
    hasInsuranceCoverage: formData.hasInsuranceCoverage,
    hasFamilySupport: formData.hasFamilySupport,
    familySupportDetails: formData.familySupportDetails,
    otherLiquidAssets: formData.otherLiquidAssets.toString(),
    monthlyContribution: formData.monthlyContribution.toString(),
    targetCompletionDate: formData.targetCompletionDate || null,
    jobSecurityLevel: formData.jobSecurityLevel,
    healthConsiderations: formData.healthConsiderations,
    majorUpcomingExpenses: formData.majorUpcomingExpenses,
    dependentCount: formData.dependentCount
  };
};

// Map partial form data to backend model for updates
const mapPartialToBackendModel = (
  originalData: EmergencyFundsForm, 
  newData: EmergencyFundsForm, 
  fieldsToUpdate: (keyof EmergencyFundsForm)[]
): PartialEmergencyFundUpdate => {
  const update: PartialEmergencyFundUpdate = {};
  
  fieldsToUpdate.forEach(field => {
    switch (field) {
      case 'totalEmergencySavings':
        if (newData.totalEmergencySavings !== originalData.totalEmergencySavings) {
          update.totalEmergencySavings = newData.totalEmergencySavings.toString();
        }
        break;
      case 'monthlyEssentialExpenses':
        if (newData.monthlyEssentialExpenses !== originalData.monthlyEssentialExpenses) {
          update.monthlyEssentialExpenses = newData.monthlyEssentialExpenses.toString();
        }
        break;
      case 'targetCoverageMonths':
        if (newData.targetCoverageMonths !== originalData.targetCoverageMonths) {
          update.targetCoverageMonths = newData.targetCoverageMonths;
        }
        break;
      case 'hasUsedEmergencyFunds':
        if (newData.hasUsedEmergencyFunds !== originalData.hasUsedEmergencyFunds) {
          update.hasUsedEmergencyFunds = newData.hasUsedEmergencyFunds;
        }
        break;
      case 'hasLineOfCredit':
        if (newData.hasLineOfCredit !== originalData.hasLineOfCredit) {
          update.hasLineOfCredit = newData.hasLineOfCredit;
        }
        break;
      case 'hasInsuranceCoverage':
        if (newData.hasInsuranceCoverage !== originalData.hasInsuranceCoverage) {
          update.hasInsuranceCoverage = newData.hasInsuranceCoverage;
        }
        break;
      case 'hasFamilySupport':
        if (newData.hasFamilySupport !== originalData.hasFamilySupport) {
          update.hasFamilySupport = newData.hasFamilySupport;
        }
        break;
      case 'familySupportDetails':
        if (newData.familySupportDetails !== originalData.familySupportDetails) {
          update.familySupportDetails = newData.familySupportDetails;
        }
        break;
      case 'otherLiquidAssets':
        if (newData.otherLiquidAssets !== originalData.otherLiquidAssets) {
          update.otherLiquidAssets = newData.otherLiquidAssets.toString();
        }
        break;
      case 'monthlyContribution':
        if (newData.monthlyContribution !== originalData.monthlyContribution) {
          update.monthlyContribution = newData.monthlyContribution.toString();
        }
        break;
      case 'targetCompletionDate':
        if (newData.targetCompletionDate !== originalData.targetCompletionDate) {
          update.targetCompletionDate = newData.targetCompletionDate || null;
        }
        break;
      case 'jobSecurityLevel':
        if (newData.jobSecurityLevel !== originalData.jobSecurityLevel) {
          update.jobSecurityLevel = newData.jobSecurityLevel;
        }
        break;
      case 'healthConsiderations':
        if (newData.healthConsiderations !== originalData.healthConsiderations) {
          update.healthConsiderations = newData.healthConsiderations;
        }
        break;
      case 'majorUpcomingExpenses':
        if (newData.majorUpcomingExpenses !== originalData.majorUpcomingExpenses) {
          update.majorUpcomingExpenses = newData.majorUpcomingExpenses;
        }
        break;
      case 'dependentCount':
        if (newData.dependentCount !== originalData.dependentCount) {
          update.dependentCount = newData.dependentCount;
        }
        break;
    }
  });
  
  return update;
};

// Map backend model to frontend form
const mapToFrontendModel = (dbData: EmergencyFundDB, savingsAccounts: EmergencySavingsAccount[] = []): EmergencyFundsForm => {
  return {
    totalEmergencySavings: parseFloat(dbData.totalEmergencySavings || '0'),
    savingsAccounts,
    monthlyEssentialExpenses: parseFloat(dbData.monthlyEssentialExpenses || '0'),
    targetCoverageMonths: dbData.targetCoverageMonths || 6,
    hasUsedEmergencyFunds: dbData.hasUsedEmergencyFunds || false,
    usageHistory: [], // This would need additional API calls if implemented
    hasLineOfCredit: dbData.hasLineOfCredit || false,
    creditLines: [], // This would be separate table if implemented
    hasInsuranceCoverage: dbData.hasInsuranceCoverage || false,
    insuranceCoverage: [], // This would be separate table if implemented
    hasFamilySupport: dbData.hasFamilySupport || false,
    familySupportDetails: dbData.familySupportDetails || '',
    otherLiquidAssets: parseFloat(dbData.otherLiquidAssets || '0'),
    monthlyContribution: parseFloat(dbData.monthlyContribution || '0'),
    targetCompletionDate: dbData.targetCompletionDate || '',
    jobSecurityLevel: dbData.jobSecurityLevel || 3,
    healthConsiderations: dbData.healthConsiderations || '',
    majorUpcomingExpenses: dbData.majorUpcomingExpenses || '',
    dependentCount: dbData.dependentCount || 0
  };
};

// Map savings account from backend to frontend
const mapSavingsAccountToFrontend = (dbAccount: EmergencySavingsAccountDB): EmergencySavingsAccount => {
  return {
    id: dbAccount.id || '',
    accountType: dbAccount.accountType,
    institution: dbAccount.institution || '',
    amount: parseFloat(dbAccount.amount),
    interestRate: parseFloat(dbAccount.interestRate || '0'),
    liquidityPeriod: dbAccount.liquidityPeriod || 'Same day'
  };
};

// Map savings account from frontend to backend
const mapSavingsAccountToBackend = (account: EmergencySavingsAccount, fundId: string): EmergencySavingsAccountDB => {
  return {
    id: account.id === 'temp-id' || account.id.startsWith('temp-') ? undefined : account.id,
    fundId,
    accountType: account.accountType,
    institution: account.institution,
    amount: account.amount.toString(),
    interestRate: account.interestRate.toString(),
    liquidityPeriod: account.liquidityPeriod
  };
};

// Utility function to remove timestamp fields
const removeTimestampFields = (obj: unknown): unknown => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const cleaned = { ...obj as Record<string, unknown> };
  delete cleaned.createdAt;
  delete cleaned.updatedAt;
  delete cleaned.created_at;
  delete cleaned.updated_at;
  
  return cleaned;
};

export class EmergencyFundService {
  private currentToken: string | null = null;

  /**
   * Set the authentication token for API requests
   */
  setAuthToken(token: string): void {
    this.currentToken = token;
    apiClient.setAuthToken(token);
  }

  /**
   * Clear the authentication token
   */
  clearAuthToken(): void {
    this.currentToken = null;
    apiClient.clearAuthToken();
  }

  /**
   * Ensure we have a valid token before making API calls
   * This helps prevent issues with stale tokens
   */
  private ensureValidToken(): void {
    if (this.currentToken) {
      apiClient.setAuthToken(this.currentToken);
    }
  }

  // Get emergency fund data for a user
  async getEmergencyFund(userId: string): Promise<EmergencyFundsForm> {
    this.ensureValidToken();
    
    try {
      // Get main emergency fund data (using the API endpoint from your controller)
      const response = await apiClient.get(`/v1/users/${userId}/emergency-fund`);
      const emergencyFundData = response.data as EmergencyFundDB;
      
      // Get savings accounts if emergency fund exists
      let savingsAccounts: EmergencySavingsAccount[] = [];
      if (emergencyFundData?.id) {
        try {
          const accountsResponse = await apiClient.get(`/v1/emergency-funds/${emergencyFundData.id}/savings-accounts`);
          const accountsData = accountsResponse.data as EmergencySavingsAccountDB[];
          savingsAccounts = accountsData.map(mapSavingsAccountToFrontend);
        } catch (error) {
          console.warn('No savings accounts found or error fetching accounts:', error);
        }
      }
      
      return mapToFrontendModel(emergencyFundData, savingsAccounts);
    } catch (error: unknown) {
      const errorObj = error as { response?: { status?: number }; code?: number };
      if (errorObj.response?.status === 404 || errorObj.code === 404) {
        // Return default empty form if no emergency fund data exists
        return {
          totalEmergencySavings: 0,
          savingsAccounts: [],
          monthlyEssentialExpenses: 0,
          targetCoverageMonths: 6,
          hasUsedEmergencyFunds: false,
          usageHistory: [],
          hasLineOfCredit: false,
          creditLines: [],
          hasInsuranceCoverage: false,
          insuranceCoverage: [],
          hasFamilySupport: false,
          familySupportDetails: '',
          otherLiquidAssets: 0,
          monthlyContribution: 0,
          targetCompletionDate: '',
          jobSecurityLevel: 3,
          healthConsiderations: '',
          majorUpcomingExpenses: '',
          dependentCount: 0
        };
      }
      throw error;
    }
  }

  // Update only specific fields of emergency fund
  async updateEmergencyFundPartial(
    userId: string, 
    originalData: EmergencyFundsForm, 
    newData: EmergencyFundsForm, 
    fieldsToUpdate: (keyof EmergencyFundsForm)[]
  ): Promise<void> {
    this.ensureValidToken();
    
    try {
      // Get the emergency fund ID first
      const existingData = await apiClient.get(`/v1/users/${userId}/emergency-fund`);
      if (!existingData.data?.id) {
        throw new Error('Emergency fund not found');
      }

      // Create partial update with only changed fields
      const partialUpdate = mapPartialToBackendModel(originalData, newData, fieldsToUpdate);
      
      // Only send request if there are actual changes
      if (Object.keys(partialUpdate).length === 0) {
        return; // No changes to save
      }

      // Update existing emergency fund with only changed fields
      await apiClient.patch(`/v1/emergency-funds/${existingData.data.id}`, removeTimestampFields(partialUpdate));
    } catch (error) {
      console.error('Error updating emergency fund partial:', error);
      throw error;
    }
  }

  // Create or update emergency fund data (full update)
  async saveEmergencyFund(userId: string, formData: EmergencyFundsForm): Promise<void> {
    this.ensureValidToken();
    
    try {
      // Clean form data
      const cleanFormData = removeTimestampFields(formData) as EmergencyFundsForm;
      const backendData = mapToBackendModel(cleanFormData, userId);
      
      // Check if emergency fund already exists
      let emergencyFundId: string;
      try {
        const existingData = await apiClient.get(`/v1/users/${userId}/emergency-fund`);
        if (existingData.data?.id) {
          // Update existing emergency fund (using the patch endpoint from your controller)
          await apiClient.patch(`/v1/emergency-funds/${existingData.data.id}`, removeTimestampFields(backendData));
          emergencyFundId = existingData.data.id;
        } else {
          throw new Error('No existing fund found');
        }
      } catch {
        // Create new emergency fund (using the create endpoint from your controller)
        const createResponse = await apiClient.post(`/v1/users/${userId}/emergency-fund`, removeTimestampFields(backendData));
        emergencyFundId = createResponse.data?.id || createResponse.data?.fund_id;
      }

      // Handle savings accounts
      if (emergencyFundId && formData.savingsAccounts.length > 0) {
        // Get existing savings accounts
        let existingAccounts: EmergencySavingsAccountDB[] = [];
        try {
          const accountsResponse = await apiClient.get(`/v1/emergency-funds/${emergencyFundId}/savings-accounts`);
          existingAccounts = accountsResponse.data || [];
        } catch {
          // No existing accounts, continue with creation
        }

        // Create maps for easier comparison
        const existingAccountsMap = new Map(existingAccounts.map(account => [account.id, account]));
        const formAccountsMap = new Map(formData.savingsAccounts.map(account => [account.id, account]));

        // Update/create accounts
        for (const account of formData.savingsAccounts) {
          const backendAccount = mapSavingsAccountToBackend(account, emergencyFundId);
          
          if (account.id && !account.id.startsWith('temp-') && existingAccountsMap.has(account.id)) {
            // Update existing account
            await apiClient.patch(`/v1/emergency-savings-accounts/${account.id}`, removeTimestampFields(backendAccount));
          } else {
            // Create new account
            await apiClient.post(`/v1/emergency-funds/${emergencyFundId}/savings-accounts`, removeTimestampFields(backendAccount));
          }
        }

        // Delete removed accounts
        for (const existingAccount of existingAccounts) {
          if (existingAccount.id && !formAccountsMap.has(existingAccount.id)) {
            await apiClient.delete(`/v1/emergency-savings-accounts/${existingAccount.id}`);
          }
        }
      }
    } catch (error) {
      console.error('Error saving emergency fund:', error);
      throw error;
    }
  }

  // Delete emergency fund
  async deleteEmergencyFund(userId: string): Promise<void> {
    this.ensureValidToken();
    
    try {
      const response = await apiClient.get(`/v1/users/${userId}/emergency-fund`);
      if (response.data?.id) {
        await apiClient.delete(`/v1/emergency-funds/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error deleting emergency fund:', error);
      throw error;
    }
  }

  // Get savings accounts for a fund
  async getSavingsAccounts(fundId: string): Promise<EmergencySavingsAccount[]> {
    this.ensureValidToken();
    
    try {
      const response = await apiClient.get(`/v1/emergency-funds/${fundId}/savings-accounts`);
      const accountsData = response.data as EmergencySavingsAccountDB[];
      return accountsData.map(mapSavingsAccountToFrontend);
    } catch (error) {
      console.error('Error fetching savings accounts:', error);
      return [];
    }
  }
}

// Create singleton instance following the pattern from other services
export const emergencyFundService = new EmergencyFundService();
export default emergencyFundService; 