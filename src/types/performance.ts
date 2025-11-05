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
  alignedWith?: string; // Team or org goal ID
  createdBy: string;
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
  createdAt: string;
  updatedAt: string;
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
