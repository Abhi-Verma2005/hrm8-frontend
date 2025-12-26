import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { getConsultantTasks, deleteConsultantTask, updateConsultantTask } from '@/lib/consultantCRMStorage';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { TaskDialog } from './TaskDialog';
import { useToast } from '@/hooks/use-toast';
import type { ConsultantTask } from '@/types/consultantCRM';

interface EnhancedTasksSectionProps {
  consultantId: string;
}

const priorityConfig = {
  urgent: { label: 'Urgent', className: 'bg-red-100 text-red-800 border-red-200' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  low: { label: 'Low', className: 'bg-green-100 text-green-800 border-green-200' },
};

const statusConfig = {
  pending: { label: 'Pending', variant: 'secondary' as const },
  'in-progress': { label: 'In Progress', variant: 'default' as const },
  completed: { label: 'Completed', variant: 'outline' as const },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const },
};

export function EnhancedTasksSection({ consultantId }: EnhancedTasksSectionProps) {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ConsultantTask | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const tasks = getConsultantTasks(consultantId);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (statusFilter === 'active') {
      filtered = filtered.filter(task => task.status !== 'completed' && task.status !== 'cancelled');
    } else if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Sort by priority and due date
    return filtered.sort((a, b) => {
      // Sort by status: active first
      const statusOrder = { 'in-progress': 0, 'pending': 1, 'completed': 2, 'cancelled': 3 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;

      // Then by priority
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      return 0;
    });
  }, [tasks, statusFilter, priorityFilter]);

  const handleToggleComplete = (task: ConsultantTask) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateConsultantTask(task.id, {
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
    });
    toast({
      title: newStatus === 'completed' ? 'Task completed' : 'Task reopened',
      description: task.title,
    });
  };

  const handleEdit = (task: ConsultantTask) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteConsultantTask(taskToDelete);
      toast({
        title: 'Task deleted',
        description: 'The task has been deleted successfully.',
      });
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleCreateNew = () => {
    setEditingTask(undefined);
    setDialogOpen(true);
  };

  const getDueDateBadge = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const isOverdue = isPast(date) && !isToday(date);
    
    let label = format(date, 'MMM dd, yyyy');
    let className = 'text-muted-foreground';
    
    if (isOverdue) {
      label = `Overdue: ${label}`;
      className = 'text-destructive';
    } else if (isToday(date)) {
      label = 'Due today';
      className = 'text-warning';
    } else if (isTomorrow(date)) {
      label = 'Due tomorrow';
      className = 'text-warning';
    }
    
    return (
      <span className={`text-xs flex items-center gap-1 ${className}`}>
        {isOverdue && <AlertCircle className="h-3 w-3" />}
        <Calendar className="h-3 w-3" />
        {label}
      </span>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tasks</CardTitle>
            <Button size="sm" onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {statusFilter !== 'all' || priorityFilter !== 'all' ? (
                <>
                  <p className="text-sm">No tasks found</p>
                  <p className="text-xs mt-1">Try adjusting your filters</p>
                </>
              ) : (
                <>
                  <p className="text-sm">No tasks yet</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={handleCreateNew}>
                    Create First Task
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={() => handleToggleComplete(task)}
                    disabled={task.status === 'cancelled'}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <span
                          className={`font-medium block ${
                            task.status === 'completed' 
                              ? 'line-through text-muted-foreground' 
                              : task.status === 'cancelled'
                                ? 'line-through text-muted-foreground'
                                : ''
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={priorityConfig[task.priority].className}>
                        {priorityConfig[task.priority].label}
                      </Badge>
                      <Badge variant={statusConfig[task.status].variant}>
                        {statusConfig[task.status].label}
                      </Badge>
                      {task.dueDate && getDueDateBadge(task.dueDate)}
                      {task.assignedToName && (
                        <span className="text-xs text-muted-foreground">
                          Assigned to: {task.assignedToName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(task)}
                      className="h-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(task.id)}
                      className="h-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        consultantId={consultantId}
        task={editingTask}
        onSuccess={() => {
          // Force re-render by not doing anything, component will auto-update from localStorage
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
