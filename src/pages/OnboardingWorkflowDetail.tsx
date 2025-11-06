import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Calendar, User, Building2, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { OnboardingTasksSection } from "@/components/onboarding/OnboardingTasksSection";
import { OnboardingDocumentsSection } from "@/components/onboarding/OnboardingDocumentsSection";
import { OnboardingTimeline } from "@/components/onboarding/OnboardingTimeline";
import { OnboardingActivityFeed } from "@/components/onboarding/OnboardingActivityFeed";
import { getOnboardingWorkflowById, getOnboardingTasks, getOnboardingDocuments } from "@/lib/onboardingStorage";
import { format } from "date-fns";

export default function OnboardingWorkflowDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const workflow = useMemo(() => getOnboardingWorkflowById(id!), [id, refreshKey]);
  const tasks = useMemo(() => getOnboardingTasks(id!), [id, refreshKey]);
  const documents = useMemo(() => getOnboardingDocuments(id!), [id, refreshKey]);

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  if (!workflow) {
    return (
      <DashboardPageLayout>
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Workflow Not Found</h3>
              <p className="text-muted-foreground mb-4">The onboarding workflow you're looking for doesn't exist.</p>
              <Button onClick={() => navigate('/onboarding')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Onboarding
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardPageLayout>
    );
  }

  const getStatusBadge = () => {
    const variants: Record<typeof workflow.status, { variant: any; label: string }> = {
      'not-started': { variant: 'secondary', label: 'Not Started' },
      'in-progress': { variant: 'default', label: 'In Progress' },
      'completed': { variant: 'outline', label: 'Completed' },
      'overdue': { variant: 'destructive', label: 'Overdue' },
    };
    return variants[workflow.status];
  };

  const statusBadge = getStatusBadge();
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const approvedDocs = documents.filter(d => d.status === 'approved').length;
  const requiredDocs = documents.filter(d => d.required).length;

  return (
    <DashboardPageLayout>
      <Helmet>
        <title>{workflow.employeeName} - Onboarding</title>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/onboarding')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{workflow.employeeName}</h1>
            <p className="text-muted-foreground">{workflow.jobTitle} · {workflow.department}</p>
          </div>
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{workflow.progress}%</div>
                <Progress value={workflow.progress} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}/{tasks.length}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedDocs}/{requiredDocs}</div>
              <p className="text-xs text-muted-foreground">Required docs approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span>Start: {format(new Date(workflow.startDate), 'MMM d')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span>Due: {format(new Date(workflow.dueDate), 'MMM d')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Info */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">{workflow.employeeEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Department</p>
                  <p className="text-muted-foreground">{workflow.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Assigned To</p>
                  <p className="text-muted-foreground">{workflow.assignedToName}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tasks">
              Tasks ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="documents">
              Documents ({documents.length})
            </TabsTrigger>
            <TabsTrigger value="timeline">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="activity">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <OnboardingTasksSection 
              workflowId={workflow.id} 
              onUpdate={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="documents">
            <OnboardingDocumentsSection 
              workflowId={workflow.id} 
              onUpdate={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="timeline">
            <OnboardingTimeline 
              workflow={workflow}
              tasks={tasks}
              documents={documents}
            />
          </TabsContent>

          <TabsContent value="activity">
            <OnboardingActivityFeed 
              workflowId={workflow.id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
