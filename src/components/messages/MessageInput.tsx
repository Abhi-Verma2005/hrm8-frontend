/**
 * Message Input Component
 * Input field for sending messages in a conversation
 */

import { useState, KeyboardEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send } from 'lucide-react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api';

interface MessageInputProps {
  conversationId: string;
  conversationStatus?: 'ACTIVE' | 'ARCHIVED' | 'CLOSED';
  disabled?: boolean;
  className?: string;
  isMarkingRead?: boolean;
}

export function MessageInput({
  conversationId,
  conversationStatus = 'ACTIVE',
  disabled = false,
  className,
  isMarkingRead = false,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { sendMessage, isConnected } = useWebSocket();

  const isArchivedOrClosed = conversationStatus === 'ARCHIVED' || conversationStatus === 'CLOSED';
  const isInputDisabled = disabled || !isConnected || isArchivedOrClosed;

  const handleSend = () => {
    if (!message.trim() || !isConnected || disabled || isArchivedOrClosed) return;

    sendMessage('send_message', {
      conversationId,
      content: message.trim(),
    });

    setMessage('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', conversationId);
      // Reuse candidate documents upload? If dedicated endpoint exists, adjust here.
      // For now, send a message with a file link by first uploading via documents endpoint.
      const uploadRes = await apiClient.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (uploadRes.success && uploadRes.data?.url) {
        sendMessage('send_message', {
          conversationId,
          content: uploadRes.data.url,
        });
      }
    } catch (error) {
      console.error('File upload failed', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDisabled = disabled || !isConnected || (!message.trim() && !uploading);

  return (
    <div className={cn('flex items-end gap-3 p-4 border-t bg-card/70 backdrop-blur-sm', className)}>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isInputDisabled || uploading}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-[52px] w-[52px] shrink-0 rounded-xl"
        onClick={() => fileInputRef.current?.click()}
        disabled={isInputDisabled || uploading}
      >
        <Paperclip className="h-5 w-5" />
      </Button>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          isArchivedOrClosed
            ? `This conversation is ${conversationStatus.toLowerCase()}. You cannot send messages.`
            : isConnected
            ? 'Type a message... (Press Enter to send, Shift+Enter for new line)'
            : 'Connecting...'
        }
        disabled={isInputDisabled}
        rows={1}
        className="min-h-[52px] max-h-[140px] resize-none rounded-xl bg-muted/40 border-border/60 focus-visible:ring-2 focus-visible:ring-primary"
      />
      <Button
        onClick={handleSend}
        disabled={isDisabled || isArchivedOrClosed}
        size="icon"
        className="h-[52px] w-[52px] shrink-0 rounded-xl"
      >
        <Send className="h-5 w-5" />
      </Button>
      {isMarkingRead && (
        <span className="text-xs text-muted-foreground px-2">Syncing…</span>
      )}
    </div>
  );
}


























