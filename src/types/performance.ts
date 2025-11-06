export type GoalStatus = 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';
export type ReviewCycle = 'monthly' | 'quarterly' | 'bi-annual' | 'annual';
export type ReviewStatus = 'not-started' | 'in-progress' | 'completed' | 'overdue';
export type FeedbackType = 'self' | 'manager' | 'peer' | 'direct-report' | 'other';

export interface PerformanceGoal {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  category: string;
  priority: GoalPriority;
  status: GoalStatus;
  startDate: string;
  targetDate: string;
  completedDate?: string;
  progress: number; // 0-100
  kpis: GoalKPI[];
  alignedWith?: string; // Parent goal or OKR ID
  alignmentType?: 'company-okr' | 'team-objective' | 'individual-goal';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyOKR {
  id: string;
  title: string;
  description: string;
  category: string;
  owner: string;
  ownerName: string;
  startDate: string;
  targetDate: string;
  progress: number;
  status: GoalStatus;
  keyResults: KeyResult[];
  createdAt: string;
  updatedAt: string;
}

export interface KeyResult {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  progress: number;
}

export interface TeamObjective {
  id: string;
  title: string;
  description: string;
  teamName: string;
  alignedWithOKR: string; // Company OKR ID
  owner: string;
  ownerName: string;
  startDate: string;
  targetDate: string;
  progress: number;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GoalKPI {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  description?: string;
}

export interface PerformanceReviewTemplate {
  id: string;
  name: string;
  description?: string;
  cycle: ReviewCycle;
  sections: ReviewSection[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSection {
  id: string;
  title: string;
  description?: string;
  questions: ReviewQuestion[];
  weight: number; // Percentage weight in overall score
}

export interface ReviewQuestion {
  id: string;
  question: string;
  type: 'rating' | 'text' | 'yes-no' | 'multiple-choice';
  required: boolean;
  options?: string[]; // For multiple choice
  helpText?: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerId: string;
  reviewerName: string;
  templateId: string;
  templateName: string;
  reviewPeriodStart: string;
  reviewPeriodEnd: string;
  status: ReviewStatus;
  dueDate: string;
  completedDate?: string;
  overallRating?: number; // 1-5
  responses: ReviewResponse[];
  strengths?: string;
  areasForImprovement?: string;
  goals?: string;
  managerComments?: string;
  employeeComments?: string;
  approvalWorkflow?: ApprovalWorkflow;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalWorkflow {
  stages: ApprovalStage[];
  currentStageIndex: number;
  overallStatus: 'pending' | 'in-progress' | 'approved' | 'rejected';
}

export interface ApprovalStage {
  id: string;
  name: string;
  role: 'manager' | 'hr' | 'senior-manager' | 'executive';
  approverId?: string;
  approverName?: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  actionDate?: string;
  required: boolean;
}

export interface ReviewResponse {
  sectionId: string;
  questionId: string;
  rating?: number;
  textResponse?: string;
  selectedOptions?: string[];
}

export interface Feedback360 {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewCycle: string;
  requestedBy: string;
  requestedByName: string;
  providers: FeedbackProvider[];
  questions: FeedbackQuestion[];
  responses?: FeedbackResponse[];
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  createdAt: string;
  completedAt?: string;
}

export interface FeedbackQuestion {
  id: string;
  question: string;
}

export interface FeedbackProvider {
  id: string;
  providerId: string;
  providerName: string;
  relationship: string;
  email: string;
  status: 'pending' | 'submitted';
  submittedAt?: string;
}

export interface FeedbackResponse {
  id: string;
  providerId: string;
  providerName: string;
  relationship: string;
  questionId: string;
  question: string;
  rating: number;
  comment: string;
  submittedAt: string;
}

export interface ReviewSchedule {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  cycle: ReviewCycle;
  nextReviewDate: string;
  employeeIds: string[]; // If empty, applies to all
  autoAssignToManager: boolean;
  sendReminders: boolean;
  reminderDaysBefore: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceMetrics {
  employeeId: string;
  averageRating: number;
  goalsCompleted: number;
  goalsInProgress: number;
  totalGoals: number;
  lastReviewDate?: string;
  nextReviewDate?: string;
  improvementTrend: 'improving' | 'stable' | 'declining' | 'new';
}

export interface MeetingAgendaTemplate {
  id: string;
  name: string;
  description: string;
  sections: {
    id: string;
    title: string;
    description?: string;
    order: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface MeetingActionItem {
  id: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  completedAt?: string;
}

export interface OneOnOneMeeting {
  id: string;
  employeeId: string;
  employeeName: string;
  managerId: string;
  managerName: string;
  scheduledDate: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  templateId?: string;
  agendaItems: {
    id: string;
    sectionTitle: string;
    notes: string;
    order: number;
  }[];
  actionItems: MeetingActionItem[];
  privateNotes?: {
    employeeNotes?: string;
    managerNotes?: string;
  };
  recurringSchedule?: {
    frequency: 'weekly' | 'biweekly' | 'monthly';
    nextMeetingDate?: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CalibrationSession {
  id: string;
  name: string;
  description?: string;
  scheduledDate: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  facilitatorId: string;
  facilitatorName: string;
  participants: CalibrationParticipant[];
  employees: CalibrationEmployee[];
  ratingDistribution?: {
    beforeCalibration: Record<number, number>;
    afterCalibration: Record<number, number>;
  };
  discussionNotes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CalibrationParticipant {
  id: string;
  userId: string;
  userName: string;
  role: string;
  department: string;
  attendance: 'pending' | 'attending' | 'declined';
}

export interface CalibrationEmployee {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  role: string;
  managerId: string;
  managerName: string;
  initialRating: number;
  proposedRating?: number;
  finalRating?: number;
  rationale?: string;
  discussionNotes?: string;
  performanceHighlights?: string[];
  developmentAreas?: string[];
  comparisonMetrics?: {
    goalsCompleted: number;
    totalGoals: number;
    avgReviewRating: number;
    tenure: number;
  };
}

export type ProficiencyLevel = 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
  type: 'technical' | 'soft' | 'leadership' | 'domain';
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

export interface SkillAssessment {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  assessorId: string;
  assessorName: string;
  assessmentDate: string;
  assessmentType: 'self' | 'manager' | 'peer' | '360';
  skillRatings: SkillRating[];
  overallNotes?: string;
  developmentPlan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkillRating {
  skillId: string;
  skillName: string;
  categoryId: string;
  currentLevel: ProficiencyLevel;
  targetLevel?: ProficiencyLevel;
  requiredLevel?: ProficiencyLevel;
  lastAssessed: string;
  trend?: 'improving' | 'stable' | 'declining';
  notes?: string;
  evidenceLinks?: string[];
}

export interface RoleSkillRequirement {
  id: string;
  roleName: string;
  department: string;
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
  requiredSkills: {
    skillId: string;
    skillName: string;
    categoryId: string;
    minimumLevel: ProficiencyLevel;
    importance: 'required' | 'preferred' | 'nice-to-have';
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface SkillGapAnalysis {
  employeeId: string;
  employeeName: string;
  role: string;
  targetRole?: string;
  gaps: {
    skillId: string;
    skillName: string;
    currentLevel: ProficiencyLevel;
    requiredLevel: ProficiencyLevel;
    gap: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }[];
  strengths: {
    skillId: string;
    skillName: string;
    level: ProficiencyLevel;
  }[];
  developmentRecommendations: string[];
}
