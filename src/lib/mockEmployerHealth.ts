import { EmployerHealth } from '@/types/platformAdmin';

export function getEmployerHealthData(): EmployerHealth[] {
  return [
    {
      employerId: 'emp-014',
      employerName: 'GlobalTech Solutions',
      healthScore: 45,
      riskLevel: 'critical',
      lastActivity: '2024-01-05T10:00:00Z',
      subscriptionTier: 'Professional',
      mrr: 5400,
      activeUsers: 12,
      issues: ['Payment failed', 'Low engagement', 'No activity in 9 days'],
    },
    {
      employerId: 'emp-023',
      employerName: 'RetailCorp Ltd',
      healthScore: 62,
      riskLevel: 'high',
      lastActivity: '2024-01-12T15:30:00Z',
      subscriptionTier: 'Starter',
      mrr: 990,
      activeUsers: 3,
      issues: ['Low feature usage', 'Support tickets'],
    },
    {
      employerId: 'emp-087',
      employerName: 'HealthPlus Medical',
      healthScore: 73,
      riskLevel: 'medium',
      lastActivity: '2024-01-13T08:45:00Z',
      subscriptionTier: 'Professional',
      mrr: 4900,
      activeUsers: 15,
      issues: ['Contract renewal approaching'],
    },
  ];
}
