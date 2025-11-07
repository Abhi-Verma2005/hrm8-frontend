import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Users, Clock, CheckCircle2, AlertCircle, Upload, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { OnboardingWorkflowCard } from "@/components/onboarding/OnboardingWorkflowCard";
import { OnboardingWorkflowDialog } from "@/components/onboarding/OnboardingWorkflowDialog";
import { OnboardingTemplateDialog } from "@/components/onboarding/OnboardingTemplateDialog";
import { OnboardingBulkActions } from "@/components/onboarding/OnboardingBulkActions";
import { OnboardingEmailDialog } from "@/components/onboarding/OnboardingEmailDialog";
import { ScheduledEmailsView } from "@/components/onboarding/ScheduledEmailsView";
import { AutomationRulesDialog } from "@/components/onboarding/AutomationRulesDialog";
import { AutomationMetricsDashboard } from "@/components/onboarding/AutomationMetricsDashboard";
import { EmailDeliveryHistory } from "@/components/onboarding/EmailDeliveryHistory";
import { EmailAnalyticsDashboard } from "@/components/onboarding/EmailAnalyticsDashboard";
import { getOnboardingWorkflows, getOnboardingStats, deleteOnboardingWorkflow, saveOnboardingWorkflow } from "@/lib/onboardingStorage";
import { OnboardingStatus, OnboardingWorkflow } from "@/types/onboarding";
import { exportToCSV } from "@/utils/exportHelpers";
import { useToast } from "@/hooks/use-toast";
import { scheduleEmail, updateScheduledEmail, ScheduledEmail } from "@/lib/scheduledEmails";
import { processAutomations } from "@/lib/automatedReminders";

