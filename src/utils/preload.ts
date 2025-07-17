import { ComponentType } from 'react';

// Utility to preload route components
type PreloadableComponent = () => Promise<{ default: ComponentType<any> }>;

const preloadedComponents = new Set<string>();

export const preloadComponent = (importFn: PreloadableComponent): PreloadableComponent => {
  return () => {
    if (!preloadedComponents.has(importFn.toString())) {
      void importFn();
      preloadedComponents.add(importFn.toString());
    }
    return importFn();
  };
};

// Preload routes that are likely to be visited next
export const preloadRoutes = {
  dashboard: (): Promise<{ default: ComponentType<any> }> => import('../pages/Dashboard/Dashboard'),
  invest: (): Promise<{ default: ComponentType<any> }> => import('../pages/Invest/Invest'),
  planning: (): Promise<{ default: ComponentType<any> }> => import('../pages/Planning/Planning'),
  wealthview: (): Promise<{ default: ComponentType<any> }> => import('../pages/Wealthview/Wealthview'),
} as const; 