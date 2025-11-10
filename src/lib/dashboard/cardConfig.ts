import {
  Building2, Briefcase, Users, DollarSign, TrendingUp, TrendingDown, Activity,
  UserCheck, UserCircle, Calendar, Clock, Target, Filter, Eye, Plus, Mail,
  BarChart3, Download, FileText, FolderKanban, UserPlus, AlertTriangle, Sparkles,
  CheckCircle, AlertCircle
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CardMenuItem {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
}

export interface CardConfig {
  icon: LucideIcon;
  variant?: 'neutral' | 'primary' | 'success' | 'warning';
  actions?: Array<{
    label: string;
    icon: LucideIcon;
    path?: string;
    action?: () => void;
  }>;
}

// Centralized card configuration - single source of truth
export const CARD_CONFIGS: Record<string, CardConfig> = {
  // Jobs Dashboard Cards
  'Total Job Postings': {
    icon: Building2,
    variant: 'primary',
    actions: [
      { label: 'View all jobs', icon: Eye, path: '/jobs' },
      { label: 'Create job', icon: Plus, path: '/jobs?action=create' },
      { label: 'Export', icon: Download },
    ],
  },
  'Active Jobs': {
    icon: Briefcase,
    variant: 'success',
    actions: [
      { label: 'View active', icon: Eye, path: '/jobs?status=active' },
      { label: 'View pipeline', icon: Filter, path: '/jobs?view=pipeline' },
    ],
  },
  'Fill Rate': {
    icon: Target,
    variant: 'neutral',
    actions: [
      { label: 'View metrics', icon: BarChart3, path: '/dashboard/jobs' },
      { label: 'View trends', icon: TrendingUp, path: '/analytics' },
    ],
  },
  'Avg. Time to Fill': {
    icon: Clock,
    variant: 'warning',
    actions: [
      { label: 'View breakdown', icon: Eye, path: '/dashboard/jobs' },
      { label: 'Optimize process', icon: Target },
    ],
  },

  // Candidates Dashboard Cards
  'Active': {
    icon: UserCheck,
    variant: 'success',
    actions: [
      { label: 'View active', icon: Eye, path: '/candidates?status=active' },
      { label: 'View analytics', icon: BarChart3, path: '/dashboard/candidates' },
    ],
  },
  'Active Candidates': {
    icon: UserCheck,
    variant: 'success',
    actions: [
      { label: 'View active', icon: Eye, path: '/candidates?status=active' },
      { label: 'View analytics', icon: BarChart3, path: '/dashboard/candidates' },
    ],
  },
  'Placed': {
    icon: Briefcase,
    variant: 'primary',
    actions: [
      { label: 'View placed', icon: Eye, path: '/candidates?status=placed' },
      { label: 'View success metrics', icon: TrendingUp, path: '/dashboard/candidates' },
    ],
  },
  'Placed Candidates': {
    icon: Briefcase,
    variant: 'primary',
    actions: [
      { label: 'View placed', icon: Eye, path: '/candidates?status=placed' },
      { label: 'View success metrics', icon: TrendingUp, path: '/dashboard/candidates' },
    ],
  },
  'Inactive': {
    icon: UserCircle,
    variant: 'neutral',
    actions: [
      { label: 'View inactive', icon: Eye, path: '/candidates?status=inactive' },
      { label: 'Re-engage campaign', icon: Mail },
    ],
  },
  'Conversion Rate': {
    icon: TrendingUp,
    variant: 'success',
    actions: [
      { label: 'View metrics', icon: Eye, path: '/dashboard/candidates' },
      { label: 'View trends', icon: BarChart3, path: '/analytics' },
    ],
  },

  // RPO Dashboard Cards
  'Active Contracts': {
    icon: Building2,
    variant: 'primary',
    actions: [
      { label: 'View All Contracts', icon: Eye, path: '/rpo/contracts' },
      { label: 'Create Contract', icon: Plus, path: '/recruitment-services?type=rpo' },
      { label: 'Export', icon: Download },
    ],
  },
  'Active Assignments': {
    icon: FolderKanban,
    variant: 'success',
    actions: [
      { label: 'View all', icon: Eye, path: '/jobs' },
      { label: 'Create assignment', icon: Plus, path: '/jobs?action=create' },
      { label: 'View pipeline', icon: Filter, path: '/jobs?view=pipeline' },
    ],
  },
  'Active Projects': {
    icon: FolderKanban,
    variant: 'success',
    actions: [
      { label: 'View all', icon: Eye, path: '/jobs' },
      { label: 'Create assignment', icon: Plus, path: '/jobs?action=create' },
      { label: 'View pipeline', icon: Filter, path: '/jobs?view=pipeline' },
    ],
  },
  'Candidate Pipeline': {
    icon: Users,
    variant: 'neutral',
    actions: [
      { label: 'View pipeline', icon: Eye, path: '/candidates' },
      { label: 'Add candidate', icon: Plus, path: '/candidates?action=create' },
      { label: 'View analytics', icon: BarChart3, path: '/dashboard/candidates' },
    ],
  },
  'Total Candidates': {
    icon: Users,
    variant: 'neutral',
    actions: [
      { label: 'View pipeline', icon: Eye, path: '/candidates' },
      { label: 'Add candidate', icon: Plus, path: '/candidates?action=create' },
      { label: 'View analytics', icon: BarChart3, path: '/dashboard/candidates' },
    ],
  },
  'Dedicated Consultants': {
    icon: Users,
    variant: 'success',
    actions: [
      { label: 'View All Consultants', icon: Eye, path: '/rpo/consultants' },
      { label: 'Assign to Project', icon: Plus },
      { label: 'Export', icon: Download },
    ],
  },
  'Monthly Recurring Revenue': {
    icon: DollarSign,
    variant: 'primary',
    actions: [
      { label: 'View MRR Report', icon: BarChart3 },
      { label: 'View Forecast', icon: Eye, path: '/rpo/forecast' },
      { label: 'Export', icon: Download },
    ],
  },
  'Expiring Soon': {
    icon: Clock,
    variant: 'warning',
    actions: [
      { label: 'View Expiring', icon: Eye, path: '/rpo/renewals' },
      { label: 'Set Reminders', icon: AlertTriangle },
      { label: 'Export', icon: Download },
    ],
  },
  'Time to Fill': {
    icon: Calendar,
    variant: 'neutral',
    actions: [
      { label: 'View breakdown', icon: Eye, path: '/dashboard/jobs' },
      { label: 'Optimize process', icon: Target },
    ],
  },

  // Employers Dashboard Cards
  'Active Clients': {
    icon: Building2,
    variant: 'primary',
    actions: [
      { label: 'View active', icon: Eye, path: '/employers?status=active' },
      { label: 'View analytics', icon: BarChart3, path: '/dashboard/employers' },
    ],
  },
  'Active Accounts': {
    icon: Building2,
    variant: 'primary',
    actions: [
      { label: 'View active', icon: Eye, path: '/employers?status=active' },
      { label: 'View analytics', icon: BarChart3, path: '/dashboard/employers' },
    ],
  },
  'Total Revenue': {
    icon: DollarSign,
    variant: 'success',
    actions: [
      { label: 'View breakdown', icon: Eye, path: '/dashboard/financial' },
      { label: 'View trends', icon: TrendingUp, path: '/dashboard/financial' },
    ],
  },
  'Monthly Revenue': {
    icon: DollarSign,
    variant: 'success',
    actions: [
      { label: 'View breakdown', icon: Eye, path: '/dashboard/financial' },
      { label: 'View trends', icon: TrendingUp, path: '/dashboard/financial' },
    ],
  },
  'Profit Margin': {
    icon: TrendingUp,
    variant: 'primary',
    actions: [
      { label: 'View details', icon: Eye, path: '/dashboard/financial' },
      { label: 'View trends', icon: TrendingUp, path: '/dashboard/financial' },
    ],
  },

  // Sales Dashboard Cards
  'Active Opportunities': {
    icon: Target,
    variant: 'primary',
    actions: [
      { label: 'View pipeline', icon: Eye, path: '/employers' },
      { label: 'Create opportunity', icon: Plus, path: '/employers?action=create' },
      { label: 'View analytics', icon: BarChart3, path: '/dashboard/sales' },
    ],
  },
  'Revenue Forecast': {
    icon: DollarSign,
    variant: 'success',
    actions: [
      { label: 'View forecast', icon: TrendingUp, path: '/dashboard/sales' },
      { label: 'View breakdown', icon: Eye, path: '/dashboard/financial' },
    ],
  },
  'Win Rate': {
    icon: Target,
    variant: 'neutral',
    actions: [
      { label: 'View metrics', icon: Eye, path: '/dashboard/sales' },
      { label: 'Improve conversion', icon: TrendingUp },
    ],
  },

  // Workload Cards
  'Total Active': {
    icon: Users,
    variant: 'neutral',
    actions: [
      { label: 'View All Consultants', icon: Eye, path: '/consultants' },
      { label: 'Add Consultant', icon: UserPlus, path: '/consultants/new' },
      { label: 'Export Report', icon: Download },
    ],
  },
  'At Capacity': {
    icon: AlertCircle,
    variant: 'warning',
    actions: [
      { label: 'View At Capacity', icon: Eye },
      { label: 'Workload Analysis', icon: Download },
    ],
  },
  'Available': {
    icon: CheckCircle,
    variant: 'success',
    actions: [
      { label: 'View Available', icon: Eye },
      { label: 'Assign Projects', icon: UserPlus },
    ],
  },
  'Overloaded': {
    icon: AlertTriangle,
    variant: 'warning',
    actions: [
      { label: 'View Overloaded', icon: Eye },
      { label: 'Redistribute Work', icon: UserPlus },
      { label: 'Export Report', icon: Download },
    ],
  },

  // Employer Quick Stats
  'Subscription': {
    icon: Sparkles,
    variant: 'primary',
    actions: [
      { label: 'View Details', icon: Eye },
      { label: 'Upgrade Plan', icon: Plus },
    ],
  },
  'Capacity': {
    icon: Briefcase,
    variant: 'neutral',
    actions: [
      { label: 'View Jobs', icon: Eye, path: '/jobs' },
      { label: 'Add Job', icon: Plus },
    ],
  },
  'Financial': {
    icon: DollarSign,
    variant: 'success',
    actions: [
      { label: 'View Revenue', icon: Eye, path: '/financial' },
      { label: 'Export Report', icon: Download },
    ],
  },
  'Activity': {
    icon: Activity,
    variant: 'neutral',
    actions: [
      { label: 'View Activity', icon: Eye },
      { label: 'Contact Employer', icon: Plus },
    ],
  },
};

// Helper function to get card configuration
export function getCardConfig(title: string): CardConfig | null {
  return CARD_CONFIGS[title] || null;
}
