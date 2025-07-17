import { useState, useEffect } from 'react';
import { useAuthService } from './useAuthService';
import { 
  authService, 
  investmentService, 
  communityService,
  calculatorService,
  // emergencyFundService
} from '../services';

/**
 * Hook to initialize and manage API services
 * Simplified without unnecessary memoization
 */
export function useApiServices() {
  const { isAuthenticated, isLoaded, updateAuthToken, hasValidToken } = useAuthService();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Services object (these are singletons, so no need to memoize)
  const services = {
    auth: authService,
    investment: investmentService,
    community: communityService,
    calculator: calculatorService,
    // emergencyFund: emergencyFundService
  };

  // Initialize APIs once auth is loaded
  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      // Mark services as initialized
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      console.error('Failed to initialize API services:', err);
      setError(err instanceof Error ? err : new Error('Unknown error initializing API'));
    }
  }, [isLoaded]);

  return { 
    isInitialized,
    isAuthenticated,
    error,
    services,
    updateAuthToken,
    hasValidToken
  };
}

export default useApiServices;