// src/context/ResponsiveContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define breakpoints (you can customize these)
// eslint-disable-next-line react-refresh/only-export-components
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

interface ResponsiveContextType {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// Create context with default value
const ResponsiveContext = createContext<ResponsiveContextType>({
  width: typeof window !== 'undefined' ? window.innerWidth : 0,
  height: typeof window !== 'undefined' ? window.innerHeight : 0,
  isMobile: false,
  isTablet: false,
  isDesktop: false,
});

// Custom hook to use the responsive context
// eslint-disable-next-line react-refresh/only-export-components
export const useResponsive = () => useContext(ResponsiveContext);

interface ResponsiveProviderProps {
  children: ReactNode;
  customBreakpoints?: typeof breakpoints;
}

// Provider component
export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ 
  children,
  customBreakpoints
}) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Use custom breakpoints or default
  const activeBreakpoints = customBreakpoints || breakpoints;

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); 

  // Determine device type based on screen width
  const isMobile = windowSize.width < activeBreakpoints.sm;
  const isTablet = windowSize.width >= activeBreakpoints.sm && windowSize.width < activeBreakpoints.lg;
  const isDesktop = windowSize.width >= activeBreakpoints.lg;

  // Create context value
  const value = {
    width: windowSize.width,
    height: windowSize.height,
    isMobile,
    isTablet,
    isDesktop,
  };

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};