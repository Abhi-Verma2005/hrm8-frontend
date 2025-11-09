export interface PlatformStats {
  totalEmployers: number;
  activeEmployers: number;
  totalRevenue: number;
  mrr: number;
  totalUsers: number;
  activeJobs: number;
  pendingServices: number;
  openTickets: number;
  mrrGrowth: number;
  employerGrowth: number;
  revenueGrowth: number;
}

export interface ActionItem {
  id: string;
  type: 'service' | 'ticket' | 'payment' | 'integration' | 'approval';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  employerName?: string;
  dueDate?: string;
  link: string;
  createdAt: string;
}

export interface PlatformNotification {
  id: string;
  userId: string;
  category: 'approval' | 'expiry' | 'payroll' | 'attendance' | 'document' | 'system';
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  relatedEntity: 'employer' | 'service' | 'user' | 'system' | 'integration';
  entityId?: string;
  actionRequired: boolean;
}

export interface EmployerHealth {
  employerId: string;
  employerName: string;
  healthScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastActivity: string;
  subscriptionTier: string;
  mrr: number;
  activeUsers: number;
  issues: string[];
}

export interface SubscriptionMetrics {
  totalSubscriptions: number;
  byTier: {
    starter: number;
    professional: number;
    enterprise: number;
  };
  churnRate: number;
  upgrades: number;
  downgrades: number;
  trialConversions: number;
}

export interface UpgradeOpportunity {
  employerId: string;
  employerName: string;
  currentTier: string;
  suggestedTier: string;
  potentialMRR: number;
  reason: string;
  likelihood: 'high' | 'medium' | 'low';
}

export interface RevenueData {
  month: string;
  revenue: number;
  mrr: number;
}
