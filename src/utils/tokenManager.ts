/**
 * Token manager for handling authentication tokens
 * Simplified version without complex expiry logic
 */

const TOKEN_KEY = 'noyack_auth_token';
const TOKEN_EXPIRY_KEY = 'noyack_auth_token_expiry';

export const tokenManager = {
  /**
   * Set the authentication token with expiry
   */
  setToken(token: string, expiryInSeconds?: number): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      
      if (expiryInSeconds) {
        const expiryTime = Date.now() + (expiryInSeconds * 1000);
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      } else {
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
      }
    } catch (error) {
      console.error('Failed to set token:', error);
    }
  },

  /**
   * Get the current token
   */
  getToken(): string | null {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      // Check if token is expired
      if (token && this.isTokenExpired()) {
        this.clearToken();
        return null;
      }
      return  token
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  },

  /**
   * Clear the authentication token
   */
  clearToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  },

  /**
   * Check if we have a valid token
   */
  hasValidToken(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  },

  /**
   * Check if the token is expired
   */
  isTokenExpired(): boolean {
    try {
      const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (!expiryTime) {
        return false; // No expiry set, assume valid
      }
      
      return Date.now() > parseInt(expiryTime, 10);
    } catch (error) {
      console.error('Failed to check token expiry:', error);
      return true; // Assume expired on error
    }
  },

  /**
   * Check if token should be refreshed (within 10 minutes of expiry)
   */
  shouldRefreshToken(): boolean {
    try {
      const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (!expiryTime) {
        return false;
      }
      
      const timeUntilExpiry = parseInt(expiryTime, 10) - Date.now();
      const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
      
      return timeUntilExpiry < tenMinutes && timeUntilExpiry > 0;
    } catch (error) {
      console.error('Failed to check if token should refresh:', error);
      return false;
    }
  }
};