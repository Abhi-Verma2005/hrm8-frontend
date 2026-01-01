import { apiClient } from '@/lib/api';
import { Company } from '@/types/company';

// Types
export interface SalesDashboardStats {
  commissions: {
    total: number;
    pending: number;
    paid: number;
  };
  leads: {
    total: number;
    converted: number;
    conversionRate: number;
  };
  companies: {
    total: number;
    activeSubscriptions: number;
  };
  recentActivity: Array<{
    type: 'COMMISSION' | 'LEAD';
    description: string;
    date: string;
    amount?: number;
    status: string;
  }>;
}

export interface Lead {
  id: string;
  company_name: string;
  email: string;
  country: string;
  website?: string;
  phone?: string;
  status: string;
  created_at: string;
}

export interface Commission {
  id: string;
  amount: number;
  status: string;
  description: string;
  type: string;
  createdAt: string;
  paidAt?: string;
}

export interface CreateLeadData {
  companyName: string;
  email: string;
  country: string;
  website?: string;
  phone?: string;
}

export interface ConvertLeadData {
  adminFirstName: string;
  adminLastName: string;
  password: string;
  acceptTerms: boolean;
}

export interface Opportunity {
  id: string;
  name: string;
  stage: string;
  amount: number;
  probability: number;
  expected_close_date?: string;
  sales_agent_id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  company?: {
    id: string;
    name: string;
    domain: string;
  };
}

export interface PipelineStats {
  totalPipelineValue: number;
  weightedPipelineValue: number;
  dealCount: number;
  byStage: Record<string, { count: number; value: number }>;
}

export const salesService = {
  // ... existing methods ...

  // Opportunities
  getOpportunities: async (filters?: { stage?: string }) => {
    console.log('[salesService] 📤 Fetching opportunities with filters:', filters);
    const params = new URLSearchParams(filters);
    const url = `/api/sales/opportunities?${params.toString()}`;
    console.log('[salesService] 🌐 Request URL:', url);

    const response = await apiClient.get<{ opportunities: Opportunity[] }>(url);

    console.log('[salesService] ✅ Opportunities response:', {
      success: response.success,
      dataKeys: response.data ? Object.keys(response.data) : [],
      opportunitiesCount: response.data?.opportunities?.length || 0,
      firstOpportunity: response.data?.opportunities?.[0],
    });

    return response;
  },

  getPipelineStats: async () => {
    console.log('[salesService] 📤 Fetching pipeline stats');
    const response = await apiClient.get<PipelineStats>('/api/sales/opportunities/stats');

    console.log('[salesService] ✅ Pipeline stats response:', {
      success: response.success,
      stats: response.data,
    });

    return response;
  },

  createOpportunity: async (data: Partial<Opportunity>) => {
    return await apiClient.post<{ opportunity: Opportunity }>('/api/sales/opportunities', data);
  },

  updateOpportunity: async (id: string, data: Partial<Opportunity>) => {
    return await apiClient.put<{ opportunity: Opportunity }>(`/api/sales/opportunities/${id}`, data);
  },

  // Dashboard
  getDashboardStats: async () => {
    return await apiClient.get<{ data: SalesDashboardStats }>('/api/sales/dashboard/stats');
  },

  // Leads
  getLeads: async () => {
    return await apiClient.get<{ leads: Lead[] }>('/api/sales/leads');
  },

  createLead: async (data: CreateLeadData) => {
    return await apiClient.post<{ lead: Lead }>('/api/sales/leads', data);
  },

  convertLead: async (leadId: string, data: ConvertLeadData) => {
    return await apiClient.post<{ company: Company }>(`/api/sales/leads/${leadId}/convert`, data);
  },

  // Commissions
  getCommissions: async () => {
    return await apiClient.get<{ commissions: Commission[] }>('/api/sales/commissions');
  },
  
  // Attributed Companies
  getCompanies: async () => {
    return await apiClient.get<{ companies: any[] }>('/api/sales/companies');
  }
};
