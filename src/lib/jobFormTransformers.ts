/**
 * Job Form Data Transformers
 * Utility functions to transform JobFormData to API request formats
 */

import { JobFormData } from '@/types/job';
import { CreateJobRequest, HiringMode, WorkArrangement, EmploymentType } from '@/lib/api/jobService';

/**
 * Transform requirements/responsibilities from form objects to strings
 */
export function transformRequirements(requirements: JobFormData['requirements']): string[] {
  return (requirements || [])
    .map((req: any) => {
      if (typeof req === 'string') return req;
      return req.text || req;
    })
    .filter((req: any) => req && typeof req === 'string' && req.trim().length > 0);
}

export function transformResponsibilities(responsibilities: JobFormData['responsibilities']): string[] {
  return (responsibilities || [])
    .map((resp: any) => {
      if (typeof resp === 'string') return resp;
      return resp.text || resp;
    })
    .filter((resp: any) => resp && typeof resp === 'string' && resp.trim().length > 0);
}

/**
 * Convert service type to hiring mode
 */
export function serviceTypeToHiringMode(serviceType: JobFormData['serviceType']): HiringMode {
  switch (serviceType) {
    case 'self-managed':
      return 'SELF_MANAGED';
    case 'shortlisting':
      return 'SHORTLISTING';
    case 'full-service':
      return 'FULL_SERVICE';
    case 'executive-search':
      return 'EXECUTIVE_SEARCH';
    case 'rpo':
      return 'FULL_SERVICE'; // RPO maps to full service
    default:
      return 'SELF_MANAGED';
  }
}

/**
 * Convert kebab-case to UPPER_SNAKE_CASE
 */
export function toUpperSnakeCase(value: string): string {
  return value.toUpperCase().replace(/-/g, '_');
}

/**
 * Transform JobFormData to CreateJobRequest
 */
export function transformJobFormDataToCreateRequest(
  data: JobFormData,
  options: {
    includeTerms?: boolean;
    userId?: string;
    status?: 'DRAFT' | 'TEMPLATE';
  } = {}
): CreateJobRequest {
  const { includeTerms = false, userId, status } = options;

  const requirements = transformRequirements(data.requirements);
  const responsibilities = transformResponsibilities(data.responsibilities);

  const jobRequest: CreateJobRequest = {
    title: data.title,
    description: data.description,
    jobSummary: data.description?.substring(0, 150),
    hiringMode: serviceTypeToHiringMode(data.serviceType),
    location: data.location,
    department: data.department,
    workArrangement: toUpperSnakeCase(data.workArrangement) as WorkArrangement,
    employmentType: toUpperSnakeCase(data.employmentType) as EmploymentType,
    numberOfVacancies: data.numberOfVacancies || 1,
    salaryMin: data.salaryMin,
    salaryMax: data.salaryMax,
    salaryCurrency: data.salaryCurrency,
    salaryDescription: data.salaryDescription,
    promotionalTags: data.tags || [],
    stealth: data.stealth,
    visibility: data.visibility,
    requirements,
    responsibilities,
    category: data.experienceLevel || undefined,
    videoInterviewingEnabled: data.videoInterviewingEnabled || false,
  };

  // Add optional fields
  if (includeTerms && data.termsAccepted) {
    (jobRequest as any).termsAccepted = true;
    (jobRequest as any).termsAcceptedAt = new Date();
    (jobRequest as any).termsAcceptedBy = userId;
  }

  if (data.closeDate) {
    (jobRequest as any).closeDate = new Date(data.closeDate);
  }

  if (data.hiringTeam) {
    (jobRequest as any).hiringTeam = data.hiringTeam;
  }

  if (data.applicationForm) {
    (jobRequest as any).applicationForm = data.applicationForm;
  }

  if (status) {
    (jobRequest as any).status = status;
  }

  if (data.assignmentMode) {
    (jobRequest as any).assignmentMode = data.assignmentMode;
  }

  if (data.regionId) {
    (jobRequest as any).regionId = data.regionId;
  }

  return jobRequest;
}

/**
 * Transform JobFormData to UpdateJobRequest (for updating existing jobs)
 */
export function transformJobFormDataToUpdateRequest(
  data: JobFormData,
  options: {
    includeTerms?: boolean;
    userId?: string;
    status?: 'DRAFT' | 'TEMPLATE' | 'OPEN';
  } = {}
): any {
  const createRequest = transformJobFormDataToCreateRequest(data, options);
  
  // UpdateJobRequest extends CreateJobRequest, so we can return it as-is
  return createRequest;
}

