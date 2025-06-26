// services/equityTrust.service.ts (Frontend)
import { apiClient } from './api-client';
import type { ApiResponse } from '../types';

export interface AccountFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  married?: boolean;
  minor?: boolean;
  
  // Address Information
  legalAddress: string;
  city: string;
  state: string;
  zipCode: string;
  mailingAddress?: string;
  mailingCity?: string;
  mailingState?: string;
  mailingZipCode?: string;
  
  // Contact Information
  phoneNumber: string;
  email?: string;
  employerName?: string;
  employerAddress?: string;
  citizenship: string;
  
  // IRA Details
  iraType: string;
  accountPurpose: string;
  initialSourceOfFunds: string;
  ongoingSourceOfFunds: string;
  fundingMethod: string;
  estimatedFundingAmount: string;
  paymentMethod: string;
  statementPreference: string;
  
  // Employment Info (for v3)
  employmentStatus?: string;
  occupationCategory?: string;
  occupation?: string;
  
  // Investment Types
  investmentTypes: {
    Alternative?: boolean;
    Digital?: boolean;
    Metals?: boolean;
    Traditional?: boolean;
  };
  
  // Beneficiaries
  beneficiaries?: Array<{
    firstName: string;
    lastName: string;
    percentage: number;
    dateOfBirth?: string;
    beneficiaryType: string;
    spouse: boolean;
  }>;
}

export interface InvestmentFormData {
  firstName: string;
  lastName: string;
  email: string;
  isAccreditedInvestor: string;
  investmentAccount: string;
  iraAccountNumber?: string;
  accountNumber: string; // For investment submission
  investmentAmount: string;
  investmentName?: string;
  investmentDescription?: string;
  payeeDetails?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface TransferFormData {
  transferType: string;
  expressTransferService: boolean;
  originalAccountType: string;
  isInherited: string;
  estimatedAmount: string;
  custodialAccountNumber: string;
  currentAccountRegistrationName: string;
  selectedCustodian: string;
  custodianName: string;
  custodianAddress: string;
  custodianAddress2: string;
  custodianCity: string;
  custodianState: string;
  custodianZip: string;
  custodianPhone: string;
  custodianFax: string;
  uploadedDocuments: File[];
}

export interface AccountOpenResponse {
  accountNumber: string;
  activityId: string;
}

export interface InvestmentResponse {
  activityId: string;
  status: string;
}

export interface ActivityStatus {
  activityId: string;
  accountNumber: string;
  status: string;
  activityType: string;
  submissionDate: string;
  lastUpdated: string;
}

export interface EquityAccount {
  accountNumber: string;
  accountType: string;
  accountStatus: string;
  balance: number;
  owner: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface AssetHolding {
  assetName: string;
  assetType: string;
  quantity: number;
  value: number;
  asOfDate: string;
}

export interface Transaction {
  transactionId: string;
  date: string;
  type: string;
  description: string;
  amount: number;
  balance: number;
}

/**
 * Service for Equity Trust API operations
 */
export class EquityTrustService {
  /**
   * Open a new IRA account
   */
  async openAccount(formData: AccountFormData, apiVersion: string = '3'): Promise<AccountOpenResponse> {
    const response: ApiResponse<AccountOpenResponse> = await apiClient.post(
      '/equity-trust/account/open',
      { formData, apiVersion }
    );
    return response.data;
  }

  /**
   * Submit an investment request
   */
  async submitInvestment(formData: InvestmentFormData): Promise<InvestmentResponse> {
    const response: ApiResponse<InvestmentResponse> = await apiClient.post(
      '/equity-trust/investment/submit',
      { formData }
    );
    return response.data;
  }

  /**
   * Get activities by various filters
   */
  async getActivities(params: {
    accountNumber?: string;
    activityId?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<ActivityStatus[]> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response: ApiResponse<{ response: ActivityStatus[] }> = await apiClient.get(
      `/equity-trust/activities?${queryParams.toString()}`
    );
    return response.data.response;
  }

  /**
   * Get user's IRA accounts
   */
  async getAccounts(): Promise<EquityAccount[]> {
    const response: ApiResponse<{ response: EquityAccount[] }> = await apiClient.get(
      '/equity-trust/accounts'
    );
    return response.data.response;
  }

  /**
   * Get assets for a specific account
   */
  async getAssets(accountNumber: string): Promise<AssetHolding[]> {
    const response: ApiResponse<{ response: AssetHolding[] }> = await apiClient.get(
      `/equity-trust/accounts/${accountNumber}/assets`
    );
    return response.data.response;
  }

  /**
   * Get transactions for a specific account
   */
  async getTransactions(
    accountNumber: string, 
    fromDate?: string, 
    toDate?: string
  ): Promise<Transaction[]> {
    const params: Record<string, string> = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    const queryParams = new URLSearchParams(params);
    const response: ApiResponse<{ response: Transaction[] }> = await apiClient.get(
      `/equity-trust/accounts/${accountNumber}/transactions?${queryParams.toString()}`
    );
    return response.data.response;
  }

  /**
   * Submit a transfer request
   */
  async submitTransfer(formData: TransferFormData): Promise<{ activityId: string }> {
    const response: ApiResponse<{ activityId: string }> = await apiClient.post(
      '/equity-trust/transfer/submit',
      { formData }
    );
    return response.data;
  }

  /**
   * Check the status of a specific activity
   */
  async checkActivityStatus(activityId: string): Promise<ActivityStatus | null> {
    try {
      const activities = await this.getActivities({ activityId });
      return activities.length > 0 ? activities[0] : null;
    } catch (error) {
      console.error('Check activity status error:', error);
      return null;
    }
  }

  /**
   * Poll activity status until complete
   */
  async pollActivityStatus(
    activityId: string, 
    onUpdate?: (status: ActivityStatus) => void,
    maxAttempts: number = 30,
    intervalMs: number = 5000
  ): Promise<ActivityStatus> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      
      const poll = async () => {
        try {
          attempts++;
          const status = await this.checkActivityStatus(activityId);
          
          if (status) {
            onUpdate?.(status);
            
            if (status.status.toLowerCase() === 'completed' || status.status.toLowerCase() === 'failed') {
              resolve(status);
              return;
            }
          }
          
          if (attempts >= maxAttempts) {
            reject(new Error('Activity status polling timed out'));
            return;
          }
          
          setTimeout(poll, intervalMs);
        } catch (error) {
          reject(error);
        }
      };
      
      poll();
    });
  }

  /**
   * Get user's account numbers from localStorage
   */
  getUserAccountNumbers(): string[] {
    const accountNumber = localStorage.getItem('userAccountNumber');
    return accountNumber ? [accountNumber] : [];
  }

  /**
   * Get user's primary account number
   */
  getPrimaryAccountNumber(): string | null {
    return localStorage.getItem('userAccountNumber');
  }

  /**
   * Save user's account number to localStorage
   */
  savePrimaryAccountNumber(accountNumber: string): void {
    localStorage.setItem('userAccountNumber', accountNumber);
  }

  /**
   * Save activity ID to localStorage
   */
  saveActivityId(activityId: string): void {
    localStorage.setItem('userActivityId', activityId);
  }

  /**
   * Get saved activity ID from localStorage
   */
  getSavedActivityId(): string | null {
    return localStorage.getItem('userActivityId');
  }

  /**
   * Clear saved account information
   */
  clearSavedAccountInfo(): void {
    localStorage.removeItem('userAccountNumber');
    localStorage.removeItem('userActivityId');
  }
}

// Create a singleton instance
export const equityTrustService = new EquityTrustService();

export default equityTrustService;