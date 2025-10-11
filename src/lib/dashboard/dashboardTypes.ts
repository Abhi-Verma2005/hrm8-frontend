import { Briefcase, Users, DollarSign, Handshake, LayoutGrid, UserCheck, type LucideIcon } from "lucide-react";
import type { WidgetType } from "./widgetRegistry";

export type DashboardType = 'overview' | 'jobs' | 'hrms' | 'financial' | 'consulting';

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
    name: 'Overview',
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
  jobs: {
    id: 'jobs',
    name: 'Jobs',
    description: 'Track hiring pipeline and recruitment metrics',
    icon: Briefcase,
    defaultRoute: '/dashboard/jobs',
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
  financial: {
    id: 'financial',
    name: 'Financial',
    description: 'Financial performance and HRMS cost analysis',
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
  consulting: {
    id: 'consulting',
    name: 'Consulting',
    description: 'Project pipeline and consulting operations',
    icon: Handshake,
    defaultRoute: '/dashboard/consulting',
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
