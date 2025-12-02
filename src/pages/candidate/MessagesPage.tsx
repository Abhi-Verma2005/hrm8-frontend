/**
 * Candidate Messages Page
 * List view of all conversations for candidates
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCandidateAuth } from '@/contexts/CandidateAuthContext';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { messagingService } from '@/lib/messagingService';
import { ConversationList } from '@/components/messages/ConversationList';
import { CandidatePageLayout } from '@/components/layouts/CandidatePageLayout';
import { Card } from '@/components/ui/card';
import { Loader2, MessageSquare } from 'lucide-react';

export default function CandidateMessagesPage() {
  const { candidate, isAuthenticated } = useCandidateAuth();
  const { conversations, setConversations, messages } = useWebSocket();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <CandidatePageLayout
        title="Messages"
        subtitle="Loading..."
      >
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </CandidatePageLayout>
    );
  }

  return (
    <CandidatePageLayout
      title="Messages"
      subtitle="Communicate with recruiters about your applications"
    >
      <div className="p-6 h-full">
      <div className="h-[calc(100vh-200px)] flex border rounded-lg overflow-hidden">
        <div className="w-full md:w-1/3 lg:w-1/4 border-r bg-card">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              currentConversationId={null}
              currentUserEmail={candidate?.email}
              messages={messages}
            />
          )}
        </div>
        <div className="flex-1 flex items-center justify-center bg-muted/30">
          <Card className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
            <p className="text-sm text-muted-foreground">
              Select a conversation from the list to start messaging
            </p>
          </Card>
        </div>
      </div>
      </div>
    </CandidatePageLayout>
  );
}

