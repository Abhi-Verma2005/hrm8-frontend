/**
 * CRM-specific types for Consultant Management
 */

export interface ConsultantNote {
  id: string;
  consultantId: string;
  authorId: string;
  authorName: string;
  category: ConsultantNoteCategory;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ConsultantNoteCategory = 
  | 'general' 
  | 'performance-review' 
  | '1-on-1' 
  | 'concern'
  | 'achievement'
  | 'training';

export interface ConsultantTask {
  id: string;
  consultantId: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo: string;
  assignedToName: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  completedAt?: string;
}

export interface ConsultantActivity {
  id: string;
  consultantId: string;
  type: ConsultantActivityType;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  userId?: string;
  userName?: string;
  createdAt: string;
}

export type ConsultantActivityType =
  | 'consultant-created'
  | 'consultant-updated'
  | 'status-changed'
  | 'assignment-added'
  | 'assignment-removed'
  | 'placement-completed'
  | 'commission-earned'
  | 'commission-paid'
  | 'performance-milestone'
  | 'training-completed'
  | 'certification-added'
  | 'note-added'
  | 'task-created'
  | 'task-completed'
  | 'document-uploaded'
  | 'login'
  | 'profile-updated';

export interface ConsultantDocument {
  id: string;
  consultantId: string;
  type: ConsultantDocumentType;
  name: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  expiryDate?: string;
  notes?: string;
}

export type ConsultantDocumentType = 
  | 'contract' 
  | 'w9-form'
  | 'i9-form'
  | 'certification' 
  | 'resume'
  | 'offer-letter'
  | 'nda'
  | 'other';

export interface ConsultantSettings {
  consultantId: string;
  
  // Capacity Settings
  maxEmployers: number;
  maxJobs: number;
  autoAssign: boolean;
  
  // Commission Settings
  commissionStructure: 'percentage' | 'flat' | 'tiered' | 'custom';
  defaultCommissionRate?: number;
  customCommissionRates?: Record<string, number>;
  
  // Notification Settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  notifyOnAssignment: boolean;
  notifyOnCommission: boolean;
  notifyOnPerformanceAlert: boolean;
  
  // Access Settings
  canViewAllCandidates: boolean;
  canViewAllEmployers: boolean;
  canManageOwnJobs: boolean;
  restrictedAccess: boolean;
  
  // Tags
  tags: string[];
  
  updatedAt: string;
}

export interface ConsultantAssignment {
  id: string;
  consultantId: string;
  consultantName: string;
  entityType: 'employer' | 'job';
  entityId: string;
  entityName: string;
  role?: 'account-manager' | 'recruiter' | 'primary' | 'support';
  isPrimary: boolean;
  assignedBy: string;
  assignedByName: string;
  assignedAt: string;
  completedAt?: string;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
}
