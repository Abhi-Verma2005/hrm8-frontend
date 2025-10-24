import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Calendar, AlertCircle } from "lucide-react";
import { getEmployerTasks, deleteTask, updateTask } from "@/lib/employerCRMStorage";
import { EmployerTask } from "@/types/employerCRM";
import { formatDistanceToNow, isPast } from "date-fns";
import { AddTaskDialog } from "./AddTaskDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TasksSectionProps {
  employerId: string;
}

const priorityColors = {
  low: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  medium: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
  urgent: "bg-red-600/20 text-red-800 dark:text-red-300 font-semibold",
};

const statusColors = {
  pending: "border-muted-foreground/20",
  "in-progress": "border-blue-500",
  completed: "border-green-500",
};

export function TasksSection({ employerId }: TasksSectionProps) {
  const [tasks, setTasks] = useState<EmployerTask[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<EmployerTask | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<EmployerTask | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    setTasks(getEmployerTasks(employerId, showCompleted));
  }, [employerId, showCompleted]);

  const handleDeleteTask = () => {
    if (!taskToDelete) return;
    
    const success = deleteTask(taskToDelete.id);
    if (success) {
      setTasks(tasks.filter(t => t.id !== taskToDelete.id));
      toast({ title: "Task deleted successfully" });
    } else {
      toast({ title: "Failed to delete task", variant: "destructive" });
    }
    
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleTaskAdded = (task: EmployerTask) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
      setTasks([task, ...tasks]);
    }
    setEditingTask(null);
  };

  const handleToggleComplete = (task: EmployerTask) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updated = updateTask(task.id, { status: newStatus });
    if (updated) {
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
      toast({ 
        title: newStatus === 'completed' ? "Task completed" : "Task reopened" 
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tasks & Follow-ups</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Checkbox 
                  id="show-completed"
                  checked={showCompleted}
                  onCheckedChange={(checked) => setShowCompleted(checked as boolean)}
                />
                <label 
                  htmlFor="show-completed" 
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Show completed tasks
                </label>
              </div>
            </div>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {showCompleted ? 'No tasks found' : 'No pending tasks'}
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => {
                const isOverdue = isPast(new Date(task.dueDate)) && task.status !== 'completed';
                
                return (
                  <div 
                    key={task.id} 
                    className={cn(
                      "border rounded-lg p-4 space-y-2 transition-colors",
                      statusColors[task.status],
                      isOverdue && "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.status === 'completed'}
                        onCheckedChange={() => handleToggleComplete(task)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={cn(
                                "font-medium",
                                task.status === 'completed' && "line-through text-muted-foreground"
                              )}>
                                {task.title}
                              </span>
                              <Badge className={priorityColors[task.priority]}>
                                {task.priority}
                              </Badge>
                              {task.status !== 'pending' && task.status !== 'completed' && (
                                <Badge variant="outline">{task.status}</Badge>
                              )}
                            </div>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setEditingTask(task);
                                setAddDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setTaskToDelete(task);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                              </span>
                            </div>
                            {isOverdue && (
                              <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                                <AlertCircle className="h-3 w-3" />
                                Overdue
                              </div>
                            )}
                          </div>
                          <span>Assigned to {task.assignedToName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddTaskDialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        employerId={employerId}
        onTaskAdded={handleTaskAdded}
        editingTask={editingTask}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
