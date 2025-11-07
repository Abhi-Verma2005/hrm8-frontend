export type BackgroundCheckType = 
  | 'criminal' 
  | 'employment' 
  | 'education' 
  | 'credit' 
  | 'drug-screen' 
  | 'reference' 
  | 'identity' 
  | 'professional-license';

export interface BackgroundCheckTypeConfig {
  type: BackgroundCheckType;
  required: boolean;
}

export interface BackgroundCheckResult {
  checkType: BackgroundCheckType;
  status: 'clear' | 'review-required' | 'not-clear' | 'pending';
  details?: string;
  documents?: { name: string; url: string }[];
  completedDate?: string;
}

export interface BackgroundCheck {
  id: string;
  candidateId: string;
  candidateName: string;
  applicationId?: string;
  offerLetterId?: string;
  provider: 'checkr' | 'sterling' | 'hireright' | 'manual';
  checkTypes: BackgroundCheckTypeConfig[];
  status: 'not-started' | 'pending-consent' | 'in-progress' | 'completed' | 'issues-found' | 'cancelled';
  initiatedBy: string;
  initiatedByName: string;
  initiatedDate: string;
  completedDate?: string;
  consentGiven: boolean;
  consentDate?: string;
  results: BackgroundCheckResult[];
  overallStatus?: 'clear' | 'conditional' | 'not-clear';
  reviewedBy?: string;
  reviewedByName?: string;
  reviewNotes?: string;
  expiryDate?: string;
  reportUrl?: string;
  cost?: number;
  createdAt: string;
  updatedAt: string;
}
