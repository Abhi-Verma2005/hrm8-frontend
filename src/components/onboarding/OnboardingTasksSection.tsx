import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertCircle, CheckCircle2, Circle } from "lucide-react";
import { getOnboardingTasks, saveOnboardingTask } from "@/lib/onboardingStorage";
import { OnboardingTask, TaskStatus } from "@/types/onboarding";
import { format } from "date-fns";
import { toast } from "sonner";

interface OnboardingTasksSectionProps {
  workflowId: string;
  onUpdate: () => void;
}

export function OnboardingTasksSection({ workflowId, onUpdate }: OnboardingTasksSectionProps) {
  const tasks = getOnboardingTasks(workflowId).sort((a, b) => a.order - b.order);
  
  const handleToggleTask = (task: OnboardingTask, checked: boolean) => {
    const newStatus: TaskStatus = checked ? 'completed' : 'in-progress';
    
    saveOnboardingTask({
      ...task,
      status: newStatus,
      completedDate: checked ? new Date().toISOString() : undefined,
      completedBy: checked ? 'current-user' : undefined,
      completedByName: checked ? 'Current User' : undefined,
      actualDuration: checked ? task.estimatedDuration : undefined,
    });
    
    toast.success(checked ? 'Task marked as completed' : 'Task reopened');
    onUpdate();
  };

  const getPriorityBadge = (priority: OnboardingTask['priority']) => {
    const variants: Record<OnboardingTask['priority'], { variant: any; label: string }> = {
      'low': { variant: 'secondary', label: 'Low' },
      'medium': { variant: 'default', label: 'Medium' },
      'high': { variant: 'default', label: 'High' },
      'critical': { variant: 'destructive', label: 'Critical' },
    };
    return variants[priority];
  };

  const getCategoryBadge = (category: OnboardingTask['category']) => {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getStatusIcon = (status: TaskStatus) => {
    if (status === 'completed') return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (status === 'in-progress') return <Circle className="h-4 w-4 text-blue-600" />;
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, OnboardingTask[]>);

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Task Progress</CardTitle>
            <span className="text-sm text-muted-foreground">{completedCount} of {tasks.length} completed</span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} className="h-2" />
        </CardContent>
      </Card>

      {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">{getCategoryBadge(category as OnboardingTask['category'])}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryTasks.map(task => {
              const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
              const priorityBadge = getPriorityBadge(task.priority);
              
              return (
                <div key={task.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={(checked) => handleToggleTask(task, checked as boolean)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      </div>
                      <Badge variant={priorityBadge.variant}>{priorityBadge.label}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                        {isOverdue && <AlertCircle className="h-3 w-3 text-destructive ml-1" />}
                      </div>
                      
                      {task.estimatedDuration && (
                        <span>Est. {task.estimatedDuration} min</span>
                      )}
                      
                      <span>Assigned to: {task.assignedToName}</span>
                      
                      {task.completedDate && (
                        <span className="text-green-600">
                          Completed {format(new Date(task.completedDate), 'MMM d')}
                        </span>
                      )}
                    </div>

                    {task.notes && (
                      <p className="text-sm italic text-muted-foreground">Note: {task.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {tasks.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No tasks assigned yet
          </CardContent>
        </Card>
      )}
    </div>
  );
}
