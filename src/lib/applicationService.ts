/**
 * Application Service
 * Handles job application API calls
 */

import { apiClient } from './api';

export interface SubmitApplicationRequest {
  jobId: string;
  resumeUrl?: string;
  coverLetterUrl?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  customAnswers?: Array<{
    questionId: string;
    answer: string | string[];
  }>;
  questionnaireData?: any;
  tags?: string[];
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: string;
  stage: string;
  appliedDate: string;
  resumeUrl?: string;
  coverLetterUrl?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  customAnswers?: any;
  questionnaireData?: any;
  isRead: boolean;
  isNew: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

class ApplicationService {
  async submitApplication(data: SubmitApplicationRequest) {
    return apiClient.post<{ application: Application; message: string }>('/api/applications', data);
  }

  async getApplication(id: string) {
    return apiClient.get<{ application: Application }>(`/api/applications/${id}`);
  }

  // Recruiter/admin view – does not require candidate auth
  async getApplicationForAdmin(id: string) {
    return apiClient.get<{ application: Application }>(`/api/applications/admin/${id}`);
  }

  async getCandidateApplications() {
    return apiClient.get<{ applications: Application[] }>('/api/applications');
  }

  async getJobApplications(jobId: string) {
    return apiClient.get<{ applications: Application[] }>(`/api/applications/job/${jobId}`);
  }

  async withdrawApplication(id: string) {
    return apiClient.post<{ application: Application; message: string }>(`/api/applications/${id}/withdraw`);
  }
}

export const applicationService = new ApplicationService();

