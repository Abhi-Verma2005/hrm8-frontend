import { SubscriptionMetrics } from '@/types/platformAdmin';

export function getSubscriptionMetrics(): SubscriptionMetrics {
  return {
    totalSubscriptions: 248,
    byTier: {
      starter: 142,
      professional: 89,
      enterprise: 17,
    },
    churnRate: 3.2,
    upgrades: 12,
    downgrades: 3,
    trialConversions: 78.5,
  };
}
