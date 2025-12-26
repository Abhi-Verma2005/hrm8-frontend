import { apiClient } from '@/lib/api';
import { CandidateDocument } from '@/types/entities';

export const resumeService = {
  async getResume(resumeId: string): Promise<CandidateDocument> {
    const response = await apiClient.get<{ success: boolean; data: CandidateDocument }>(
      `/api/resumes/${resumeId}`
    );
    return response.data.data;
  },
};
