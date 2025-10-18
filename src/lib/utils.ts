import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Scrolls to top of the page or the main content container
 * Works with both window scrolling and fixed sidebar layouts
 */
export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  // Double RAF ensures we're past layout AND paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const mainContent = document.getElementById('main-scroll-container');
      
      if (mainContent) {
        // Force browser to calculate current layout
        void mainContent.offsetHeight;
        void mainContent.scrollHeight;
        
        // Now scroll with confidence that layout is stable
        mainContent.scrollTo({
          top: 0,
          left: 0,
          behavior,
        });
        
        // Multiple verification checks to ensure scroll stays at top
        const verifyScroll = () => {
          if (mainContent.scrollTop > 10) {
            mainContent.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          }
        };
        
        // Check at multiple intervals to catch late-initializing components
        setTimeout(verifyScroll, 50);
        setTimeout(verifyScroll, 100);
        setTimeout(verifyScroll, 200);
      } else {
        // Fallback for non-sidebar layouts
        window.scrollTo({
          top: 0,
          left: 0,
          behavior,
        });
      }
    });
  });
};
