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
  // Try to find the main scrollable container (SidebarInset)
  const mainContent = document.getElementById('main-scroll-container');
  
  if (mainContent) {
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
};
