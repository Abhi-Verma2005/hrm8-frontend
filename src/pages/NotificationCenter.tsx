import { NotificationSettings } from '@/components/feedback/NotificationSettings';
import { PendingFeedbackRequests } from '@/components/feedback/PendingFeedbackRequests';

export default function NotificationCenter() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Notification Center</h1>
        <p className="text-muted-foreground">
          Manage feedback requests and email notification preferences
        </p>
      </div>

      <PendingFeedbackRequests />
      <NotificationSettings />
    </div>
  );
}
