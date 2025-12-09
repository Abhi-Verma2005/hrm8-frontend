/**
 * Messaging Service
 * Handles API calls for conversations and messages
 */

import { apiClient } from './api';
import { ConversationData, MessageData } from '@/types/websocket';

export interface GetConversationsResponse {
  conversations: ConversationData[];
}

export interface GetConversationResponse {
  conversation: ConversationData;
}

export interface GetMessagesResponse {
  messages: MessageData[];
}

class MessagingService {
  /**
   * Get all conversations for the current user
   */
  async getConversations(): Promise<{
    success: boolean;
    data?: ConversationData[];
    error?: string;
  }> {
    try {
      const response = await apiClient.get<GetConversationsResponse>(
        '/api/conversations'
      );
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.conversations,
        };
      }
      return {
        success: false,
        error: response.error || 'Failed to fetch conversations',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Get a specific conversation by ID
   */
  async getConversation(
    conversationId: string
  ): Promise<{
    success: boolean;
    data?: ConversationData;
    error?: string;
  }> {
    try {
      const response = await apiClient.get<GetConversationResponse>(
        `/api/conversations/${conversationId}`
      );
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.conversation,
        };
      }
      return {
        success: false,
        error: response.error || 'Failed to fetch conversation',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(
    conversationId: string
  ): Promise<{
    success: boolean;
    data?: MessageData[];
    error?: string;
  }> {
    try {
      const response = await apiClient.get<GetMessagesResponse>(
        `/api/conversations/${conversationId}/messages`
      );
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.messages,
        };
      }
      return {
        success: false,
        error: response.error || 'Failed to fetch messages',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Get conversation by job and candidate (for candidates)
   */
  async getConversationByJobAndCandidate(
    jobId: string,
    candidateId: string
  ): Promise<{
    success: boolean;
    data?: ConversationData;
    error?: string;
  }> {
    try {
      const response = await apiClient.get<GetConversationResponse>(
        `/api/conversations/job/${jobId}/candidate/${candidateId}`
      );
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.conversation,
        };
      }
      return {
        success: false,
        error: response.error || 'Failed to fetch conversation',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }
}

export const messagingService = new MessagingService();

































