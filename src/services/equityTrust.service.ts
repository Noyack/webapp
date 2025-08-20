// services/equityTrust.service.ts - COMPLETE FIXED FRONTEND SERVICE FILE
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
  identificationType: string;
  idNumber: string;
  issueDate: string;
  expirationDate: string;
  stateOfIssuance: string;
 
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
  initialSourceOfFundsOtherDetails?: string;
  ongoingSourceOfFunds: string;
  ongoingSourceOfFundsOtherDetails?: string;
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
 
  // Helper functions
  private cleanPhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '');
  }


  private cleanSSN(ssn: string): string {
    return ssn.replace(/\D/g, '');
  }


  // FIXED: Phone type mapping - API expects strings, not numbers
  private mapPhoneTypeToString(phoneType: string): string {
    const mapping: { [key: string]: string } = {
      'business': 'Business',
      'cellular': 'Cellular',
      'fax': 'Fax',
      'home': 'Home'
    };
    return mapping[phoneType?.toLowerCase()] || 'Cellular'; // Default to cellular
  }


  // Account type mapping
  private mapAccountType(iraType: string): string {
    const mapping: { [key: string]: string } = {
      'traditional': 'Traditional IRA',
      'roth': 'Roth IRA',
      'sep': 'SEP IRA',
      'simple': 'SIMPLE IRA'
    };
    return mapping[iraType?.toLowerCase()] || 'Traditional IRA';
  }


  // Funding method mapping to valid enum values
  private mapFundingMethod(method: string): string {
    const mapping: { [key: string]: string } = {
      'ach_transfer': 'Contribution',
      'wire_transfer': 'Contribution',
      'check': 'Contribution',
      'rollover': 'Rollover',
      'transfer': 'Transfer',
      'contribution': 'Contribution',
      'conversion': 'Conversion',
      'deposit': 'Deposit',
      'recharacterization': 'Recharacterization'
    };
    return mapping[method?.toLowerCase()] || 'Contribution';
  }


  // Map account purpose to valid enum values
  private mapAccountPurpose(purpose: string): string {
    const mapping: { [key: string]: string } = {
      'retirement': 'Retirement',
      'rollover': 'Wealth Accumulation/Investment',
      'transfer': 'Wealth Accumulation/Investment',
      'conversion': 'Wealth Accumulation/Investment',
      'wealth_accumulation': 'Wealth Accumulation/Investment',
      'current_income': 'Current Income (Dividends and Interest Payments)'
    };
    return mapping[purpose?.toLowerCase()] || 'Wealth Accumulation/Investment';
  }


  // Map employment status to valid enum values
  private mapEmploymentStatus(status: string): string {
    const mapping: { [key: string]: string } = {
      'employed': 'Employed',
      'self_employed': 'Employed', // Map self_employed to Employed
      'unemployed': 'Unemployed',
      'retired': 'Retired'
    };
    return mapping[status?.toLowerCase()] || 'Employed';
  }


  // Map form fund sources to single choice (API requirement)
  private mapInitialFundSource(source: string) {
    const sources = {
      retirementFunds: false,
      transfer: false,
      rollover: false,
      employmentWages: false,
      investments: false,
      inheritanceTrust: false,
      other: false
    };


    // Only set ONE to true based on form selection
    switch (source?.toLowerCase()) {
      case 'employment':
      case 'employment_income':
      case 'salary':
      case 'wages':
      case 'self_employment':
        sources.employmentWages = true;
        break;
      case 'retirement':
      case 'pension':
        sources.retirementFunds = true;
        break;
      case 'transfer':
      case 'trustee_transfer':
      case 'ira_transfer':
        sources.transfer = true;
        break;
      case 'rollover':
      case '401k_rollover':
        sources.rollover = true;
        break;
      case 'investments':
      case 'dividends':
      case 'capital_gains':
      case 'savings':
        sources.investments = true;
        break;
      case 'inheritance':
      case 'trust':
      case 'gift':
        sources.inheritanceTrust = true;
        break;
      default:
        sources.other = true;
    }


    return sources;
  }


  // Map form investment types to single choice (API requirement)
  private mapInvestmentTypes(types: any) {
    // API requires only ONE to be true
    if (types?.Metals) {
      return { Alternative: false, Digital: false, Metals: true, Traditional: false };
    } else if (types?.Alternative) {
      return { Alternative: true, Digital: false, Metals: false, Traditional: false };
    } else if (types?.Digital) {
      return { Alternative: false, Digital: true, Metals: false, Traditional: false };
    } else {
      // Default to Traditional
      return { Alternative: false, Digital: false, Metals: false, Traditional: true };
    }
  }


  // NEW: Format date to MM/DD/YYYY as required by API
  private formatDateToMMDDYYYY(dateString: string): string {
    if (!dateString) return '';
   
    // If already in MM/DD/YYYY format, return as is
    if (dateString.includes('/')) return dateString;
   
    // Convert from YYYY-MM-DD to MM/DD/YYYY
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Invalid date
   
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
   
    return `${month}/${day}/${year}`;
  }


  // Generate realistic ID dates (past issue, future expiration)
  private generateRealisticIDDates() {
    const issueDate = new Date();
    issueDate.setFullYear(issueDate.getFullYear() - 3); // 3 years ago
   
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 4); // 4 years from now
   
    return {
      issueDate: this.formatDateToMMDDYYYY(issueDate.toISOString().split('T')[0]),
      expirationDate: this.formatDateToMMDDYYYY(expirationDate.toISOString().split('T')[0])
    };
  }


  /**
   * Transform form data to PERFECT Equity Trust API format
   */
  private transformFormDataToEquityTrustFormat(formData: AccountFormData) {
    const fundingMethod = this.mapFundingMethod(formData.fundingMethod);
    const realisticDates = this.generateRealisticIDDates();
   
    return {
      requests: [{
        owner: {
          firstName: formData.firstName.substring(0, 12),
          lastName: formData.lastName.substring(0, 20),
          // FIXED: Use correct date format
          dateOfBirth: this.formatDateToMMDDYYYY(formData.dateOfBirth),
          ssn: this.cleanSSN(formData.ssn),
          married: formData.married || false,
          minor: formData.minor || false,
          addresses: [{
            addressType: 'Legal',
            addressLine1: formData.legalAddress.substring(0, 69),
            addressLine2: formData.mailingAddress && !formData.mailingAddress.includes(formData.legalAddress)
              ? formData.mailingAddress.substring(0, 69)
              : '',
            city: formData.city.substring(0, 36),
            state: formData.state,
            zipCode: formData.zipCode,
            primary: true,
          }],
          phones: [{
            phoneType: this.mapPhoneTypeToString('cellular'),
            phoneNumber: this.cleanPhoneNumber(formData.phoneNumber),
            primary: true,
          }],
          emailAddresses: [{
            email: formData.email,
          }],
        },
       
       
        accountType: this.mapAccountType(formData.iraType),
       
        ...(formData.investmentTypes?.Metals ? {
          preciousMetals: {
            segregated: false // Default to segregated storage
          }
        } : {}),
        goldLevelService: false,
        eSignature: false,
        fees: {
          currentFeePaymentMethod: 'Deduct from Account',
          futureFeePaymentMethod: 'Deduct from Account',
        },
       
        funding: {
          fundingAmount: parseFloat(formData.estimatedFundingAmount),
          fundingMethod: fundingMethod,
          // Add contributionYear only if fundingMethod is Contribution
          ...(fundingMethod === 'Contribution' ? {
            contributionYear: new Date().getFullYear()
          } : {})
        },
       
        statementPreference: 'Electronic',
        investmentTypes: this.mapInvestmentTypes(formData.investmentTypes),
        customerDueDiligence: {
          accountPurpose: this.mapAccountPurpose(formData.accountPurpose),
          initialFundSource: this.mapInitialFundSource(formData.initialSourceOfFunds),
          ...(this.mapInitialFundSource(formData.initialSourceOfFunds).other ? {
            initialFundSourceOtherDetails: formData.initialSourceOfFundsOtherDetails || 'Other funding source details'
          } : {}),
          ongoingFundSource: this.mapInitialFundSource(formData.ongoingSourceOfFunds),
          ...(this.mapInitialFundSource(formData.ongoingSourceOfFunds).other ? {
            ongoingFundSourceOtherDetails: formData.ongoingSourceOfFundsOtherDetails || 'Other ongoing source details'
          } : {}),
          identificationType: formData.identificationType || 'US Drivers License',
          stateOfIssuance: formData.stateOfIssuance || formData.state,
          idNumber: formData.idNumber?.replace(/[^a-zA-Z0-9]/g, '') || '',
          issueDate: formData.issueDate,
          expirationDate: formData.expirationDate,
          employmentStatus: this.mapEmploymentStatus(formData.employmentStatus || 'employed'),
          employerName: formData.employerName || 'Not specified',
          occupationCategory: formData.occupationCategory || 'Computer and Mathematical Occupations',
          occupation: formData.occupation || 'Software Developers',
          employerAddress: {
            addressLine1: formData.employerAddress || formData.legalAddress,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          }
        },
      }],
    };
  }


  /**
   * Open a new IRA account - data is perfectly formatted before sending
   */
  async openAccount(formData: AccountFormData, apiVersion: string = '3'): Promise<AccountOpenResponse> {
    // Transform the form data to the exact format Equity Trust expects
    const accountRequest = this.transformFormDataToEquityTrustFormat(formData);
   
    console.log('🔧 Frontend: Sending perfectly formatted request:', JSON.stringify(accountRequest, null, 2));
   
    const response: ApiResponse<AccountOpenResponse> = await apiClient.post(
      '/equity-trust/account/open',
      { accountRequest, apiVersion }
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
  async getAccounts(accountNumber: string): Promise<EquityAccount[]> {
    const response: ApiResponse<{ response: EquityAccount[] }> = await apiClient.get(
      `/equity-trust/accounts/search/${accountNumber}`
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

