import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmailMessage, EmailStatus } from '@/lib/api/emailInboxService';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, Mail, Eye, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { emailInboxService } from '@/lib/api/emailInboxService';

interface EmailDetailProps {
  email: EmailMessage;
  onResend?: () => void;
  className?: string;
}

const STATUS_CONFIG: Record<EmailStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
  SENT: { label: 'Sent', variant: 'outline', icon: Mail },
  DELIVERED: { label: 'Delivered', variant: 'secondary', icon: CheckCircle2 },
  OPENED: { label: 'Opened', variant: 'default', icon: Eye },
  BOUNCED: { label: 'Bounced', variant: 'destructive', icon: XCircle },
  FAILED: { label: 'Failed', variant: 'destructive', icon: XCircle },
};

export function EmailDetail({ email, onResend, className }: EmailDetailProps) {
  const statusConfig = STATUS_CONFIG[email.status];
  const StatusIcon = statusConfig.icon;
  const canResend = email.status === 'FAILED' || email.status === 'BOUNCED';

  const handleResend = async () => {
    try {
      await emailInboxService.resendEmail(email.id);
      toast.success('Email resent successfully');
      onResend?.();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to resend email');
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle>{email.subject}</CardTitle>
              <Badge variant={statusConfig.variant} className="gap-1">
                <StatusIcon className="h-3 w-3" />
                {statusConfig.label}
              </Badge>
            </div>
            <CardDescription>
              {format(new Date(email.sentAt), 'PPpp')}
            </CardDescription>
          </div>
          {canResend && (
            <Button variant="outline" size="sm" onClick={handleResend}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Resend
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1">To:</div>
          <div className="text-sm">{email.to}</div>
        </div>

        {email.cc.length > 0 && (
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">CC:</div>
            <div className="text-sm">{email.cc.join(', ')}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-muted-foreground mb-1">Sent At:</div>
            <div>{format(new Date(email.sentAt), 'PPpp')}</div>
          </div>
          {email.deliveredAt && (
            <div>
              <div className="font-medium text-muted-foreground mb-1">Delivered At:</div>
              <div>{format(new Date(email.deliveredAt), 'PPpp')}</div>
            </div>
          )}
          {email.openedAt && (
            <div>
              <div className="font-medium text-muted-foreground mb-1">Opened At:</div>
              <div>{format(new Date(email.openedAt), 'PPpp')}</div>
            </div>
          )}
        </div>

        {email.errorMessage && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="text-sm font-medium text-destructive mb-1">Error:</div>
            <div className="text-sm text-destructive">{email.errorMessage}</div>
          </div>
        )}

        <div>
          <div className="text-sm font-medium text-muted-foreground mb-2">Body:</div>
          <ScrollArea className="h-[400px] border rounded-md p-4 bg-background">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: email.body }}
            />
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

