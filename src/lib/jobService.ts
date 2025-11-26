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
  category?: string;
  department?: string;
  salaryMin?: number;
  salaryMax?: number;
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface JobFilterOptions {
  categories: string[];
  departments: string[];
  locations: string[];
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
    if (params?.category) queryParams.append('category', params.category);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.salaryMin !== undefined) queryParams.append('salaryMin', params.salaryMin.toString());
    if (params?.salaryMax !== undefined) queryParams.append('salaryMax', params.salaryMax.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
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

  async getFilterOptions() {
    return apiClient.get<{ data: JobFilterOptions }>('/api/public/jobs/filters');
  }
}

export const jobService = new JobService();

