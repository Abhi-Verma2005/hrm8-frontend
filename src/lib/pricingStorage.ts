import { ATSSubscriptionTier, PricingHistory } from '@/types/pricing';

// Mock data
const mockTiers: ATSSubscriptionTier[] = [
  {
    id: 'tier-ats-lite',
    name: 'ATS Lite',
    monthlyPrice: 0,
    annualPrice: 0,
    maxJobs: 3,
    maxUsers: 1,
    features: ['Basic job posting', 'Candidate tracking', 'Email notifications'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tier-small',
    name: 'Small',
    monthlyPrice: 199,
    annualPrice: 1990,
    maxJobs: 10,
    maxUsers: 5,
    features: ['All ATS Lite features', 'AI screening', 'Analytics dashboard', 'Priority support'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let tiers = [...mockTiers];
let history: PricingHistory[] = [];

export function getATSSubscriptionTiers(): ATSSubscriptionTier[] {
  return tiers.filter(t => t.status === 'active');
}

export function getATSSubscriptionTier(id: string): ATSSubscriptionTier | undefined {
  return tiers.find(t => t.id === id);
}

export function createATSSubscriptionTier(
  tier: Omit<ATSSubscriptionTier, 'id' | 'createdAt' | 'updatedAt'>
): ATSSubscriptionTier {
  const newTier: ATSSubscriptionTier = {
    ...tier,
    id: `tier-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tiers.push(newTier);
  return newTier;
}

export function updateATSSubscriptionTier(
  id: string,
  updates: Partial<ATSSubscriptionTier>,
  changedBy: string
): ATSSubscriptionTier | null {
  const index = tiers.findIndex(t => t.id === id);
  if (index === -1) return null;

  const oldTier = { ...tiers[index] };
  tiers[index] = {
    ...tiers[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  history.push({
    id: `history-${Date.now()}`,
    tierId: id,
    changes: updates,
    changedBy,
    changedAt: new Date().toISOString(),
  });

  return tiers[index];
}

export function getPricingHistory(tierId: string): PricingHistory[] {
  return history.filter(h => h.tierId === tierId);
}
