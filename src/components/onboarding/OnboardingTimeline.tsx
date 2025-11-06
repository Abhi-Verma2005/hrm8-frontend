import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OnboardingWorkflow, OnboardingTask, OnboardingDocument } from "@/types/onboarding";
import { CheckCircle2, Circle, FileText, ListTodo } from "lucide-react";
import { format } from "date-fns";

interface OnboardingTimelineProps {
  workflow: OnboardingWorkflow;
  tasks: OnboardingTask[];
  documents: OnboardingDocument[];
}

export function OnboardingTimeline({ workflow, tasks, documents }: OnboardingTimelineProps) {
  const events = [
    {
      date: workflow.createdAt,
      type: 'workflow',
      title: 'Workflow Created',
      description: `Onboarding workflow started by ${workflow.createdBy}`,
      icon: Circle,
      completed: true,
    },
    ...tasks
      .filter(t => t.completedDate)
      .map(t => ({
        date: t.completedDate!,
        type: 'task',
        title: `Task Completed: ${t.title}`,
        description: `Completed by ${t.completedByName}`,
        icon: CheckCircle2,
        completed: true,
      })),
    ...documents
      .filter(d => d.uploadedAt)
      .map(d => ({
        date: d.uploadedAt!,
        type: 'document',
        title: `Document Uploaded: ${d.name}`,
        description: `Uploaded by ${d.uploadedByName}`,
        icon: FileText,
        completed: true,
      })),
    ...documents
      .filter(d => d.reviewedAt)
      .map(d => ({
        date: d.reviewedAt!,
        type: 'document',
        title: `Document ${d.status === 'approved' ? 'Approved' : 'Rejected'}: ${d.name}`,
        description: `Reviewed by ${d.reviewedByName}`,
        icon: FileText,
        completed: d.status === 'approved',
      })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:h-full before:w-0.5 before:bg-border">
          {events.map((event, index) => {
            const Icon = event.icon;
            return (
              <div key={index} className="relative">
                <div className="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-background">
                  <Icon className={`h-3 w-3 ${event.completed ? 'text-green-600' : 'text-muted-foreground'}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(event.date), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            );
          })}
          
          {events.length === 0 && (
            <p className="text-sm text-muted-foreground">No activity yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
