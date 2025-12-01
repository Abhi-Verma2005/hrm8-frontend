/**
 * Admin/User Messages Page
 * List view of all conversations for admins/users
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { messagingService } from '@/lib/messagingService';
import { ConversationList } from '@/components/messages/ConversationList';
import { Card } from '@/components/ui/card';
import { Loader2, MessageSquare } from 'lucide-react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';

export default function MessagesPage() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { user, isAuthenticated } = useAuth();
  const { conversations, setConversations, messages, joinConversation } =
    useWebSocket();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadConversations();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (conversationId) {
      joinConversation(conversationId);
    }
  }, [conversationId, joinConversation]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const response = await messagingService.getConversations();
      if (response.success && response.data) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardPageLayout
      title="Messages"
      breadcrumbs={[
        { label: 'Home', href: '/home' },
        { label: 'Messages', href: '/messages' },
      ]}
    >
      <div className="h-[calc(100vh-200px)] flex border rounded-lg overflow-hidden">
        <div className="w-full md:w-1/3 lg:w-1/4 border-r bg-card">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              currentConversationId={conversationId || null}
              currentUserEmail={user?.email}
              messages={messages}
            />
          )}
        </div>
        {conversationId ? (
          <div className="flex-1">
            {/* Conversation will be shown via route */}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/30">
            <Card className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
              <p className="text-sm text-muted-foreground">
                Select a conversation from the list to start messaging
              </p>
            </Card>
          </div>
        )}
      </div>
    </DashboardPageLayout>
  );
}












