import { apiClient } from '@/lib/api';

export interface ResumeAnnotation {
  id: string;
  resumeId: string;
  userId: string;
  userName: string;
  userColor: string;
  type: 'highlight' | 'comment';
  text: string;
  comment?: string;
  position: {
    start: number;
    end: number;
  };
  createdAt: string;
}

export interface CreateAnnotationRequest {
  resumeId: string;
  userId: string;
  userName: string;
  userColor: string;
  type: 'highlight' | 'comment';
  text: string;
  comment?: string;
  position: {
    start: number;
    end: number;
  };
}

export const resumeAnnotationService = {
  async getAnnotations(resumeId: string): Promise<ResumeAnnotation[]> {
    const response = await apiClient.get<ResumeAnnotation[]>(
      `/api/resumes/${resumeId}/annotations`
    );
    return response.data || [];
  },

  async createAnnotation(data: CreateAnnotationRequest): Promise<ResumeAnnotation> {
    const response = await apiClient.post<ResumeAnnotation>(
      `/api/resumes/${data.resumeId}/annotations`,
      data
    );
    if (!response.data) {
      throw new Error('Failed to create annotation: No data returned');
    }
    return response.data;
  },

  async deleteAnnotation(resumeId: string, annotationId: string, userId: string): Promise<void> {
    await apiClient.delete(`/api/resumes/${resumeId}/annotations/${annotationId}`, { userId });
  }
};
