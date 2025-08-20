// src/components/ScrollToTop.tsx
import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Add a small delay to ensure DOM is fully rendered
    const scrollToTop = () => {
      // Method 1: Try to find all possible scroll containers
      const scrollContainers = [
        // Mobile layout - the nested overflow-auto container
        document.querySelector('.overflow-auto'),
        // Desktop layout - the main content area
        document.querySelector('main.overflow-y-auto'),
        // Alternative desktop selector
        document.querySelector('[class*="overflow-y-auto"]'),
        // Any div with overflow-auto
        document.querySelector('div[class*="overflow-auto"]'),
        // Fallback - look for any scrollable element
        ...Array.from(document.querySelectorAll('[class*="overflow"]')),
      ].filter(Boolean); // Remove null/undefined elements


      // Try scrolling each container
      let scrolled = false;
      scrollContainers.forEach((container) => {
        if (container && container.scrollTop > 0) {
          container.scrollTo(0, 0);
          scrolled = true;
        }
      });

      // Also scroll all containers regardless of current position
      scrollContainers.forEach((container) => {
        if (container) {
          container.scrollTo(0, 0);
        }
      });

      // Fallback to window scroll
      if (!scrolled) {
        window.scrollTo(0, 0);
      }

      // Additional fallback - scroll document elements
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Execute immediately
    scrollToTop();

    // Execute after a short delay to handle any async rendering
    const timeoutId = setTimeout(scrollToTop, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}