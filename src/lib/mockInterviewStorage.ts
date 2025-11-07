import type { Interview } from '@/types/interview';

const STORAGE_KEY = 'hrm8_interviews';

const mockInterviews: Interview[] = [];

function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockInterviews));
  }
}

export function getInterviews(): Interview[] {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getInterviewById(id: string): Interview | undefined {
  return getInterviews().find(i => i.id === id);
}

export function getInterviewsByApplication(applicationId: string): Interview[] {
  return getInterviews().filter(i => i.applicationId === applicationId);
}

export function getInterviewsByDate(date: Date): Interview[] {
  const dateStr = date.toISOString().split('T')[0];
  return getInterviews().filter(i => i.scheduledDate.startsWith(dateStr));
}

export function saveInterview(interview: Interview): void {
  const interviews = getInterviews();
  interviews.push(interview);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(interviews));
}

export function updateInterview(id: string, updates: Partial<Interview>): void {
  const interviews = getInterviews();
  const index = interviews.findIndex(i => i.id === id);
  if (index !== -1) {
    interviews[index] = { ...interviews[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interviews));
  }
}

export function deleteInterview(id: string): void {
  const interviews = getInterviews();
  const filtered = interviews.filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
