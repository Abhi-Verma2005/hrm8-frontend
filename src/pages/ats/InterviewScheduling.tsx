import { useState } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Video, Users, Plus, Calendar as CalendarIcon } from "lucide-react";
import { getInterviews, getInterviewStats, Interview } from "@/lib/interviewService";
import { format } from "date-fns";
import { ScheduleInterviewDialog } from "@/components/interviews/ScheduleInterviewDialog";

export default function InterviewScheduling() {
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("upcoming");

  const allInterviews = getInterviews();
  const stats = getInterviewStats();

  const filteredInterviews = allInterviews.filter((interview) => {
    const now = new Date();
    const interviewDate = new Date(interview.scheduledDate);

    if (filter === "upcoming") {
      return interview.status === "scheduled" && interviewDate > now;
    }
    if (filter === "completed") {
      return interview.status === "completed";
    }
    return true;
  });

  const getStatusColor = (status: Interview["status"]) => {
    switch (status) {
      case "scheduled":
        return "teal";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      case "no-show":
        return "orange";
      case "rescheduled":
        return "secondary";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type: Interview["type"]) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "phone":
        return <Clock className="h-4 w-4" />;
      case "in-person":
        return <Users className="h-4 w-4" />;
      case "technical":
        return <CalendarIcon className="h-4 w-4" />;
      case "panel":
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-base font-semibold flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Interview Scheduling</h1>
            <p className="text-muted-foreground">
              Manage and coordinate candidate interviews
            </p>
          </div>
          <Button onClick={() => setScheduleDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Interview
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcoming}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scheduled}</div>
            </CardContent>
          </Card>
        </div>

        {/* Interview List */}
        <Tabs defaultValue="upcoming" onValueChange={(v: any) => setFilter(v)}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4 mt-4">
            {filteredInterviews.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No interviews found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {filter === "upcoming"
                      ? "No upcoming interviews scheduled"
                      : filter === "completed"
                      ? "No completed interviews"
                      : "No interviews yet"}
                  </p>
                  <Button onClick={() => setScheduleDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredInterviews.map((interview) => (
                  <Card key={interview.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                          {getTypeIcon(interview.type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{interview.candidateName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {interview.jobTitle} • Round {interview.round}
                              </p>
                            </div>
                            <Badge variant={getStatusColor(interview.status)}>
                              {interview.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Date & Time</p>
                              <p className="font-medium">
                                {format(new Date(interview.scheduledDate), "MMM dd, yyyy")}
                              </p>
                              <p className="text-xs">
                                {format(new Date(interview.scheduledDate), "hh:mm a")}
                              </p>
                            </div>

                            <div>
                              <p className="text-muted-foreground">Duration</p>
                              <p className="font-medium">{interview.duration} minutes</p>
                            </div>

                            <div>
                              <p className="text-muted-foreground">Type</p>
                              <p className="font-medium capitalize">{interview.type}</p>
                            </div>

                            <div>
                              <p className="text-muted-foreground">Interviewers</p>
                              <p className="font-medium">
                                {interview.interviewerNames.join(", ")}
                              </p>
                            </div>
                          </div>

                          {interview.meetingLink && (
                            <div className="mt-3 pt-3 border-t">
                              <a
                                href={interview.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                Join Meeting →
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <ScheduleInterviewDialog
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
        />
      </div>
    </DashboardPageLayout>
  );
}
