import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { authService } from '../services';

/**
 * Custom hook to manage authentication with the auth service
 * This creates a bridge between Clerk's React hooks and our service layer
 */
export function useAuthService() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  // Set up auth token when auth state changes
  useEffect(() => {
    if (!isLoaded) return;

    const updateAuthToken = async () => {
      try {
        if (isSignedIn) {
          const token = await getToken();
          if (token) {
            authService.setAuthToken(token);
          }
        } else {
          authService.clearAuthToken();
        }
      } catch (error) {
        console.error('Failed to update auth token:', error);
      }
    };

    updateAuthToken();
  }, [isSignedIn, isLoaded, getToken]);

  return {
    isAuthenticated: isSignedIn,
    isLoaded,
    authService,
  };
}

export default useAuthService;