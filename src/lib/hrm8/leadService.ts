/**
 * Lead Service
 * API client for lead management and assignment
 */

import { apiClient } from '../api';

export interface Lead {
  id: string;
  companyName: string;
  email: string;
  phone?: string;
  website?: string;
  country: string;
  city?: string;
  stateProvince?: string;
  regionId?: string;
  assignedConsultantId?: string;
  assignedAt?: string;
  assignedBy?: string;
  assignmentMode?: 'AUTO' | 'MANUAL';
  assignmentSource?: string;
  createdBy?: string;
  referredBy?: string;
  leadSource: string;
  status: string;
  lossReason?: string;
  lossNotes?: string;
  notes?: string;
  tags: string[];
  validatedBy?: string;
  validatedAt?: string;
  attributionLocked: boolean;
  convertedToCompanyId?: string;
  convertedAt?: string;
  createdAt: string;
  updatedAt: string;
  assignedConsultant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    currentLeads: number;
    maxLeads: number;
  };
  region?: {
    id: string;
    name: string;
    code: string;
  };
  convertedCompany?: {
    id: string;
    name: string;
    domain: string;
  };
}

export interface ConsultantForLeadAssignment {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  regionId: string;
  currentLeads: number;
  maxLeads: number;
  availability: string;
  successRate: number;
  totalRevenue: number;
}

export interface LeadAssignmentInfo {
  lead: Lead;
  assignments: Array<{
    id: string;
    consultantId: string;
    leadId: string;
    assignedAt: string;
    assignedBy?: string;
    status: string;
    assignmentSource?: string;
    consultant: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      currentLeads: number;
      maxLeads: number;
    };
  }>;
  currentAssignment: {
    id: string;
    consultantId: string;
    leadId: string;
    assignedAt: string;
    assignedBy?: string;
    status: string;
    assignmentSource?: string;
    consultant: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      currentLeads: number;
      maxLeads: number;
    };
  } | null;
}

class LeadService {
  private baseUrl = '/api/crm/leads';
  private hrm8BaseUrl = '/api/hrm8/leads';

  /**
   * List all leads (CRM endpoint)
   */
  async list(filters?: {
    assignedConsultantId?: string;
    status?: string;
    attributionStatus?: string;
  }): Promise<{ success: boolean; data?: Lead[]; error?: string }> {
    try {
      const params = new URLSearchParams();
      if (filters?.assignedConsultantId) {
        params.append('assignedConsultantId', filters.assignedConsultantId);
      }
      if (filters?.status) {
        params.append('status', filters.status);
      }
      if (filters?.attributionStatus) {
        params.append('attributionStatus', filters.attributionStatus);
      }

      const response = await apiClient.get<Lead[]>(`${this.baseUrl}?${params.toString()}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch leads',
      };
    }
  }

  /**
   * Get lead by ID
   */
  async getById(id: string): Promise<{ success: boolean; data?: Lead; error?: string }> {
    try {
      const response = await apiClient.get<Lead>(`${this.baseUrl}/${id}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch lead',
      };
    }
  }

  /**
   * Create a new lead
   */
  async create(data: {
    companyName: string;
    email: string;
    phone?: string;
    website?: string;
    country: string;
    city?: string;
    stateProvince?: string;
    regionId?: string;
    leadSource?: string;
    notes?: string;
    tags?: string[];
  }): Promise<{ success: boolean; data?: Lead; error?: string }> {
    try {
      const response = await apiClient.post<Lead>(this.baseUrl, data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create lead',
      };
    }
  }

  /**
   * Update lead status
   */
  async updateStatus(
    id: string,
    status: string,
    lossReason?: string,
    lossNotes?: string
  ): Promise<{ success: boolean; data?: Lead; error?: string }> {
    try {
      const response = await apiClient.patch<Lead>(`${this.baseUrl}/${id}/status`, { 
        status,
        lossReason,
        lossNotes
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update lead status',
      };
    }
  }

  /**
   * Get consultants eligible for lead assignment (HRM8 endpoint)
   */
  async getConsultantsForAssignment(regionId?: string): Promise<{
    success: boolean;
    data?: { consultants: ConsultantForLeadAssignment[] };
    error?: string;
  }> {
    try {
      const params = regionId ? `?regionId=${regionId}` : '';
      const response = await apiClient.get<{ consultants: ConsultantForLeadAssignment[] }>(`${this.hrm8BaseUrl}/consultants-for-assignment${params}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch consultants',
      };
    }
  }

  /**
   * Get lead assignment info (HRM8 endpoint)
   */
  async getAssignmentInfo(id: string): Promise<{
    success: boolean;
    data?: LeadAssignmentInfo;
    error?: string;
  }> {
    try {
      const response = await apiClient.get<LeadAssignmentInfo>(`${this.hrm8BaseUrl}/${id}/assignment`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch assignment info',
      };
    }
  }

  /**
   * Auto-assign lead (HRM8 endpoint)
   */
  async autoAssign(id: string): Promise<{
    success: boolean;
    data?: { lead: Lead; assignment: any; consultantId?: string };
    error?: string;
  }> {
    try {
      const response = await apiClient.post<{ lead: Lead; assignment: any; consultantId?: string }>(`${this.hrm8BaseUrl}/${id}/auto-assign`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to auto-assign lead',
      };
    }
  }

  /**
   * Assign lead to consultant (HRM8 endpoint)
   */
  async assignConsultant(
    id: string,
    consultantId: string,
    assignmentSource?: string
  ): Promise<{
    success: boolean;
    data?: { lead: Lead; assignment: any };
    error?: string;
  }> {
    try {
      const response = await apiClient.post<{ lead: Lead; assignment: any }>(`${this.hrm8BaseUrl}/${id}/assign-consultant`, {
        consultantId,
        assignmentSource,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to assign lead',
      };
    }
  }

  /**
   * Unassign lead (HRM8 endpoint)
   */
  async unassign(id: string): Promise<{
    success: boolean;
    data?: { lead: Lead };
    error?: string;
  }> {
    try {
      const response = await apiClient.post<{ lead: Lead }>(`${this.hrm8BaseUrl}/${id}/unassign`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to unassign lead',
      };
    }
  }

  /**
   * Validate lead attribution (Admin/Licensee Admin only)
   */
  async validate(id: string, regionId: string): Promise<{
    success: boolean;
    data?: Lead;
    error?: string;
  }> {
    try {
      const response = await apiClient.post<Lead>(`${this.baseUrl}/${id}/validate`, { regionId });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to validate attribution',
      };
    }
  }

  /**
   * Override lead attribution (HRM8 Admin only)
   */
  async overrideAttribution(id: string, data: {
    newCreatedBy: string | null;
    newReferredBy: string | null;
    reason: string;
  }): Promise<{
    success: boolean;
    data?: Lead;
    error?: string;
  }> {
    try {
      const response = await apiClient.post<Lead>(`${this.baseUrl}/${id}/override-attribution`, data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to override attribution',
      };
    }
  }

  /**
   * Convert lead to company
   */
  async convert(id: string): Promise<{
    success: boolean;
    data?: { companyId: string; contactId: string; opportunityId: string };
    error?: string;
  }> {
    try {
      const response = await apiClient.post<{ companyId: string; contactId: string; opportunityId: string }>(
        `${this.baseUrl}/${id}/convert`
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to convert lead',
      };
    }
  }
}

export const leadService = new LeadService();





