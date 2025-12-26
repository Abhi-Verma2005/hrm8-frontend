import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { getConsultantTasks, updateConsultantTask } from '@/lib/consultantCRMStorage';
import { format } from 'date-fns';

interface TasksSectionProps {
  consultantId: string;
}

const getPriorityBadge = (priority: string) => {
  const config = {
    urgent: { label: 'Urgent', className: 'bg-red-100 text-red-800' },
    high: { label: 'High', className: 'bg-orange-100 text-orange-800' },
    medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
    low: { label: 'Low', className: 'bg-green-100 text-green-800' },
  };
  const { label, className } = config[priority as keyof typeof config];
  return <Badge variant="secondary" className={className}>{label}</Badge>;
};

export function TasksSection({ consultantId }: TasksSectionProps) {
  const tasks = getConsultantTasks(consultantId);

  const handleToggleTask = (taskId: string, completed: boolean) => {
    updateConsultantTask(taskId, {
      status: completed ? 'completed' : 'pending'
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tasks</CardTitle>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tasks yet
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <Checkbox
                  checked={task.status === 'completed'}
                  onCheckedChange={(checked) => handleToggleTask(task.id, checked as boolean)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </span>
                    {getPriorityBadge(task.priority)}
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                    <span>•</span>
                    <span>Assigned to: {task.assignedToName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
