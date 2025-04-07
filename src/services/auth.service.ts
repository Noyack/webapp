import apiClient from './api-client';
import { ContactDetails, User } from '../types';

/**
 * Service for authentication and user profile operations
 */
export class AuthService {
  /**
   * Set the authentication token
   */
  setAuthToken(token: string): void {
    apiClient.setAuthToken(token);
  }

  /**
   * Clear the authentication token
   */
  clearAuthToken(): void {
    apiClient.clearAuthToken();
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
    const response = await apiClient.post<User>('/users', userData);
    return response.data;
  }

  /**
   * Get the current user's profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('users/profile');
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
    const response = await apiClient.patch<User>(`/users/${userId}/onboarding`, onboardingData);
    return response.data;
  }
}

// Create a singleton instance
export const authService = new AuthService();

export default authService;