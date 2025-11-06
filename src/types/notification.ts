export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationCategory = 'approval' | 'expiry' | 'payroll' | 'attendance' | 'document' | 'system';

export interface Notification {
  id: string;
  userId: string;
  category: NotificationCategory;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byCategory: Record<NotificationCategory, number>;
}
