import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, Award, Target, Clock, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getRecruiterPerformance } from '@/lib/backgroundChecks/analyticsService';

export default function RecruiterAnalyticsDashboard() {
  const { recruiterId } = useParams<{ recruiterId: string }>();
  const navigate = useNavigate();

  const allRecruiters = getRecruiterPerformance();
  const recruiter = allRecruiters.find(r => r.recruiterId === recruiterId);

  if (!recruiter) {
    return (
      <DashboardPageLayout title="Recruiter Not Found">
        <Card>
          <CardContent className="p-6">
            <p>Recruiter not found</p>
            <Button onClick={() => navigate('/background-checks/analytics')}>
              Back to Analytics
            </Button>
          </CardContent>
        </Card>
      </DashboardPageLayout>
    );
  }

  // Calculate team averages
  const teamAvg = {
    completionRate: allRecruiters.reduce((sum, r) => sum + r.completionRate, 0) / allRecruiters.length,
    onTimeRate: allRecruiters.reduce((sum, r) => sum + r.onTimeRate, 0) / allRecruiters.length,
    qualityScore: allRecruiters.reduce((sum, r) => sum + r.qualityScore, 0) / allRecruiters.length,
    avgCompletionTime: allRecruiters.reduce((sum, r) => sum + r.avgCompletionTime, 0) / allRecruiters.length,
  };

  // Mock trend data for the recruiter
  const trendData = Array.from({ length: 6 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
    initiated: Math.floor(recruiter.totalInitiated / 6 + Math.random() * 5),
    completed: Math.floor((recruiter.totalInitiated / 6) * (recruiter.completionRate / 100) + Math.random() * 3),
  }));

  // Radar chart data comparing to team average
  const radarData = [
    {
      metric: 'Completion Rate',
      value: recruiter.completionRate,
      teamAvg: teamAvg.completionRate,
    },
    {
      metric: 'On-Time Rate',
      value: recruiter.onTimeRate,
      teamAvg: teamAvg.onTimeRate,
    },
    {
      metric: 'Quality Score',
      value: recruiter.qualityScore,
      teamAvg: teamAvg.qualityScore,
    },
  ];

  const getComparisonBadge = (value: number, avg: number) => {
    const diff = value - avg;
    if (diff > 5) return <Badge className="bg-green-500">Above Average</Badge>;
    if (diff < -5) return <Badge variant="destructive">Below Average</Badge>;
    return <Badge variant="outline">Average</Badge>;
  };

  const overallScore = (recruiter.completionRate + recruiter.onTimeRate + recruiter.qualityScore) / 3;

  return (
    <DashboardPageLayout
      title={`${recruiter.recruiterName}'s Performance`}
      subtitle="Individual analytics and performance metrics"
      actions={
        <Button variant="outline" onClick={() => navigate('/background-checks/analytics')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Analytics
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Overall Score */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Overall Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-4xl font-bold mb-2">{overallScore.toFixed(1)}%</div>
                <Progress value={overallScore} className="h-3" />
              </div>
              {getComparisonBadge(overallScore, (teamAvg.completionRate + teamAvg.onTimeRate + teamAvg.qualityScore) / 3)}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Checks Initiated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-base font-semibold flex items-center justify-between">
                <div className="text-2xl font-bold">{recruiter.totalInitiated}</div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completion Rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-base font-semibold flex items-center justify-between">
                  <div className="text-2xl font-bold">{recruiter.completionRate.toFixed(1)}%</div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {recruiter.completionRate > teamAvg.completionRate ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>Above team avg ({teamAvg.completionRate.toFixed(1)}%)</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span>Below team avg ({teamAvg.completionRate.toFixed(1)}%)</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>On-Time Delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-base font-semibold flex items-center justify-between">
                  <div className="text-2xl font-bold">{recruiter.onTimeRate.toFixed(1)}%</div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {recruiter.onTimeRate > teamAvg.onTimeRate ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>Above team avg ({teamAvg.onTimeRate.toFixed(1)}%)</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span>Below team avg ({teamAvg.onTimeRate.toFixed(1)}%)</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Quality Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-base font-semibold flex items-center justify-between">
                  <div className="text-2xl font-bold">{recruiter.qualityScore.toFixed(1)}%</div>
                  <Award className="h-8 w-8 text-purple-500" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {recruiter.qualityScore > teamAvg.qualityScore ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>Above team avg ({teamAvg.qualityScore.toFixed(1)}%)</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span>Below team avg ({teamAvg.qualityScore.toFixed(1)}%)</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Performance Trend</CardTitle>
              <CardDescription>Checks initiated and completed over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} cursor={{ fill: 'transparent' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="initiated" fill="hsl(var(--primary))" name="Initiated" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="hsl(var(--success))" name="Completed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Comparison to Team Average */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Team Comparison</CardTitle>
              <CardDescription>Performance metrics vs. team average</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" className="text-xs" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar name="Your Performance" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                  <Radar name="Team Average" dataKey="teamAvg" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Improvement Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Improvement Suggestions</CardTitle>
            <CardDescription>Personalized recommendations based on your performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recruiter.completionRate < teamAvg.completionRate && (
                <div className="flex items-start gap-3 p-3 border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Boost Completion Rate</h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                      Your completion rate is {(teamAvg.completionRate - recruiter.completionRate).toFixed(1)}% below team average.
                      Consider sending more frequent reminders to candidates and referees.
                    </p>
                  </div>
                </div>
              )}

              {recruiter.onTimeRate < teamAvg.onTimeRate && (
                <div className="flex items-start gap-3 p-3 border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Improve On-Time Delivery</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                      Focus on reducing processing time by following up proactively with pending checks and automating reminders.
                    </p>
                  </div>
                </div>
              )}

              {recruiter.qualityScore < teamAvg.qualityScore && (
                <div className="flex items-start gap-3 p-3 border border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-900 rounded-lg">
                  <Award className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Enhance Quality Score</h4>
                    <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
                      Focus on thoroughness in check reviews and ensure all documentation is complete before finalizing checks.
                    </p>
                  </div>
                </div>
              )}

              {recruiter.completionRate >= teamAvg.completionRate &&
                recruiter.onTimeRate >= teamAvg.onTimeRate &&
                recruiter.qualityScore >= teamAvg.qualityScore && (
                  <div className="flex items-start gap-3 p-3 border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 rounded-lg">
                    <Award className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100">Excellent Performance!</h4>
                      <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                        You're performing above team average across all metrics. Keep up the great work!
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
