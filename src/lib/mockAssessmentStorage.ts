import type { Assessment } from '@/types/assessment';

const STORAGE_KEY = 'hrm8_assessments';

const mockAssessments: Assessment[] = [];

function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAssessments));
  }
}

export function getAssessments(): Assessment[] {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getAssessmentById(id: string): Assessment | undefined {
  return getAssessments().find(a => a.id === id);
}

export function getAssessmentsByCandidate(candidateId: string): Assessment[] {
  return getAssessments().filter(a => a.candidateId === candidateId);
}

export function getAssessmentsByJob(jobId: string): Assessment[] {
  return getAssessments().filter(a => a.jobId === jobId);
}

export function saveAssessment(assessment: Assessment): void {
  const assessments = getAssessments();
  assessments.push(assessment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
}

export function updateAssessment(id: string, updates: Partial<Assessment>): void {
  const assessments = getAssessments();
  const index = assessments.findIndex(a => a.id === id);
  if (index !== -1) {
    assessments[index] = { ...assessments[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
  }
}

export function deleteAssessment(id: string): void {
  const assessments = getAssessments();
  const filtered = assessments.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getAssessmentByToken(token: string): Assessment | undefined {
  return getAssessments().find(a => a.invitationToken === token);
}

export function getPendingAssessments(): Assessment[] {
  const now = new Date();
  return getAssessments().filter(a => {
    if (a.status === 'completed' || a.status === 'expired' || a.status === 'cancelled') return false;
    
    const invitedDate = new Date(a.invitedDate);
    const daysSinceInvite = Math.floor((now.getTime() - invitedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysSinceInvite >= 3;
  });
}

export function getExpiringAssessments(): Assessment[] {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
  
  return getAssessments().filter(a => {
    if (a.status === 'completed' || a.status === 'expired' || a.status === 'cancelled') return false;
    
    const expiryDate = new Date(a.expiryDate);
    return expiryDate <= threeDaysFromNow && expiryDate > now;
  });
}
