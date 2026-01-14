/**
 * Message List Component
 * Displays messages in a conversation with scrollable container
 */

import { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageData } from '@/types/websocket';
import { cn } from '@/lib/utils';
import { format, isSameDay } from 'date-fns';

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
          'flex flex-col items-center justify-center h-full text-muted-foreground p-8',
          className
        )}
      >
        <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          <span className="text-2xl">👋</span>
        </div>
        <p className="font-medium text-foreground">No messages yet</p>
        <p className="text-sm mt-1">Start the conversation by sending a message below.</p>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: { date: Date; msgs: MessageData[] }[] = [];
  messages.forEach((msg) => {
    const date = new Date(msg.createdAt);
    if (isNaN(date.getTime())) return;

    if (groupedMessages.length === 0) {
      groupedMessages.push({ date, msgs: [msg] });
    } else {
      const lastGroup = groupedMessages[groupedMessages.length - 1];
      if (isSameDay(lastGroup.date, date)) {
        lastGroup.msgs.push(msg);
      } else {
        groupedMessages.push({ date, msgs: [msg] });
      }
    }
  });

  return (
    <div className={cn('flex-1 overflow-y-auto px-4 py-4 space-y-6', className)} ref={scrollRef}>
      {groupedMessages.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-4">
          <div className="flex justify-center sticky top-0 z-10 py-2">
            <span className="text-[10px] font-medium text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full border shadow-sm">
              {format(group.date, 'MMMM d, yyyy')}
            </span>
          </div>

          {group.msgs.map((message, i) => {
            const isOwn = message.isOwn || message.senderEmail === currentUserEmail;
            const isSystem = message.senderType === 'SYSTEM';
            const prevMessage = group.msgs[i - 1];
            const isSequence = prevMessage && prevMessage.senderEmail === message.senderEmail;

            if (isSystem) {
              return (
                <div
                  key={message.id}
                  className="flex items-center justify-center py-2"
                >
                  <div className="px-3 py-1.5 bg-muted/50 rounded-full text-[11px] text-muted-foreground max-w-md text-center border">
                    {message.content}
                  </div>
                </div>
              );
            }

            // Get sender initials
            const email = message.senderEmail || 'unknown@user';
            const senderName = email.split('@')[0];
            const initials = senderName
              .split('.')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3 group', // Added 'group' for hover effects if needed
                  isOwn ? 'flex-row-reverse' : 'flex-row',
                  isSequence ? 'mt-1' : 'mt-4'
                )}
              >
                {!isOwn && (
                  <Avatar className={cn("h-8 w-8 shrink-0 shadow-sm border border-background", isSequence && "opacity-0")}>
                    <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">{initials}</AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    'flex flex-col gap-1 max-w-[75%]',
                    isOwn ? 'items-end' : 'items-start'
                  )}
                >
                  <div
                    className={cn(
                      'px-4 py-2 text-sm shadow-sm relative',
                      isOwn
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                        : 'bg-white dark:bg-muted/40 text-foreground border border-border/50 rounded-2xl rounded-tl-sm',
                      isSequence && (isOwn ? 'rounded-tr-2xl' : 'rounded-tl-2xl')
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed">
                      {message.content}
                    </p>
                  </div>

                  <div className={cn("flex items-center gap-1.5 px-1 opacity-60 group-hover:opacity-100 transition-opacity", isOwn && "flex-row-reverse")}>
                    <span className="text-[10px] text-muted-foreground">
                      {(() => {
                        try {
                          return message.createdAt && !isNaN(new Date(message.createdAt).getTime())
                            ? format(new Date(message.createdAt), 'h:mm a')
                            : 'Just now';
                        } catch {
                          return 'Just now';
                        }
                      })()}
                    </span>
                    {/* Only show 'Delivered/Read' for own messages? - can be added later */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

