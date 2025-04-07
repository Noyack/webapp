import apiClient from './api-client';
import { 
  Fund, 
  IncomeSource, 
  InvestmentPosition,
  InvestmentTransaction,
  PaymentMethod,
  PersonalInfoForm,
  RecurringInvestment,
  ReferralInfo
} from '../types';

/**
 * Service for investment-related operations
 */
export class WealthViewService {
  /**
   * Get user's wealth base info
   */
  async postWealthBasicInfo(userId:string, apiData:PersonalInfoForm): Promise<PersonalInfoForm>{
    const response = await apiClient.post<PersonalInfoForm>(`v1/users/${userId}/basic-info`, apiData)
    return response.data
  }
  async getWealthBasicInfo(userId:string): Promise<PersonalInfoForm>{
    const response = await apiClient.get<PersonalInfoForm>(`v1/users/${userId}/basic-info`)
    return response.data
  }

  async patchWealthBasicInfo(basicInfoId:string, apiData:Partial<PersonalInfoForm>): Promise<object>{
    const response = await apiClient.patch<PersonalInfoForm>(`v1/basic-info/${basicInfoId}`, apiData)
    return response
  }
  
  async postWealthIncome(userId:string, apiData:IncomeSource): Promise<PersonalInfoForm>{
    const response = await apiClient.post<PersonalInfoForm>(`v1/users/${userId}/basic-info`, apiData)
    return response.data
  }
  async getWealthIncome(userId:string): Promise<PersonalInfoForm>{
    const response = await apiClient.get<PersonalInfoForm>(`v1/users/${userId}/basic-info`)
    return response.data
  }

  async patchWealthIncome(basicInfoId:string, apiData:Partial<PersonalInfoForm>): Promise<object>{
    const response = await apiClient.patch<PersonalInfoForm>(`v1/basic-info/${basicInfoId}`, apiData)
    return response
  }
  

  /**
   * Get available funds for investment
   */
  async getAvailableFunds(): Promise<Fund[]> {
    const response = await apiClient.get<Fund[]>('/funds');
    return response.data;
  }

  /**
   * Get user's current investment positions
   */
  async getUserPositions(): Promise<InvestmentPosition[]> {
    const response = await apiClient.get<InvestmentPosition[]>('/positions');
    return response.data;
  }

  /**
   * Get user's transaction history
   */
  async getTransactionHistory(params?: {
    startDate?: string;
    endDate?: string;
    type?: InvestmentTransaction['type'];
    limit?: number;
    offset?: number;
  }): Promise<InvestmentTransaction[]> {
    const response = await apiClient.get<InvestmentTransaction[]>('/transactions', { params });
    return response.data;
  }

  /**
   * Make a one-time investment
   */
  async makeInvestment(fundId: string, amount: number, paymentMethodId: string): Promise<InvestmentTransaction> {
    const response = await apiClient.post<InvestmentTransaction>('/investments', {
      fundId,
      amount,
      paymentMethodId
    });
    return response.data;
  }

  /**
   * Setup a recurring investment
   */
  async setupRecurringInvestment(
    fundId: string, 
    amount: number, 
    frequency: RecurringInvestment['frequency'],
    paymentMethodId: string,
    startDate?: string
  ): Promise<RecurringInvestment> {
    const response = await apiClient.post<RecurringInvestment>('/investments/recurring', {
      fundId,
      amount,
      frequency,
      paymentMethodId,
      startDate
    });
    return response.data;
  }

  /**
   * Get user's recurring investments
   */
  async getRecurringInvestments(): Promise<RecurringInvestment[]> {
    const response = await apiClient.get<RecurringInvestment[]>('/investments/recurring');
    return response.data;
  }

  /**
   * Update a recurring investment
   */
  async updateRecurringInvestment(
    recurringId: string, 
    updates: Partial<RecurringInvestment>
  ): Promise<RecurringInvestment> {
    const response = await apiClient.patch<RecurringInvestment>(
      `/investments/recurring/${recurringId}`,
      updates
    );
    return response.data;
  }

  /**
   * Cancel a recurring investment
   */
  async cancelRecurringInvestment(recurringId: string): Promise<void> {
    await apiClient.delete(`/investments/recurring/${recurringId}`);
  }

  /**
   * Get payment methods
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await apiClient.get<PaymentMethod[]>('/payment-methods');
    return response.data;
  }

  /**
   * Add a payment method
   */
  async addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    const response = await apiClient.post<PaymentMethod>('/payment-methods', paymentMethod);
    return response.data;
  }

  /**
   * Remove a payment method
   */
  async removePaymentMethod(paymentMethodId: string): Promise<void> {
    await apiClient.delete(`/payment-methods/${paymentMethodId}`);
  }

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
    const response = await apiClient.post<PaymentMethod>(
      `/payment-methods/${paymentMethodId}/default`
    );
    return response.data;
  }

  /**
   * Get user's referral information
   */
  async getReferralInfo(): Promise<ReferralInfo> {
    const response = await apiClient.get<ReferralInfo>('/referrals');
    return response.data;
  }

  /**
   * Update dividend reinvestment preferences
   */
  async updateReinvestmentPreference(enableReinvestment: boolean): Promise<void> {
    await apiClient.post('/preferences/reinvestment', { enabled: enableReinvestment });
  }

  /**
   * Request a withdrawal/cash out
   */
  async requestWithdrawal(amount: number, bankAccountId: string): Promise<InvestmentTransaction> {
    const response = await apiClient.post<InvestmentTransaction>('/withdrawals', {
      amount,
      bankAccountId
    });
    return response.data;
  }
}

// Create a singleton instance
export const wealthViewService = new WealthViewService();

export default wealthViewService;