/**
 * Conversation Header Component
 * Shows participant info and online status
 */

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { ConversationData } from '@/types/websocket';
import { cn } from '@/lib/utils';

interface ConversationHeaderProps {
  conversation: ConversationData;
  currentUserEmail?: string;
  className?: string;
}

export function ConversationHeader({
  conversation,
  currentUserEmail,
  className,
}: ConversationHeaderProps) {
  const { onlineUsers } = useWebSocket();

  // Get the other participant (not current user)
  const otherParticipant = conversation.participants.find(
    (p) => p !== currentUserEmail
  );
  const isOnline = onlineUsers.some((u) => u.userEmail === otherParticipant);

  // Get display name
  let displayName = 'Unknown';
  if (conversation.candidate) {
    displayName = `${conversation.candidate.firstName} ${conversation.candidate.lastName}`;
  } else if (otherParticipant) {
    displayName = otherParticipant.split('@')[0];
  }

  // Get initials for avatar
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 border-b bg-card',
        className
      )}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={conversation.candidate?.photo} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm truncate">{displayName}</h3>
          {isOnline && (
            <Badge variant="success" className="h-2 w-2 p-0 rounded-full" />
          )}
        </div>
        {conversation.job && (
          <p className="text-xs text-muted-foreground truncate">
            {conversation.job.title}
          </p>
        )}
      </div>
    </div>
  );
}















