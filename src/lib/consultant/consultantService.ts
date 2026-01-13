/**
 * Consultant Service
 * API service for consultant self-service operations
 */

import { apiClient } from '../api';
import { JobPipelineStage, JobPipelineStatus } from '@/types/job';

export interface ConsultantProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  photo?: string;
  role: 'RECRUITER' | 'SALES_AGENT' | 'CONSULTANT_360';
  status: string;
  regionId?: string;
  address?: string;
  city?: string;
  stateProvince?: string;
  country?: string;
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

class ConsultantService {
  async getProfile() {
    return apiClient.get<{ consultant: ConsultantProfile }>('/api/consultant/profile');
  }

  async updateProfile(data: Partial<ConsultantProfile>) {
    return apiClient.put<{ consultant: ConsultantProfile }>('/api/consultant/profile', data);
  }

  async getJobs() {
    return apiClient.get<{ jobs: any[] }>('/api/consultant/jobs');
  }

  async getCommissions(filters?: { status?: string; commissionType?: string }) {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.commissionType) queryParams.append('commissionType', filters.commissionType);

    const query = queryParams.toString();
    return apiClient.get<{ commissions: any[] }>(`/api/consultant/commissions${query ? `?${query}` : ''}`);
  }

  async getPerformance() {
    return apiClient.get<{
      metrics: {
        totalPlacements: number;
        totalRevenue: number;
        successRate: number;
        averageDaysToFill?: number;
        pendingCommissions: number;
        totalCommissionsPaid: number;
      }
    }>('/api/consultant/performance');
  }

  async getJobPipeline(jobId: string) {
    return apiClient.get<{ pipeline: JobPipelineStatus }>(`/api/consultant/jobs/${jobId}/pipeline`);
  }

  async updateJobPipeline(jobId: string, payload: { stage: JobPipelineStage; progress?: number; note?: string | null }) {
    return apiClient.patch<{ pipeline: JobPipelineStatus }>(`/api/consultant/jobs/${jobId}/pipeline`, payload);
  }
}

export const consultantService = new ConsultantService();



