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
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  status: 'draft' | 'open' | 'closed' | 'on-hold' | 'filled';
  visibility: 'public' | 'private' | 'stealth';
  postingDate: string;
  closeDate?: string;
  priority: 'standard' | 'urgent' | 'high';
  remoteOption: boolean;
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
  remoteOption: boolean;
  priority: 'standard' | 'urgent' | 'high';
  
  // Step 2: Job Description
  description: string;
  requirements: string[];
  responsibilities: string[];
  
  // Step 3: Compensation & Details
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  hideSalary: boolean;
  closeDate?: string;
  visibility: 'public' | 'private' | 'stealth';
  
  // Step 4: Review & Publish
  status: 'draft' | 'open';
  jobBoardDistribution: string[];
}
