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
  jobCode: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  department: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'casual';
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod?: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'annual';
  salaryDescription?: string;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  status: 'draft' | 'open' | 'closed' | 'on-hold' | 'filled';
  visibility: 'public' | 'private' | 'stealth';
  postingDate: string;
  closeDate?: string;
  priority: 'standard' | 'urgent' | 'high';
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
  // Step 1: Basic Details
  postAsHRM8: boolean;
  employerId: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'casual';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  workArrangement: 'on-site' | 'remote' | 'hybrid';
  priority: 'standard' | 'urgent' | 'high';
  
  // Step 2: Job Description
  positionDescriptionFile?: File | null;
  positionDescriptionText?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  
  // Step 3: Compensation, Details & Hiring Team
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'annual';
  salaryDescription?: string;
  hideSalary: boolean;
  closeDate?: string;
  visibility: 'public' | 'private' | 'stealth';
  hiringTeam: HiringTeamMember[];
  
  // Step 4: Application Form
  applicationForm: ApplicationFormConfig;
  
  // Step 5: Review & Publish
  status: 'draft' | 'open';
  jobBoardDistribution: string[];
}
