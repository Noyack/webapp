// src/hooks/useBreakpoint.tsx
import { useResponsive } from '../context/ResponsiveContext';
import { breakpoints } from '../context/ResponsiveContext';

/**
 * A hook that provides more granular breakpoint checks
 */
export const useBreakpoint = () => {
  const { width } = useResponsive();
  
  return {
    // Exact breakpoint checks
    isXs: width < breakpoints.sm,
    isSm: width >= breakpoints.sm && width < breakpoints.md,
    isMd: width >= breakpoints.md && width < breakpoints.lg,
    isLg: width >= breakpoints.lg && width < breakpoints.xl,
    isXl: width >= breakpoints.xl,
    
    // "and up" checks (minimum width)
    isSmUp: width >= breakpoints.sm,
    isMdUp: width >= breakpoints.md,
    isLgUp: width >= breakpoints.lg,
    isXlUp: width >= breakpoints.xl,
    
    // "and down" checks (maximum width)
    isXsDown: width < breakpoints.sm,
    isSmDown: width < breakpoints.md,
    isMdDown: width < breakpoints.lg,
    isLgDown: width < breakpoints.xl,
    
    // Current width
    width,
  };
};