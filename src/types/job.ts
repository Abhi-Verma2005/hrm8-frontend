import { ApplicationFormConfig } from './applicationForm';

export interface HiringTeamMember {
  id: string;
  userId?: string;
  email: string;
  name: string;
  role: 'hiring_manager' | 'recruiter' | 'interviewer' | 'coordinator';
  permissions: {
    canViewApplications: boolean;
    canShortlist: boolean;
    canScheduleInterviews: boolean;
    canMakeOffers: boolean;
  };
  status: 'active' | 'pending_invite';
  invitedAt?: string;
  addedBy?: string;
}

export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  employerLogo?: string;
  createdBy: string;
  createdByName: string;
  title: string;
  numberOfVacancies: number;
  jobCode: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  department: string;
  location: string;
  country?: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'casual';
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod?: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'annual';
  salaryDescription?: string;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  status: 'draft' | 'open' | 'closed' | 'on-hold' | 'filled' | 'template';
  visibility: 'public' | 'private';
  stealth: boolean;
  postingDate: string;
  closeDate?: string;
  tags: string[];
  workArrangement: 'on-site' | 'remote' | 'hybrid';
  aiGeneratedDescription: boolean;
  serviceType: 'self-managed' | 'shortlisting' | 'full-service' | 'executive-search' | 'rpo';
  serviceStatus?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedConsultantId?: string;
  assignedConsultantName?: string;
  jobBoardDistribution: string[];
  applicantsCount: number;
  unreadApplicants?: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  hiringTeam?: HiringTeamMember[];
  applicationForm?: ApplicationFormConfig;
  
  // JobTarget Promotion & Payment
  hasJobTargetPromotion?: boolean;
  jobTargetBudget?: number;
  jobTargetBudgetRemaining?: number;
  jobTargetPromotions?: string[];
  paymentId?: string;
  requiresPayment?: boolean;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  serviceFee?: number;
  termsAccepted?: boolean;
  termsAcceptedAt?: Date;
  termsAcceptedBy?: string;
  
  // Internal Job Posting Fields
  isInternal?: boolean;
  internalOnly?: boolean;
  eligibleDepartments?: string[];
  internalApplyDeadline?: string;
  currentEmployeePriority?: boolean;
  
  // Requisition Link
  requisitionId?: string;
  
  // AI Interview Configuration
  aiInterviewConfig?: {
    defaultMode: 'video' | 'phone' | 'text';
    questionSource: 'predefined' | 'ai-generated' | 'hybrid';
    defaultQuestions?: Array<{
      question: string;
      category: 'technical' | 'behavioral' | 'situational' | 'cultural' | 'experience';
    }>;
  };
  
  // Video Interviewing
  videoInterviewingEnabled?: boolean;
}

export interface JobTemplate {
  id: string;
  employerId?: string;
  templateName: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  employmentType: string;
  department: string;
  experienceLevel: string;
  isActive: boolean;
  isSystemTemplate: boolean;
  createdAt: string;
}

export interface JobActivity {
  id: string;
  jobId: string;
  userId: string;
  userName: string;
  activityType: 'created' | 'updated' | 'status-changed' | 'service-activated' | 'candidate-moved' | 'published' | 'closed';
  activityDescription: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface JobFormData {
  // Service Type
  serviceType: 'self-managed' | 'shortlisting' | 'full-service' | 'executive-search' | 'rpo';
  
  // Step 1: Basic Details
  title: string;
  numberOfVacancies: number;
  department: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'casual';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  workArrangement: 'on-site' | 'remote' | 'hybrid';
  tags: string[];
  
  // Step 2: Job Description
  positionDescriptionFile?: File | null;
  positionDescriptionText?: string;
  extractedJobData?: {
    title?: string;
    description?: string;
    requirements: string[];
    responsibilities: string[];
    qualifications?: string[];
    benefits?: string[];
    salaryRange?: {
      min?: number;
      max?: number;
      currency?: string;
      period?: string;
    };
    location?: string;
    employmentType?: string;
    experienceLevel?: string;
    department?: string;
  };
  description: string;
  requirements: Array<{ id: string; text: string; order: number }>;
  responsibilities: Array<{ id: string; text: string; order: number }>;
  
  // Step 3: Compensation, Details & Hiring Team
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'annual';
  salaryDescription?: string;
  hideSalary: boolean;
  closeDate?: string;
  visibility: 'public' | 'private';
  stealth: boolean;
  hiringTeam: HiringTeamMember[];
  
  // Step 4: Application Form
  applicationForm: ApplicationFormConfig;
  
  // Step 5: Review & Publish
  status: 'draft' | 'open';
  jobBoardDistribution: string[];
  
  // Step 6: Payment & JobTarget
  includeJobTargetPromotion?: boolean;
  jobTargetBudgetTier?: 'basic' | 'standard' | 'premium' | 'executive' | 'custom' | 'none';
  jobTargetBudgetCustom?: number;
  selectedPaymentMethod?: 'account' | 'credit_card';
  paymentInvoiceRequested?: boolean;
  termsAccepted?: boolean;
  
  // Video Interviewing
  videoInterviewingEnabled?: boolean;
}
