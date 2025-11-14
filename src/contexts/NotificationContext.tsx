import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  Notification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  subscribeToNotifications,
} from '@/lib/notifications/notificationService';
import { useToast } from '@/hooks/use-toast';
import { Bell, Briefcase, Calendar, CheckCircle, FileText, Star, UserCheck } from 'lucide-react';

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  const refreshNotifications = () => {
    const allNotifications = getNotifications();
    setNotifications(allNotifications);
    setUnreadCount(getUnreadCount());
  };

  useEffect(() => {
    // Initial load
    refreshNotifications();

    // Subscribe to new notifications
    const unsubscribe = subscribeToNotifications((notification) => {
      refreshNotifications();
      
      // Show toast for new notifications
      const icon = getNotificationIcon(notification.type);
      const duration = getNotificationDuration(notification.type);
      
      toast({
        title: notification.title,
        description: notification.message,
        duration,
        action: notification.link ? (
          <a 
            href={notification.link} 
            className="text-sm font-medium underline underline-offset-4"
            onClick={() => markAsRead(notification.id)}
          >
            View
          </a>
        ) : undefined,
      });
    });

    // Poll for changes (in case of multi-tab scenarios)
    const interval = setInterval(refreshNotifications, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    refreshNotifications();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    refreshNotifications();
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
    refreshNotifications();
  };

  const handleClearAll = () => {
    clearAllNotifications();
    refreshNotifications();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
        deleteNotification: handleDeleteNotification,
        clearAll: handleClearAll,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'new_application':
      return <FileText className="h-4 w-4" />;
    case 'application_status_change':
      return <CheckCircle className="h-4 w-4" />;
    case 'interview_scheduled':
    case 'interview_completed':
      return <Calendar className="h-4 w-4" />;
    case 'candidate_status_change':
      return <UserCheck className="h-4 w-4" />;
    case 'offer_sent':
    case 'offer_accepted':
    case 'offer_declined':
      return <Briefcase className="h-4 w-4" />;
    case 'feedback_added':
      return <Star className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
}

function getNotificationDuration(type: Notification['type']): number {
  // Important notifications stay longer
  switch (type) {
    case 'offer_accepted':
    case 'new_application':
      return 8000;
    case 'offer_sent':
    case 'interview_scheduled':
      return 6000;
    default:
      return 5000;
  }
}
