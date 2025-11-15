import type { DateRange } from "react-day-picker";
import { isWithinInterval } from "date-fns";

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Filter data by date range
 */
export function filterDataByDateRange<T extends { date?: Date | string; createdAt?: Date | string; month?: string }>(
  data: T[],
  dateRange?: DateRange
): T[] {
  if (!dateRange?.from) return data;

  return data.filter((item) => {
    let itemDate: Date | undefined;

    if (item.date) {
      itemDate = typeof item.date === 'string' ? new Date(item.date) : item.date;
    } else if (item.createdAt) {
      itemDate = typeof item.createdAt === 'string' ? new Date(item.createdAt) : item.createdAt;
    } else if (item.month) {
      // Handle month strings like "Jan", "Feb", etc.
      const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(item.month);
      if (monthIndex !== -1) {
        itemDate = new Date(2024, monthIndex, 1);
      }
    }

    if (!itemDate) return false;

    return isWithinInterval(itemDate, {
      start: dateRange.from,
      end: dateRange.to || dateRange.from,
    });
  });
}

/**
 * Get comparison metrics for two periods
 */
export interface ComparisonMetrics {
  primaryValue: number;
  comparisonValue: number;
  change: number;
  trend: "up" | "down" | "neutral";
}

export function getComparisonMetrics(
  primaryValue: number,
  comparisonValue: number
): ComparisonMetrics {
  const change = calculatePercentageChange(primaryValue, comparisonValue);
  const trend = change > 0 ? "up" : change < 0 ? "down" : "neutral";

  return {
    primaryValue,
    comparisonValue,
    change,
    trend,
  };
}

/**
 * Format comparison label based on date ranges
 */
export function formatComparisonLabel(range?: DateRange): string {
  if (!range?.from || !range?.to) return "No period selected";
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fromMonth = months[range.from.getMonth()];
  const toMonth = months[range.to.getMonth()];
  const fromYear = range.from.getFullYear();
  const toYear = range.to.getFullYear();

  if (fromYear === toYear && fromMonth === toMonth) {
    return `${fromMonth} ${fromYear}`;
  } else if (fromYear === toYear) {
    return `${fromMonth} - ${toMonth} ${fromYear}`;
  } else {
    return `${fromMonth} ${fromYear} - ${toMonth} ${toYear}`;
  }
}
