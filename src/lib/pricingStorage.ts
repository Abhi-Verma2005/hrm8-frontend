import { 
  ATSSubscriptionTier, 
  AddonService, 
  RecruitmentService, 
  CustomPricing, 
  PricingHistory 
} from '@/types/pricing';

// Mock ATS Subscription Tiers
const mockTiers: ATSSubscriptionTier[] = [
  {
    id: 'ats-lite',
    name: 'ATS Lite',
    description: 'Perfect for small businesses just getting started',
    monthlyPrice: 0,
    annualPrice: 0,
    annualDiscount: 0,
    maxJobs: 3,
    maxUsers: 1,
    features: [
      'Up to 3 active job postings',
      '1 user account',
      'Basic candidate tracking',
      'Email notifications',
      'Standard support',
    ],
    status: 'active',
    sortOrder: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'payg',
    name: 'Pay As You Go',
    description: 'Flexibility to post jobs as needed',
    monthlyPrice: 0,
    annualPrice: 0,
    annualDiscount: 0,
    maxJobs: 999,
    maxUsers: 1,
    features: [
      'Unlimited active jobs',
      '1 user account',
      'Pay per job posted',
      'Basic candidate tracking',
      'Email notifications',
    ],
    status: 'active',
    sortOrder: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'small',
    name: 'Small',
    description: 'Ideal for growing teams',
    monthlyPrice: 199,
    annualPrice: 1990,
    annualDiscount: 16.5,
    maxJobs: 10,
    maxUsers: 5,
    features: [
      'Up to 10 active job postings',
      '5 user accounts',
      'AI-powered screening & matching',
      'Advanced analytics dashboard',
      'Custom branding',
      'Priority email support',
      'Integrations (LinkedIn, Indeed)',
    ],
    popularBadge: true,
    status: 'active',
    sortOrder: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'medium',
    name: 'Medium',
    description: 'For established recruitment teams',
    monthlyPrice: 499,
    annualPrice: 4990,
    annualDiscount: 16.5,
    maxJobs: 25,
    maxUsers: 15,
    features: [
      'Up to 25 active job postings',
      '15 user accounts',
      'All Small plan features',
      'Advanced AI screening',
      'Customizable workflows',
      'API access',
      'Dedicated account manager',
      'Phone support',
    ],
    status: 'active',
    sortOrder: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'large',
    name: 'Large',
    description: 'For high-volume recruiting',
    monthlyPrice: 999,
    annualPrice: 9990,
    annualDiscount: 16.5,
    maxJobs: 100,
    maxUsers: 50,
    features: [
      'Up to 100 active job postings',
      '50 user accounts',
      'All Medium plan features',
      'Advanced reporting & analytics',
      'Custom integrations',
      'Onboarding assistance',
      '24/7 priority support',
      'SLA guarantee',
    ],
    status: 'active',
    sortOrder: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    monthlyPrice: 0,
    annualPrice: 0,
    annualDiscount: 0,
    maxJobs: 999999,
    maxUsers: 999999,
    features: [
      'Unlimited job postings',
      'Unlimited user accounts',
      'All Large plan features',
      'Custom feature development',
      'Dedicated infrastructure',
      'White-label options',
      'Custom SLA',
      'Executive business reviews',
    ],
    status: 'active',
    sortOrder: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Mock Add-on Services
const mockAddons: AddonService[] = [
  {
    id: 'hrms',
    name: 'HRMS Add-on',
    description: 'Full employee lifecycle management',
    pricingModel: 'per_use',
    basePrice: 200,
    pricePerUnit: 5,
    unitLabel: 'per employee per month',
    features: [
      'Employee records management',
      'Time & attendance tracking',
      'Leave management',
      'Performance reviews',
      'Document management',
    ],
    applicableTiers: ['small', 'medium', 'large', 'enterprise'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'assessments',
    name: 'Candidate Assessments',
    description: 'Pre-employment testing and skills assessment',
    pricingModel: 'per_use',
    basePrice: 0,
    pricePerUnit: 15,
    unitLabel: 'per assessment',
    features: [
      'Skills-based testing',
      'Personality assessments',
      'Cognitive ability tests',
      'Custom question banks',
      'Automated scoring',
    ],
    applicableTiers: ['small', 'medium', 'large', 'enterprise'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'reference-check',
    name: 'Reference Checking',
    description: 'Automated reference verification',
    pricingModel: 'per_use',
    basePrice: 0,
    pricePerUnit: 25,
    unitLabel: 'per check',
    features: [
      'Automated reference requests',
      'Structured questionnaires',
      'Verification reports',
      'Compliance tracking',
    ],
    applicableTiers: ['small', 'medium', 'large', 'enterprise'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'video-interview',
    name: 'Video Interviewing',
    description: 'One-way and live video interview platform',
    pricingModel: 'flat',
    basePrice: 99,
    features: [
      'One-way video interviews',
      'Live interview scheduling',
      'Interview recording',
      'AI-powered insights',
      'Interview templates',
    ],
    applicableTiers: ['small', 'medium', 'large', 'enterprise'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Mock Recruitment Services
const mockRecruitmentServices: RecruitmentService[] = [
  {
    id: 'shortlisting',
    name: 'Shortlisting Service',
    description: 'Professional candidate screening and shortlisting',
    serviceType: 'shortlisting',
    pricingModel: 'flat',
    baseFee: 500,
    estimatedDuration: '5-7 business days',
    features: [
      'CV screening',
      'Initial phone screening',
      'Shortlist of 5-10 candidates',
      'Candidate summaries',
    ],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'full-service',
    name: 'Full-Service Recruitment',
    description: 'End-to-end recruitment support',
    serviceType: 'full-service',
    pricingModel: 'percentage',
    baseFee: 2000,
    percentageFee: 15,
    minFee: 2000,
    maxFee: 20000,
    estimatedDuration: '30-45 days',
    features: [
      'Job posting & advertising',
      'Full candidate sourcing',
      'Screening & interviewing',
      'Reference checks',
      'Offer negotiation support',
      '90-day replacement guarantee',
    ],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'executive-search',
    name: 'Executive Search',
    description: 'Senior leadership recruitment',
    serviceType: 'executive-search',
    pricingModel: 'percentage',
    baseFee: 5000,
    percentageFee: 25,
    minFee: 5000,
    estimatedDuration: '60-90 days',
    features: [
      'Confidential search',
      'Market mapping',
      'Direct headhunting',
      'Comprehensive assessment',
      'Background verification',
      '6-month replacement guarantee',
    ],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rpo',
    name: 'Recruitment Process Outsourcing',
    description: 'Dedicated recruitment team',
    serviceType: 'rpo',
    pricingModel: 'flat',
    baseFee: 5000,
    estimatedDuration: 'Ongoing',
    features: [
      'Dedicated recruitment consultant',
      'Full recruitment lifecycle',
      'Employer branding support',
      'Recruitment metrics & reporting',
      'Scalable solution',
    ],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// In-memory storage
let tiers = [...mockTiers];
let addons = [...mockAddons];
let recruitmentServices = [...mockRecruitmentServices];
let customPricing: CustomPricing[] = [];
let history: PricingHistory[] = [];

// ATS Subscription Tier Functions
export function getATSSubscriptionTiers(includeInactive = false): ATSSubscriptionTier[] {
  const filtered = includeInactive ? tiers : tiers.filter(t => t.status === 'active');
  return filtered.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getATSSubscriptionTier(id: string): ATSSubscriptionTier | undefined {
  return tiers.find(t => t.id === id);
}

export function createATSSubscriptionTier(
  tier: Omit<ATSSubscriptionTier, 'id' | 'createdAt' | 'updatedAt'>
): ATSSubscriptionTier {
  const newTier: ATSSubscriptionTier = {
    ...tier,
    id: `tier-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tiers.push(newTier);
  
  // Record history
  history.push({
    id: `history-${Date.now()}`,
    entityType: 'tier',
    entityId: newTier.id,
    changes: { ...tier },
    previousValues: {},
    changedBy: 'system',
    changedAt: new Date().toISOString(),
    reason: 'Created new tier',
  });
  
  return newTier;
}

export function updateATSSubscriptionTier(
  id: string,
  updates: Partial<ATSSubscriptionTier>,
  changedBy: string,
  reason?: string
): ATSSubscriptionTier | null {
  const index = tiers.findIndex(t => t.id === id);
  if (index === -1) return null;

  const previousValues = { ...tiers[index] };
  tiers[index] = {
    ...tiers[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Record history
  history.push({
    id: `history-${Date.now()}`,
    entityType: 'tier',
    entityId: id,
    changes: updates,
    previousValues,
    changedBy,
    changedAt: new Date().toISOString(),
    reason,
  });

  return tiers[index];
}

export function deleteATSSubscriptionTier(id: string): boolean {
  const index = tiers.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  tiers.splice(index, 1);
  return true;
}

// Add-on Service Functions
export function getAddonServices(includeInactive = false): AddonService[] {
  return includeInactive ? addons : addons.filter(a => a.status === 'active');
}

export function getAddonService(id: string): AddonService | undefined {
  return addons.find(a => a.id === id);
}

export function createAddonService(
  addon: Omit<AddonService, 'id' | 'createdAt' | 'updatedAt'>
): AddonService {
  const newAddon: AddonService = {
    ...addon,
    id: `addon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  addons.push(newAddon);
  return newAddon;
}

export function updateAddonService(
  id: string,
  updates: Partial<AddonService>,
  changedBy: string,
  reason?: string
): AddonService | null {
  const index = addons.findIndex(a => a.id === id);
  if (index === -1) return null;

  const previousValues = { ...addons[index] };
  addons[index] = {
    ...addons[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  history.push({
    id: `history-${Date.now()}`,
    entityType: 'addon',
    entityId: id,
    changes: updates,
    previousValues,
    changedBy,
    changedAt: new Date().toISOString(),
    reason,
  });

  return addons[index];
}

// Recruitment Service Functions
export function getRecruitmentServices(includeInactive = false): RecruitmentService[] {
  return includeInactive ? recruitmentServices : recruitmentServices.filter(r => r.status === 'active');
}

export function getRecruitmentService(id: string): RecruitmentService | undefined {
  return recruitmentServices.find(r => r.id === id);
}

export function createRecruitmentService(
  service: Omit<RecruitmentService, 'id' | 'createdAt' | 'updatedAt'>
): RecruitmentService {
  const newService: RecruitmentService = {
    ...service,
    id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  recruitmentServices.push(newService);
  return newService;
}

export function updateRecruitmentService(
  id: string,
  updates: Partial<RecruitmentService>,
  changedBy: string,
  reason?: string
): RecruitmentService | null {
  const index = recruitmentServices.findIndex(r => r.id === id);
  if (index === -1) return null;

  const previousValues = { ...recruitmentServices[index] };
  recruitmentServices[index] = {
    ...recruitmentServices[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  history.push({
    id: `history-${Date.now()}`,
    entityType: 'recruitment',
    entityId: id,
    changes: updates,
    previousValues,
    changedBy,
    changedAt: new Date().toISOString(),
    reason,
  });

  return recruitmentServices[index];
}

// Custom Pricing Functions
export function getCustomPricing(employerId?: string): CustomPricing[] {
  if (employerId) {
    return customPricing.filter(cp => cp.employerId === employerId);
  }
  return customPricing;
}

export function createCustomPricing(
  pricing: Omit<CustomPricing, 'id' | 'createdAt' | 'updatedAt'>
): CustomPricing {
  const newPricing: CustomPricing = {
    ...pricing,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  customPricing.push(newPricing);
  return newPricing;
}

// History Functions
export function getPricingHistory(entityType?: string, entityId?: string): PricingHistory[] {
  let filtered = history;
  
  if (entityType) {
    filtered = filtered.filter(h => h.entityType === entityType);
  }
  
  if (entityId) {
    filtered = filtered.filter(h => h.entityId === entityId);
  }
  
  return filtered.sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());
}
