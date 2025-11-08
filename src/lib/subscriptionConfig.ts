export const SUBSCRIPTION_TIERS = {
  'ats-lite': { 
    maxOpenJobs: Infinity, 
    maxUsers: Infinity, 
    monthlyFee: 0,
    jobPostingCost: 0,
    name: 'ATS Lite',
    description: 'Basic ATS features',
    features: {
      ats: true,
      aiScreening: false,
      customForms: false,
      teamCollaboration: false,
      talentPool: false,
      brandedCareersPage: false,
      jobBoardIntegration: false,
      locationManager: false,
      departmentManager: false,
      divisionManager: false,
      reportsAnalytics: 'basic'
    }
  },
  'payg': { 
    maxOpenJobs: Infinity, 
    maxUsers: Infinity, 
    monthlyFee: 0,
    jobPostingCost: 195,
    name: 'Pay As You Go',
    description: 'Pay per job posting',
    features: {
      ats: true,
      aiScreening: true,
      customForms: true,
      teamCollaboration: true,
      talentPool: true,
      brandedCareersPage: true,
      jobBoardIntegration: true,
      locationManager: true,
      departmentManager: true,
      divisionManager: false,
      reportsAnalytics: 'standard'
    }
  },
  small: { 
    maxOpenJobs: 5, 
    maxUsers: Infinity, 
    monthlyFee: 295,
    jobPostingCost: 0,
    name: 'Small',
    description: 'For small teams',
    features: {
      ats: true,
      aiScreening: true,
      customForms: true,
      teamCollaboration: true,
      talentPool: true,
      brandedCareersPage: true,
      jobBoardIntegration: true,
      locationManager: true,
      departmentManager: true,
      divisionManager: false,
      reportsAnalytics: 'advanced'
    }
  },
  medium: { 
    maxOpenJobs: 25, 
    maxUsers: Infinity, 
    monthlyFee: 495,
    jobPostingCost: 0,
    name: 'Medium',
    description: 'For growing companies',
    features: {
      ats: true,
      aiScreening: true,
      customForms: true,
      teamCollaboration: true,
      talentPool: true,
      brandedCareersPage: true,
      jobBoardIntegration: true,
      locationManager: true,
      departmentManager: true,
      divisionManager: false,
      reportsAnalytics: 'advanced'
    }
  },
  large: { 
    maxOpenJobs: 50, 
    maxUsers: Infinity, 
    monthlyFee: 695,
    jobPostingCost: 0,
    name: 'Large',
    description: 'For large organizations',
    features: {
      ats: true,
      aiScreening: true,
      customForms: true,
      teamCollaboration: true,
      talentPool: true,
      brandedCareersPage: true,
      jobBoardIntegration: true,
      locationManager: true,
      departmentManager: true,
      divisionManager: true,
      reportsAnalytics: 'advanced'
    }
  },
  enterprise: { 
    maxOpenJobs: Infinity, 
    maxUsers: Infinity, 
    monthlyFee: 995,
    jobPostingCost: 0,
    name: 'Enterprise',
    description: 'Unlimited everything',
    features: {
      ats: true,
      aiScreening: true,
      customForms: true,
      teamCollaboration: true,
      talentPool: true,
      brandedCareersPage: true,
      jobBoardIntegration: true,
      locationManager: true,
      departmentManager: true,
      divisionManager: true,
      reportsAnalytics: 'enterprise'
    }
  }
} as const;

export const PAYG_JOB_POSTING_COST = 195;

// HRMS Add-on Configuration
export const HRMS_ADDON = {
  pricePerEmployee: 6,
  minimumEmployees: 50,
  name: 'HRMS Module',
  description: 'Full HR Management System',
  features: [
    'Employee Records Management',
    'Leave & Attendance Tracking',
    'Performance Management',
    'Payroll Integration',
    'Benefits Administration',
    'Document Management',
    'Organizational Charts',
    'Employee Self-Service Portal'
  ]
} as const;

// Additional Add-on Services
export const ADDON_SERVICES = {
  assessments: {
    name: 'Skills Assessments',
    monthlyCost: 99,
    perUseCost: 5,
    description: 'Pre-employment skills testing'
  },
  referenceChecking: {
    name: 'Reference Checking',
    perCheckCost: 25,
    description: 'Automated reference verification'
  },
  videoInterviewing: {
    name: 'Video Interviewing',
    monthlyCost: 149,
    description: 'One-way and live video interviews'
  }
} as const;

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
