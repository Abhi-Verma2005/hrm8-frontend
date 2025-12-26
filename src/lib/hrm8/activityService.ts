import { apiClient } from '../api';

export enum ActivityType {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  NOTE = 'NOTE',
  TASK = 'TASK',
  OTHER = 'OTHER'
}

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description?: string;
  outcome?: string;
  nextSteps?: string;
  leadId?: string;
  companyId?: string;
  opportunityId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Add other fields as needed based on backend model
}

export interface CreateActivityInput {
  leadId?: string;
  companyId?: string;
  opportunityId?: string;
  type: ActivityType;
  subject: string;
  description?: string;
  outcome?: string;
  nextSteps?: string;
  dueDate?: Date;
  callDuration?: number;
  meetingLink?: string;
}

class ActivityService {
  private baseUrl = '/api/crm';

  async create(data: CreateActivityInput): Promise<{ success: boolean; data?: Activity; error?: string }> {
    try {
      const response = await apiClient.post<Activity>(`${this.baseUrl}/activities`, data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create activity',
      };
    }
  }

  async getByLeadId(leadId: string): Promise<{ success: boolean; data?: Activity[]; error?: string }> {
    try {
      const response = await apiClient.get<Activity[]>(`${this.baseUrl}/leads/${leadId}/activities`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch activities',
      };
    }
  }
}

export const activityService = new ActivityService();
