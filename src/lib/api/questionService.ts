/**
 * Question Service
 * API client for application form questions
 */

import { apiClient } from '../api';
import { ApplicationFormConfig, ApplicationQuestion } from '@/types/applicationForm';

export interface GenerateQuestionsRequest {
  userNotes?: string;
  questionCount?: number;
}

export interface GenerateQuestionsResponse {
  success: boolean;
  data: {
    questions: ApplicationQuestion[];
  };
}

export const questionService = {
  /**
   * Get application form configuration for a job
   */
  async getApplicationForm(jobId: string): Promise<ApplicationFormConfig | null> {
    const response = await apiClient.get<{ success: boolean; data: { applicationForm: ApplicationFormConfig | null } }>(
      `/api/jobs/${jobId}/application-form`
    );
    return response.data.data.applicationForm;
  },

  /**
   * Update application form configuration for a job
   */
  async updateApplicationForm(jobId: string, applicationForm: ApplicationFormConfig | null): Promise<void> {
    await apiClient.put(`/api/jobs/${jobId}/application-form`, { applicationForm });
  },

  /**
   * Generate questions using AI
   * If jobId is empty, jobData should be provided in request
   */
  async generateQuestions(jobId: string, request: GenerateQuestionsRequest & { jobData?: any }): Promise<ApplicationQuestion[]> {
    const endpoint = jobId && jobId !== 'new'
      ? `/api/jobs/${jobId}/application-form/generate-questions`
      : `/api/jobs/new/application-form/generate-questions`;
    
    const response = await apiClient.post<{ questions: ApplicationQuestion[] }>(
      endpoint,
      request
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to generate questions');
    }

    // Backend returns { success: true, data: { questions: [...] } }
    // apiClient returns { success: true, data: { success: true, data: { questions: [...] } } }
    // So we need to access response.data.data.questions
    const questions = (response.data as any)?.data?.questions || (response.data as any)?.questions;
    
    if (!questions || !Array.isArray(questions)) {
      console.error('Unexpected response structure:', response);
      throw new Error('Invalid response format from question generation API');
    }

    return questions;
  },
};

