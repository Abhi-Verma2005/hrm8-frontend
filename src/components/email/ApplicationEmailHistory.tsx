import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmailMessage, EmailStatus, emailInboxService } from '@/lib/api/emailInboxService';
import { format } from 'date-fns';
import { Mail, CheckCircle2, XCircle, Eye, RefreshCw, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { EmailDetail } from './EmailDetail';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ApplicationEmailHistoryProps {
  applicationId: string;
  className?: string;
}

const STATUS_CONFIG: Record<EmailStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
  SENT: { label: 'Sent', variant: 'outline', icon: Mail },
  DELIVERED: { label: 'Delivered', variant: 'secondary', icon: CheckCircle2 },
  OPENED: { label: 'Opened', variant: 'default', icon: Eye },
  BOUNCED: { label: 'Bounced', variant: 'destructive', icon: XCircle },
  FAILED: { label: 'Failed', variant: 'destructive', icon: XCircle },
};

export function ApplicationEmailHistory({ applicationId, className }: ApplicationEmailHistoryProps) {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);

  useEffect(() => {
    loadEmails();
  }, [applicationId]);

  const loadEmails = async () => {
    setIsLoading(true);
    try {
      const data = await emailInboxService.getApplicationEmails(applicationId);
      setEmails(data.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()));
    } catch (error: any) {
      toast.error('Failed to load email history');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Loading email history...</p>
        </CardContent>
      </Card>
    );
  }

  if (emails.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No emails sent to this candidate yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email History</CardTitle>
              <CardDescription>
                All emails sent to this candidate for this application
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadEmails}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {emails.map((email) => {
                const statusConfig = STATUS_CONFIG[email.status];
                const StatusIcon = statusConfig.icon;

                return (
                  <Card
                    key={email.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedEmail(email)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-sm truncate">{email.subject}</h4>
                            <Badge variant={statusConfig.variant} className="gap-1 text-xs">
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div>To: {email.to}</div>
                            <div>{format(new Date(email.sentAt), 'PPpp')}</div>
                            {email.openedAt && (
                              <div className="flex items-center gap-1 text-xs">
                                <Eye className="h-3 w-3" />
                                Opened {format(new Date(email.openedAt), 'PPp')}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={!!selectedEmail} onOpenChange={(open) => !open && setSelectedEmail(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEmail && (
            <EmailDetail
              email={selectedEmail}
              onResend={loadEmails}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

