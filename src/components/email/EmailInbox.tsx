import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmailMessage, EmailStatus } from '@/lib/api/emailInboxService';
import { formatDistanceToNow } from 'date-fns';
import { Mail, CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailInboxProps {
  emails: EmailMessage[];
  onEmailClick?: (email: EmailMessage) => void;
  className?: string;
}

const STATUS_CONFIG: Record<EmailStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
  SENT: { label: 'Sent', variant: 'outline', icon: Mail },
  DELIVERED: { label: 'Delivered', variant: 'secondary', icon: CheckCircle2 },
  OPENED: { label: 'Opened', variant: 'default', icon: Eye },
  BOUNCED: { label: 'Bounced', variant: 'destructive', icon: XCircle },
  FAILED: { label: 'Failed', variant: 'destructive', icon: XCircle },
};

export function EmailInbox({ emails, onEmailClick, className }: EmailInboxProps) {
  if (emails.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No emails found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className={cn('h-full', className)}>
      <div className="space-y-2">
        {emails.map((email) => {
          const statusConfig = STATUS_CONFIG[email.status];
          const StatusIcon = statusConfig.icon;

          return (
            <Card
              key={email.id}
              className={cn(
                'cursor-pointer hover:shadow-md transition-shadow',
                onEmailClick && 'hover:bg-muted/50'
              )}
              onClick={() => onEmailClick?.(email)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm truncate">{email.subject}</h4>
                      <Badge variant={statusConfig.variant} className="gap-1 text-xs">
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      To: {email.to}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatDistanceToNow(new Date(email.sentAt), { addSuffix: true })}</span>
                      {email.openedAt && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Opened {formatDistanceToNow(new Date(email.openedAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}

