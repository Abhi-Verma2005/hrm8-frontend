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
  // Use requestAnimationFrame to ensure DOM is painted
  requestAnimationFrame(() => {
    const mainContent = document.getElementById('main-scroll-container');
    
    if (mainContent) {
      // Force a reflow to ensure layout is calculated
      void mainContent.scrollHeight;
      
      mainContent.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    } else {
      // Fallback to window scroll for pages without sidebar
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    }
  });
};
