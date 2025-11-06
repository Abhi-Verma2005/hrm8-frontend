import { Notification, NotificationStats } from "@/types/notification";

let notifications: Notification[] = [];

export function getNotifications(userId: string): Notification[] {
  return notifications.filter(n => n.userId === userId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getUnreadNotifications(userId: string): Notification[] {
  return notifications.filter(n => n.userId === userId && !n.read);
}

export function createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Notification {
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  
  notifications.push(newNotification);
  return newNotification;
}

export function markAsRead(notificationId: string): boolean {
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    return true;
  }
  return false;
}

export function markAllAsRead(userId: string): number {
  let count = 0;
  notifications.forEach(n => {
    if (n.userId === userId && !n.read) {
      n.read = true;
      count++;
    }
  });
  return count;
}

export function deleteNotification(notificationId: string): boolean {
  const initialLength = notifications.length;
  notifications = notifications.filter(n => n.id !== notificationId);
  return notifications.length < initialLength;
}

export function getNotificationStats(userId: string): NotificationStats {
  const userNotifications = getNotifications(userId);
  
  return {
    total: userNotifications.length,
    unread: userNotifications.filter(n => !n.read).length,
    byCategory: {
      approval: userNotifications.filter(n => n.category === 'approval').length,
      expiry: userNotifications.filter(n => n.category === 'expiry').length,
      payroll: userNotifications.filter(n => n.category === 'payroll').length,
      attendance: userNotifications.filter(n => n.category === 'attendance').length,
      document: userNotifications.filter(n => n.category === 'document').length,
      system: userNotifications.filter(n => n.category === 'system').length,
    },
  };
}
