import { NotificationSettings } from '@/components/feedback/NotificationSettings';
import { PendingFeedbackRequests } from '@/components/feedback/PendingFeedbackRequests';
import { Button } from '@/components/ui/button';
import { FileText, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationCenter() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notification Center</h1>
          <p className="text-muted-foreground">
            Manage feedback requests and email notification preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/feedback-templates">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </Button>
          </Link>
          <Link to="/feedback-dashboard">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <PendingFeedbackRequests />
      <NotificationSettings />
    </div>
  );
}
