// Export all services from a single entry point
export { default as apiClient } from './api-client';
export { default as authService } from './auth.service';
export { default as investmentService } from './investment.service';
export { default as communityService } from './community.service';
export { default as calculatorService } from './calculator.service';
export { default as emergencyFundService } from './emergencyFund.service';

// Re-export types if needed
export * from './api-client';
export * from './investment.service';
export * from './community.service';
export * from './calculator.service';
export * from './emergencyFund.service';