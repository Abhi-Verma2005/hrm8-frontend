import { isWithinInterval } from "date-fns";
import type { DateRange } from "react-day-picker";

export const filterByDateRange = <T extends Record<string, any>>(
  data: T[],
  dateRange: DateRange | undefined,
  monthKey: keyof T
): T[] => {
  if (!dateRange?.from) return data;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return data.filter((item) => {
    const monthValue = item[monthKey] as string;
    const monthIndex = monthNames.indexOf(monthValue);
    if (monthIndex === -1) return true; // Keep items with invalid months
    
    const itemDate = new Date(2024, monthIndex, 1);
    return isWithinInterval(itemDate, {
      start: dateRange.from!,
      end: dateRange.to || dateRange.from!,
    });
  });
};

export const filterByProperty = <T extends Record<string, any>>(
  data: T[],
  filterValue: string,
  propertyKey: keyof T
): T[] => {
  if (filterValue === "all") return data;
  return data.filter(item => item[propertyKey] === filterValue);
};
