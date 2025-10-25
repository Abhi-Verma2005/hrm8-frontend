export const SUBSCRIPTION_TIERS = {
  free: { 
    maxOpenJobs: 1, 
    maxUsers: 1, 
    monthlyFee: 0,
    jobPostingCost: 0,
    name: 'Free'
  },
  small: { 
    maxOpenJobs: 5, 
    maxUsers: Infinity, 
    monthlyFee: 295,
    jobPostingCost: 0,
    name: 'Small'
  },
  medium: { 
    maxOpenJobs: 25, 
    maxUsers: Infinity, 
    monthlyFee: 495,
    jobPostingCost: 0,
    name: 'Medium'
  },
  large: { 
    maxOpenJobs: 50, 
    maxUsers: Infinity, 
    monthlyFee: 695,
    jobPostingCost: 0,
    name: 'Large'
  },
  enterprise: { 
    maxOpenJobs: Infinity, 
    maxUsers: Infinity, 
    monthlyFee: 995,
    jobPostingCost: 0,
    name: 'Enterprise'
  }
} as const;

export const PAYG_JOB_POSTING_COST = 195;

export const RECRUITMENT_SERVICES = {
  'self-managed': {
    baseFee: 0,
    upfrontPercentage: 0,
    name: 'Self-Managed (FREE)'
  },
  'shortlisting': {
    baseFee: 1990,
    upfrontPercentage: 0.5,
    name: 'Shortlisting Service'
  },
  'full-service': {
    baseFee: 5990,
    upfrontPercentage: 0.5,
    name: 'Standard Recruitment Service'
  },
  'executive-search': {
    baseFeeUnder100k: 9990,
    baseFeeOver100k: 14990,
    upfrontPercentage: 0.5,
    name: 'Executive Search'
  },
  'rpo': {
    monthlyFee: 10000,
    upfrontPercentage: 0,
    name: 'RPO (Recruitment Process Outsourcing)'
  }
} as const;

export function getServiceBaseFee(serviceType: 'shortlisting' | 'full-service' | 'executive-search' | 'rpo'): number {
  switch (serviceType) {
    case 'shortlisting':
      return RECRUITMENT_SERVICES['shortlisting'].baseFee;
    case 'full-service':
      return RECRUITMENT_SERVICES['full-service'].baseFee;
    case 'executive-search':
      return RECRUITMENT_SERVICES['executive-search'].baseFeeUnder100k;
    case 'rpo':
      return RECRUITMENT_SERVICES['rpo'].monthlyFee;
    default:
      return 0;
  }
}

export function isMonthlyService(serviceType: string): boolean {
  return serviceType === 'rpo';
}

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;
