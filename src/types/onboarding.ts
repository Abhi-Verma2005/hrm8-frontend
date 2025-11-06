export type OnboardingStatus = 'not-started' | 'in-progress' | 'completed' | 'overdue';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'skipped';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type DocumentStatus = 'pending' | 'uploaded' | 'approved' | 'rejected';
export type NotificationType = 'task-assigned' | 'task-reminder' | 'task-completed' | 'document-uploaded' | 'document-approved' | 'workflow-completed';

export interface OnboardingWorkflow {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  jobTitle: string;
  department: string;
  startDate: string;
  status: OnboardingStatus;
  progress: number; // 0-100
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface OnboardingTask {
  id: string;
  workflowId: string;
  title: string;
  description: string;
  category: 'administrative' | 'hr' | 'it' | 'training' | 'compliance' | 'equipment' | 'orientation' | 'other';
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  completedDate?: string;
  completedBy?: string;
  completedByName?: string;
  estimatedDuration?: number; // in minutes
  actualDuration?: number;
  dependencies?: string[]; // task IDs that must be completed first
  notes?: string;
  attachments?: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingDocument {
  id: string;
  workflowId: string;
  name: string;
  description?: string;
  type: 'contract' | 'identification' | 'tax-form' | 'bank-details' | 'emergency-contact' | 'policy-acknowledgment' | 'certification' | 'background-check' | 'other';
  status: DocumentStatus;
  required: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  uploadedBy?: string;
  uploadedByName?: string;
  uploadedAt?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingNotification {
  id: string;
  workflowId: string;
  type: NotificationType;
  recipient: string;
  recipientName: string;
  subject: string;
  message: string;
  sentAt: string;
  readAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface OnboardingTemplate {
  id: string;
  name: string;
  description: string;
  department?: string;
  jobTitle?: string;
  duration: number; // in days
  tasks: Omit<OnboardingTask, 'id' | 'workflowId' | 'assignedTo' | 'assignedToName' | 'status' | 'completedDate' | 'completedBy' | 'completedByName' | 'actualDuration' | 'createdAt' | 'updatedAt'>[];
  documents: Omit<OnboardingDocument, 'id' | 'workflowId' | 'status' | 'fileUrl' | 'fileName' | 'fileSize' | 'mimeType' | 'uploadedBy' | 'uploadedByName' | 'uploadedAt' | 'reviewedBy' | 'reviewedByName' | 'reviewedAt' | 'reviewNotes' | 'createdAt' | 'updatedAt'>[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface OnboardingStats {
  total: number;
  notStarted: number;
  inProgress: number;
  completed: number;
  overdue: number;
  avgCompletionTime: number; // in days
  avgProgress: number;
  taskCompletionRate: number;
  documentCompletionRate: number;
}
