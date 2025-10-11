import { Users, Briefcase, FileText, UserCheck, TrendingUp, BarChart3, PieChart, Target, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type WidgetType = 
  | 'stat-active-jobs'
  | 'stat-total-candidates'
  | 'stat-applications'
  | 'stat-hired'
  | 'chart-hiring-trends'
  | 'chart-application-funnel'
  | 'chart-job-distribution'
  | 'chart-source-of-hire'
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
}

export const WIDGET_REGISTRY: Record<WidgetType, WidgetDefinition> = {
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
    }
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
    }
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
    }
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
    }
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
  },
  'activity-feed': {
    id: 'activity-feed',
    name: 'Recent Activity',
    description: 'Latest hiring activities and updates',
    category: 'activity',
    component: 'RecentActivityCard',
    icon: Clock,
    defaultSize: { w: 12, h: 2 },
    minSize: { w: 6, h: 2 },
    maxSize: { w: 12, h: 4 },
  },
};
