import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Video, 
  Calendar, 
  TrendingUp, 
  Users, 
  Settings, 
  Plus,
  FileText,
  BarChart3,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { getAIInterviewsByJob } from '@/lib/aiInterview/aiInterviewStorage';
import { format } from 'date-fns';
import { JobAIInterviewSettings } from './JobAIInterviewSettings';
import { BulkScheduleDialog } from './BulkScheduleDialog';
import type { Job } from '@/types/job';

interface JobAIInterviewsTabProps {
  job: Job;
}

export function JobAIInterviewsTab({ job }: JobAIInterviewsTabProps) {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showBulkSchedule, setShowBulkSchedule] = useState(false);
  const interviews = getAIInterviewsByJob(job.id);
  
  const completedInterviews = interviews.filter(i => i.status === 'completed');
  const scheduledInterviews = interviews.filter(i => i.status === 'scheduled');
  const inProgressInterviews = interviews.filter(i => i.status === 'in-progress');
  
  const avgScore = completedInterviews.length > 0
    ? Math.round(completedInterviews.reduce((sum, i) => sum + (i.analysis?.overallScore || 0), 0) / completedInterviews.length)
    : null;

  const strongCandidates = completedInterviews.filter(i => (i.analysis?.overallScore || 0) >= 75).length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Interviews</CardDescription>
            <CardTitle className="text-3xl">{interviews.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{completedInterviews.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average Score</CardDescription>
            <CardTitle className="text-3xl">
              {avgScore !== null ? (
                <span className={avgScore >= 75 ? 'text-green-600' : avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'}>
                  {avgScore}
                </span>
              ) : (
                <span className="text-muted-foreground text-xl">N/A</span>
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Strong Candidates (75+)</CardDescription>
            <CardTitle className="text-3xl text-green-600">{strongCandidates}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Bulk Schedule Interviews
                </h3>
                <p className="text-sm text-muted-foreground">
                  Schedule AI interviews for multiple applicants at once
                </p>
                <div className="pt-2 text-sm text-muted-foreground">
                  {job.applicantsCount} applicant{job.applicantsCount !== 1 ? 's' : ''} available
                </div>
              </div>
              <Button onClick={() => setShowBulkSchedule(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Interview Configuration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Configure default questions and settings for this job
                </p>
                <div className="pt-2">
                  {job.aiInterviewConfig?.defaultQuestions ? (
                    <Badge variant="outline">
                      {job.aiInterviewConfig.defaultQuestions.length} default questions
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Not configured</Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={() => setShowSettings(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interview List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Interview History</CardTitle>
              <CardDescription>All AI interviews conducted for this position</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/ai-interviews/analytics')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {interviews.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No AI interviews scheduled yet</p>
              <Button onClick={() => setShowBulkSchedule(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule First Interview
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Status Summary */}
              <div className="flex gap-4 text-sm">
                {scheduledInterviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>{scheduledInterviews.length} Scheduled</span>
                  </div>
                )}
                {inProgressInterviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-yellow-600" />
                    <span>{inProgressInterviews.length} In Progress</span>
                  </div>
                )}
                {completedInterviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>{completedInterviews.length} Completed</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Interview Cards */}
              <div className="space-y-3">
                {interviews.slice(0, 10).map((interview) => (
                  <div
                    key={interview.id}
                    className="border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => navigate(`/ai-interviews/${interview.id}`)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{interview.candidateName}</h4>
                          <Badge variant={interview.status === 'completed' ? 'outline' : 'secondary'}>
                            {interview.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(interview.scheduledDate), 'PPp')}</span>
                          </div>
                          <span className="capitalize">{interview.interviewMode}</span>
                        </div>

                        {interview.analysis && (
                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <span className={`text-lg font-bold ${
                                interview.analysis.overallScore >= 85 ? 'text-green-600' :
                                interview.analysis.overallScore >= 70 ? 'text-blue-600' :
                                interview.analysis.overallScore >= 60 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {interview.analysis.overallScore}
                              </span>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {interview.analysis.recommendation.replace('-', ' ')}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      {interview.reportId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/ai-interviews/reports/${interview.reportId}`);
                          }}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {interviews.length > 10 && (
                <div className="text-center pt-4">
                  <Button variant="outline" onClick={() => navigate('/ai-interviews', { state: { jobId: job.id } })}>
                    View All {interviews.length} Interviews
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {showSettings && (
        <JobAIInterviewSettings
          job={job}
          open={showSettings}
          onOpenChange={setShowSettings}
        />
      )}

      {showBulkSchedule && (
        <BulkScheduleDialog
          job={job}
          open={showBulkSchedule}
          onOpenChange={setShowBulkSchedule}
        />
      )}
    </div>
  );
}
