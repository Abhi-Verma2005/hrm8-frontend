import { PlatformStats } from '@/types/platformAdmin';

export function getPlatformStats(): PlatformStats {
  return {
    totalEmployers: 248,
    activeEmployers: 186,
    totalRevenue: 2847500,
    mrr: 234800,
    totalUsers: 3542,
    activeJobs: 1247,
    pendingServices: 23,
    openTickets: 12,
    mrrGrowth: 12.5,
    employerGrowth: 8.3,
    revenueGrowth: 15.7,
  };
}
