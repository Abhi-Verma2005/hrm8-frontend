import { RevenueData } from '@/types/platformAdmin';

export function getRevenueData(): RevenueData[] {
  return [
    { month: 'Jul', revenue: 198500, mrr: 198500 },
    { month: 'Aug', revenue: 205200, mrr: 205200 },
    { month: 'Sep', revenue: 212800, mrr: 212800 },
    { month: 'Oct', revenue: 218400, mrr: 218400 },
    { month: 'Nov', revenue: 225600, mrr: 225600 },
    { month: 'Dec', revenue: 231200, mrr: 231200 },
    { month: 'Jan', revenue: 234800, mrr: 234800 },
  ];
}
