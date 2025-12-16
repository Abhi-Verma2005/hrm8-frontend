/**
 * Admin/User Conversation Page
 * Individual conversation view for admins/users
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { messagingService } from '@/lib/messagingService';
import { ConversationHeader } from '@/components/messages/ConversationHeader';
import { MessageList } from '@/components/messages/MessageList';
import { MessageInput } from '@/components/messages/MessageInput';
import { ConversationData } from '@/types/websocket';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const { messages, joinConversation, isConnected } = useWebSocket();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<ConversationData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (conversationId) {
      loadConversation();
      joinConversation(conversationId);
    }
  }, [conversationId, joinConversation]);

  const loadConversation = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    try {
      const response = await messagingService.getConversation(conversationId);
      if (response.success && response.data) {
        setConversation(response.data);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!conversationId) {
    return null;
  }

  if (isLoading) {
    return (
      <DashboardPageLayout
        title="Loading..."
        breadcrumbs={[
          { label: 'Home', href: '/home' },
          { label: 'Messages', href: '/messages' },
          { label: 'Conversation', href: '#' },
        ]}
      >
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardPageLayout>
    );
  }

  if (!conversation) {
    return (
      <DashboardPageLayout
        title="Conversation Not Found"
        breadcrumbs={[
          { label: 'Home', href: '/home' },
          { label: 'Messages', href: '/messages' },
        ]}
      >
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Conversation not found</p>
            <Button
              variant="outline"
              onClick={() => navigate('/messages')}
            >
              Back to Messages
            </Button>
          </div>
        </div>
      </DashboardPageLayout>
    );
  }

  const conversationMessages = messages[conversationId] || [];

  return (
    <DashboardPageLayout
      title="Messages"
      breadcrumbs={[
        { label: 'Home', href: '/home' },
        { label: 'Messages', href: '/messages' },
        {
          label: conversation.candidate
            ? `${conversation.candidate.firstName} ${conversation.candidate.lastName}`
            : 'Conversation',
          href: '#',
        },
      ]}
    >
      <div className="h-[calc(100vh-200px)] flex flex-col border rounded-lg overflow-hidden">
        <div className="border-b bg-card">
          <div className="flex items-center gap-2 p-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/messages')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <ConversationHeader
            conversation={conversation}
            currentUserEmail={user?.email}
          />
        </div>
        <MessageList
          messages={conversationMessages}
          currentUserEmail={user?.email}
          className="flex-1"
        />
        <MessageInput
          conversationId={conversationId}
          disabled={!isConnected}
        />
      </div>
    </DashboardPageLayout>
  );
}




































