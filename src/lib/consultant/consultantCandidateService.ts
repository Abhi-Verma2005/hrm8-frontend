import { apiClient } from '../api';
import { ConversationData, MessageData } from '@/types/websocket';

export interface CandidatePipelineItem {
    id: string; // Application ID
    status: string;
    stage: string;
    applied_date: string;
    score?: number;
    recruiter_notes?: string;
    candidate: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        photo?: string;
        resume_url?: string;
        linked_in_url?: string;
    };
    video_interview?: {
        status: string;
    }[];
}

export const ConsultantCandidateService = {
    /**
     * Fetch candidate pipeline for a specific job
     */
    getPipeline: async (jobId: string): Promise<CandidatePipelineItem[]> => {
        const { data } = await apiClient.get<CandidatePipelineItem[]>(`/consultant/jobs/${jobId}/candidates`);
        return data || [];
    },

    /**
     * Update application status
     */
    updateStatus: async (applicationId: string, status: string, stage?: string): Promise<any> => {
        const { data } = await apiClient.post<any>(`/consultant/candidates/${applicationId}/status`, { status, stage });
        return data;
    },

    /**
     * Add operational note
     */
    addNote: async (applicationId: string, note: string): Promise<void> => {
        await apiClient.post(`/consultant/candidates/${applicationId}/note`, { note });
    },

    /**
     * List conversations
     */
    getConversations: async (): Promise<ConversationData[]> => {
        const { data } = await apiClient.get<ConversationData[]>('/consultant/messages');
        return data || [];
    },

    /**
     * Get messages for a conversation
     */
    getMessages: async (conversationId: string, limit = 50, cursor?: string): Promise<MessageData[]> => {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (cursor) params.append('cursor', cursor);

        const { data } = await apiClient.get<MessageData[]>(`/consultant/messages/${conversationId}?${params}`);
        return data || [];
    },

    /**
     * Send a message
     */
    sendMessage: async (conversationId: string, content: string, attachments?: any[]): Promise<MessageData> => {
        const { data } = await apiClient.post<MessageData>(`/consultant/messages/${conversationId}`, {
            content,
            attachments
        });
        // data will be the Message object.
        if (!data) throw new Error('Failed to send message');
        return data;
    },

    /**
     * Mark conversation as read
     */
    markRead: async (conversationId: string): Promise<void> => {
        await apiClient.put(`/consultant/messages/${conversationId}/read`);
    }
};
