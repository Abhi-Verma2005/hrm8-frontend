import { 
  Users, Briefcase, FileText, UserCheck, TrendingUp, BarChart3, PieChart, Target, Clock,
  UserCircle, Calendar, Percent, Building2, DollarSign, TrendingDown, Wallet, Receipt,
  FolderKanban, Building, Gauge, Timer
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DashboardType } from "./dashboardTypes";

export type WidgetType = 
  // Jobs widgets
  | 'stat-active-jobs'
  | 'stat-total-candidates'
  | 'stat-applications'
  | 'stat-hired'
  | 'chart-hiring-trends'
  | 'chart-application-funnel'
  | 'chart-job-distribution'
  | 'chart-source-of-hire'
  // HRMS widgets
  | 'stat-total-employees'
  | 'stat-attendance-rate'
  | 'stat-leave-requests'
  | 'stat-department-count'
  | 'chart-attendance-trends'
  | 'chart-employee-distribution'
  | 'chart-leave-analysis'
  | 'chart-performance-overview'
  // Financial widgets
  | 'stat-total-revenue'
  | 'stat-total-expenses'
  | 'stat-profit-margin'
  | 'stat-payroll-cost'
  | 'chart-revenue-expense'
  | 'chart-budget-analysis'
  | 'chart-cost-breakdown'
  | 'chart-payroll-trends'
  // Consulting widgets
  | 'stat-active-projects'
  | 'stat-total-clients'
  | 'stat-utilization-rate'
  | 'stat-billable-hours'
  | 'chart-project-pipeline'
  | 'chart-client-distribution'
  | 'chart-resource-allocation'
  | 'chart-revenue-forecast'
  // Shared
  | 'activity-feed';

export interface WidgetDefinition {
  id: WidgetType;
  name: string;
  description: string;
  category: 'stat' | 'chart' | 'activity';
  component: string;
  icon: LucideIcon;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  maxSize?: { w: number; h: number };
  defaultProps?: Record<string, any>;
  allowedDashboards: DashboardType[];
}

