export type ConsultantStatus = 'available' | 'busy' | 'offline' | 'on-leave';
export type ConsultantSpecialization = 
  | 'technology'
  | 'finance'
  | 'healthcare'
  | 'executive'
  | 'engineering'
  | 'sales-marketing'
  | 'operations'
  | 'generalist';

export interface Consultant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  
  // Status & Availability
  status: ConsultantStatus;
  currentCapacity: number; // Current active assignments
  maxCapacity: number; // Maximum concurrent assignments
  
  // Specializations
  specializations: ConsultantSpecialization[];
  industries: string[];
  
  // Performance Metrics
  totalAssignments: number;
  completedAssignments: number;
  activeAssignments: number;
  completionRate: number; // percentage
  averageTimeToFill: number; // in days
  averageSatisfactionScore: number; // 1-5
  
  // Financial
  totalEarnings: number;
  earningsThisMonth: number;
  commissionRate: number; // percentage
  outstandingCommissions: number;
  
  // Service Level Performance
  slaComplianceRate: number; // percentage
  onTimeDeliveryRate: number; // percentage
  
  // Client Relationships
  preferredByEmployers: string[]; // Array of employer IDs
  blacklistedByEmployers: string[]; // Array of employer IDs
  
  // Metadata
  joinedAt: Date;
  lastActiveAt: Date;
  isActive: boolean;
  
  // Professional Info
  bio?: string;
  yearsOfExperience: number;
  certifications?: string[];
}

export interface ConsultantStats {
  totalConsultants: number;
  availableConsultants: number;
  busyConsultants: number;
  averageUtilization: number; // percentage
  totalActiveAssignments: number;
  totalCommissionsPaid: number;
  totalCommissionsPending: number;
}
