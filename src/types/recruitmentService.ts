export type ServiceType = 'shortlisting' | 'full-service' | 'executive-search' | 'rpo';
export type ServiceStatus = 'active' | 'on-hold' | 'completed' | 'cancelled';
export type ServicePriority = 'high' | 'medium' | 'low';
export type ServiceStage = 'initiated' | 'in-progress' | 'shortlisting' | 'interviewing' | 'offer' | 'completed';

export interface ServiceProject {
  id: string;
  name: string;
  serviceType: ServiceType;
  status: ServiceStatus;
  priority: ServicePriority;
  stage: ServiceStage;
  
  // Client/Employer info
  clientId: string;
  clientName: string;
  clientLogo?: string;
  location: string; // "City, State" format for display
  country: string;
  
  // Assigned consultants
  consultants: Array<{
    id: string;
    name: string;
    role: 'lead' | 'support';
    avatar?: string;
  }>;
  
  // Progress metrics
  progress: number; // 0-100
  targetPositions: number;
  positionsFilled: number;
  candidatesShortlisted: number;
  candidatesInterviewed: number;
  
  // Financial
  projectValue: number;
  currency: string;
  
  // Dates
  startDate: string;
  deadline: string;
  completedDate?: string;
  
  // Additional info
  description?: string;
  requirements?: string[];
  tags?: string[];
  
  createdAt: string;
  updatedAt: string;
}

export interface ServiceTask {
  id: string;
  serviceProjectId: string;
  title: string;
  description?: string;
  assignedTo: string;
  assignedToName: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: ServicePriority;
  dueDate: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceActivity {
  id: string;
  serviceProjectId: string;
  type: 'created' | 'updated' | 'status-changed' | 'consultant-assigned' | 'task-added' | 'milestone-reached' | 'note-added';
  description: string;
  userId: string;
  userName: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface ServiceStats {
  totalActive: number;
  byType: {
    shortlisting: number;
    fullService: number;
    executiveSearch: number;
    rpo: number;
  };
  totalRevenue: number;
  avgSuccessRate: number;
  completedThisMonth: number;
}
