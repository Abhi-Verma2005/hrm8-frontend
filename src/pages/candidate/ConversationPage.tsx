/**
 * Candidate Conversation Page
 * Individual conversation view for candidates
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCandidateAuth } from '@/contexts/CandidateAuthContext';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { messagingService } from '@/lib/messagingService';
import { ConversationHeader } from '@/components/messages/ConversationHeader';
import { MessageList } from '@/components/messages/MessageList';
import { MessageInput } from '@/components/messages/MessageInput';
import { ConversationData } from '@/types/websocket';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CandidatePageLayout } from '@/components/layouts/CandidatePageLayout';
import { AtsPageHeader } from '@/components/layouts/AtsPageHeader';

export default function CandidateConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { candidate } = useCandidateAuth();
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
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">Conversation not found</p>
          <Button
            variant="outline"
            onClick={() => navigate('/candidate/messages')}
            className="mt-4"
          >
            Back to Messages
          </Button>
        </div>
      </div>
    );
  }

  const conversationMessages = messages[conversationId] || [];

  return (
    <CandidatePageLayout>
      <div className="p-6 space-y-6 h-full">
        <AtsPageHeader
          title="Messages"
          subtitle={conversation.candidate
            ? `Conversation with ${conversation.candidate.firstName} ${conversation.candidate.lastName}`
            : 'Conversation'}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/candidate/messages')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </AtsPageHeader>
      <div className="h-[calc(100vh-200px)] flex flex-col border rounded-lg overflow-hidden">
        <div className="border-b bg-card">
          <ConversationHeader
            conversation={conversation}
            currentUserEmail={candidate?.email}
          />
        </div>
        <MessageList
          messages={conversationMessages}
          currentUserEmail={candidate?.email}
          className="flex-1"
        />
        <MessageInput
          conversationId={conversationId}
          disabled={!isConnected}
        />
      </div>
      </div>
    </CandidatePageLayout>
  );
}

