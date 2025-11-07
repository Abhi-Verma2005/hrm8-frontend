import { useState, useEffect } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Video, Phone, Users, Plus } from "lucide-react";
import { getInterviews, saveInterview } from "@/lib/mockInterviewStorage";
import { Interview } from "@/types/interview";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InterviewScheduler } from "@/components/interviews/InterviewScheduler";
import { toast } from "@/hooks/use-toast";

export default function Interviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = () => {
    setInterviews(getInterviews());
  };

  const handleScheduleInterview = (data: any) => {
    const newInterview: Interview = {
      id: `int-${Date.now()}`,
      applicationId: 'app-temp',
      candidateId: 'cand-temp',
      candidateName: 'Sample Candidate',
      jobId: 'job-temp',
      jobTitle: 'Sample Position',
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
      description: "The interview has been scheduled successfully.",
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

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Interviews</h1>
            <p className="text-muted-foreground">
              Schedule and manage candidate interviews
            </p>
          </div>
          <Button onClick={() => setIsSchedulerOpen(true)}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Schedule Interview
          </Button>
        </div>

        <div className="grid gap-4">
          {interviews.map((interview) => (
            <Card key={interview.id}>
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
      </div>
    </DashboardPageLayout>
  );
}
