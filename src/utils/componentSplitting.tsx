import { lazy, ComponentType, Suspense } from 'react';

// Utility to create a lazy-loaded component with a specific chunk name
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  chunkName: string
): React.LazyExoticComponent<T> => {
  return lazy(() => {
    // Add a comment to help webpack/vite identify the chunk
    // @ts-ignore
    importFn.chunkName = chunkName;
    return importFn();
  });
};

// Higher-order component to wrap components that should be code-split
export const withCodeSplitting = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  chunkName: string,
  fallback?: React.ReactNode
) => {
  const LazyComponent = createLazyComponent(importFn, chunkName);
  
  return (props: P) => (
    <Suspense fallback={fallback || <div>Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
}; 