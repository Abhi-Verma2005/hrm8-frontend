/**
 * Job Allocation Service
 * API service for job allocation management
 */

import { apiClient } from '../api';

class JobAllocationService {
  async assignConsultant(jobId: string, consultantId: string) {
    return apiClient.post(`/api/hrm8/jobs/${jobId}/assign-consultant`, { consultantId });
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
}

export const jobAllocationService = new JobAllocationService();



