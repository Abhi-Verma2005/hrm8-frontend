/**
 * Job API Service
 * Handles all job-related API calls
 */

import { apiClient } from '../api';
import { Job, JobFormData } from '@/types/job';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'VISITOR';
export type JobStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'ON_HOLD' | 'FILLED' | 'TEMPLATE';
export type HiringMode = 'SELF_MANAGED' | 'SHORTLISTING' | 'FULL_SERVICE' | 'EXECUTIVE_SEARCH';
export type WorkArrangement = 'ON_SITE' | 'REMOTE' | 'HYBRID';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'CASUAL';

export interface CreateJobRequest {
  title: string;
  description: string;
  jobSummary?: string;
  hiringMode: HiringMode;
  location: string;
  department?: string;
  workArrangement: WorkArrangement;
  employmentType: EmploymentType;
  numberOfVacancies?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryDescription?: string;
  category?: string;
  promotionalTags?: string[];
  featured?: boolean;
  stealth?: boolean;
  visibility?: string;
  expiryDate?: string;
  videoInterviewingEnabled?: boolean;
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  status?: JobStatus;
  closeDate?: string;
}

export interface GetJobsFilters {
  status?: JobStatus;
  department?: string;
  location?: string;
  hiringMode?: HiringMode;
}

class JobService {
  /**
   * Create a new job
   */
  async createJob(data: CreateJobRequest) {
    return apiClient.post<Job>('/api/jobs', data);
  }

  /**
   * Get all jobs for the company
   */
  async getJobs(filters?: GetJobsFilters) {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.department) queryParams.append('department', filters.department);
    if (filters?.location) queryParams.append('location', filters.location);
    if (filters?.hiringMode) queryParams.append('hiringMode', filters.hiringMode);

    const queryString = queryParams.toString();
    const endpoint = `/api/jobs${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<Job[]>(endpoint);
  }

  /**
   * Get job by ID
   */
  async getJobById(id: string) {
    return apiClient.get<Job>(`/api/jobs/${id}`);
  }

  /**
   * Update job
   */
  async updateJob(id: string, data: UpdateJobRequest) {
    return apiClient.put<Job>(`/api/jobs/${id}`, data);
  }

  /**
   * Delete job
   */
  async deleteJob(id: string) {
    return apiClient.delete(`/api/jobs/${id}`);
  }

  /**
   * Bulk delete jobs
   */
  async bulkDeleteJobs(jobIds: string[]) {
    return apiClient.post<{ deletedCount: number; message: string }>('/api/jobs/bulk-delete', { jobIds });
  }

  /**
   * Publish job (change status from DRAFT to OPEN)
   */
  async publishJob(id: string) {
    return apiClient.post<Job>(`/api/jobs/${id}/publish`);
  }

  /**
   * Save job as draft
   */
  async saveDraft(id: string, data: UpdateJobRequest) {
    return apiClient.post<Job>(`/api/jobs/${id}/save-draft`, data);
  }

  /**
   * Save job as template
   */
  async saveTemplate(id: string | null, data: CreateJobRequest) {
    const endpoint = id ? `/api/jobs/${id}/save-template` : `/api/jobs/new/save-template`;
    return apiClient.post<Job>(endpoint, data);
  }
}

export const jobService = new JobService();

