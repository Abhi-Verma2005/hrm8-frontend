export type SubscriptionTier = 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'active' | 'trial' | 'suspended' | 'cancelled';
export type ModuleType = 'ats' | 'hrms';
export type BillingCycle = 'monthly' | 'annual';

export interface ModuleSubscription {
  module: ModuleType;
  isActive: boolean;
  activatedAt: Date;
  expiresAt?: Date;
}

export interface Employer {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  website?: string;
  
  // Subscription Information
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  subscribedModules: ModuleSubscription[];
  billingCycle: BillingCycle;
  
  // Usage & Limits
  activeUsers: number;
  maxUsers: number;
  activeJobs: number;
  maxJobs?: number;
  totalEmployees: number;
  
  // Contact Information
  primaryContact: {
    name: string;
    email: string;
    phone?: string;
  };
  
  // Billing Information
  billingEmail?: string;
  monthlyRecurringRevenue: number;
  outstandingInvoices: number;
  
  // Service Engagement
  isUsingRecruitmentServices: boolean;
  activeServiceRequests: number;
  totalServiceRevenue: number;
  
  // Add-ons
  enabledAddOns: {
    videoInterviewing: boolean;
    referenceChecks: boolean;
    assessments: boolean;
    jobTargetDistribution: boolean;
  };
  
  // Metadata
  onboardedAt: Date;
  lastActivityAt: Date;
  accountManager?: string;
  
  // Custom Branding
  brandColor?: string;
  careerPageSlug?: string;
}

export interface EmployerStats {
  totalEmployers: number;
  activeEmployers: number;
  trialEmployers: number;
  totalMRR: number;
  averageLTV: number;
  churnRate: number;
  atsOnlyCount: number;
  hrmsOnlyCount: number;
  bothModulesCount: number;
}