export default function OnboardingManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OnboardingStatus | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedWorkflowIds, setSelectedWorkflowIds] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [activeView, setActiveView] = useState<'workflows' | 'scheduled' | 'metrics' | 'delivery' | 'analytics'>('workflows');
  const [editingScheduledEmail, setEditingScheduledEmail] = useState<ScheduledEmail | null>(null);
  const [showAutomationDialog, setShowAutomationDialog] = useState(false);
  const { toast } = useToast();

  const workflows = useMemo(() => getOnboardingWorkflows(), [refreshKey]);
  const stats = useMemo(() => getOnboardingStats(), [refreshKey]);

  // Automatically process automations on page load and when workflows change
  useEffect(() => {
    if (workflows.length > 0) {
      const result = processAutomations(workflows);
      
      if (result.created > 0) {
        toast({
          title: "Automation Rules Processed",
          description: `${result.created} email(s) scheduled automatically.`,
        });
      }
      
      if (result.errors.length > 0) {
        console.error("Automation errors:", result.errors);
      }
    }
  }, [workflows.length, toast]);

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
    
    // Process automations after workflow creation/update
    setTimeout(() => {
      const updatedWorkflows = getOnboardingWorkflows();
      const result = processAutomations(updatedWorkflows);
      
      if (result.created > 0) {
        toast({
          title: "Automation Applied",
          description: `${result.created} email(s) scheduled automatically based on your rules.`,
        });
      }
    }, 100);
  };

  const handleSelectWorkflow = (id: string, selected: boolean) => {
    setSelectedWorkflowIds(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleBulkDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmBulkDelete = () => {
    if (selectedWorkflowIds.size === 0) return;
    
    selectedWorkflowIds.forEach(id => {
      deleteOnboardingWorkflow(id);
    });
    
    toast({
      title: "Workflows deleted",
      description: `${selectedWorkflowIds.size} workflow(s) deleted successfully.`,
    });
    
    setSelectedWorkflowIds(new Set());
    setShowDeleteDialog(false);
    setRefreshKey(prev => prev + 1);
  };

  const selectedWorkflows = useMemo(() => {
    return workflows.filter(w => selectedWorkflowIds.has(w.id));
  }, [workflows, selectedWorkflowIds]);

  const handleBulkStatusUpdate = (status: OnboardingStatus) => {
    if (selectedWorkflowIds.size === 0) return;
    
    selectedWorkflowIds.forEach(id => {
      const workflow = workflows.find(w => w.id === id);
      if (workflow) {
        saveOnboardingWorkflow({ ...workflow, status });
      }
    });
    
    toast({
      title: "Status updated",
      description: `${selectedWorkflowIds.size} workflow(s) updated to ${status}.`,
    });
    
    setSelectedWorkflowIds(new Set());
    setRefreshKey(prev => prev + 1);
  };

  const handleBulkExport = () => {
    if (selectedWorkflowIds.size === 0) return;
    
    const selectedWorkflows = workflows.filter(w => selectedWorkflowIds.has(w.id));
    const exportData = selectedWorkflows.map(w => ({
      'Employee Name': w.employeeName,
      'Email': w.employeeEmail,
      'Job Title': w.jobTitle,
      'Department': w.department,
      'Status': w.status,
      'Progress': `${w.progress}%`,
      'Start Date': w.startDate,
      'Due Date': w.dueDate,
      'Assigned To': w.assignedToName,
    }));
    
    exportToCSV(exportData, 'onboarding-workflows');
    
    toast({
      title: "Export successful",
      description: `${selectedWorkflowIds.size} workflow(s) exported to CSV.`,
    });
  };

  const handleSendEmail = (emailType: string, message: string, workflowIds: string[]) => {
    if (workflowIds.length === 0) return;
    
    toast({
      title: "Emails Sent",
      description: `Sent ${emailType} email to ${workflowIds.length} employee(s).`,
    });
    
    setSelectedWorkflowIds(new Set());
  };

  const handleScheduleEmail = (emailType: string, message: string, workflowIds: string[], scheduledFor: Date) => {
    if (workflowIds.length === 0) return;
    
    if (editingScheduledEmail) {
      // Update existing scheduled email
      updateScheduledEmail(editingScheduledEmail.id, {
        emailType,
        message,
        recipientIds: workflowIds,
        scheduledFor,
      });
      
      toast({
        title: "Scheduled Email Updated",
        description: `Email has been updated and will be sent on ${scheduledFor.toLocaleString()}.`,
      });
      
      setEditingScheduledEmail(null);
    } else {
      // Create new scheduled email
      scheduleEmail(emailType, message, workflowIds, scheduledFor);
      
      toast({
        title: "Email Scheduled",
        description: `Email scheduled for ${scheduledFor.toLocaleString()} to ${workflowIds.length} employee(s).`,
      });
    }
    
    setSelectedWorkflowIds(new Set());
  };

  const handleEditScheduledEmail = (email: ScheduledEmail) => {
    setEditingScheduledEmail(email);
    
    // Find workflows that match the recipient IDs
    const recipientWorkflows = workflows.filter(w => email.recipientIds.includes(w.id));
    setSelectedWorkflowIds(new Set(email.recipientIds));
    
    setShowEmailDialog(true);
  };

  const handleClearSelection = () => {
    setSelectedWorkflowIds(new Set());
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredWorkflows.map(w => w.id));
      setSelectedWorkflowIds(allIds);
    } else {
      setSelectedWorkflowIds(new Set());
    }
  };

  const isAllSelected = filteredWorkflows.length > 0 && 
    filteredWorkflows.every(w => selectedWorkflowIds.has(w.id));
  
  const isSomeSelected = filteredWorkflows.some(w => selectedWorkflowIds.has(w.id)) && !isAllSelected;

  return (
    <DashboardPageLayout
      breadcrumbActions={
        <>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </>
      }
    >
      <Helmet>
        <title>Employee Onboarding - HRMS</title>
      </Helmet>

      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Onboarding</h1>
            <p className="text-muted-foreground">Manage employee onboarding workflows, tasks, and documents</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAutomationDialog(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Automation Rules
            </Button>
            <Button variant="outline" onClick={() => setShowTemplateDialog(true)}>
              Manage Templates
            </Button>
            <Button onClick={() => setShowWorkflowDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </div>

        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'workflows' | 'scheduled' | 'metrics' | 'delivery' | 'analytics')}>
          <TabsList>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Emails</TabsTrigger>
            <TabsTrigger value="metrics">Automation Metrics</TabsTrigger>
            <TabsTrigger value="delivery">Delivery History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="space-y-6">
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 border rounded-md px-3 h-10">
            <Checkbox
              checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium">
              {isAllSelected ? "Deselect All" : "Select All"}
            </span>
          </div>

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
                    isSelected={selectedWorkflowIds.has(workflow.id)}
                    onSelect={handleSelectWorkflow}
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
                  isSelected={selectedWorkflowIds.has(workflow.id)}
                  onSelect={handleSelectWorkflow}
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
                  isSelected={selectedWorkflowIds.has(workflow.id)}
                  onSelect={handleSelectWorkflow}
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
                  isSelected={selectedWorkflowIds.has(workflow.id)}
                  onSelect={handleSelectWorkflow}
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
                  isSelected={selectedWorkflowIds.has(workflow.id)}
                  onSelect={handleSelectWorkflow}
                />
              ))}
            </div>
          </TabsContent>
          </Tabs>
        </TabsContent>

      <TabsContent value="scheduled" className="space-y-6">
        <ScheduledEmailsView 
          onEdit={handleEditScheduledEmail}
          allWorkflows={workflows}
        />
      </TabsContent>

      <TabsContent value="metrics" className="space-y-6">
        <AutomationMetricsDashboard />
      </TabsContent>

      <TabsContent value="delivery" className="space-y-6">
        <EmailDeliveryHistory />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <EmailAnalyticsDashboard />
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

        <OnboardingBulkActions
          selectedCount={selectedWorkflowIds.size}
          onUpdateStatus={handleBulkStatusUpdate}
          onDelete={handleBulkDelete}
          onExport={handleBulkExport}
          onSendEmail={() => setShowEmailDialog(true)}
          onClearSelection={handleClearSelection}
        />

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Workflows</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedWorkflowIds.size} workflow(s)? This action cannot be undone and will also delete all associated tasks and documents.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="max-h-[300px] overflow-y-auto border rounded-md p-4 space-y-2">
              <p className="text-sm font-medium mb-2">Workflows to be deleted:</p>
              {selectedWorkflows.map(workflow => (
                <div key={workflow.id} className="text-sm p-2 bg-muted rounded-md">
                  <div className="font-medium">{workflow.employeeName}</div>
                  <div className="text-muted-foreground text-xs">
                    {workflow.jobTitle} • {workflow.department}
                  </div>
                </div>
              ))}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive hover:bg-destructive/90">
                Delete {selectedWorkflowIds.size} Workflow{selectedWorkflowIds.size > 1 ? 's' : ''}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <OnboardingEmailDialog
          open={showEmailDialog}
          onOpenChange={(open) => {
            setShowEmailDialog(open);
            if (!open) setEditingScheduledEmail(null);
          }}
          selectedCount={selectedWorkflowIds.size}
          selectedWorkflows={selectedWorkflows}
          onSend={handleSendEmail}
          onSchedule={handleScheduleEmail}
          editingScheduledId={editingScheduledEmail?.id}
          initialData={editingScheduledEmail ? {
            emailType: editingScheduledEmail.emailType,
            message: editingScheduledEmail.message,
            recipientIds: editingScheduledEmail.recipientIds,
            scheduledFor: editingScheduledEmail.scheduledFor,
          } : undefined}
        />

        <AutomationRulesDialog
          open={showAutomationDialog}
          onOpenChange={setShowAutomationDialog}
          workflows={workflows}
        />
      </div>
    </DashboardPageLayout>
  );
}
