import { useParams, useNavigate } from 'react-router-dom';
import { useAIInterview } from '@/hooks/useAIInterview';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, FileText, BarChart3, MessageSquare } from 'lucide-react';
import { LiveTranscript } from '@/components/aiInterview/interface/LiveTranscript';
import { AIInterviewAnalysis } from '@/components/aiInterview/analysis/AIInterviewAnalysis';
import { InterviewReport } from '@/components/aiInterview/reports/InterviewReport';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

export default function AIInterviewDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session, loading } = useAIInterview(id || '');

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-500',
    ready: 'bg-green-500',
    'in-progress': 'bg-yellow-500',
    completed: 'bg-purple-500',
    cancelled: 'bg-red-500',
    'no-show': 'bg-gray-500',
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title={`Interview with ${session.candidateName}`}
        description={`${session.jobTitle} - ${format(new Date(session.scheduledDate), 'PPp')}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/ai-interviews')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
            {session.status === 'scheduled' && (
              <Button onClick={() => navigate(`/ai-interviews/session/${session.invitationToken}`)}>
                <Play className="h-4 w-4 mr-2" />
                Start Interview
              </Button>
            )}
            {session.status === 'completed' && session.reportId && (
              <Button onClick={() => navigate(`/ai-interviews/reports/${session.reportId}`)}>
                <FileText className="h-4 w-4 mr-2" />
                View Report
              </Button>
            )}
          </div>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Interview Overview</CardTitle>
            <Badge className={statusColors[session.status]}>
              {session.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Mode</p>
            <p className="font-medium capitalize">{session.interviewMode}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Questions</p>
            <p className="font-medium">{session.questions.length} questions</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">{session.duration ? `${Math.floor(session.duration / 60)} min` : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="font-medium">{session.analysis?.overallScore ?? 'N/A'}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          {session.analysis && <TabsTrigger value="analysis">Analysis</TabsTrigger>}
          {session.analysis && <TabsTrigger value="report">Report</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interview Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Candidate</p>
                <p>{session.candidateName}</p>
                <p className="text-sm text-muted-foreground">{session.candidateEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Position</p>
                <p>{session.jobTitle}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p>{format(new Date(session.scheduledDate), 'PPpp')}</p>
              </div>
              {session.startedAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Started</p>
                  <p>{format(new Date(session.startedAt), 'PPpp')}</p>
                </div>
              )}
              {session.completedAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p>{format(new Date(session.completedAt), 'PPpp')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcript">
          <LiveTranscript transcript={session.transcript} />
        </TabsContent>

        {session.analysis && (
          <>
            <TabsContent value="analysis">
              <AIInterviewAnalysis analysis={session.analysis} />
            </TabsContent>
            <TabsContent value="report">
              <div className="text-center py-12 text-muted-foreground">
                Report generation in progress...
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
