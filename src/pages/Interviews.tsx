import { useState, useEffect } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Video, Phone, Users, Plus, LayoutGrid, List, CalendarDays, BarChart3, FileText } from "lucide-react";
import { getInterviews, saveInterview, updateInterview } from "@/lib/mockInterviewStorage";
import { Interview } from "@/types/interview";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InterviewScheduler } from "@/components/interviews/InterviewScheduler";
import { getTemplateById } from "@/lib/mockTemplateStorage";
import { InterviewKanbanBoard } from "@/components/interviews/InterviewKanbanBoard";
import { InterviewDetailPanel } from "@/components/interviews/InterviewDetailPanel";
import { InterviewCalendarView } from "@/components/interviews/InterviewCalendarView";
import { InterviewAnalyticsDashboard } from "@/components/interviews/InterviewAnalyticsDashboard";
import { InterviewTemplateManager } from "@/components/interviews/InterviewTemplateManager";
import { InterviewCalibrationReport } from "@/components/interviews/InterviewCalibrationReport";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

export default function Interviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list" | "calendar" | "analytics" | "templates" | "calibration">("kanban");
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = () => {
    setInterviews(getInterviews());
  };

  const handleScheduleInterview = (data: any) => {
    const template = data.templateId ? getTemplateById(data.templateId) : null;
    
    const newInterview: Interview = {
      id: `int-${Date.now()}`,
      applicationId: 'app-temp',
      candidateId: 'cand-temp',
      candidateName: 'Sample Candidate',
      jobId: 'job-temp',
      jobTitle: 'Sample Position',
      templateId: data.templateId,
      questions: template?.questions,
      ratingCriteria: template?.ratingCriteria,
      interviewers: data.interviewers.split(',').map((email: string) => ({
        userId: `user-${Date.now()}`,
        name: email.trim(),
        email: email.trim(),
        role: 'interviewer',
        responseStatus: 'pending',
      })),
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      duration: data.duration,
      type: data.type,
      location: data.location,
      meetingLink: data.meetingLink,
      status: 'scheduled',
      agenda: data.agenda,
      feedback: [],
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveInterview(newInterview);
    loadInterviews();
    setIsSchedulerOpen(false);
    toast({
      title: "Interview Scheduled",
      description: template 
        ? `Interview scheduled with ${template.name} template`
        : "The interview has been scheduled successfully.",
    });
  };

  const getTypeIcon = (type: Interview['type']) => {
    const icons = {
      phone: <Phone className="h-4 w-4" />,
      video: <Video className="h-4 w-4" />,
      'in-person': <Users className="h-4 w-4" />,
      panel: <Users className="h-4 w-4" />,
    };
    return icons[type];
  };

  const getStatusBadge = (status: Interview['status']) => {
    const variants: Record<Interview['status'], any> = {
      scheduled: "secondary",
      completed: "default",
      cancelled: "outline",
      'no-show': "destructive",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const handleViewDetails = (interview: Interview) => {
    setSelectedInterview(interview);
    setIsDetailPanelOpen(true);
  };

  const handleUpdateInterview = (updatedInterview: Interview) => {
    updateInterview(updatedInterview.id, updatedInterview);
    loadInterviews();
    toast({
      title: "Interview Updated",
      description: "The interview has been updated successfully.",
    });
  };

  const handleReschedule = (interview: Interview, newDate: Date, newTime: string) => {
    updateInterview(interview.id, {
      scheduledDate: newDate.toISOString().split('T')[0],
      scheduledTime: newTime,
    });
    loadInterviews();
    toast({
      title: "Interview Rescheduled",
      description: `Interview with ${interview.candidateName} has been rescheduled`,
    });
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Interviews</h1>
            <p className="text-muted-foreground">
              Schedule and manage {interviews.length} candidate interviews
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
              <TabsList>
                <TabsTrigger value="kanban">
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Board
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="templates">
                  <FileText className="h-4 w-4 mr-2" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="calibration">
                  <Users className="h-4 w-4 mr-2" />
                  Calibration
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={() => setIsSchedulerOpen(true)}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </div>
        </div>

        {viewMode === "kanban" ? (
          <InterviewKanbanBoard onRefresh={loadInterviews} onViewDetails={handleViewDetails} />
        ) : viewMode === "calendar" ? (
          <InterviewCalendarView
            interviews={interviews}
            onViewDetails={handleViewDetails}
            onReschedule={handleReschedule}
          />
        ) : viewMode === "analytics" ? (
          <InterviewAnalyticsDashboard interviews={interviews} />
        ) : viewMode === "templates" ? (
          <InterviewTemplateManager />
        ) : viewMode === "calibration" ? (
          <InterviewCalibrationReport interviews={interviews} />
        ) : (
          <div className="grid gap-4">
            {interviews.map((interview) => (
              <Card 
                key={interview.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewDetails(interview)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{interview.candidateName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{interview.jobTitle}</p>
                    </div>
                    {getStatusBadge(interview.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(interview.type)}
                      <span className="capitalize">{interview.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {format(new Date(interview.scheduledDate), "PPP")} at {interview.scheduledTime}
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      {interview.duration} minutes
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {interviews.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No Scheduled Interviews</p>
                  <p className="text-sm text-muted-foreground">
                    Schedule interviews from candidate applications
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <Dialog open={isSchedulerOpen} onOpenChange={setIsSchedulerOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
            </DialogHeader>
            <InterviewScheduler
              candidateName="Sample Candidate"
              jobTitle="Sample Position"
              onSubmit={handleScheduleInterview}
              onCancel={() => setIsSchedulerOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <InterviewDetailPanel
          interview={selectedInterview}
          open={isDetailPanelOpen}
          onOpenChange={setIsDetailPanelOpen}
          onUpdateInterview={handleUpdateInterview}
        />
      </div>
    </DashboardPageLayout>
  );
}
