import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OnboardingChecklist } from './onboarding/OnboardingChecklist';
import { OnboardingDocuments } from './onboarding/OnboardingDocuments';
import { OnboardingTraining } from './onboarding/OnboardingTraining';
import { CreateOnboardingDialog } from './onboarding/CreateOnboardingDialog';
import { CheckSquare, FileText, GraduationCap, Calendar, Users, Play, CheckCircle } from 'lucide-react';
import { getConsultantWorkflow } from '@/lib/onboardingStorage';
import { format } from 'date-fns';

interface OnboardingTabProps {
  consultantId: string;
  consultantName: string;
}

export function OnboardingTab({ consultantId, consultantName }: OnboardingTabProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const workflow = getConsultantWorkflow(consultantId);

  if (!workflow) {
    return (
      <>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Onboarding Workflow</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create an onboarding workflow to track progress, manage documents, and assign training modules.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Play className="mr-2 h-4 w-4" />
              Start Onboarding
            </Button>
          </CardContent>
        </Card>

        <CreateOnboardingDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          consultantId={consultantId}
          consultantName={consultantName}
          onCreated={() => {
            setShowCreateDialog(false);
            window.location.reload();
          }}
        />
      </>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const isOverdue = new Date(workflow.targetCompletionDate) < new Date() && workflow.status !== 'completed';

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle>Onboarding Progress</CardTitle>
                <Badge variant={getStatusColor(isOverdue ? 'overdue' : workflow.status)}>
                  {isOverdue ? 'Overdue' : workflow.status.replace('-', ' ')}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {workflow.consultantType}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Started: {format(new Date(workflow.startDate), 'MMM dd, yyyy')} • 
                Target: {format(new Date(workflow.targetCompletionDate), 'MMM dd, yyyy')}
              </p>
            </div>
            {workflow.status === 'completed' && (
              <CheckCircle className="h-8 w-8 text-green-500" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-bold">{workflow.overallProgress}%</span>
              </div>
              <Progress value={workflow.overallProgress} className="h-3" />
            </div>

            {/* Progress Grid */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Checklist</span>
                    </div>
                    <span className="text-lg font-bold">{workflow.checklistProgress}%</span>
                  </div>
                  <Progress value={workflow.checklistProgress} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Documents</span>
                    </div>
                    <span className="text-lg font-bold">{workflow.documentProgress}%</span>
                  </div>
                  <Progress value={workflow.documentProgress} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Training</span>
                    </div>
                    <span className="text-lg font-bold">{workflow.trainingProgress}%</span>
                  </div>
                  <Progress value={workflow.trainingProgress} />
                </CardContent>
              </Card>
            </div>

            {/* Key Info */}
            <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
              {workflow.onboardingCoordinatorName && (
                <div>
                  <span className="text-sm text-muted-foreground">Coordinator:</span>
                  <span className="ml-2 font-medium">{workflow.onboardingCoordinatorName}</span>
                </div>
              )}
              {workflow.buddyName && (
                <div>
                  <span className="text-sm text-muted-foreground">Buddy:</span>
                  <span className="ml-2 font-medium">{workflow.buddyName}</span>
                </div>
              )}
              {workflow.firstDayDate && (
                <div>
                  <span className="text-sm text-muted-foreground">First Day:</span>
                  <span className="ml-2 font-medium">
                    {format(new Date(workflow.firstDayDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
              {workflow.orientationDate && (
                <div>
                  <span className="text-sm text-muted-foreground">Orientation:</span>
                  <span className="ml-2 font-medium">
                    {format(new Date(workflow.orientationDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="checklist">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="checklist">
            <CheckSquare className="h-4 w-4 mr-2" />
            Checklist
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="training">
            <GraduationCap className="h-4 w-4 mr-2" />
            Training
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checklist">
          <OnboardingChecklist workflow={workflow} />
        </TabsContent>

        <TabsContent value="documents">
          <OnboardingDocuments workflow={workflow} />
        </TabsContent>

        <TabsContent value="training">
          <OnboardingTraining workflow={workflow} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