export const WIDGET_REGISTRY: Record<WidgetType, WidgetDefinition> = {
  // ===== JOBS WIDGETS =====
  'stat-active-jobs': {
    id: 'stat-active-jobs',
    name: 'Active Jobs',
    description: 'Total number of active job postings',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: Briefcase,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Active Jobs",
      value: "24",
      change: "+12%",
      trend: "up",
      variant: "neutral"
    },
    allowedDashboards: ['jobs']
  },
  'stat-total-candidates': {
    id: 'stat-total-candidates',
    name: 'Total Candidates',
    description: 'Total candidates in the pipeline',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: Users,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Total Candidates",
      value: "1,234",
      change: "+8%",
      trend: "up",
      variant: "success"
    },
    allowedDashboards: ['jobs']
  },
  'stat-applications': {
    id: 'stat-applications',
    name: 'Applications',
    description: 'Pending applications to review',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: FileText,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Applications",
      value: "567",
      change: "+23%",
      trend: "up",
      variant: "primary"
    },
    allowedDashboards: ['jobs']
  },
  'stat-hired': {
    id: 'stat-hired',
    name: 'Hired This Month',
    description: 'Candidates hired in the current month',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: UserCheck,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Hired This Month",
      value: "18",
      change: "+5%",
      trend: "up",
      variant: "warning"
    },
    allowedDashboards: ['jobs']
  },
  'chart-hiring-trends': {
    id: 'chart-hiring-trends',
    name: 'Hiring Trends',
    description: 'Application flow over time',
    category: 'chart',
    component: 'HiringTrendsChart',
    icon: TrendingUp,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['jobs']
  },
  'chart-application-funnel': {
    id: 'chart-application-funnel',
    name: 'Application Funnel',
    description: 'Candidate progression through stages',
    category: 'chart',
    component: 'ApplicationFunnelChart',
    icon: BarChart3,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['jobs']
  },
  'chart-job-distribution': {
    id: 'chart-job-distribution',
    name: 'Job Distribution',
    description: 'Jobs by department and type',
    category: 'chart',
    component: 'JobDistributionChart',
    icon: PieChart,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['jobs']
  },
  'chart-source-of-hire': {
    id: 'chart-source-of-hire',
    name: 'Source of Hire',
    description: 'Where candidates are coming from',
    category: 'chart',
    component: 'SourceOfHireChart',
    icon: Target,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['jobs']
  },

  // ===== HRMS WIDGETS =====
  'stat-total-employees': {
    id: 'stat-total-employees',
    name: 'Total Employees',
    description: 'Total active employees',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: UserCircle,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Total Employees",
      value: "342",
      change: "+6%",
      trend: "up",
      variant: "success"
    },
    allowedDashboards: ['hrms']
  },
  'stat-attendance-rate': {
    id: 'stat-attendance-rate',
    name: 'Attendance Rate',
    description: 'Average employee attendance',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: Calendar,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Attendance Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      variant: "success"
    },
    allowedDashboards: ['hrms']
  },
  'stat-leave-requests': {
    id: 'stat-leave-requests',
    name: 'Leave Requests',
    description: 'Pending leave requests',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: FileText,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Leave Requests",
      value: "23",
      change: "-12%",
      trend: "down",
      variant: "primary"
    },
    allowedDashboards: ['hrms']
  },
  'stat-department-count': {
    id: 'stat-department-count',
    name: 'Departments',
    description: 'Active departments',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: Building2,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Departments",
      value: "12",
      change: "0%",
      trend: "neutral",
      variant: "neutral"
    },
    allowedDashboards: ['hrms']
  },
  'chart-attendance-trends': {
    id: 'chart-attendance-trends',
    name: 'Attendance Trends',
    description: 'Daily attendance patterns',
    category: 'chart',
    component: 'AttendanceTrendsChart',
    icon: TrendingUp,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['hrms']
  },
  'chart-employee-distribution': {
    id: 'chart-employee-distribution',
    name: 'Employee Distribution',
    description: 'Employees by department',
    category: 'chart',
    component: 'EmployeeDistributionChart',
    icon: PieChart,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['hrms']
  },
  'chart-leave-analysis': {
    id: 'chart-leave-analysis',
    name: 'Leave Analysis',
    description: 'Leave trends and types',
    category: 'chart',
    component: 'LeaveAnalysisChart',
    icon: BarChart3,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['hrms']
  },
  'chart-performance-overview': {
    id: 'chart-performance-overview',
    name: 'Performance Overview',
    description: 'Employee performance metrics',
    category: 'chart',
    component: 'PerformanceOverviewChart',
    icon: Target,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['hrms']
  },

  // ===== FINANCIAL WIDGETS =====
  'stat-total-revenue': {
    id: 'stat-total-revenue',
    name: 'Total Revenue',
    description: 'Revenue this period',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: DollarSign,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Total Revenue",
      value: "$2.4M",
      change: "+18%",
      trend: "up",
      variant: "success"
    },
    allowedDashboards: ['financial']
  },
  'stat-total-expenses': {
    id: 'stat-total-expenses',
    name: 'Total Expenses',
    description: 'Expenses this period',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: TrendingDown,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Total Expenses",
      value: "$1.8M",
      change: "+5%",
      trend: "up",
      variant: "warning"
    },
    allowedDashboards: ['financial']
  },
  'stat-profit-margin': {
    id: 'stat-profit-margin',
    name: 'Profit Margin',
    description: 'Net profit margin',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: Percent,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Profit Margin",
      value: "25%",
      change: "+3%",
      trend: "up",
      variant: "success"
    },
    allowedDashboards: ['financial']
  },
  'stat-payroll-cost': {
    id: 'stat-payroll-cost',
    name: 'Payroll Cost',
    description: 'Monthly payroll expenses',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: Wallet,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Payroll Cost",
      value: "$890K",
      change: "+2%",
      trend: "up",
      variant: "primary"
    },
    allowedDashboards: ['financial']
  },
  'chart-revenue-expense': {
    id: 'chart-revenue-expense',
    name: 'Revenue vs Expenses',
    description: 'Revenue and expense trends',
    category: 'chart',
    component: 'RevenueExpenseChart',
    icon: TrendingUp,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['financial']
  },
  'chart-budget-analysis': {
    id: 'chart-budget-analysis',
    name: 'Budget Analysis',
    description: 'Budget vs actual spending',
    category: 'chart',
    component: 'BudgetAnalysisChart',
    icon: BarChart3,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['financial']
  },
  'chart-cost-breakdown': {
    id: 'chart-cost-breakdown',
    name: 'Cost Breakdown',
    description: 'Expenses by category',
    category: 'chart',
    component: 'CostBreakdownChart',
    icon: PieChart,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['financial']
  },
  'chart-payroll-trends': {
    id: 'chart-payroll-trends',
    name: 'Payroll Trends',
    description: 'Payroll cost over time',
    category: 'chart',
    component: 'PayrollTrendsChart',
    icon: Receipt,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['financial']
  },

  // ===== CONSULTING WIDGETS =====
  'stat-active-projects': {
    id: 'stat-active-projects',
    name: 'Active Projects',
    description: 'Currently active projects',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: FolderKanban,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Active Projects",
      value: "32",
      change: "+15%",
      trend: "up",
      variant: "primary"
    },
    allowedDashboards: ['consulting']
  },
  'stat-total-clients': {
    id: 'stat-total-clients',
    name: 'Total Clients',
    description: 'Active client accounts',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: Building,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Total Clients",
      value: "18",
      change: "+3",
      trend: "up",
      variant: "success"
    },
    allowedDashboards: ['consulting']
  },
  'stat-utilization-rate': {
    id: 'stat-utilization-rate',
    name: 'Utilization Rate',
    description: 'Team utilization percentage',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: Gauge,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Utilization Rate",
      value: "78%",
      change: "+5%",
      trend: "up",
      variant: "success"
    },
    allowedDashboards: ['consulting']
  },
  'stat-billable-hours': {
    id: 'stat-billable-hours',
    name: 'Billable Hours',
    description: 'Total billable hours this month',
    category: 'stat',
    component: 'EnhancedStatCard',
    icon: Timer,
    defaultSize: { w: 3, h: 1 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 1 },
    defaultProps: {
      title: "Billable Hours",
      value: "2,840",
      change: "+12%",
      trend: "up",
      variant: "primary"
    },
    allowedDashboards: ['consulting']
  },
  'chart-project-pipeline': {
    id: 'chart-project-pipeline',
    name: 'Project Pipeline',
    description: 'Projects by status',
    category: 'chart',
    component: 'ProjectPipelineChart',
    icon: BarChart3,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['consulting']
  },
  'chart-client-distribution': {
    id: 'chart-client-distribution',
    name: 'Client Distribution',
    description: 'Clients by industry',
    category: 'chart',
    component: 'ClientDistributionChart',
    icon: PieChart,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['consulting']
  },
  'chart-resource-allocation': {
    id: 'chart-resource-allocation',
    name: 'Resource Allocation',
    description: 'Team allocation across projects',
    category: 'chart',
    component: 'ResourceAllocationChart',
    icon: Users,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['consulting']
  },
  'chart-revenue-forecast': {
    id: 'chart-revenue-forecast',
    name: 'Revenue Forecast',
    description: 'Projected revenue by quarter',
    category: 'chart',
    component: 'RevenueForecastChart',
    icon: TrendingUp,
    defaultSize: { w: 6, h: 2 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['consulting']
  },

  // ===== SHARED WIDGETS =====
  'activity-feed': {
    id: 'activity-feed',
    name: 'Recent Activity',
    description: 'Latest activities and updates',
    category: 'activity',
    component: 'RecentActivityCard',
    icon: Clock,
    defaultSize: { w: 12, h: 2 },
    minSize: { w: 6, h: 2 },
    maxSize: { w: 12, h: 4 },
    allowedDashboards: ['jobs', 'hrms', 'financial', 'consulting']
  },
};
