/**
 * WebSocket Type Definitions
 * Matches backend WebSocket message types and structures
 */

export type ConnectionState =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting'
  | 'error';

export type WSMessageType =
  | 'authenticate'
  | 'join_conversation'
  | 'authentication_success'
  | 'send_message'
  | 'user_online'
  | 'user_offline'
  | 'connection_established'
  | 'messages_loaded'
  | 'new_message'
  | 'message_sent'
  | 'user_joined'
  | 'user_left'
  | 'online_users_list'
  | 'error';

export type MessageSenderType = 'USER' | 'CANDIDATE' | 'SYSTEM';
export type MessageType = 'TEXT' | 'SYSTEM' | 'APPLICATION_SUBMITTED';

export interface WSMessage {
  type: WSMessageType;
  payload: any;
}

export interface OnlineUser {
  userEmail: string;
  userName: string;
}

export interface MessageData {
  id: string;
  conversationId: string;
  senderEmail: string;
  senderType: MessageSenderType;
  senderId?: string;
  content: string;
  type: MessageType;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  isOwn?: boolean;
}

export interface ConversationData {
  id: string;
  jobId: string;
  candidateId: string;
  participants: string[];
  lastMessageId?: string;
  createdAt: string;
  updatedAt: string;
  job?: {
    id: string;
    title: string;
  };
  candidate?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  lastMessage?: MessageData;
}

export interface AuthenticationSuccessPayload {
  userEmail: string;
  userName: string;
  userType: 'USER' | 'CANDIDATE';
  message: string;
}

export interface MessagesLoadedPayload {
  conversationId: string;
  messages: MessageData[];
}

export interface NewMessagePayload extends MessageData {
  isOwn: boolean;
}

export interface JoinConversationPayload {
  conversationId: string;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
}

export interface ErrorPayload {
  message: string;
  code: number;
}

export interface WebSocketContextType {
  connectionState: ConnectionState;
  isConnected: boolean;
  sendMessage: (type: WSMessageType, payload: any) => void;
  joinConversation: (conversationId: string) => void;
  currentConversationId: string | null;
  onlineUsers: OnlineUser[];
  messages: Record<string, MessageData[]>;
  conversations: ConversationData[];
  setConversations: (conversations: ConversationData[]) => void;
  addMessage: (conversationId: string, message: MessageData) => void;
  onMessage?: (type: WSMessageType, handler: (payload: any) => void) => () => void;
}

