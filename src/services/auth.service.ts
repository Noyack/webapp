import apiClient from './api-client';
import { ContactDetails, Subscriptions, User, UserInfo } from '../types';
import { tokenManager } from '../utils/tokenManager';

/**
 * Service for authentication and user profile operations
 */
export class AuthService {
  /**
   * Set the authentication token
   */
  setAuthToken(token: string, expiryInSeconds?: number): void {
    apiClient.setAuthToken(token, expiryInSeconds);
  }

  /**
   * Clear the authentication token
   */
  clearAuthToken(): void {
    apiClient.clearAuthToken();
  }

  /**
   * Check if we have a valid token
   */
  hasValidToken(): boolean {
    return tokenManager.hasValidToken();
  }

  /**
   * Get current token from storage
   */
  getCurrentToken(): string | null {
    return tokenManager.getToken();
  }

  /**
   * Create a user profile after sign-up
   */
  async createUserProfile(userData: {
    fname: string;
    lname: string;
    email: unknown; // from Clerk
    age?: number;
    location?: string;
  }): Promise<User> {
    const response = await apiClient.post<User>('users', userData);
    return response.data;
  }

  /**
   * Get the current user's profile
   */
  async getCurrentUser(): Promise<UserInfo> {
    try{
      const response = await apiClient.get<UserInfo>('users/profile');
      return response.data;
    }catch{
      return null
    }
  }
  
  async getCurrentSub(userId: string): Promise<Subscriptions> {
    const response = await apiClient.get<Subscriptions>(`v1/subscription/${userId}`);
    return response.data;
  }

  async getWealth(userId: string): Promise<any> {
    const response = await apiClient.get<any>(`users/profile/wealth/${userId}`,);
    return response.data;
  }


  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, userData: Partial<ContactDetails>): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${userId}`, userData);
    return response.data;
  }

  /**
   * Check if user is new (needs onboarding)
   */
  async checkIsNewUser(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      // Logic to determine if user is new and needs onboarding
      // This is an example - adjust based on your backend API
      return user && user.onboarding;
    } catch  {
      // If user not found, they're probably new
      return true;
    }
  }

  /**
   * Complete user onboarding
   */
  async completeOnboarding(userId: string, onboardingData: unknown): Promise<User> {
    const response = await apiClient.patch<User>(`users/${userId}/onboarding`, onboardingData);
    return response.data;
  }
}

// Create a singleton instance
export const authService = new AuthService();

export default authService;
