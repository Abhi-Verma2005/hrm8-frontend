import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Target, FileText, Users, Calendar as CalendarIcon, TrendingUp } from "lucide-react";
import { GoalCard } from "@/components/performance/GoalCard";
import { ReviewCard } from "@/components/performance/ReviewCard";
import { Feedback360Card } from "@/components/performance/Feedback360Card";
import { getPerformanceGoals, getPerformanceReviews, getFeedback360, getReviewTemplates } from "@/lib/performanceStorage";

export default function PerformanceManagement() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock current user
  const currentEmployeeId = "1";

  const myGoals = useMemo(() => getPerformanceGoals(currentEmployeeId), [currentEmployeeId, refreshKey]);
  const myReviews = useMemo(() => getPerformanceReviews({ employeeId: currentEmployeeId }), [currentEmployeeId, refreshKey]);
  const my360Feedback = useMemo(() => getFeedback360(currentEmployeeId), [currentEmployeeId, refreshKey]);
  const templates = useMemo(() => getReviewTemplates(), [refreshKey]);

  const activeGoals = myGoals.filter(g => g.status === 'in-progress');
  const completedGoals = myGoals.filter(g => g.status === 'completed');
  const avgProgress = myGoals.length > 0 
    ? myGoals.reduce((sum, g) => sum + g.progress, 0) / myGoals.length 
    : 0;

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Performance Management</h1>
            <p className="text-muted-foreground">
              Track goals, reviews, and professional development
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Goal
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeGoals.length}</div>
              <p className="text-xs text-muted-foreground">
                {completedGoals.length} completed this year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgProgress.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">
                Across all goals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reviews</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myReviews.length}</div>
              <p className="text-xs text-muted-foreground">
                {myReviews.filter(r => r.status === 'completed').length} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">360 Feedback</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{my360Feedback.length}</div>
              <p className="text-xs text-muted-foreground">
                {my360Feedback.filter(f => f.status === 'in-progress').length} in progress
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="goals" className="w-full">
          <TabsList>
            <TabsTrigger value="goals">
              <Target className="mr-2 h-4 w-4" />
              Goals & KPIs
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <FileText className="mr-2 h-4 w-4" />
              Performance Reviews
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <Users className="mr-2 h-4 w-4" />
              360° Feedback
            </TabsTrigger>
            <TabsTrigger value="templates">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Review Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">My Goals</h3>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Goal
                </Button>
              </div>

              {myGoals.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Goals Set</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start tracking your performance by setting goals
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Goal
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {myGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Performance Reviews</h3>
              
              {myReviews.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Performance reviews will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {myReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">360° Feedback</h3>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Request Feedback
                </Button>
              </div>

              {my360Feedback.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No 360° Feedback</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Request feedback from your manager, peers, and team members
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Request Feedback
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {my360Feedback.map((feedback) => (
                    <Feedback360Card key={feedback.id} feedback={feedback} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Review Templates</h3>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{template.name}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Review Cycle</span>
                        <span className="font-medium capitalize">{template.cycle}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Sections</span>
                        <span className="font-medium">{template.sections.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Questions</span>
                        <span className="font-medium">
                          {template.sections.reduce((sum, s) => sum + s.questions.length, 0)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
