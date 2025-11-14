import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';

// Cache for formatted dates to avoid expensive recalculations
const dateCache = new Map<string, { formatted: string; timestamp: number }>();
const CACHE_TTL = 60000; // 60 seconds

/**
 * Custom hook that caches formatDistanceToNow results for better performance
 * Cache entries are refreshed every 60 seconds
 */
export function useFormattedDate(date: Date | string | undefined): string {
  return useMemo(() => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const cacheKey = dateObj.toISOString();
    const now = Date.now();
    
    // Check cache
    const cached = dateCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return cached.formatted;
    }
    
    // Calculate and cache
    const formatted = formatDistanceToNow(dateObj, { addSuffix: true });
    dateCache.set(cacheKey, { formatted, timestamp: now });
    
    // Clean up old cache entries (keep max 100 entries)
    if (dateCache.size > 100) {
      const entriesToDelete = Array.from(dateCache.entries())
        .filter(([_, value]) => now - value.timestamp > CACHE_TTL)
        .map(([key]) => key);
      
      entriesToDelete.forEach(key => dateCache.delete(key));
    }
    
    return formatted;
  }, [date]);
}

/**
 * Clear the date formatting cache
 */
export function clearDateCache() {
  dateCache.clear();
}
