import { CheckCircle2, Upload, FileCheck, XCircle, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { getOnboardingTasks, getOnboardingDocuments } from "@/lib/onboardingStorage";

interface OnboardingActivityFeedProps {
  workflowId: string;
}

interface Activity {
  id: string;
  type: 'task-completed' | 'task-assigned' | 'document-uploaded' | 'document-approved' | 'document-rejected';
  title: string;
  description: string;
  actor: string;
  actorInitials: string;
  date: string;
  icon: any;
  iconColor: string;
}

export function OnboardingActivityFeed({ workflowId }: OnboardingActivityFeedProps) {
  const tasks = getOnboardingTasks(workflowId);
  const documents = getOnboardingDocuments(workflowId);

  const activities: Activity[] = [
    ...tasks.map(task => {
      if (task.status === 'completed' && task.completedDate) {
        return {
          id: `task-completed-${task.id}`,
          type: 'task-completed' as const,
          title: `Completed task: ${task.title}`,
          description: `Task marked as complete in ${task.category}`,
          actor: task.completedByName || 'Unknown',
          actorInitials: (task.completedByName || 'U').split(' ').map(n => n[0]).join(''),
          date: task.completedDate,
          icon: CheckCircle2,
          iconColor: 'text-green-600',
        };
      }
      return {
        id: `task-assigned-${task.id}`,
        type: 'task-assigned' as const,
        title: `Task assigned: ${task.title}`,
        description: `Assigned to ${task.assignedToName}`,
        actor: 'System',
        actorInitials: 'S',
        date: task.createdAt,
        icon: Clock,
        iconColor: 'text-blue-600',
      };
    }),
    ...documents.flatMap(doc => {
      const activities = [];
      
      if (doc.uploadedAt && doc.uploadedByName) {
        activities.push({
          id: `doc-uploaded-${doc.id}`,
          type: 'document-uploaded' as const,
          title: `Uploaded: ${doc.name}`,
          description: `Document uploaded for review`,
          actor: doc.uploadedByName,
          actorInitials: doc.uploadedByName.split(' ').map(n => n[0]).join(''),
          date: doc.uploadedAt,
          icon: Upload,
          iconColor: 'text-blue-600',
        });
      }
      
      if (doc.status === 'approved' && doc.reviewedAt && doc.reviewedByName) {
        activities.push({
          id: `doc-approved-${doc.id}`,
          type: 'document-approved' as const,
          title: `Approved: ${doc.name}`,
          description: doc.reviewNotes || 'Document approved',
          actor: doc.reviewedByName,
          actorInitials: doc.reviewedByName.split(' ').map(n => n[0]).join(''),
          date: doc.reviewedAt,
          icon: FileCheck,
          iconColor: 'text-green-600',
        });
      }
      
      if (doc.status === 'rejected' && doc.reviewedAt && doc.reviewedByName) {
        activities.push({
          id: `doc-rejected-${doc.id}`,
          type: 'document-rejected' as const,
          title: `Rejected: ${doc.name}`,
          description: doc.reviewNotes || 'Document rejected',
          actor: doc.reviewedByName,
          actorInitials: doc.reviewedByName.split(' ').map(n => n[0]).join(''),
          date: doc.reviewedAt,
          icon: XCircle,
          iconColor: 'text-destructive',
        });
      }
      
      return activities;
    }),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
            <p className="text-muted-foreground">
              Activity will appear here as tasks are completed and documents are processed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activity.icon;
              
              return (
                <div key={activity.id} className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{activity.actorInitials}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                        <p className="text-sm font-medium">{activity.title}</p>
                      </div>
                      <time className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(parseISO(activity.date), { addSuffix: true })}
                      </time>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      by {activity.actor} • {format(parseISO(activity.date), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
