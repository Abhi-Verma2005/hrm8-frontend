/**
 * Regional Sales Service (Frontend)
 * Fetches sales pipeline data for Regional Licensees
 */

import { apiClient } from '../api';

export interface RegionalOpportunity {
  id: string;
  name: string;
  stage: string;
  amount: number;
  probability: number;
  expected_close_date: string;
  sales_agent_id: string; // Added field
  sales_agent?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  company: {
    id: string;
    name: string;
    domain: string;
  };
}

export interface RegionalPipelineStats {
  regionId: string;
  totalPipelineValue: number;
  weightedPipelineValue: number;
  dealCount: number;
  activeAgents: number;
  byStage: Record<string, { count: number; value: number }>;
}

interface OpportunitiesResponse {
  opportunities: RegionalOpportunity[];
}

interface ActivitiesResponse {
  activities: Record<string, unknown>[];
}

export const regionalSalesService = {
  /**
   * Get Opportunities for a region
   */
  getOpportunities: async (regionId: string, filters?: Record<string, string>) => {
    console.log('[regionalSalesService] 📤 Fetching opportunities for region:', regionId, 'filters:', filters);
    // Construct query string manually for GET params
    const params = new URLSearchParams({ regionId, ...filters });
    const response = await apiClient.get<OpportunitiesResponse>(`/api/hrm8/sales/regional/opportunities?${params.toString()}`);

    console.log('[regionalSalesService] 📦 Response structure:', {
      success: response.success,
      dataKeys: response.data ? Object.keys(response.data) : [],
      opportunities: response.data?.opportunities,
    });

    const opportunities = response.data?.opportunities || [];
    console.log('[regionalSalesService] ✅ Returning opportunities:', opportunities.length);

    return opportunities;
  },

  /**
   * Get Pipeline Stats for a region
   */
  getStats: async (regionId: string) => {
    console.log('[regionalSalesService] 📤 Fetching stats for region:', regionId);
    const params = new URLSearchParams({ regionId });
    const response = await apiClient.get<RegionalPipelineStats>(`/api/hrm8/sales/regional/stats?${params.toString()}`);

    console.log('[regionalSalesService] 📊 Stats response:', {
      success: response.success,
      stats: response.data,
    });

    return response.data as RegionalPipelineStats;
  },

  /**
   * Get Recent Activities for a region
   */
  getActivities: async (regionId: string) => {
    console.log('[regionalSalesService] 📤 Fetching activities for region:', regionId);
    const params = new URLSearchParams({ regionId });
    const response = await apiClient.get<ActivitiesResponse>(`/api/hrm8/sales/regional/activities?${params.toString()}`);

    console.log('[regionalSalesService] 📋 Activities response:', {
      success: response.success,
      activities: response.data?.activities,
    });

    return response.data?.activities || [];
  }
};
