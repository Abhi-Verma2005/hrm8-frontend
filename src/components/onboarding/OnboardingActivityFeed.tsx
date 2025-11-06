import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOnboardingNotifications } from "@/lib/onboardingStorage";
import { Bell, CheckCircle2, FileText, UserPlus, Clock } from "lucide-react";
import { format } from "date-fns";

interface OnboardingActivityFeedProps {
  workflowId: string;
}

export function OnboardingActivityFeed({ workflowId }: OnboardingActivityFeedProps) {
  const notifications = getOnboardingNotifications(workflowId)
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

  const getIcon = (type: string) => {
    switch (type) {
      case 'task-assigned':
      case 'task-reminder':
        return Clock;
      case 'task-completed':
        return CheckCircle2;
      case 'document-uploaded':
      case 'document-approved':
        return FileText;
      case 'workflow-completed':
        return UserPlus;
      default:
        return Bell;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map(notification => {
            const Icon = getIcon(notification.type);
            return (
              <div key={notification.id} className="flex gap-4 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{notification.subject}</p>
                    {notification.readAt && (
                      <Badge variant="secondary" className="text-xs">Read</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    Sent to {notification.recipientName} · {format(new Date(notification.sentAt), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No activity recorded yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
