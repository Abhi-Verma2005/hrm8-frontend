export type ServiceType = 
  | 'shortlisting'      // Resume screening & shortlist creation
  | 'full-service'      // Complete recruitment from posting to offer
  | 'executive-search'  // Senior/executive level search
  | 'rpo';              // Recruitment Process Outsourcing

export type ServiceLevel = 
  | 'standard'   // 5-7 business days
  | 'priority'   // 3-4 business days
  | 'express';   // 1-2 business days

export type ServiceRequestStatus = 
  | 'requested'    // Initial request submitted
  | 'assigned'     // Consultant assigned
  | 'in-progress'  // Actively being worked on
  | 'review'       // Submitted for client review
  | 'completed'    // Successfully completed
  | 'cancelled';   // Cancelled by client or system

export interface ServiceRequest {
  id: string;
  employerId: string;
  employerName: string;
  jobId?: string;
  jobTitle: string;
  
  // Service Details
  serviceType: ServiceType;
  serviceLevel: ServiceLevel;
  
  // Status & Timeline
  status: ServiceRequestStatus;
  requestedAt: Date;
  assignedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  slaDeadline: Date;
  
  // Assignment
  assignedConsultantId?: string;
  assignedConsultantName?: string;
  
  // Requirements
  requirements: string;
  targetCandidateCount?: number;
  
  // Deliverables
  deliveredCandidateCount?: number;
  deliverables?: {
    candidateIds: string[];
    reportUrl?: string;
    notes?: string;
  };
  
  // Financial
  quotedPrice: number;
  finalPrice?: number;
  invoiceId?: string;
  
  // Client Feedback
  clientSatisfaction?: 1 | 2 | 3 | 4 | 5;
  clientFeedback?: string;
  
  // Metadata
  createdBy: string;
  updatedAt: Date;
}

export interface ServiceRequestStats {
  totalRequests: number;
  activeRequests: number;
  completedThisMonth: number;
  averageCompletionTime: number; // in days
  slaComplianceRate: number; // percentage
  averageSatisfactionScore: number;
  totalServiceRevenue: number;
  revenueByServiceType: Record<ServiceType, number>;
}
