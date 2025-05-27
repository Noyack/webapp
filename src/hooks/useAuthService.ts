import { useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { authService } from '../services';
import { tokenManager } from '../utils/tokenManager';

/**
 * Custom hook to manage authentication with the auth service
 * Optimized to prevent unnecessary re-renders
 */
export function useAuthService() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  
  // Use refs to prevent re-renders from token updates
  const isUpdatingToken = useRef(false);
  const lastTokenUpdate = useRef(0);
  const MIN_UPDATE_INTERVAL = 30000; // 30 seconds minimum between updates
  
  // Memoize the authentication status to prevent re-renders
  const isAuthenticated = useMemo(() => {
    return isSignedIn && tokenManager.hasValidToken();
  }, [isSignedIn]); // Only depend on isSignedIn, not token validity

  // Update auth token function - now with throttling
  const updateAuthToken = useCallback(async (): Promise<boolean> => {
    // Prevent rapid successive token updates
    const now = Date.now();
    if (isUpdatingToken.current || (now - lastTokenUpdate.current) < MIN_UPDATE_INTERVAL) {
      return tokenManager.hasValidToken();
    }

    try {
      isUpdatingToken.current = true;
      
      if (isSignedIn) {
        const token = await getToken({ template: "noyack" });
        if (token) {
          // Store token in localStorage with 50-minute expiry (Clerk tokens last 1 hour)
          authService.setAuthToken(token, 50 * 60); // 50 minutes
          lastTokenUpdate.current = now;
          return true;
        }
      } else {
        authService.clearAuthToken();
        return false;
      }
    } catch (error) {
      console.error('Failed to update auth token:', error);
    } finally {
      isUpdatingToken.current = false;
    }
    
    return false;
  }, [isSignedIn, getToken]);

  // Silent token refresh function
  const silentTokenRefresh = useCallback(async () => {
    if (!isSignedIn || !tokenManager.shouldRefreshToken()) {
      return;
    }
    
    try {
      await updateAuthToken();
    } catch (error) {
      console.error('Silent token refresh failed:', error);
    }
  }, [isSignedIn, updateAuthToken]);

  // Initialize token only once when auth is loaded
  useLayoutEffect(() => {
    if (!isLoaded) return;
    
    const initializeAuth = async () => {
      if (isSignedIn && !tokenManager.hasValidToken()) {
        await updateAuthToken();
      } else if (!isSignedIn) {
        authService.clearAuthToken();
      }
    };

    initializeAuth();
  }, [isLoaded, isSignedIn, updateAuthToken]);

  // Set up background token refresh
  useLayoutEffect(() => {
    if (!isSignedIn) return;

    // Check for token refresh every 5 minutes
    const intervalId = setInterval(silentTokenRefresh, 5 * 60 * 1000);

    // Also refresh on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        silentTokenRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSignedIn, silentTokenRefresh]);

  // Memoize hasValidToken function to prevent re-creates
  const hasValidToken = useCallback(() => tokenManager.hasValidToken(), []);

  return useMemo(() => ({
    isAuthenticated,
    isLoaded,
    authService,
    updateAuthToken,
    hasValidToken,
  }), [isAuthenticated, isLoaded, updateAuthToken, hasValidToken]);
}