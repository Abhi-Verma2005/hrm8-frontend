import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoalCreationDialog } from "./GoalCreationDialog";
import { GoalProgressDialog } from "./GoalProgressDialog";
import { Plus, Target, Calendar, TrendingUp, AlertCircle, CheckCircle2, Clock, Search } from "lucide-react";
import { getPerformanceGoals } from "@/lib/performanceStorage";
import type { PerformanceGoal, GoalStatus } from "@/types/performance";
import { format } from "date-fns";

interface GoalsSectionProps {
  consultantId: string;
}

export function GoalsSection({ consultantId }: GoalsSectionProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<PerformanceGoal | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const allGoals = getPerformanceGoals().filter(g => g.employeeId === consultantId);
  
  const filteredGoals = allGoals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || goal.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || goal.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleUpdateProgress = (goal: PerformanceGoal) => {
    setSelectedGoal(goal);
    setProgressDialogOpen(true);
  };

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'in-progress':
        return <TrendingUp className="h-4 w-4 text-primary" />;
      case 'on-hold':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Target className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: GoalStatus) => {
    const variants: Record<GoalStatus, { variant: any; label: string }> = {
      'not-started': { variant: 'secondary', label: 'Not Started' },
      'in-progress': { variant: 'default', label: 'In Progress' },
      'completed': { variant: 'outline', label: 'Completed' },
      'on-hold': { variant: 'secondary', label: 'On Hold' },
      'cancelled': { variant: 'destructive', label: 'Cancelled' },
    };
    return variants[status];
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { variant: any; className: string }> = {
      'critical': { variant: 'destructive', className: 'bg-red-600 text-white' },
      'high': { variant: 'default', className: 'bg-orange-600 text-white' },
      'medium': { variant: 'secondary', className: 'bg-blue-600 text-white' },
      'low': { variant: 'outline', className: 'bg-muted' },
    };
    return variants[priority] || variants.medium;
  };

  const activeGoals = allGoals.filter(g => g.status === 'in-progress');
  const completedGoals = allGoals.filter(g => g.status === 'completed');

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Goals & Objectives
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {activeGoals.length} active • {completedGoals.length} completed
              </p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search goals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Goals List */}
          <div className="space-y-3">
            {filteredGoals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                    ? "No goals match your filters"
                    : "No goals set yet"}
                </p>
                {!searchQuery && statusFilter === "all" && priorityFilter === "all" && (
                  <Button variant="outline" size="sm" onClick={() => setCreateDialogOpen(true)} className="mt-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Goal
                  </Button>
                )}
              </div>
            ) : (
              filteredGoals.map((goal) => {
                const statusBadge = getStatusBadge(goal.status);
                const priorityBadge = getPriorityBadge(goal.priority);
                const isOverdue = new Date(goal.targetDate) < new Date() && goal.status !== 'completed';

                return (
                  <Card key={goal.id} className="border-l-4" style={{
                    borderLeftColor: goal.priority === 'critical' ? 'hsl(var(--destructive))' :
                                     goal.priority === 'high' ? 'hsl(var(--warning))' :
                                     'hsl(var(--primary))'
                  }}>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {getStatusIcon(goal.status)}
                              <h4 className="font-semibold truncate">{goal.title}</h4>
                              <Badge variant={priorityBadge.variant} className={priorityBadge.className}>
                                {goal.priority}
                              </Badge>
                              <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                              {isOverdue && (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  Overdue
                                </Badge>
                              )}
                            </div>
                            {goal.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{goal.description}</p>
                            )}
                          </div>
                          {goal.status !== 'completed' && goal.status !== 'cancelled' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateProgress(goal)}
                            >
                              Update Progress
                            </Button>
                          )}
                        </div>

                        {/* Progress */}
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Overall Progress</span>
                            <span className="font-semibold">{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>

                        {/* KPIs */}
                        {goal.kpis && goal.kpis.length > 0 && (
                          <div className="pt-3 border-t">
                            <p className="text-sm font-semibold mb-2 flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              Key Performance Indicators
                            </p>
                            <div className="space-y-2">
                              {goal.kpis.map((kpi) => (
                                <div key={kpi.id}>
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-muted-foreground">{kpi.name}</span>
                                    <span className="font-medium">
                                      {kpi.current} / {kpi.target} {kpi.unit}
                                    </span>
                                  </div>
                                  <Progress value={(kpi.current / kpi.target) * 100} className="h-1.5" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Dates */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Start: {format(new Date(goal.startDate), "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            <span>Target: {format(new Date(goal.targetDate), "MMM d, yyyy")}</span>
                          </div>
                          {goal.completedDate && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Completed: {format(new Date(goal.completedDate), "MMM d, yyyy")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <GoalCreationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        consultantId={consultantId}
        onSuccess={() => {
          setCreateDialogOpen(false);
          // Force re-render
          window.location.reload();
        }}
      />

      {selectedGoal && (
        <GoalProgressDialog
          open={progressDialogOpen}
          onOpenChange={setProgressDialogOpen}
          goal={selectedGoal}
          onSuccess={() => {
            setProgressDialogOpen(false);
            setSelectedGoal(null);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
