import { apiClient } from '../api';

export type EmailTemplateType =
  | 'APPLICATION_CONFIRMATION'
  | 'INTERVIEW_INVITATION'
  | 'REJECTION'
  | 'OFFER_EXTENDED'
  | 'OFFER_ACCEPTED'
  | 'STAGE_CHANGE'
  | 'REMINDER'
  | 'FOLLOW_UP'
  | 'CUSTOM';

export interface EmailTemplate {
  id: string;
  companyId: string;
  jobId: string | null;
  jobRoundId: string | null;
  name: string;
  type: EmailTemplateType;
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
  isDefault: boolean;
  isAiGenerated: boolean;
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateVariable {
  key: string;
  label: string;
  description: string;
  example: string;
  category: string;
}

export interface CreateEmailTemplateRequest {
  jobId?: string | null;
  jobRoundId?: string | null;
  name: string;
  type: EmailTemplateType;
  subject: string;
  body: string;
  variables?: string[];
  isActive?: boolean;
  isDefault?: boolean;
  isAiGenerated?: boolean;
}

export interface UpdateEmailTemplateRequest {
  name?: string;
  subject?: string;
  body?: string;
  variables?: string[];
  isActive?: boolean;
  isDefault?: boolean;
}

export interface GenerateAITemplateRequest {
  jobRoundId?: string;
  templateType: EmailTemplateType;
  jobId?: string;
  tone?: 'professional' | 'friendly' | 'casual' | 'formal';
  additionalContext?: string;
}

export interface GeneratedEmailTemplate {
  subject: string;
  body: string;
  suggestedVariables: string[];
}

export interface TemplatePreviewRequest {
  templateId: string;
  sampleData?: Record<string, any>;
}

export interface TemplatePreview {
  subject: string;
  body: string;
}

export const emailTemplateService = {
  /**
   * Get all templates
   */
  async getTemplates(filters?: {
    jobId?: string;
    jobRoundId?: string;
    type?: EmailTemplateType;
  }): Promise<EmailTemplate[]> {
    const params = new URLSearchParams();
    if (filters?.jobId) params.append('jobId', filters.jobId);
    if (filters?.jobRoundId) params.append('jobRoundId', filters.jobRoundId);
    if (filters?.type) params.append('type', filters.type);

    const response = await apiClient.get(`/api/email-templates?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get template by ID
   */
  async getTemplate(id: string): Promise<EmailTemplate> {
    const response = await apiClient.get(`/api/email-templates/${id}`);
    return response.data.data;
  },

  /**
   * Create template
   */
  async createTemplate(data: CreateEmailTemplateRequest): Promise<EmailTemplate> {
    const response = await apiClient.post('/api/email-templates', data);
    return response.data.data;
  },

  /**
   * Update template
   */
  async updateTemplate(id: string, data: UpdateEmailTemplateRequest): Promise<EmailTemplate> {
    const response = await apiClient.put(`/api/email-templates/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete template
   */
  async deleteTemplate(id: string): Promise<void> {
    await apiClient.delete(`/api/email-templates/${id}`);
  },

  /**
   * Preview template
   */
  async previewTemplate(data: TemplatePreviewRequest): Promise<TemplatePreview> {
    const response = await apiClient.post(`/api/email-templates/${data.templateId}/preview`, {
      sampleData: data.sampleData,
    });
    return response.data.data;
  },

  /**
   * Get available variables
   */
  async getVariables(): Promise<TemplateVariable[]> {
    const response = await apiClient.get('/api/email-templates/variables');
    return response.data.data;
  },

  /**
   * Generate template using AI
   */
  async generateAITemplate(data: GenerateAITemplateRequest): Promise<GeneratedEmailTemplate> {
    const response = await apiClient.post('/api/email-templates/generate-ai', data);
    return response.data.data;
  },
};

