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
  // participants is an array of ConversationParticipant objects
  const participants = conversation.participants || [];
  const otherParticipant = participants.find(
    (p) => p.participantEmail !== currentUserEmail
  );
  const otherParticipantEmail = otherParticipant?.participantEmail;
  const isOnline = otherParticipantEmail
    ? onlineUsers.some((u) => u.userEmail === otherParticipantEmail)
    : false;

  // Get display name from participant data
  let displayName = 'Unknown';
  if (otherParticipant?.displayName) {
    displayName = otherParticipant.displayName;
  } else if (otherParticipantEmail) {
    displayName = otherParticipantEmail.split('@')[0];
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
        'flex items-center gap-4 p-4 bg-card/70 backdrop-blur-sm',
        className
      )}
    >
      <Avatar className="h-12 w-12 ring-2 ring-muted">
        <AvatarImage src={undefined} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-base truncate">{displayName}</h3>
          {isOnline && conversation.status === 'ACTIVE' && (
            <Badge variant="success" className="h-2 w-2 p-0 rounded-full" />
          )}
          {conversation.status !== 'ACTIVE' && (
            <Badge
              variant={conversation.status === 'ARCHIVED' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {conversation.status}
            </Badge>
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






























