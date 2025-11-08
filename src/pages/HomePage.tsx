import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Users, Briefcase, Calendar, TrendingUp, Award, BookOpen,
  Clock, Target, FileText, MessageSquare, DollarSign, LogOut
} from "lucide-react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getEmployees } from "@/lib/employeeStorage";
import { getPerformanceGoals, getPerformanceReviews, getFeedback360 } from "@/lib/performanceStorage";
import { getLeaveRequests } from "@/lib/leaveStorage";
import { format } from "date-fns";

export default function HomePage() {
  const navigate = useNavigate();

  // Fetch data from all modules
  const employees = useMemo(() => getEmployees(), []);
  const goals = useMemo(() => getPerformanceGoals(), []);
  const reviews = useMemo(() => getPerformanceReviews(), []);
  const feedback360 = useMemo(() => getFeedback360(), []);
  const leaveRequests = useMemo(() => getLeaveRequests(), []);

  // Calculate key metrics
  const stats = useMemo(() => {
    const activeEmployees = employees.filter(e => e.status === 'active').length;
    const newHires = employees.filter(e => {
      const hireDate = new Date(e.hireDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return hireDate > thirtyDaysAgo;
    }).length;

    const activeGoals = goals.filter(g => g.status === 'in-progress').length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const goalCompletionRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

    const pendingReviews = reviews.filter(r => r.status === 'in-progress' || r.status === 'not-started').length;
    
    const pending360Feedback = feedback360.filter(f => f.status === 'pending' || f.status === 'in-progress').length;

    const pendingLeaveRequests = leaveRequests.filter(l => l.status === 'pending').length;

    const avgRating = reviews
      .filter(r => r.overallRating)
      .reduce((sum, r) => sum + r.overallRating!, 0) / reviews.filter(r => r.overallRating).length || 0;

    return {
      activeEmployees,
      newHires,
      activeGoals,
      goalCompletionRate,
      pendingReviews,
      pending360Feedback,
      pendingLeaveRequests,
      avgRating: avgRating.toFixed(1),
    };
  }, [employees, goals, reviews, feedback360, leaveRequests]);

  // Recent activity
  const recentActivity = useMemo(() => {
    const activities: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      timestamp: string;
      icon: typeof Users;
    }> = [];

    // Recent goals
    goals.slice(0, 3).forEach(goal => {
      activities.push({
        id: goal.id,
        type: 'goal',
        title: 'Goal Updated',
        description: `${goal.employeeName}: ${goal.title}`,
        timestamp: goal.updatedAt,
        icon: Target,
      });
    });

    // Recent reviews
    reviews.slice(0, 3).forEach(review => {
      activities.push({
        id: review.id,
        type: 'review',
        title: 'Review Progress',
        description: `${review.employeeName} - ${review.status}`,
        timestamp: review.updatedAt,
        icon: FileText,
      });
    });

    // Recent leave requests
    leaveRequests.slice(0, 2).forEach(leave => {
      activities.push({
        id: leave.id,
        type: 'leave',
        title: 'Leave Request',
        description: `${leave.employeeName} - ${leave.leaveTypeName}`,
        timestamp: leave.createdAt,
        icon: Calendar,
      });
    });

    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 10);
  }, [goals, reviews, leaveRequests]);

  return (
    <DashboardPageLayout>
      <Helmet>
        <title>Home - HRMS Dashboard</title>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">Here's what's happening across your organization</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/hrms')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Active Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeEmployees}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.newHires} new hires this month
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/performance')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                Active Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeGoals}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.goalCompletionRate}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/performance')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Pending Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReviews}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Avg rating: {stats.avgRating}/5.0
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/leave')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Leave Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingLeaveRequests}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Pending approval
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => navigate('/hrms')}>
                <Users className="h-6 w-6 mb-2" />
                <span className="text-xs">Employees</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => navigate('/jobs')}>
                <Briefcase className="h-6 w-6 mb-2" />
                <span className="text-xs">Jobs</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => navigate('/performance/goals/new')}>
                <Target className="h-6 w-6 mb-2" />
                <span className="text-xs">New Goal</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => navigate('/performance/reviews/new')}>
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-xs">New Review</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => navigate('/talent-development')}>
                <BookOpen className="h-6 w-6 mb-2" />
                <span className="text-xs">Learning</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => navigate('/attendance')}>
                <Clock className="h-6 w-6 mb-2" />
                <span className="text-xs">Attendance</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No recent activity
                    </p>
                  ) : (
                    recentActivity.map((activity) => {
                      const ActivityIcon = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <ActivityIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Cards */}
          <div className="space-y-6">
            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Goal Completion</span>
                    <span className="font-medium">{stats.goalCompletionRate}%</span>
                  </div>
                  <Progress value={stats.goalCompletionRate} />
                </div>
                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pending Reviews</span>
                    <Badge variant="secondary">{stats.pendingReviews}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">360 Feedback</span>
                    <Badge variant="secondary">{stats.pending360Feedback}</Badge>
                  </div>
                </div>
                <Button className="w-full" onClick={() => navigate('/performance')}>
                  View Performance
                </Button>
              </CardContent>
            </Card>

            {/* Module Access */}
            <Card>
              <CardHeader>
                <CardTitle>Modules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/compensation')}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Compensation
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/onboarding')}>
                  <Award className="h-4 w-4 mr-2" />
                  Onboarding
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/offboarding')}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Offboarding
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/analytics')}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
