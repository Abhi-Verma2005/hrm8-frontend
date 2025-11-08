import { CheckCircle2, Circle, Clock, FileText, ListTodo } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import type { OnboardingWorkflow, OnboardingTask, OnboardingDocument } from "@/types/onboarding";

interface OnboardingTimelineProps {
  workflow: OnboardingWorkflow;
  tasks: OnboardingTask[];
  documents: OnboardingDocument[];
}

export function OnboardingTimeline({ workflow, tasks, documents }: OnboardingTimelineProps) {
  const timelineEvents = [
    {
      id: 'workflow-created',
      type: 'workflow',
      title: 'Workflow Created',
      description: `Onboarding workflow initiated for ${workflow.employeeName}`,
      date: workflow.createdAt,
      icon: Circle,
      completed: true,
    },
    {
      id: 'workflow-start',
      type: 'workflow',
      title: 'Start Date',
      description: `${workflow.employeeName} joins as ${workflow.jobTitle}`,
      date: workflow.startDate,
      icon: Clock,
      completed: new Date(workflow.startDate) <= new Date(),
    },
    ...tasks
      .filter(t => t.status === 'completed' && t.completedDate)
      .map(task => ({
        id: task.id,
        type: 'task' as const,
        title: `Task Completed: ${task.title}`,
        description: `Completed by ${task.completedByName || 'Unknown'}`,
        date: task.completedDate!,
        icon: ListTodo,
        completed: true,
      })),
    ...documents
      .filter(d => d.status === 'approved' && d.reviewedAt)
      .map(doc => ({
        id: doc.id,
        type: 'document' as const,
        title: `Document Approved: ${doc.name}`,
        description: `Reviewed by ${doc.reviewedByName || 'Unknown'}`,
        date: doc.reviewedAt!,
        icon: FileText,
        completed: true,
      })),
    ...(workflow.completedDate
      ? [{
          id: 'workflow-completed',
          type: 'workflow' as const,
          title: 'Onboarding Completed',
          description: 'All tasks and documents completed successfully',
          date: workflow.completedDate,
          icon: CheckCircle2,
          completed: true,
        }]
      : [{
          id: 'workflow-due',
          type: 'workflow' as const,
          title: 'Due Date',
          description: 'Onboarding should be completed by this date',
          date: workflow.dueDate,
          icon: Clock,
          completed: false,
        }]
    ),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card>
      <CardContent className="p-6">
        {timelineEvents.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Timeline Events</h3>
            <p className="text-muted-foreground">
              Timeline events will appear here as the onboarding progresses.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-border" />

            <div className="space-y-8">
              {timelineEvents.map((event, index) => {
                const Icon = event.icon;
                const isLast = index === timelineEvents.length - 1;

                return (
                  <div key={event.id} className="relative flex gap-4">
                    {/* Icon */}
                    <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      event.completed 
                        ? 'bg-primary border-primary' 
                        : 'bg-background border-border'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        event.completed ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`} />
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${!isLast ? 'pb-8' : ''}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className={`font-medium ${
                            event.completed ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {event.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {event.description}
                          </p>
                        </div>
                        <time className="text-sm text-muted-foreground whitespace-nowrap">
                          {format(parseISO(event.date), 'MMM d, yyyy')}
                        </time>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
