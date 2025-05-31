import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { authService } from '../services';

/**
 * Custom hook to manage authentication with the auth service
 * Simplified version without unnecessary memoization
 */
export function useAuthService() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [isUpdatingToken, setIsUpdatingToken] = useState(false);
  
  // Simple derived state
  const isAuthenticated = isSignedIn && isTokenSet;
  
  // Update auth token function
  const updateAuthToken = async (): Promise<boolean> => {
    if (isUpdatingToken || !isLoaded || !isSignedIn) {
      return false;
    }

    try {
      setIsUpdatingToken(true);
      
      const token = await getToken({ template: "noyack" });
      if (token) {
        // Store token in localStorage with 50-minute expiry (Clerk tokens last 1 hour)
        authService.setAuthToken(token, 50 * 60); // 50 minutes
        setIsTokenSet(true);
        return true;
      } else {
        authService.clearAuthToken();
        setIsTokenSet(false);
        return false;
      }
    } catch (error) {
      console.error('Failed to update auth token:', error);
      authService.clearAuthToken();
      setIsTokenSet(false);
      return false;
    } finally {
      setIsUpdatingToken(false);
    }
  };

  // Check if we have a valid token
  const hasValidToken = (): boolean => {
    return authService.hasValidToken();
  };

  // Initialize token when auth is loaded and user is signed in
  useEffect(() => {
    if (!isLoaded) return;
    
    if (isSignedIn) {
      // Check if we already have a valid token
      if (hasValidToken()) {
        setIsTokenSet(true);
      } else {
        // Get new token
        updateAuthToken();
      }
    } else {
      // User is not signed in, clear everything
      authService.clearAuthToken();
      setIsTokenSet(false);
    }
  }, [isLoaded, isSignedIn]);

  // Token refresh on visibility change (when user comes back to tab)
  useEffect(() => {
    if (!isSignedIn) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !hasValidToken()) {
        updateAuthToken();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSignedIn]);

  return {
    isAuthenticated,
    isLoaded,
    authService,
    updateAuthToken,
    hasValidToken,
  };
}