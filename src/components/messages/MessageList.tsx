/**
 * Message List Component
 * Displays messages in a conversation with scrollable container
 */

import { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageData } from '@/types/websocket';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface MessageListProps {
  messages: MessageData[];
  currentUserEmail?: string;
  className?: string;
}

export function MessageList({
  messages,
  currentUserEmail,
  className,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center h-full text-muted-foreground',
          className
        )}
      >
        <p className="text-sm">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className={cn('flex-1 overflow-y-auto', className)} ref={scrollRef}>
      <div className="space-y-4 p-4">
        {messages.map((message) => {
          const isOwn = message.isOwn || message.senderEmail === currentUserEmail;
          const isSystem = message.senderType === 'SYSTEM';

          if (isSystem) {
            return (
              <div
                key={message.id}
                className="flex items-center justify-center py-2"
              >
                <div className="px-3 py-1.5 bg-muted rounded-full text-xs text-muted-foreground max-w-md text-center">
                  {message.content}
                </div>
              </div>
            );
          }

          // Get sender initials
          const senderName = message.senderEmail.split('@')[0];
          const initials = senderName
            .split('.')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          return (
            <div
              key={message.id}
              className={cn('flex gap-3', isOwn && 'flex-row-reverse')}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'flex flex-col gap-1 max-w-[70%]',
                  isOwn && 'items-end'
                )}
              >
                <div
                  className={cn(
                    'rounded-lg px-4 py-2 text-sm',
                    isOwn
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground px-1">
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

