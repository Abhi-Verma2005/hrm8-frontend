/**
 * Job Service
 * Handles job-related API calls
 */

import { apiClient } from './api';

export interface PublicJob {
  id: string;
  title: string;
  description: string;
  jobSummary?: string;
  location: string;
  department?: string;
  workArrangement: string;
  employmentType: string;
  numberOfVacancies: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryDescription?: string;
  requirements: string[];
  responsibilities: string[];
  promotionalTags: string[];
  featured: boolean;
  postingDate?: string;
  expiryDate?: string;
  company: {
    id: string;
    name: string;
    website: string;
  };
  applicationForm?: any;
  createdAt: string;
}

export interface PublicJobSearchParams {
  location?: string;
  employmentType?: string;
  workArrangement?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface PublicJobSearchResponse {
  jobs: PublicJob[];
  total: number;
  limit: number;
  offset: number;
}

class JobService {
  async getPublicJobs(params?: PublicJobSearchParams) {
    const queryParams = new URLSearchParams();
    if (params?.location) queryParams.append('location', params.location);
    if (params?.employmentType) queryParams.append('employmentType', params.employmentType);
    if (params?.workArrangement) queryParams.append('workArrangement', params.workArrangement);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    return apiClient.get<PublicJobSearchResponse>(
      `/api/public/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );
  }

  async getPublicJobById(id: string) {
    return apiClient.get<{ job: PublicJob }>(`/api/public/jobs/${id}`);
  }
}

export const jobService = new JobService();

