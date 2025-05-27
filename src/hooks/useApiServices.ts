import { useState, useEffect, useMemo } from 'react';
import {useAuthService} from './useAuthService';
import { 
  authService, 
  investmentService, 
  communityService,
  calculatorService,
  // emergencyFundService
} from '../services';

/**
 * Hook to initialize and manage API services
 * Optimized to prevent unnecessary re-renders
 */
export function useApiServices() {
  const { isAuthenticated, isLoaded, updateAuthToken, hasValidToken } = useAuthService();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Memoize services object to prevent re-creation on every render
  const services = useMemo(() => ({
    auth: authService,
    investment: investmentService,
    community: communityService,
    calculator: calculatorService,
    // emergencyFund: emergencyFundService
  }), []); // Empty dependency array since services are singletons

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

  // Memoize the return object to prevent re-renders
  return useMemo(() => ({ 
    isInitialized,
    isAuthenticated,
    error,
    services,
    updateAuthToken,
    hasValidToken
  }), [isInitialized, isAuthenticated, error, services, updateAuthToken, hasValidToken]);
}

export default useApiServices;