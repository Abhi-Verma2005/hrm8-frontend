/**
 * Job Allocation Service
 * API service for job allocation management
 */

import { apiClient } from '../api';

export interface UnassignedJob {
  id: string;
  title: string;
  location: string;
  companyId: string;
  companyName?: string;
  regionId?: string;
  category?: string;
  status: string;
  createdAt: string;
  assignmentMode?: 'AUTO' | 'MANUAL';
  assignmentSource?: string;
}

export interface ConsultantForAssignment {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  availability: string;
  regionId?: string;
  currentJobs: number;
  maxJobs: number;
  industryExpertise?: string[];
  languages?: string[];
}

export interface JobAssignmentInfo {
  job: {
    id: string;
    title: string;
    assignedConsultantId?: string;
    assignmentSource?: string;
    assignmentMode?: 'AUTO' | 'MANUAL';
    regionId?: string;
  };
  consultants: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
}

class JobAllocationService {
  async assignConsultant(jobId: string, consultantId: string, assignmentSource?: string) {
    return apiClient.post(`/api/hrm8/jobs/${jobId}/assign-consultant`, { 
      consultantId,
      assignmentSource 
    });
  }

  async assignRegion(jobId: string, regionId: string) {
    return apiClient.post(`/api/hrm8/jobs/${jobId}/assign-region`, { regionId });
  }

  async unassign(jobId: string) {
    return apiClient.post(`/api/hrm8/jobs/${jobId}/unassign`);
  }

  async getJobConsultants(jobId: string) {
    return apiClient.get<{ consultants: Array<{ id: string; firstName: string; lastName: string; email: string }> }>(
      `/api/hrm8/jobs/${jobId}/consultants`
    );
  }

  async getUnassignedJobs(filters?: { regionId?: string; companyId?: string }) {
    const queryParams = new URLSearchParams();
    if (filters?.regionId) queryParams.append('regionId', filters.regionId);
    if (filters?.companyId) queryParams.append('companyId', filters.companyId);

    const query = queryParams.toString();
    return apiClient.get<{ jobs: UnassignedJob[] }>(
      `/api/hrm8/jobs/unassigned${query ? `?${query}` : ''}`
    );
  }

  async getAssignmentInfo(jobId: string) {
    return apiClient.get<JobAssignmentInfo>(`/api/hrm8/jobs/${jobId}/assignment-info`);
  }

  async autoAssign(jobId: string) {
    return apiClient.post<{ consultantId?: string; job: any; consultants: any[] }>(
      `/api/hrm8/jobs/${jobId}/auto-assign`
    );
  }

  async getConsultantsForAssignment(filters: {
    regionId: string;
    role?: string;
    availability?: string;
    industry?: string;
    language?: string;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    queryParams.append('regionId', filters.regionId);
    if (filters.role) queryParams.append('role', filters.role);
    if (filters.availability) queryParams.append('availability', filters.availability);
    if (filters.industry) queryParams.append('industry', filters.industry);
    if (filters.language) queryParams.append('language', filters.language);
    if (filters.search) queryParams.append('search', filters.search);

    return apiClient.get<{ consultants: ConsultantForAssignment[] }>(
      `/api/hrm8/consultants/for-assignment?${queryParams.toString()}`
    );
  }
}

export const jobAllocationService = new JobAllocationService();



