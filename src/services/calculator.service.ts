import apiClient from './api-client';
import { 
  FireCalculatorState, 
  RetirementCalcState,
  AgeNetWorthDataPoint,
  ChartDataPoint 
} from '../types';

/**
 * Service for financial calculator operations
 */
export class CalculatorService {
  /**
   * Save FIRE calculator settings for a user
   */
  async saveFireCalculatorSettings(
    settings: Omit<FireCalculatorState, 'fireNumber' | 'fireAge' | 'yearsUntilFire' | 'chartData'>
  ): Promise<void> {
    await apiClient.post('/calculator/fire/settings', settings);
  }

  /**
   * Get saved FIRE calculator settings
   */
  async getFireCalculatorSettings(): Promise<Partial<FireCalculatorState>> {
    const response = await apiClient.get<Partial<FireCalculatorState>>('/calculator/fire/settings');
    return response.data;
  }

  /**
   * Calculate FIRE results on the server
   * This can be useful for more complex calculations or to track user goals
   */
  async calculateFireResults(
    inputs: Omit<FireCalculatorState, 'fireNumber' | 'fireAge' | 'yearsUntilFire' | 'chartData'>
  ): Promise<{
    fireNumber: number;
    fireAge: number | null;
    yearsUntilFire: number | null;
    chartData: AgeNetWorthDataPoint[];
  }> {
    const response = await apiClient.post<{
      fireNumber: number;
      fireAge: number | null;
      yearsUntilFire: number | null;
      chartData: AgeNetWorthDataPoint[];
    }>('/calculator/fire/calculate', inputs);
    
    return response.data;
  }

  /**
   * Save retirement calculator settings for a user
   */
  async saveRetirementCalculatorSettings(
    settings: Omit<RetirementCalcState, 'result' | 'chartData'>
  ): Promise<void> {
    await apiClient.post('/calculator/retirement/settings', settings);
  }

  /**
   * Get saved retirement calculator settings
   */
  async getRetirementCalculatorSettings(): Promise<Partial<RetirementCalcState>> {
    const response = await apiClient.get<Partial<RetirementCalcState>>('/calculator/retirement/settings');
    return response.data;
  }

  /**
   * Calculate retirement results on the server
   */
  async calculateRetirementResults(
    inputs: Omit<RetirementCalcState, 'result' | 'chartData'>
  ): Promise<{
    result: number;
    chartData: ChartDataPoint[];
  }> {
    const response = await apiClient.post<{
      result: number;
      chartData: ChartDataPoint[];
    }>('/calculator/retirement/calculate', inputs);
    
    return response.data;
  }

  /**
   * Save a calculation as a goal
   */
  async saveGoal(
    name: string, 
    goalType: 'fire' | 'retirement',
    targetAmount: number,
    targetDate: string,
    calculatorState: Partial<FireCalculatorState | RetirementCalcState>
  ): Promise<void> {
    await apiClient.post('/goals', {
      name,
      goalType,
      targetAmount,
      targetDate,
      calculatorState
    });
  }

  /**
   * Get user's saved goals
   */
  async getGoals(): Promise<unknown[]> {
    const response = await apiClient.get<unknown[]>('/goals');
    return response.data;
  }
}

// Create a singleton instance
export const calculatorService = new CalculatorService();

export default calculatorService;