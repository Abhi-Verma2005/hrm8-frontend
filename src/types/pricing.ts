/**
 * Pricing management types
 */

export type BillingCycle = 'monthly' | 'annual';
export type PricingStatus = 'active' | 'draft' | 'archived';

export interface ATSSubscriptionTier {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  maxJobs: number;
  maxUsers: number;
  features: string[];
  status: PricingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PricingHistory {
  id: string;
  tierId: string;
  changes: Record<string, any>;
  changedBy: string;
  changedAt: string;
  reason?: string;
}
