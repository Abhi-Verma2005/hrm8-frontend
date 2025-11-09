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
    name: 'Candidate Assessments',
    pricingModel: 'assessment-based',
    description: 'Assessment-based pricing - varies by type and volume'
  },
  referenceChecking: {
    name: 'Reference Checking',
    perCandidateCost: 69,
    description: 'Automated reference verification - per candidate'
  },
  videoInterviewing: {
    name: 'Video Interviewing',
    perJobCost: 99,
    description: 'One-way and live video interviews - per job posting'
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
    baseMonthlyPerConsultant: 5990, // Guide price
    basePerVacancy: 3990, // Guide price
    upfrontPercentage: 0,
    name: 'RPO (Recruitment Process Outsourcing)',
    description: 'Pricing tailored to employer needs - guide prices shown',
    isTailored: true,
    minimumConsultants: 1,
    minimumContract: 6, // months
    note: 'Pricing is customized for each employer based on volume, duration, and specific requirements'
  }
} as const;

export const PRICING_NOTES = {
  annualPayment: 'Subscription fees paid annually',
  hrmsBlocks: 'HRMS charged in blocks of 50 employees paid annually',
  optionalServices: 'Optional services - additional charges apply',
  currency: 'Pricing in USD',
  rpoCustom: 'RPO pricing is tailored to each employer - guide prices shown for reference'
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
      return RECRUITMENT_SERVICES['rpo'].baseMonthlyPerConsultant;
    default:
      return 0;
  }
}

export function isMonthlyService(serviceType: string): boolean {
  return serviceType === 'rpo';
}

export function calculateRPOGuidePricing(
  consultants: number,
  months: number,
  estimatedVacancies: number
): {
  monthlyRetainer: number;
  totalMonthlyFees: number;
  perVacancyFees: number;
  totalEstimated: number;
  breakdown: string[];
} {
  const GUIDE_CONSULTANT_RATE = RECRUITMENT_SERVICES.rpo.baseMonthlyPerConsultant;
  const GUIDE_VACANCY_FEE = RECRUITMENT_SERVICES.rpo.basePerVacancy;
  
  const monthlyRetainer = consultants * GUIDE_CONSULTANT_RATE;
  const totalMonthlyFees = monthlyRetainer * months;
  const perVacancyFees = estimatedVacancies * GUIDE_VACANCY_FEE;
  const totalEstimated = totalMonthlyFees + perVacancyFees;
  
  return {
    monthlyRetainer,
    totalMonthlyFees,
    perVacancyFees,
    totalEstimated,
    breakdown: [
      `${consultants} consultant(s) × $${GUIDE_CONSULTANT_RATE.toLocaleString()}/month × ${months} months = $${totalMonthlyFees.toLocaleString()}`,
      `${estimatedVacancies} estimated vacancies × $${GUIDE_VACANCY_FEE.toLocaleString()} = $${perVacancyFees.toLocaleString()}`,
      `Total Estimated: $${totalEstimated.toLocaleString()}`
    ]
  };
}

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;
