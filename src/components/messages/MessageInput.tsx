/**
 * Message Input Component
 * Input field for sending messages in a conversation
 */

import { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  conversationId: string;
  disabled?: boolean;
  className?: string;
}

export function MessageInput({
  conversationId,
  disabled = false,
  className,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const { sendMessage, isConnected } = useWebSocket();

  const handleSend = () => {
    if (!message.trim() || !isConnected || disabled) return;

    sendMessage('send_message', {
      conversationId,
      content: message.trim(),
    });

    setMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDisabled = disabled || !isConnected || !message.trim();

  return (
    <div className={cn('flex items-end gap-2 p-4 border-t', className)}>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          isConnected
            ? 'Type a message... (Press Enter to send, Shift+Enter for new line)'
            : 'Connecting...'
        }
        disabled={disabled || !isConnected}
        rows={1}
        className="min-h-[60px] max-h-[120px] resize-none"
      />
      <Button
        onClick={handleSend}
        disabled={isDisabled}
        size="icon"
        className="h-[60px] w-[60px] shrink-0"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}















