
import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current viewport is mobile size
 * @param breakpoint - The breakpoint width in pixels (default: 768)
 * @returns Boolean indicating if viewport is mobile size
 */
export const useIsMobile = (breakpoint = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Check on mount
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
};
