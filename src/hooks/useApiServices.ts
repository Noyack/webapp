import { useState, useEffect } from 'react';
import useAuthService from './useAuthService';
import { 
  authService, 
  investmentService, 
  communityService,
  calculatorService
} from '../services';

/**
 * Hook to initialize and manage API services
 * This sets up authentication tokens and handles API service initialization
 */
export function useApiServices() {
  const { isAuthenticated, isLoaded } = useAuthService();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize APIs once auth is loaded
  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      // Mark services as initialized
      setIsInitialized(true);
    } catch (err) {
      console.error('Failed to initialize API services:', err);
      setError(err instanceof Error ? err : new Error('Unknown error initializing API'));
    }
  }, [isLoaded]);

  // Return all services, their status, and any errors
  return { 
    isInitialized,
    isAuthenticated,
    error,
    services: {
      auth: authService,
      investment: investmentService,
      community: communityService,
      calculator: calculatorService
    }
  };
}

export default useApiServices;