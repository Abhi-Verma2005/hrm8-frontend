export type ApplicationStatus = 
  | 'applied' 
  | 'screening' 
  | 'interview' 
  | 'offer' 
  | 'hired' 
  | 'rejected' 
  | 'withdrawn';

export type ApplicationStage = 
  | 'New Application'
  | 'Resume Review'
  | 'Phone Screen'
  | 'Technical Interview'
  | 'Manager Interview'
  | 'Final Round'
  | 'Reference Check'
  | 'Offer Extended'
  | 'Offer Accepted'
  | 'Rejected'
  | 'Withdrawn';

export interface ApplicationAnswer {
  questionId: string;
  question: string;
  answer: string | string[];
}

export interface ApplicationNote {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface ApplicationActivity {
  id: string;
  type: 'status_change' | 'note_added' | 'email_sent' | 'interview_scheduled' | 'document_uploaded' | 'rating_changed';
  description: string;
  userId?: string;
  userName?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface Interview {
  id: string;
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral';
  scheduledDate: Date;
  duration: number; // minutes
  interviewers: string[];
  location?: string;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  feedback?: string;
  rating?: number;
}

export interface Application {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhoto?: string;
  jobId: string;
  jobTitle: string;
  employerName: string;
  
  // Application Details
  appliedDate: Date;
  status: ApplicationStatus;
  stage: ApplicationStage;
  
  // Internal Candidate Fields
  isInternalCandidate?: boolean;
  currentEmployeeId?: string;
  currentDepartment?: string;
  currentPosition?: string;
  currentManager?: string;
  yearsAtCompany?: number;
  internalReferral?: boolean;
  referredBy?: string;
  
  // Documents
  resumeUrl?: string;
  coverLetterUrl?: string;
  portfolioUrl?: string;
  
  // Custom Responses
  customAnswers: ApplicationAnswer[];
  
  // Scoring & Rating
  score?: number; // 0-100 fit score
  rating?: number; // 1-5 stars
  aiMatchScore?: number; // 0-100 AI-generated match percentage
  
  // Read Status
  isRead?: boolean; // Track if application has been viewed
  isNew?: boolean; // Track if application is newly submitted
  
  // Notes & Activities
  notes: ApplicationNote[];
  activities: ApplicationActivity[];
  
  // Interviews
  interviews: Interview[];
  
  // Assignment
  assignedTo?: string; // Recruiter ID
  assignedToName?: string;
  
  // Rejection
  rejectionReason?: string;
  rejectionDate?: Date;
  
  // Tags
  tags?: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationFilters {
  search?: string;
  status?: ApplicationStatus[];
  stage?: ApplicationStage[];
  jobId?: string;
  candidateId?: string;
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minScore?: number;
  maxScore?: number;
  tags?: string[];
}
