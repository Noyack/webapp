/**
 * Token Manager with optimized refresh logic
 * Prevents unnecessary token checks and updates
 */

interface TokenData {
  token: string;
  expiresAt: number;
}

const TOKEN_STORAGE_KEY = 'noyack_auth_token';
const REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutes before expiry

class TokenManager {
  private tokenData: TokenData | null = null;
  private lastValidityCheck = 0;
  private validityCheckInterval = 30000; // Check validity at most every 30 seconds

  constructor() {
    this.loadToken();
  }

  /**
   * Load token from localStorage
   */
  private loadToken(): void {
    try {
      const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (stored) {
        this.tokenData = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load token from storage:', error);
      this.clearToken();
    }
  }

  /**
   * Save token to localStorage
   */
  private saveToken(): void {
    try {
      if (this.tokenData) {
        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(this.tokenData));
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save token to storage:', error);
    }
  }

  /**
   * Set a new token with expiry
   */
  setToken(token: string, expiryInSeconds: number = 3600): void {
    const expiresAt = Date.now() + (expiryInSeconds * 1000);
    this.tokenData = { token, expiresAt };
    this.saveToken();
    this.lastValidityCheck = Date.now(); // Reset validity check timer
  }

  /**
   * Get the current token
   */
  getToken(): string | null {
    if (!this.tokenData) {
      return null;
    }

    // Quick expiry check without frequent validity checks
    if (Date.now() >= this.tokenData.expiresAt) {
      this.clearToken();
      return null;
    }

    return this.tokenData.token;
  }

  /**
   * Check if we have a valid token (cached for performance)
   */
  hasValidToken(): boolean {
    const now = Date.now();
    
    // Use cached result if we checked recently
    if (now - this.lastValidityCheck < this.validityCheckInterval) {
      return this.tokenData !== null && now < this.tokenData.expiresAt;
    }

    // Update last check time
    this.lastValidityCheck = now;

    if (!this.tokenData) {
      return false;
    }

    if (now >= this.tokenData.expiresAt) {
      this.clearToken();
      return false;
    }

    return true;
  }

  /**
   * Check if token should be refreshed soon
   */
  shouldRefreshToken(): boolean {
    if (!this.tokenData) {
      return false;
    }

    const now = Date.now();
    return now >= (this.tokenData.expiresAt - REFRESH_BUFFER);
  }

  /**
   * Clear the token
   */
  clearToken(): void {
    this.tokenData = null;
    this.saveToken();
    this.lastValidityCheck = 0;
  }

  /**
   * Get token expiry time
   */
  getTokenExpiry(): number | null {
    return this.tokenData?.expiresAt || null;
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiry(): number | null {
    if (!this.tokenData) {
      return null;
    }
    
    return Math.max(0, this.tokenData.expiresAt - Date.now());
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();

// For debugging/testing
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).tokenManager = tokenManager;
}