/**
 * Consultant Messages Page
 * Inbox view for consultants
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { ConsultantCandidateService } from '@/lib/consultant/consultantCandidateService';
import { ConversationList } from '@/components/messages/ConversationList';
import { MessageList } from '@/components/messages/MessageList';
import { MessageInput } from '@/components/messages/MessageInput';
import { Card } from '@/components/ui/card';
import { Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ConsultantMessagesPage() {
    const { consultant, isAuthenticated } = useConsultantAuth();
    const { conversations, setConversations, messages, setMessages, sendMessage } = useWebSocket();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { id: conversationId } = useParams();

    const loadConversations = async () => {
        setIsLoading(true);
        try {
            // NOTE: We might need to handle 'participants' expansion if not already done by standard ConversationService
            // The ConsultantCandidateService wraps the API which returns Conversation structure
            const data = await ConsultantCandidateService.getConversations();
            setConversations(data);
        } catch (error) {
            console.error('Failed to load conversations:', error);
            toast.error('Failed to load conversations');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadConversations();
        }
    }, [isAuthenticated]);

    // Handle marking read when opening a conversation
    useEffect(() => {
        if (conversationId && isAuthenticated) {
            ConsultantCandidateService.markRead(conversationId).catch(console.error);
            // Also simpler to fetch messages? WebSocket should subscribe automatically if setup correctly.
            // The WebSocketContext typically handles subscription based on auth, but let's check if we need to manually join.
            // Usually 'join_conversation' or similar. 
            // Assuming existing WebSocketContext handles global 'user_id' channel or specific logic.
            // If we need to fetch history explicitly:
            ConsultantCandidateService.getMessages(conversationId).then(history => {
                setMessages(prev => ({
                    ...prev,
                    [conversationId]: history
                }));
            });
        }
    }, [conversationId, isAuthenticated]);

    const currentConversation = conversations.find(c => c.id === conversationId);
    const currentMessages = conversationId ? messages[conversationId] || [] : [];

    return (
        <div className="h-[calc(100vh-64px)] p-6 space-y-6 bg-gradient-to-b from-background via-background to-muted/40">
            <header className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
                    <p className="text-muted-foreground">Chat with your candidates</p>
                </div>
            </header>

            <div className="h-[calc(100vh-180px)] flex rounded-2xl border bg-card shadow-sm overflow-hidden">
                {/* Conversation List Sidebar */}
                <div className="w-full md:w-1/3 lg:w-1/4 border-r bg-muted/20 backdrop-blur-sm flex flex-col">
                    {isLoading ? (
                        <div className="flex items-center justify-center flex-1">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <ConversationList
                            conversations={conversations}
                            currentConversationId={conversationId}
                            currentUserEmail={consultant?.email}
                            messages={messages}
                            className="h-full"
                        />
                    )}
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-muted/30">
                    {conversationId ? (
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="p-4 border-b bg-background/50 backdrop-blur-sm flex justify-between items-center">
                                <div>
                                    <h2 className="font-semibold">
                                        {currentConversation
                                            ? (currentConversation.participants.find(p => p.participantEmail !== consultant?.email)?.displayName || 'Candidate')
                                            : 'Chat'}
                                    </h2>
                                    {currentConversation?.job && (
                                        <p className="text-xs text-muted-foreground">{currentConversation.job.title}</p>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <MessageList
                                messages={currentMessages}
                                currentUserEmail={consultant?.email}
                                className="flex-1"
                            />

                            {/* Input */}
                            <MessageInput
                                conversationId={conversationId}
                                conversationStatus={currentConversation?.status || 'ACTIVE'}
                                disabled={!currentConversation}
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-center p-10">
                            <div className="max-w-md">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                                    <MessageSquare className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                                <p className="text-sm text-muted-foreground">
                                    Choose a candidate from the list to view your conversation history.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
