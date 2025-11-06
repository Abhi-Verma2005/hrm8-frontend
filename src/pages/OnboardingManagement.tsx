import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Users, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { OnboardingWorkflowCard } from "@/components/onboarding/OnboardingWorkflowCard";
import { OnboardingWorkflowDialog } from "@/components/onboarding/OnboardingWorkflowDialog";
import { OnboardingTemplateDialog } from "@/components/onboarding/OnboardingTemplateDialog";
import { getOnboardingWorkflows, getOnboardingStats } from "@/lib/onboardingStorage";
import { OnboardingStatus } from "@/types/onboarding";

export default function OnboardingManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OnboardingStatus | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const workflows = useMemo(() => getOnboardingWorkflows(), [refreshKey]);
  const stats = useMemo(() => getOnboardingStats(), [refreshKey]);

  const filteredWorkflows = useMemo(() => {
    return workflows.filter(workflow => {
      const matchesSearch = 
        workflow.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.employeeEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || workflow.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || workflow.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [workflows, searchQuery, statusFilter, departmentFilter]);

  const departments = useMemo(() => {
    const depts = new Set(workflows.map(w => w.department));
    return Array.from(depts).sort();
  }, [workflows]);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowWorkflowDialog(false);
    setShowTemplateDialog(false);
  };

  return (
    <DashboardPageLayout>
      <Helmet>
        <title>Employee Onboarding - HRMS</title>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Employee Onboarding</h1>
          <p className="text-muted-foreground">Manage employee onboarding workflows, tasks, and documents</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.inProgress} in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.avgCompletionTime} days avg
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.taskCompletionRate}%</div>
              <p className="text-xs text-muted-foreground">
                All tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <Input
              placeholder="Search by name, email, or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowTemplateDialog(true)}>
              Manage Templates
            </Button>
            <Button onClick={() => setShowWorkflowDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </div>

        {/* Workflows List */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({workflows.length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({stats.inProgress})</TabsTrigger>
            <TabsTrigger value="not-started">Not Started ({stats.notStarted})</TabsTrigger>
            <TabsTrigger value="overdue">Overdue ({stats.overdue})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredWorkflows.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get started by creating your first onboarding workflow
                  </p>
                  <Button onClick={() => setShowWorkflowDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workflow
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWorkflows.map(workflow => (
                  <OnboardingWorkflowCard
                    key={workflow.id}
                    workflow={workflow}
                    onUpdate={handleSuccess}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorkflows.filter(w => w.status === 'in-progress').map(workflow => (
                <OnboardingWorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onUpdate={handleSuccess}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="not-started" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorkflows.filter(w => w.status === 'not-started').map(workflow => (
                <OnboardingWorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onUpdate={handleSuccess}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="overdue" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorkflows.filter(w => w.status === 'overdue').map(workflow => (
                <OnboardingWorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onUpdate={handleSuccess}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorkflows.filter(w => w.status === 'completed').map(workflow => (
                <OnboardingWorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onUpdate={handleSuccess}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <OnboardingWorkflowDialog
        open={showWorkflowDialog}
        onOpenChange={setShowWorkflowDialog}
        onSuccess={handleSuccess}
      />

        <OnboardingTemplateDialog
          open={showTemplateDialog}
          onOpenChange={setShowTemplateDialog}
          onSuccess={handleSuccess}
        />
      </div>
    </DashboardPageLayout>
  );
}
