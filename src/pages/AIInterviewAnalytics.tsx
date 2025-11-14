import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAIInterviewSessions } from '@/lib/aiInterview/aiInterviewStorage';
import { BarChart3, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function AIInterviewAnalytics() {
  const sessions = getAIInterviewSessions();
  const completedSessions = sessions.filter(s => s.status === 'completed');
  
  const totalInterviews = sessions.length;
  const completionRate = totalInterviews > 0 
    ? Math.round((completedSessions.length / totalInterviews) * 100) 
    : 0;
  
  const avgScore = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((sum, s) => sum + (s.analysis?.overallScore || 0), 0) / completedSessions.length)
    : 0;
  
  const avgDuration = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / completedSessions.length / 60)
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="AI Interview Analytics"
        description="Insights and metrics from AI interviews"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInterviews}</div>
            <p className="text-xs text-muted-foreground">
              {completedSessions.length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Of scheduled interviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}</div>
            <p className="text-xs text-muted-foreground">
              Out of 100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDuration} min</div>
            <p className="text-xs text-muted-foreground">
              Per interview
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview Performance Overview</CardTitle>
          <CardDescription>Recent interview statistics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">
                  {sessions.filter(s => s.status === 'scheduled').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">
                  {sessions.filter(s => s.status === 'in-progress').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {completedSessions.length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedSessions
                .sort((a, b) => (b.analysis?.overallScore || 0) - (a.analysis?.overallScore || 0))
                .slice(0, 5)
                .map(session => (
                  <div key={session.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{session.candidateName}</p>
                      <p className="text-sm text-muted-foreground">{session.jobTitle}</p>
                    </div>
                    <div className="text-lg font-bold">{session.analysis?.overallScore}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interview Modes Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Video</span>
                <span className="font-bold">
                  {sessions.filter(s => s.interviewMode === 'video').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Phone</span>
                <span className="font-bold">
                  {sessions.filter(s => s.interviewMode === 'phone').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Text</span>
                <span className="font-bold">
                  {sessions.filter(s => s.interviewMode === 'text').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
