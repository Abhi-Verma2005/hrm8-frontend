import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Goal } from "@/types/performance";
import { format } from "date-fns";
import { Edit, Search, Target, Trash2 } from "lucide-react";
import { GoalFormDialog } from "./GoalFormDialog";
import { deleteGoal } from "@/lib/performanceStorage";
import { toast } from "sonner";

interface GoalsTabProps {
  goals: Goal[];
  onRefresh: () => void;
}

export function GoalsTab({ goals, onRefresh }: GoalsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || goal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Goal['status']) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      'not-started': { variant: "secondary", label: "Not Started" },
      'in-progress': { variant: "outline", label: "In Progress" },
      'completed': { variant: "default", label: "Completed" },
      'cancelled': { variant: "destructive", label: "Cancelled" },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: Goal['priority']) => {
    const colors: Record<string, string> = {
      low: "secondary",
      medium: "outline",
      high: "destructive",
    };
    return <Badge variant={colors[priority] as any} className="capitalize">{priority}</Badge>;
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      deleteGoal(id);
      onRefresh();
      toast.success("Goal deleted successfully");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Goals</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search goals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredGoals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Target className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p>No goals found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{goal.title}</h3>
                        {getStatusBadge(goal.status)}
                        {getPriorityBadge(goal.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{goal.employeeName}</span>
                        <span>•</span>
                        <span>Due: {format(new Date(goal.targetDate), "MMM d, yyyy")}</span>
                        <span>•</span>
                        <span className="capitalize">{goal.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingGoal(goal)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(goal.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {editingGoal && (
        <GoalFormDialog
          open={!!editingGoal}
          onOpenChange={(open) => !open && setEditingGoal(null)}
          goal={editingGoal}
          onSuccess={() => {
            onRefresh();
            setEditingGoal(null);
          }}
        />
      )}
    </>
  );
}
