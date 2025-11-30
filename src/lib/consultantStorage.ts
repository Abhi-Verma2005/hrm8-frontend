/**
 * Consultant Storage
 * API-based consultant management (replaces localStorage)
 */

import { consultantManagementService, Consultant } from './hrm8/consultantManagementService';

// Legacy interface for backward compatibility during migration
export type { ConsultantStatus, ConsultantType, EmploymentType } from '@/types/consultant';
export type { Consultant } from './hrm8/consultantManagementService';

export async function getAllConsultants(): Promise<Consultant[]> {
  try {
    const response = await consultantManagementService.getAll();
    if (response.success && response.data?.consultants) {
      return response.data.consultants;
    }
    return [];
  } catch (error) {
    console.error('Error fetching consultants:', error);
    return [];
  }
}

export async function getConsultantById(id: string): Promise<Consultant | undefined> {
  try {
    const response = await consultantManagementService.getById(id);
    if (response.success && response.data?.consultant) {
      return response.data.consultant;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching consultant:', error);
    return undefined;
  }
}

export async function createConsultant(consultant: Omit<Consultant, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash' | 'availability' | 'totalCommissionsPaid' | 'pendingCommissions' | 'totalPlacements' | 'totalRevenue' | 'successRate'> & { password: string }): Promise<Consultant> {
  const response = await consultantManagementService.create({
    email: consultant.email,
    password: consultant.password,
    firstName: consultant.firstName,
    lastName: consultant.lastName,
    phone: consultant.phone,
    photo: consultant.photo,
    role: consultant.role,
    regionId: consultant.regionId,
  });
  
  if (response.success && response.data?.consultant) {
    return response.data.consultant;
  }
  throw new Error(response.error || 'Failed to create consultant');
}

export async function updateConsultant(id: string, updates: Partial<Consultant>): Promise<Consultant | null> {
  const response = await consultantManagementService.update(id, updates);
  if (response.success && response.data?.consultant) {
    return response.data.consultant;
  }
  return null;
}

export async function deleteConsultant(id: string): Promise<boolean> {
  // Note: There's no delete endpoint, we'll use suspend
  const response = await consultantManagementService.suspend(id);
  return response.success;
}

export async function updateConsultantStatus(id: string, status: Consultant['status']): Promise<boolean> {
  if (status === 'SUSPENDED') {
    const response = await consultantManagementService.suspend(id);
    return response.success;
  } else if (status === 'ACTIVE') {
    const response = await consultantManagementService.reactivate(id);
    return response.success;
  }
  return false;
}

export async function getConsultantsByType(type: string): Promise<Consultant[]> {
  const all = await getAllConsultants();
  return all.filter(c => c.role === type);
}

export async function getConsultantsByStatus(status: Consultant['status']): Promise<Consultant[]> {
  const all = await getAllConsultants();
  return all.filter(c => c.status === status);
}

export async function getActiveConsultants(): Promise<Consultant[]> {
  return getConsultantsByStatus('ACTIVE');
}

export async function searchConsultants(query: string): Promise<Consultant[]> {
  const all = await getAllConsultants();
  const lowerQuery = query.toLowerCase();
  return all.filter(c =>
    c.firstName.toLowerCase().includes(lowerQuery) ||
    c.lastName.toLowerCase().includes(lowerQuery) ||
    c.email.toLowerCase().includes(lowerQuery) ||
    (c.industryExpertise || []).some(s => s.toLowerCase().includes(lowerQuery))
  );
}

export async function getTopPerformers(limit: number = 10): Promise<Consultant[]> {
  const all = await getAllConsultants();
  return all
    .filter(c => c.status === 'ACTIVE')
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit);
}

export async function updateConsultantCapacity(
  id: string,
  type: 'employers' | 'jobs',
  delta: number
): Promise<boolean> {
  const consultant = await getConsultantById(id);
  if (!consultant) return false;

  const updates: Partial<Consultant> = {};
  if (type === 'employers') {
    updates.currentEmployers = Math.max(0, (consultant.currentEmployers || 0) + delta);
  } else {
    updates.currentJobs = Math.max(0, (consultant.currentJobs || 0) + delta);
  }

  const result = await updateConsultant(id, updates);
  return result !== null;
}

export async function getConsultantStats() {
  const all = await getAllConsultants();
  const active = all.filter(c => c.status === 'ACTIVE');

  return {
    total: all.length,
    active: active.length,
    onLeave: all.filter(c => c.status === 'ON_LEAVE').length,
    inactive: all.filter(c => c.status === 'INACTIVE').length,
    suspended: all.filter(c => c.status === 'SUSPENDED').length,
    byType: {
      salesRep: all.filter(c => c.role === 'SALES_AGENT').length,
      recruiter: all.filter(c => c.role === 'RECRUITER').length,
      '360Consultant': all.filter(c => c.role === 'CONSULTANT_360').length,
    },
    totalPlacements: active.reduce((sum, c) => sum + (c.totalPlacements || 0), 0),
    totalRevenue: active.reduce((sum, c) => sum + (c.totalRevenue || 0), 0),
    averageSuccessRate: active.length > 0
      ? active.reduce((sum, c) => sum + (c.successRate || 0), 0) / active.length
      : 0,
    totalCommissionsPaid: active.reduce((sum, c) => sum + (c.totalCommissionsPaid || 0), 0),
    pendingCommissions: active.reduce((sum, c) => sum + (c.pendingCommissions || 0), 0),
  };
}
