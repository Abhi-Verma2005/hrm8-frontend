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
  // Check if we're inside a drawer's ScrollArea
  const scrollAreaViewport = document.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
  
  if (scrollAreaViewport) {
    scrollAreaViewport.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  } else {
    // Fallback to main container
    const mainContent = document.getElementById('main-scroll-container');
    
    if (mainContent) {
      mainContent.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    }
  }
};
