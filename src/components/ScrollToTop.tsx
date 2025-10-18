import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '@/lib/utils';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Small delay to ensure the new route content is rendered
    const timeoutId = setTimeout(() => {
      scrollToTop('auto');
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
