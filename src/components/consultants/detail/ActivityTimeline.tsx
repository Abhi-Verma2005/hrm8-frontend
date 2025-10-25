import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getConsultantActivities } from '@/lib/consultantCRMStorage';
import { format, formatDistanceToNow } from 'date-fns';

interface ActivityTimelineProps {
  consultantId: string;
}

export function ActivityTimeline({ consultantId }: ActivityTimelineProps) {
  const activities = getConsultantActivities(consultantId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No activity recorded yet
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{activity.title}</span>
                    <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  )}
                  {activity.userName && (
                    <p className="text-xs text-muted-foreground mt-1">by {activity.userName}</p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground text-right">
                  <div>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</div>
                  <div className="text-xs">{format(new Date(activity.createdAt), 'MMM dd, yyyy')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
