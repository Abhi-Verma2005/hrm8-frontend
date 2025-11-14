export type NotificationType = 
  | 'new_application'
  | 'application_status_change'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'candidate_status_change'
  | 'offer_sent'
  | 'offer_accepted'
  | 'offer_declined'
  | 'document_uploaded'
  | 'feedback_added'
  | 'team_mention';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  link?: string;
  metadata?: {
    applicationId?: string;
    candidateId?: string;
    candidateName?: string;
    jobId?: string;
    jobTitle?: string;
    userId?: string;
    userName?: string;
  };
}

const NOTIFICATIONS_KEY = 'ats_notifications';
const MAX_NOTIFICATIONS = 100;

// Subscribers for real-time updates
type NotificationCallback = (notification: Notification) => void;
const subscribers = new Set<NotificationCallback>();

export function subscribeToNotifications(callback: NotificationCallback): () => void {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function notifySubscribers(notification: Notification) {
  subscribers.forEach(callback => callback(notification));
}

export function getNotifications(): Notification[] {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    if (stored) {
      const notifications = JSON.parse(stored);
      return notifications.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp),
      }));
    }
  } catch (error) {
    console.error('Error reading notifications:', error);
  }
  return [];
}

export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): Notification {
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    isRead: false,
  };

  const notifications = getNotifications();
  notifications.unshift(newNotification);

  // Keep only the last MAX_NOTIFICATIONS
  const trimmed = notifications.slice(0, MAX_NOTIFICATIONS);
  
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(trimmed));
  
  // Notify all subscribers
  notifySubscribers(newNotification);
  
  return newNotification;
}

export function markAsRead(notificationId: string): void {
  const notifications = getNotifications();
  const updated = notifications.map(n =>
    n.id === notificationId ? { ...n, isRead: true } : n
  );
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
}

export function markAllAsRead(): void {
  const notifications = getNotifications();
  const updated = notifications.map(n => ({ ...n, isRead: true }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
}

export function deleteNotification(notificationId: string): void {
  const notifications = getNotifications();
  const filtered = notifications.filter(n => n.id !== notificationId);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
}

export function clearAllNotifications(): void {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
}

export function getUnreadCount(): number {
  const notifications = getNotifications();
  return notifications.filter(n => !n.isRead).length;
}

// Helper functions to create specific notification types
export function notifyNewApplication(candidateName: string, jobTitle: string, applicationId: string, jobId: string) {
  return addNotification({
    type: 'new_application',
    title: 'New Application',
    message: `${candidateName} applied for ${jobTitle}`,
    link: `/applications/${applicationId}`,
    metadata: {
      applicationId,
      candidateName,
      jobId,
      jobTitle,
    },
  });
}

export function notifyApplicationStatusChange(
  candidateName: string,
  jobTitle: string,
  newStatus: string,
  applicationId: string
) {
  return addNotification({
    type: 'application_status_change',
    title: 'Application Status Updated',
    message: `${candidateName}'s application for ${jobTitle} moved to ${newStatus}`,
    link: `/applications/${applicationId}`,
    metadata: {
      applicationId,
      candidateName,
      jobTitle,
    },
  });
}

export function notifyInterviewScheduled(
  candidateName: string,
  jobTitle: string,
  interviewDate: Date,
  applicationId: string
) {
  return addNotification({
    type: 'interview_scheduled',
    title: 'Interview Scheduled',
    message: `Interview scheduled with ${candidateName} for ${jobTitle} on ${interviewDate.toLocaleDateString()}`,
    link: `/applications/${applicationId}`,
    metadata: {
      applicationId,
      candidateName,
      jobTitle,
    },
  });
}

export function notifyInterviewCompleted(
  candidateName: string,
  jobTitle: string,
  applicationId: string
) {
  return addNotification({
    type: 'interview_completed',
    title: 'Interview Completed',
    message: `Interview with ${candidateName} for ${jobTitle} has been completed`,
    link: `/applications/${applicationId}`,
    metadata: {
      applicationId,
      candidateName,
      jobTitle,
    },
  });
}

export function notifyCandidateStatusChange(
  candidateName: string,
  newStatus: string,
  candidateId: string
) {
  return addNotification({
    type: 'candidate_status_change',
    title: 'Candidate Status Changed',
    message: `${candidateName} is now ${newStatus}`,
    link: `/candidates/${candidateId}`,
    metadata: {
      candidateId,
      candidateName,
    },
  });
}

export function notifyOfferSent(
  candidateName: string,
  jobTitle: string,
  applicationId: string
) {
  return addNotification({
    type: 'offer_sent',
    title: 'Offer Sent',
    message: `Job offer sent to ${candidateName} for ${jobTitle}`,
    link: `/applications/${applicationId}`,
    metadata: {
      applicationId,
      candidateName,
      jobTitle,
    },
  });
}

export function notifyOfferAccepted(
  candidateName: string,
  jobTitle: string,
  applicationId: string
) {
  return addNotification({
    type: 'offer_accepted',
    title: 'Offer Accepted! 🎉',
    message: `${candidateName} accepted the offer for ${jobTitle}`,
    link: `/applications/${applicationId}`,
    metadata: {
      applicationId,
      candidateName,
      jobTitle,
    },
  });
}

export function notifyDocumentUploaded(
  candidateName: string,
  documentType: string,
  candidateId: string
) {
  return addNotification({
    type: 'document_uploaded',
    title: 'Document Uploaded',
    message: `${candidateName} uploaded a ${documentType}`,
    link: `/candidates/${candidateId}`,
    metadata: {
      candidateId,
      candidateName,
    },
  });
}

export function notifyFeedbackAdded(
  candidateName: string,
  reviewerName: string,
  applicationId: string
) {
  return addNotification({
    type: 'feedback_added',
    title: 'New Feedback',
    message: `${reviewerName} added feedback for ${candidateName}`,
    link: `/applications/${applicationId}`,
    metadata: {
      applicationId,
      candidateName,
      userName: reviewerName,
    },
  });
}
