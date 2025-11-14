import { TeamMemberFeedback } from './collaborativeFeedback';

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
  recordingUrl?: string;
  notes?: string;
}

export interface ScorecardCriterion {
  id: string;
  name: string;
  description?: string;
  rating: number; // 1-5
  weight: number; // percentage
  notes?: string;
}

export interface Scorecard {
  id: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluatorRole: string;
  evaluatorPhoto?: string;
  template: string; // e.g., 'Technical Interview', 'Culture Fit', 'Leadership'
  criteria: ScorecardCriterion[];
  overallScore: number; // calculated weighted average
  recommendation: 'strong-hire' | 'hire' | 'neutral' | 'no-hire' | 'strong-no-hire';
  strengths?: string[];
  concerns?: string[];
  overallFeedback?: string;
  notes?: string;
  status: 'draft' | 'completed';
  completedAt: Date;
  createdAt: Date;
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
  linkedInUrl?: string;
  
  // Parsed Resume Data
  parsedResume?: ParsedResume;
  
  // Questionnaire responses
  questionnaireData?: QuestionnaireData;
  
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
  
  // Scorecards
  scorecards?: Scorecard[];
  
  // Team Reviews
  teamReviews?: TeamMemberFeedback[];
  
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

export interface WorkExperience {
  id: string;
  company: string;
  companyLogo?: string;
  title: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  location: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  reasonForLeaving?: string;
}

export interface Education {
  id: string;
  institution: string;
  institutionLogo?: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate: Date;
  gpa?: number;
  maxGpa?: number;
  honors?: string;
  relevantCoursework?: string[];
  thesisTitle?: string;
}

export interface Skill {
  name: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsExperience?: number;
  lastUsed?: Date;
  endorsements?: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  verificationUrl?: string;
  description?: string;
}

export interface ParsedResume {
  workHistory: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  summary?: string;
  parsedAt: Date;
}

export interface QuestionnaireQuestion {
  id: string;
  question: string;
  type: 'text' | 'multiple-choice' | 'yes-no' | 'rating' | 'file';
  required: boolean;
  category?: string;
}

export interface QuestionnaireResponse {
  questionId: string;
  question: string;
  answer: string;
  type: QuestionnaireQuestion['type'];
  aiAnalysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    qualityScore: number; // 0-100
    keyInsights: string[];
    concerns?: string[];
    strengths?: string[];
  };
}

export interface QuestionnaireData {
  responses: QuestionnaireResponse[];
  overallScore?: number;
  completionRate: number;
  timeSpent?: number; // minutes
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
