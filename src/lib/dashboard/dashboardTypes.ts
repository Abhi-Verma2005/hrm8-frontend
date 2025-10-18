import { Briefcase, Users, DollarSign, Handshake, LayoutGrid, UserCheck, Activity, UserCog, type LucideIcon } from "lucide-react";
import type { WidgetType } from "./widgetRegistry";

export type DashboardType = 'overview' | 'financial' | 'activity' | 'ats' | 'hrms' | 'services';

export interface DashboardMetadata {
  id: DashboardType;
  name: string;
  description: string;
  icon: LucideIcon;
  defaultRoute: string;
  availableWidgets: WidgetType[];
}

export const DASHBOARD_METADATA: Record<DashboardType, DashboardMetadata> = {
  overview: {
    id: 'overview',
    name: 'Platform Overview',
    description: 'Executive summary across all business areas',
    icon: LayoutGrid,
    defaultRoute: '/dashboard/overview',
    availableWidgets: [
      'stat-active-jobs',
      'stat-total-employees',
      'stat-total-revenue',
      'stat-active-projects',
      'chart-hiring-trends',
      'chart-revenue-expense',
      'chart-employee-distribution',
      'chart-project-pipeline',
      'activity-feed'
    ]
  },
  financial: {
    id: 'financial',
    name: 'Financial',
    description: 'Track revenue, subscriptions, and financial health',
    icon: DollarSign,
    defaultRoute: '/dashboard/financial',
    availableWidgets: [
      'stat-total-revenue',
      'stat-total-expenses',
      'stat-profit-margin',
      'stat-payroll-cost',
      'chart-revenue-expense',
      'chart-budget-analysis',
      'chart-cost-breakdown',
      'chart-payroll-trends',
      'activity-feed'
    ]
  },
  activity: {
    id: 'activity',
    name: 'Activity',
    description: 'Monitor platform engagement and usage patterns',
    icon: Activity,
    defaultRoute: '/dashboard/activity',
    availableWidgets: [
      'stat-active-jobs',
      'stat-total-candidates',
      'stat-applications',
      'stat-hired',
      'chart-hiring-trends',
      'chart-application-funnel',
      'activity-feed'
    ]
  },
  ats: {
    id: 'ats',
    name: 'ATS',
    description: 'Track hiring pipeline and recruitment metrics',
    icon: Briefcase,
    defaultRoute: '/dashboard/ats',
    availableWidgets: [
      'stat-active-jobs',
      'stat-total-candidates',
      'stat-applications',
      'stat-hired',
      'chart-hiring-trends',
      'chart-application-funnel',
      'chart-job-distribution',
      'chart-source-of-hire',
      'activity-feed'
    ]
  },
  hrms: {
    id: 'hrms',
    name: 'HRMS',
    description: 'Employee management and workforce analytics',
    icon: UserCheck,
    defaultRoute: '/dashboard/hrms',
    availableWidgets: [
      'stat-total-employees',
      'stat-attendance-rate',
      'stat-leave-requests',
      'stat-department-count',
      'chart-attendance-trends',
      'chart-employee-distribution',
      'chart-leave-analysis',
      'chart-performance-overview',
      'activity-feed'
    ]
  },
  services: {
    id: 'services',
    name: 'Services',
    description: 'Track recruitment services delivery and consultant performance',
    icon: UserCog,
    defaultRoute: '/dashboard/services',
    availableWidgets: [
      'stat-active-projects',
      'stat-total-clients',
      'stat-utilization-rate',
      'stat-billable-hours',
      'chart-project-pipeline',
      'chart-client-distribution',
      'chart-resource-allocation',
      'chart-revenue-forecast',
      'activity-feed'
    ]
  }
};
