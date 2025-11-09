import { UpgradeOpportunity } from '@/types/platformAdmin';

export function getUpgradeOpportunities(): UpgradeOpportunity[] {
  return [
    {
      employerId: 'emp-032',
      employerName: 'InnovateTech',
      currentTier: 'Professional',
      suggestedTier: 'Enterprise',
      potentialMRR: 8500,
      reason: 'Using 95% of user licenses, multiple integration requests',
      likelihood: 'high',
    },
    {
      employerId: 'emp-045',
      employerName: 'DesignHub Agency',
      currentTier: 'Starter',
      suggestedTier: 'Professional',
      potentialMRR: 3500,
      reason: 'High job posting volume, needs ATS features',
      likelihood: 'high',
    },
    {
      employerId: 'emp-076',
      employerName: 'BuildCo Construction',
      currentTier: 'Starter',
      suggestedTier: 'Professional',
      potentialMRR: 2800,
      reason: 'Requested advanced reporting features',
      likelihood: 'medium',
    },
  ];
}
