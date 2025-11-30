/**
 * WebSocket Context
 * Manages WebSocket connection with exponential backoff reconnection
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import {
  ConnectionState,
  WSMessage,
  WSMessageType,
  MessageData,
  ConversationData,
  OnlineUser,
  WebSocketContextType,
} from '@/types/websocket';

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

interface WebSocketProviderProps {
  children: ReactNode;
  isAuthenticated: boolean;
  userEmail?: string;
}

// WebSocket URL construction
const getWebSocketUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return apiUrl.replace(/^http/, 'ws');
};

// Exponential backoff configuration
const RECONNECT_CONFIG = {
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  multiplier: 2,
  jitter: 0.1, // 10% jitter
};

export function WebSocketProvider({
  children,
  isAuthenticated,
  userEmail,
}: WebSocketProviderProps) {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>('disconnected');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messages, setMessages] = useState<Record<string, MessageData[]>>({});
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptRef = useRef(0);
  const shouldReconnectRef = useRef(true);
  const messageHandlersRef = useRef<
    Map<WSMessageType, (payload: any) => void>
  >(new Map());

  const isConnected = connectionState === 'connected';

  // Calculate exponential backoff delay
  const getReconnectDelay = useCallback((attempt: number): number => {
    const baseDelay = Math.min(
      RECONNECT_CONFIG.initialDelay *
        Math.pow(RECONNECT_CONFIG.multiplier, attempt),
      RECONNECT_CONFIG.maxDelay
    );
    const jitterAmount = baseDelay * RECONNECT_CONFIG.jitter;
    const jitter = (Math.random() - 0.5) * 2 * jitterAmount;
    return baseDelay + jitter;
  }, []);

  // Handle incoming WebSocket messages
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: WSMessage = JSON.parse(event.data);
      console.log('📨 WebSocket message received:', message.type, message.payload);

      // Call registered handlers
      const handler = messageHandlersRef.current.get(message.type);
      if (handler) {
        handler(message.payload);
      }

      // Handle specific message types
      switch (message.type) {
        case 'connection_established':
          console.log('✅ WebSocket connection established');
          break;

        case 'authentication_success':
          console.log('✅ WebSocket authentication successful');
          setConnectionState('connected');
          reconnectAttemptRef.current = 0; // Reset reconnect attempts
          break;

        case 'online_users_list':
          setOnlineUsers(message.payload.users || []);
          break;

        case 'user_online':
          setOnlineUsers((prev) => {
            const exists = prev.find(
              (u) => u.userEmail === message.payload.userEmail
            );
            if (exists) return prev;
            return [
              ...prev,
              {
                userEmail: message.payload.userEmail,
                userName: message.payload.userName,
              },
            ];
          });
          break;

        case 'user_offline':
          setOnlineUsers((prev) =>
            prev.filter(
              (u) => u.userEmail !== message.payload.userEmail
            )
          );
          break;

        case 'messages_loaded':
          const { conversationId, messages: loadedMessages } = message.payload;
          setMessages((prev) => ({
            ...prev,
            [conversationId]: loadedMessages,
          }));
          break;

        case 'new_message':
        case 'message_sent':
          const newMessage = message.payload as MessageData;
          setMessages((prev) => {
            const conversationMessages = prev[newMessage.conversationId] || [];
            // Check if message already exists
            const exists = conversationMessages.some((m) => m.id === newMessage.id);
            if (exists) return prev;
            return {
              ...prev,
              [newMessage.conversationId]: [...conversationMessages, newMessage],
            };
          });
          break;

        case 'error':
          console.error('❌ WebSocket error:', message.payload);
          break;

        default:
          console.log('📨 Unhandled message type:', message.type);
      }
    } catch (error) {
      console.error('❌ Error parsing WebSocket message:', error);
    }
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!isAuthenticated || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    if (wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    try {
      const wsUrl = getWebSocketUrl();
      console.log('🔌 Connecting to WebSocket:', wsUrl);
      setConnectionState('connecting');

      // WebSocket automatically includes cookies for same-origin requests
      // No need to manually set credentials - browser handles it
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket opened');
        // Authentication happens automatically via cookies
      };

      ws.onmessage = handleMessage;

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionState('error');
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket closed:', event.code, event.reason);
        setConnectionState('disconnected');
        wsRef.current = null;

        // Attempt to reconnect if we should
        if (shouldReconnectRef.current && isAuthenticated) {
          const delay = getReconnectDelay(reconnectAttemptRef.current);
          console.log(
            `🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttemptRef.current + 1})`
          );
          setConnectionState('reconnecting');
          reconnectAttemptRef.current += 1;

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };
    } catch (error) {
      console.error('❌ Error creating WebSocket:', error);
      setConnectionState('error');
    }
  }, [isAuthenticated, handleMessage, getReconnectDelay]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionState('disconnected');
    reconnectAttemptRef.current = 0;
  }, []);

  // Send message through WebSocket
  const sendMessage = useCallback(
    (type: WSMessageType, payload: any) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.warn('⚠️ WebSocket not connected, cannot send message');
        return;
      }

      const message: WSMessage = { type, payload };
      wsRef.current.send(JSON.stringify(message));
      console.log('📤 WebSocket message sent:', type, payload);
    },
    []
  );

  // Join a conversation
  const joinConversation = useCallback(
    (conversationId: string) => {
      setCurrentConversationId(conversationId);
      sendMessage('join_conversation', { conversationId });
    },
    [sendMessage]
  );

  // Add message to state (for external updates)
  const addMessage = useCallback(
    (conversationId: string, message: MessageData) => {
      setMessages((prev) => {
        const conversationMessages = prev[conversationId] || [];
        const exists = conversationMessages.some((m) => m.id === message.id);
        if (exists) return prev;
        return {
          ...prev,
          [conversationId]: [...conversationMessages, message],
        };
      });
    },
    []
  );

  // Register message handler
  const onMessage = useCallback(
    (type: WSMessageType, handler: (payload: any) => void) => {
      messageHandlersRef.current.set(type, handler);
      return () => {
        messageHandlersRef.current.delete(type);
      };
    },
    []
  );

  // Connect/disconnect based on authentication state
  useEffect(() => {
    if (isAuthenticated) {
      shouldReconnectRef.current = true;
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const value: WebSocketContextType = {
    connectionState,
    isConnected,
    sendMessage,
    joinConversation,
    currentConversationId,
    onlineUsers,
    messages,
    conversations,
    setConversations,
    addMessage,
    onMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}

