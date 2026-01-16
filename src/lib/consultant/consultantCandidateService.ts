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
        const { data } = await apiClient.get<CandidatePipelineItem[]>(`/api/consultant/jobs/${jobId}/candidates`);
        return data || [];
    },

    /**
     * Update application status
     */
    updateStatus: async (applicationId: string, status: string, stage?: string): Promise<any> => {
        const { data } = await apiClient.post<any>(`/api/consultant/candidates/${applicationId}/status`, { status, stage });
        return data;
    },

    /**
     * Add operational note
     */
    addNote: async (applicationId: string, note: string): Promise<void> => {
        await apiClient.post(`/api/consultant/candidates/${applicationId}/note`, { note });
    },

    /**
     * List conversations
     */
    getConversations: async (): Promise<ConversationData[]> => {
        const { data } = await apiClient.get<ConversationData[]>('/api/consultant/messages');
        return data || [];
    },

    /**
     * Get messages for a conversation
     */
    getMessages: async (conversationId: string, limit = 50, cursor?: string): Promise<MessageData[]> => {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (cursor) params.append('cursor', cursor);

        const { data } = await apiClient.get<MessageData[]>(`/api/consultant/messages/${conversationId}?${params}`);
        return data || [];
    },

    /**
     * Send a message
     */
    sendMessage: async (conversationId: string, content: string, attachments?: any[]): Promise<MessageData> => {
        const { data } = await apiClient.post<MessageData>(`/api/consultant/messages/${conversationId}`, {
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
        await apiClient.put(`/api/consultant/messages/${conversationId}/read`);
    },

    /**
     * Move application to a specific round (for drag-drop pipeline)
     */
    moveToRound: async (applicationId: string, roundId: string): Promise<any> => {
        const { data } = await apiClient.post<any>(`/api/consultant/candidates/${applicationId}/move-to-round`, { roundId });
        return data;
    },

    /**
     * Update application stage (for drag-drop pipeline)
     */
    updateStage: async (applicationId: string, stage: string): Promise<any> => {
        const { data } = await apiClient.post<any>(`/api/consultant/candidates/${applicationId}/stage`, { stage });
        return data;
    },

    /**
     * Get job applications in ApplicationPipeline-compatible format
     */
    getJobApplications: async (jobId: string): Promise<{ success: boolean; data: { applications: any[] } }> => {
        const { data } = await apiClient.get<CandidatePipelineItem[]>(`/api/consultant/jobs/${jobId}/candidates`);
        const applications = (data || []).map((app: CandidatePipelineItem) => ({
            id: app.id,
            candidateId: app.candidate.id,
            candidateName: `${app.candidate.first_name} ${app.candidate.last_name}`,
            candidateEmail: app.candidate.email,
            candidatePhoto: app.candidate.photo,
            jobId,
            appliedDate: new Date(app.applied_date),
            status: app.status.toLowerCase(),
            stage: app.stage,
            resumeUrl: app.candidate.resume_url,
            linkedInUrl: app.candidate.linked_in_url,
            score: app.score,
            notes: [],
            activities: [],
            interviews: [],
            tags: [],
            shortlisted: false,
            manuallyAdded: false,
        }));
        return { success: true, data: { applications } };
    },

    /**
     * Get job rounds for pipeline columns
     */
    getJobRounds: async (jobId: string): Promise<{ success: boolean; data: { rounds: any[] } }> => {
        const response = await apiClient.get<{ rounds: any[] }>(`/api/consultant/jobs/${jobId}/rounds`);
        return { success: response.success, data: { rounds: response.data?.rounds || [] } };
    }
};
