export interface PerformanceMetrics {
  consultantId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'all-time';
  startDate: string;
  endDate: string;
  
  // Placement Metrics
  totalPlacements: number;
  successfulPlacements: number;
  failedPlacements: number;
  pendingPlacements: number;
  successRate: number;
  
  // Revenue Metrics
  totalRevenue: number;
  averageRevenuePerPlacement: number;
  targetRevenue?: number;
  revenueAchievement?: number; // percentage of target
  
  // Time Metrics
  averageDaysToFill: number;
  fastestPlacement: number;
  slowestPlacement: number;
  
  // Activity Metrics
  totalApplicationsReviewed: number;
  totalInterviewsScheduled: number;
  totalCandidatesPresented: number;
  totalClientMeetings: number;
  
  // Quality Metrics
  clientSatisfactionScore?: number;
  candidateSatisfactionScore?: number;
  retentionRate?: number;
  offerAcceptanceRate?: number;
  
  // Commission Metrics
  totalCommissionsEarned: number;
  pendingCommissions: number;
  averageCommissionPerPlacement: number;
  
  // Ranking
  teamRank?: number;
  companyRank?: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface PlacementRecord {
  id: string;
  consultantId: string;
  consultantName: string;
  
  // Entities
  candidateId: string;
  candidateName: string;
  employerId: string;
  employerName: string;
  jobId: string;
  jobTitle: string;
  
  // Financial
  placementFee: number;
  salary: number;
  commissionAmount: number;
  currency: string;
  
  // Timeline
  jobPostedDate: string;
  candidateAppliedDate: string;
  firstInterviewDate?: string;
  offerDate?: string;
  startDate: string;
  
  // Metrics
  daysToFill: number;
  applicantsReviewed: number;
  candidatesPresented: number;
  interviewsScheduled: number;
  
  // Status
  status: 'active' | 'completed' | 'terminated' | 'replaced';
  replacementReason?: string;
  
  // Satisfaction
  clientSatisfaction?: number;
  candidateSatisfaction?: number;
  
  // Metadata
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceTarget {
  id: string;
  consultantId: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  year: number;
  month?: number;
  quarter?: number;
  
  // Revenue Targets
  revenueTarget: number;
  placementsTarget: number;
  
  // Quality Targets
  successRateTarget: number;
  satisfactionTarget: number;
  daysToFillTarget: number;
  
  // Progress
  currentRevenue: number;
  currentPlacements: number;
  achievement: number; // percentage
  
  status: 'on-track' | 'at-risk' | 'achieved' | 'missed';
  
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  consultantId: string;
  consultantName: string;
  consultantPhoto?: string;
  consultantType: string;
  metric: number;
  metricType: 'placements' | 'revenue' | 'success-rate' | 'satisfaction';
  period: string;
  badge?: 'gold' | 'silver' | 'bronze';
}
