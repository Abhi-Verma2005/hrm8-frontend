import type { PerformanceGoal, PerformanceReviewTemplate, PerformanceReview, Feedback360, ReviewSchedule } from '@/types/performance';
import { mockPerformanceGoals, mockReviewTemplates, mockPerformanceReviews, mockFeedback360, mockReviewSchedules } from '@/data/mockPerformanceData';

const GOALS_KEY = 'hrms_performance_goals';
const TEMPLATES_KEY = 'hrms_review_templates';
const REVIEWS_KEY = 'hrms_performance_reviews';
const FEEDBACK_360_KEY = 'hrms_feedback_360';
const SCHEDULES_KEY = 'hrms_review_schedules';

// Performance Goals
export function getPerformanceGoals(employeeId?: string, status?: string): PerformanceGoal[] {
  const stored = localStorage.getItem(GOALS_KEY);
  let goals = stored ? JSON.parse(stored) : mockPerformanceGoals;
  
  if (employeeId) {
    goals = goals.filter((g: PerformanceGoal) => g.employeeId === employeeId);
  }
  
  if (status) {
    goals = goals.filter((g: PerformanceGoal) => g.status === status);
  }
  
  return goals.sort((a: PerformanceGoal, b: PerformanceGoal) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getGoalById(id: string): PerformanceGoal | undefined {
  return getPerformanceGoals().find(g => g.id === id);
}

export function savePerformanceGoal(goal: PerformanceGoal): void {
  const goals = getPerformanceGoals();
  const index = goals.findIndex(g => g.id === goal.id);
  
  if (index >= 0) {
    goals[index] = { ...goal, updatedAt: new Date().toISOString() };
  } else {
    goals.push({
      ...goal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function deletePerformanceGoal(id: string): void {
  const goals = getPerformanceGoals().filter(g => g.id !== id);
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

// Review Templates
export function getReviewTemplates(): PerformanceReviewTemplate[] {
  const stored = localStorage.getItem(TEMPLATES_KEY);
  return stored ? JSON.parse(stored) : mockReviewTemplates;
}

export function getTemplateById(id: string): PerformanceReviewTemplate | undefined {
  return getReviewTemplates().find(t => t.id === id);
}

export function saveReviewTemplate(template: PerformanceReviewTemplate): void {
  const templates = getReviewTemplates();
  const index = templates.findIndex(t => t.id === template.id);
  
  if (index >= 0) {
    templates[index] = { ...template, updatedAt: new Date().toISOString() };
  } else {
    templates.push({
      ...template,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

// Performance Reviews
export function getPerformanceReviews(filters?: {
  employeeId?: string;
  reviewerId?: string;
  status?: string;
}): PerformanceReview[] {
  const stored = localStorage.getItem(REVIEWS_KEY);
  let reviews = stored ? JSON.parse(stored) : mockPerformanceReviews;
  
  if (filters?.employeeId) {
    reviews = reviews.filter((r: PerformanceReview) => r.employeeId === filters.employeeId);
  }
  
  if (filters?.reviewerId) {
    reviews = reviews.filter((r: PerformanceReview) => r.reviewerId === filters.reviewerId);
  }
  
  if (filters?.status) {
    reviews = reviews.filter((r: PerformanceReview) => r.status === filters.status);
  }
  
  return reviews.sort((a: PerformanceReview, b: PerformanceReview) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getReviewById(id: string): PerformanceReview | undefined {
  return getPerformanceReviews().find(r => r.id === id);
}

export function savePerformanceReview(review: PerformanceReview): void {
  const reviews = getPerformanceReviews();
  const index = reviews.findIndex(r => r.id === review.id);
  
  if (index >= 0) {
    reviews[index] = { ...review, updatedAt: new Date().toISOString() };
  } else {
    reviews.push({
      ...review,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

// 360 Feedback
export function getFeedback360(employeeId?: string): Feedback360[] {
  const stored = localStorage.getItem(FEEDBACK_360_KEY);
  let feedback = stored ? JSON.parse(stored) : mockFeedback360;
  
  if (employeeId) {
    feedback = feedback.filter((f: Feedback360) => f.employeeId === employeeId);
  }
  
  return feedback.sort((a: Feedback360, b: Feedback360) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function saveFeedback360(feedback: Feedback360): void {
  const allFeedback = getFeedback360();
  const index = allFeedback.findIndex(f => f.id === feedback.id);
  
  if (index >= 0) {
    allFeedback[index] = feedback;
  } else {
    allFeedback.push({
      ...feedback,
      createdAt: new Date().toISOString(),
    });
  }
  
  localStorage.setItem(FEEDBACK_360_KEY, JSON.stringify(allFeedback));
}

// Review Schedules
export function getReviewSchedules(): ReviewSchedule[] {
  const stored = localStorage.getItem(SCHEDULES_KEY);
  return stored ? JSON.parse(stored) : mockReviewSchedules;
}

export function saveReviewSchedule(schedule: ReviewSchedule): void {
  const schedules = getReviewSchedules();
  const index = schedules.findIndex(s => s.id === schedule.id);
  
  if (index >= 0) {
    schedules[index] = { ...schedule, updatedAt: new Date().toISOString() };
  } else {
    schedules.push({
      ...schedule,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
}

// Legacy functions for consultants module
export function getPerformanceBreakdown(consultantId: string) {
  return [];
}

export function getMonthlyPlacementTrends(consultantId: string, year: number) {
  return [];
}

export function getMonthlyRevenueTrends(consultantId: string, year: number) {
  return [];
}

