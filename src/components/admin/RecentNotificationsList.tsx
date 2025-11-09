import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, ExternalLink } from 'lucide-react';
import { PlatformNotification } from '@/types/platformAdmin';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface RecentNotificationsListProps {
  notifications: PlatformNotification[];
}

export function RecentNotificationsList({ notifications }: RecentNotificationsListProps) {
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: PlatformNotification['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'warning':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'success':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'info':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
            <CardDescription>Latest platform updates</CardDescription>
          </div>
          {unreadCount > 0 && (
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
        ) : (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
                  !notification.read ? 'bg-muted/30' : ''
                }`}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getTypeColor(notification.type)}>
                      {notification.type}
                    </Badge>
                    {notification.actionRequired && (
                      <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
                        Action Required
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {notification.link && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(notification.link)}
                    className="ml-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => navigate('/notification-center')}
            >
              View All Notifications
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
