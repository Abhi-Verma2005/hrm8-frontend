import { mockConsultants } from '@/data/mockConsultantsData';
import type { Consultant, ConsultantStatus, ConsultantType, EmploymentType } from '@/types/consultant';

const STORAGE_KEY = 'consultants';

export function getAllConsultants(): Consultant[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockConsultants));
    return mockConsultants;
  }
  return JSON.parse(stored);
}

export function getConsultantById(id: string): Consultant | undefined {
  const all = getAllConsultants();
  return all.find(c => c.id === id);
}

export function createConsultant(consultant: Omit<Consultant, 'id' | 'createdAt' | 'updatedAt'>): Consultant {
  const all = getAllConsultants();
  const newConsultant: Consultant = {
    ...consultant,
    id: `consultant_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  all.push(newConsultant);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return newConsultant;
}

export function updateConsultant(id: string, updates: Partial<Consultant>): Consultant | null {
  const all = getAllConsultants();
  const index = all.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  all[index] = {
    ...all[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all[index];
}

export function deleteConsultant(id: string): boolean {
  const all = getAllConsultants();
  const filtered = all.filter(c => c.id !== id);
  if (filtered.length === all.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function updateConsultantStatus(id: string, status: ConsultantStatus): boolean {
  return updateConsultant(id, { status }) !== null;
}

export function getConsultantsByType(type: ConsultantType): Consultant[] {
  return getAllConsultants().filter(c => c.type === type);
}

export function getConsultantsByStatus(status: ConsultantStatus): Consultant[] {
  return getAllConsultants().filter(c => c.status === status);
}

export function getActiveConsultants(): Consultant[] {
  return getAllConsultants().filter(c => c.status === 'active');
}

export function searchConsultants(query: string): Consultant[] {
  const all = getAllConsultants();
  const lowerQuery = query.toLowerCase();
  return all.filter(c =>
    c.firstName.toLowerCase().includes(lowerQuery) ||
    c.lastName.toLowerCase().includes(lowerQuery) ||
    c.email.toLowerCase().includes(lowerQuery) ||
    c.specialization.some(s => s.toLowerCase().includes(lowerQuery))
  );
}

export function getTopPerformers(limit: number = 10): Consultant[] {
  const all = getAllConsultants();
  return all
    .filter(c => c.status === 'active')
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit);
}

export function updateConsultantCapacity(
  id: string,
  type: 'employers' | 'jobs',
  delta: number
): boolean {
  const consultant = getConsultantById(id);
  if (!consultant) return false;

  const updates: Partial<Consultant> = {};
  if (type === 'employers') {
    updates.currentEmployers = Math.max(0, consultant.currentEmployers + delta);
  } else {
    updates.currentJobs = Math.max(0, consultant.currentJobs + delta);
  }

  return updateConsultant(id, updates) !== null;
}

export function getConsultantStats() {
  const all = getAllConsultants();
  const active = all.filter(c => c.status === 'active');

  return {
    total: all.length,
    active: active.length,
    onLeave: all.filter(c => c.status === 'on-leave').length,
    inactive: all.filter(c => c.status === 'inactive').length,
    suspended: all.filter(c => c.status === 'suspended').length,
    byType: {
      salesRep: all.filter(c => c.type === 'sales-rep').length,
      recruiter: all.filter(c => c.type === 'recruiter').length,
      '360Consultant': all.filter(c => c.type === '360-consultant').length,
      industryPartner: all.filter(c => c.type === 'industry-partner').length,
    },
    totalPlacements: active.reduce((sum, c) => sum + c.totalPlacements, 0),
    totalRevenue: active.reduce((sum, c) => sum + c.totalRevenue, 0),
    averageSuccessRate: active.length > 0
      ? active.reduce((sum, c) => sum + c.successRate, 0) / active.length
      : 0,
    totalCommissionsPaid: active.reduce((sum, c) => sum + c.totalCommissionsPaid, 0),
    pendingCommissions: active.reduce((sum, c) => sum + c.pendingCommissions, 0),
  };
}
