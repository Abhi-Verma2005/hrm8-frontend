/**
 * Consultant 360 API Service
 * Handles all API calls for Consultant 360 unified dashboard
 */

import { api } from '../api';

// ==================== Types ====================

export interface UnifiedDashboardStats {
    totalEarnings: number;
    availableBalance: number;
    pendingBalance: number;
    activeJobs: number;
    activeLeads: number;
    conversionRate: number;
    totalPlacements: number;
    totalSubscriptionSales: number;
    recruiterEarnings: number;
    salesEarnings: number;
}

export interface ActiveJob {
    id: string;
    title: string;
    companyName: string;
    status: string;
    location: string;
    assignedAt: string;
}

export interface ActiveLead {
    id: string;
    companyName: string;
    contactEmail: string;
    status: string;
    source: string;
    createdAt: string;
}

export interface MonthlyTrendItem {
    month: string;
    year: number;
    recruiterEarnings: number;
    salesEarnings: number;
    total: number;
}

export interface Commission {
    id: string;
    consultantId: string;
    regionId: string;
    jobId?: string;
    type: 'PLACEMENT' | 'SUBSCRIPTION_SALE' | 'RECRUITMENT_SERVICE' | 'CUSTOM';
    amount: number;
    rate?: number;
    description?: string;
    status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED';
    confirmedAt?: string;
    paidAt?: string;
    paymentReference?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface RecruiterEarnings {
    totalPlacements: number;
    totalRevenue: number;
    pendingCommissions: number;
    confirmedCommissions: number;
    paidCommissions: number;
    commissions: Commission[];
}

export interface SalesEarnings {
    totalSubscriptionSales: number;
    totalServiceFees: number;
    pendingCommissions: number;
    confirmedCommissions: number;
    paidCommissions: number;
    commissions: Commission[];
}

export interface CombinedBalance {
    totalEarned: number;
    availableBalance: number;
    pendingBalance: number;
    totalWithdrawn: number;
    availableCommissions: Array<{
        id: string;
        amount: number;
        type: 'PLACEMENT' | 'SUBSCRIPTION_SALE' | 'RECRUITMENT_SERVICE' | 'CUSTOM';
        description: string;
        createdAt: string;
    }>;
}

export interface UnifiedEarnings {
    recruiterEarnings: RecruiterEarnings;
    salesEarnings: SalesEarnings;
    combined: CombinedBalance;
    recentCommissions: Commission[];
    monthlyTrend: MonthlyTrendItem[];
}

export interface DashboardData {
    stats: UnifiedDashboardStats;
    activeJobs: ActiveJob[];
    activeLeads: ActiveLead[];
    recentCommissions: Commission[];
    monthlyTrend: MonthlyTrendItem[];
}

export interface Withdrawal {
    id: string;
    consultantId: string;
    amount: number;
    status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
    paymentMethod: string;
    paymentDetails?: Record<string, unknown>;
    commissionIds: string[];
    processedBy?: string;
    processedAt?: string;
    paymentReference?: string;
    adminNotes?: string;
    rejectionReason?: string;
    rejectedAt?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface WithdrawalRequest {
    amount: number;
    paymentMethod: string;
    paymentDetails?: Record<string, unknown>;
    commissionIds: string[];
    notes?: string;
}

export interface StripeAccountStatus {
    hasAccount: boolean;
    accountId?: string;
    payoutsEnabled: boolean;
    chargesEnabled: boolean;
    detailsSubmitted: boolean;
    requiresAction: boolean;
}

// ==================== API Functions ====================

export const consultant360Service = {
    /**
     * Get unified dashboard data
     */
    async getDashboard(): Promise<{ success: boolean; data?: DashboardData; error?: string }> {
        try {
            const response = await api.get('/consultant360/dashboard');
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to fetch dashboard',
            };
        }
    },

    /**
     * Get unified earnings breakdown
     */
    async getEarnings(): Promise<{ success: boolean; data?: UnifiedEarnings; error?: string }> {
        try {
            const response = await api.get('/consultant360/earnings');
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to fetch earnings',
            };
        }
    },

    /**
     * Get commissions with optional filters
     */
    async getCommissions(filters?: {
        type?: 'RECRUITER' | 'SALES' | 'ALL';
        status?: 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED';
        limit?: number;
        offset?: number;
    }): Promise<{
        success: boolean;
        data?: { commissions: Commission[]; total: number };
        error?: string;
    }> {
        try {
            const response = await api.get('/consultant360/commissions', { params: filters });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to fetch commissions',
            };
        }
    },

    /**
     * Get unified withdrawal balance
     */
    async getBalance(): Promise<{ success: boolean; data?: { balance: CombinedBalance }; error?: string }> {
        try {
            const response = await api.get('/consultant360/balance');
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to fetch balance',
            };
        }
    },

    /**
     * Request withdrawal
     */
    async requestWithdrawal(data: WithdrawalRequest): Promise<{
        success: boolean;
        data?: { withdrawal: Withdrawal };
        error?: string;
    }> {
        try {
            const response = await api.post('/consultant360/withdraw', data);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to request withdrawal',
            };
        }
    },

    /**
     * Get withdrawal history
     */
    async getWithdrawals(status?: string): Promise<{
        success: boolean;
        data?: { withdrawals: Withdrawal[] };
        error?: string;
    }> {
        try {
            const response = await api.get('/consultant360/withdrawals', {
                params: status ? { status } : undefined,
            });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to fetch withdrawals',
            };
        }
    },

    /**
     * Cancel a pending withdrawal
     */
    async cancelWithdrawal(id: string): Promise<{ success: boolean; error?: string }> {
        try {
            const response = await api.post(`/consultant360/withdrawals/${id}/cancel`);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to cancel withdrawal',
            };
        }
    },

    /**
     * Execute withdrawal (Stripe payout)
     */
    async executeWithdrawal(id: string): Promise<{
        success: boolean;
        data?: { transfer: unknown };
        error?: string;
    }> {
        try {
            const response = await api.post(`/consultant360/withdrawals/${id}/execute`);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to execute withdrawal',
            };
        }
    },

    /**
     * Start Stripe Connect onboarding
     */
    async stripeOnboard(): Promise<{
        success: boolean;
        data?: { accountLink: { url: string } };
        error?: string;
    }> {
        try {
            const response = await api.post('/consultant360/stripe/onboard');
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to start onboarding',
            };
        }
    },

    /**
     * Get Stripe account status
     */
    async getStripeStatus(): Promise<{
        success: boolean;
        data?: StripeAccountStatus;
        error?: string;
    }> {
        try {
            const response = await api.get('/consultant360/stripe/status');
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to get Stripe status',
            };
        }
    },

    /**
     * Get Stripe dashboard login link
     */
    async getStripeLoginLink(): Promise<{
        success: boolean;
        data?: { url: string };
        error?: string;
    }> {
        try {
            const response = await api.post('/consultant360/stripe/login-link');
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to get login link',
            };
        }
    },
};
