/**
 * Consultant Management Service
 * API service for HRM8 admin consultant management
 */

import { apiClient } from '../api';

export interface Consultant {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  photo?: string;
  role: 'RECRUITER' | 'SALES_AGENT' | 'CONSULTANT_360';
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE' | 'SUSPENDED';
  regionId?: string;
  address?: string;
  city?: string;
  stateProvince?: string;
  country?: string;
  territory?: string;
  languages?: Array<{ language: string; proficiency: string }>;
  industryExpertise?: string[];
  resumeUrl?: string;
  paymentMethod?: Record<string, unknown>;
  taxInformation?: Record<string, unknown>;
  availability: 'AVAILABLE' | 'AT_CAPACITY' | 'UNAVAILABLE';
  maxEmployers: number;
  currentEmployers: number;
  maxJobs: number;
  currentJobs: number;
  maxLeads: number;
  currentLeads: number;
  commissionStructure?: string;
  defaultCommissionRate?: number;
  totalCommissionsPaid: number;
  pendingCommissions: number;
  totalPlacements: number;
  totalRevenue: number;
  successRate: number;
  averageDaysToFill?: number;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultantEmailProvisioningInfo {
  success: boolean;
  provider?: 'google' | 'microsoft';
  email?: string;
  providerUserId?: string;
  tempPassword?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface ConsultantCreateResponse {
  consultant: Consultant;
  emailProvisioning?: ConsultantEmailProvisioningInfo;
}

class ConsultantManagementService {
  async getAll(filters?: {
    regionId?: string;
    role?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (filters?.regionId) queryParams.append('regionId', filters.regionId);
    if (filters?.role) queryParams.append('role', filters.role);
    if (filters?.status) queryParams.append('status', filters.status);

    const query = queryParams.toString();
    return apiClient.get<{ consultants: Consultant[] }>(`/api/hrm8/consultants${query ? `?${query}` : ''}`);
  }

  async getById(id: string) {
    return apiClient.get<{ consultant: Consultant }>(`/api/hrm8/consultants/${id}`);
  }

  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    photo?: string;
    role: 'RECRUITER' | 'SALES_AGENT' | 'CONSULTANT_360';
    regionId?: string;
    territory?: string;
    commissionRate?: number;
    employeeId?: string;
    startDate?: Date;
    reportsToUserId?: string;
  }) {
    return apiClient.post<ConsultantCreateResponse>('/api/hrm8/consultants', data);
  }

  async update(id: string, data: Partial<Consultant>) {
    return apiClient.put<{ consultant: Consultant }>(`/api/hrm8/consultants/${id}`, data);
  }

  async assignRegion(consultantId: string, regionId: string) {
    return apiClient.post<{ consultant: Consultant }>(`/api/hrm8/consultants/${consultantId}/assign-region`, { regionId });
  }

  async suspend(id: string) {
    return apiClient.post(`/api/hrm8/consultants/${id}/suspend`);
  }

  async reactivate(id: string) {
    return apiClient.post(`/api/hrm8/consultants/${id}/reactivate`);
  }

  async generateEmail(data: {
    firstName: string;
    lastName: string;
    consultantId?: string;
  }) {
    return apiClient.post<{ email: string }>('/api/hrm8/consultants/generate-email', data);
  }
}

export const consultantManagementService = new ConsultantManagementService();



