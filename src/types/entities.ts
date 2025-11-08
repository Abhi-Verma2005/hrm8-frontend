export interface Department {
  id: string;
  name: string;
  description?: string;
  headOfDepartment?: string;
  costCenter?: string;
  createdAt: Date;
}

export interface Location {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  phone?: string;
  isPrimary?: boolean;
  capacity?: number;
  createdAt: Date;
}

export interface Employer {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  location: string;
  status: 'active' | 'inactive' | 'pending' | 'trial' | 'expired';
  activeJobs: number;
  lastContact: Date;
  email?: string;
  website?: string;
  description?: string;
  companySize?: string;
  departments?: Department[];
  locations?: Location[];
  
  // Account & Billing
  accountType: 'approved' | 'payg';
  creditLimit?: number;
  currentBalance?: number;
  outstandingBalance?: number;
  paymentTerms?: string;
  billingContact?: string;
  billingEmail?: string;
  approvedAt?: Date;
  approvedBy?: string;
  stripeCustomerId?: string;

  // Subscription Management
  subscriptionTier: 'ats-lite' | 'payg' | 'small' | 'medium' | 'large' | 'enterprise';
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  subscriptionStatus?: 'active' | 'trial' | 'expired' | 'cancelled';

  // Job & User Limits
  maxOpenJobs: number;
  currentOpenJobs: number;
  maxUsers: number;
  currentUsers: number;
  
  // CRM Fields
  activeJobCount: number; // Alias for activeJobs
  userCount: number; // Alias for currentUsers
  totalJobsPosted: number;
  totalSpent?: number;
  accountManagerId?: string;
  accountManagerName?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;

  // Billing
  monthlySubscriptionFee?: number;
  nextBillingDate?: Date;
  hasUsedFreeTier?: boolean;
}

export interface Job {
  id: string;
  title: string;
  employer: string;
  employerLogo?: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  salary: string;
  status: 'open' | 'closed' | 'draft';
  applicants: number;
  unreadApplicants?: number;
  postedDate: Date;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  name: string; // Full name for backward compatibility
  photo?: string;
  email: string;
  phone: string;
  
  // Professional Details
  currentPosition?: string;
  desiredPosition?: string;
  position: string; // For backward compatibility
  experience: string; // "X years"
  experienceYears: number;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  
  // Skills & Qualifications
  skills: string[];
  education?: string;
  certifications?: string[];
  
  // Employment Preferences
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  workArrangement: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  employmentTypePreferences: ('full-time' | 'part-time' | 'contract')[];
  noticePeriod?: string;
  availabilityDate?: Date;
  
  // Documents & Links
  resumeUrl?: string;
  coverLetterUrl?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  
  // Location
  location: string; // "City, State" format for display
  city?: string;
  state?: string;
  country: string;
  
  // Status & Tracking
  status: 'active' | 'placed' | 'inactive';
  source: 'job_board' | 'referral' | 'direct' | 'linkedin' | 'agency' | 'career_fair' | 'other';
  sourceDetails?: string;
  tags: string[];
  rating?: number; // 0-5 stars
  score?: number; // 0-100 fit score
  
  // Relationships
  assignedTo?: string; // Recruiter/consultant ID
  
  // Dates
  appliedDate: Date;
  lastContactedDate?: Date;
  nextFollowUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CandidateNote {
  id: string;
  candidateId: string;
  userId: string;
  userName: string;
  noteType: 'general' | 'interview_feedback' | 'phone_screen' | 'reference_check' | 'other';
  content: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CandidateDocument {
  id: string;
  candidateId: string;
  documentType: 'resume' | 'cover_letter' | 'certificate' | 'portfolio' | 'other';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Consultant {
  id: string;
  name: string;
  photo?: string;
  email: string;
  specialization: string;
  availability: 'available' | 'assigned' | 'unavailable';
  activeClients: number;
  rating: number;
  joinedDate: Date;
}
