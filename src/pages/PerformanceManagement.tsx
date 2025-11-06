import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Target, FileText, Users, Calendar as CalendarIcon, TrendingUp, MessageSquare, ClipboardCheck, Download, Sparkles, Award, AlertTriangle, GraduationCap } from "lucide-react";
import { GoalCard } from "@/components/performance/GoalCard";
import { ReviewCard } from "@/components/performance/ReviewCard";
import { Feedback360Card } from "@/components/performance/Feedback360Card";
import { GoalFormDialog } from "@/components/performance/GoalFormDialog";
import { GoalsFilterBar } from "@/components/performance/GoalsFilterBar";
import { Feedback360RequestDialog } from "@/components/performance/Feedback360RequestDialog";
import { Feedback360ResponseDialog } from "@/components/performance/Feedback360ResponseDialog";
import { ReviewCompletionDialog } from "@/components/performance/ReviewCompletionDialog";
import { GoalAnalyticsDashboard } from "@/components/performance/analytics/GoalAnalyticsDashboard";
import { GoalRecommendationsDialog } from "@/components/performance/GoalRecommendationsDialog";
import { PerformanceCalendar } from "@/components/performance/PerformanceCalendar";
import { ReviewDetailDialog } from "@/components/performance/ReviewDetailDialog";
import { PerformanceBenchmarking } from "@/components/performance/PerformanceBenchmarking";
import { GoalAlignmentView } from "@/components/performance/GoalAlignmentView";
import { PerformanceReportExportDialog } from "@/components/performance/PerformanceReportExportDialog";
import { ReviewTemplateBuilder } from "@/components/performance/ReviewTemplateBuilder";
import { PerformanceInsightsDashboard } from "@/components/performance/PerformanceInsightsDashboard";
import { OneOnOneMeetingTracker } from "@/components/performance/OneOnOneMeetingTracker";
import { CalibrationSessionManager } from "@/components/performance/CalibrationSessionManager";
import { SkillsAssessmentMatrix } from "@/components/performance/SkillsAssessmentMatrix";
import { PIPManager } from "@/components/performance/PIPManager";
import { SuccessionPlanning } from "@/components/performance/SuccessionPlanning";
import { LearningDevelopment } from "@/components/performance/LearningDevelopment";
import { getPerformanceGoals, getPerformanceReviews, getFeedback360, getReviewTemplates, mockCompanyOKRs, mockTeamObjectives, getOneOnOneMeetings, getMeetingTemplates, saveOneOnOneMeeting, getReviewSchedules, getCalibrationSessions, saveCalibrationSession, updateCalibrationSession, getSkillsAssessments, saveSkillsAssessment, updateSkillsAssessment, getPIPs, updatePIP, getSuccessionPlans } from "@/lib/performanceStorage";
import { getCourses, getTrainingPaths, getCourseEnrollments, getEmployeeCertifications, getSkillDevelopmentPrograms, getLearningAnalytics } from "@/lib/learningStorage";
import { getEmployees } from "@/lib/employeeStorage";
import type { PerformanceGoal, PerformanceReview, OneOnOneMeeting, MeetingAgendaTemplate, ReviewSchedule, Feedback360, CalibrationSession, SkillAssessment, PerformanceImprovementPlan, PIPCheckIn } from "@/types/performance";
import { mockCalibrationSessions } from "@/data/mockCalibrationData";
import { mockSkillCategories, mockSkillAssessments, mockRoleSkillRequirements } from "@/data/mockSkillsData";
import { mockPIPs } from "@/data/mockPIPData";
import { mockSuccessionPlans, mockNineBoxData, mockLeadershipPipeline } from "@/data/mockSuccessionData";
import { toast } from "sonner";

export default function PerformanceManagement() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<PerformanceGoal | undefined>(undefined);
  const [feedback360DialogOpen, setFeedback360DialogOpen] = useState(false);
  const [feedbackResponseDialogOpen, setFeedbackResponseDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [recommendationsDialogOpen, setRecommendationsDialogOpen] = useState(false);
  const [reviewDetailOpen, setReviewDetailOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [currentUserRole] = useState<'manager' | 'hr'>('manager'); // Mock role
  
  // Filter and sort state
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("progress-desc");

  // Mock current user
  const currentEmployeeId = "1";
  const currentEmployeeName = "John Smith";

  const allGoals = useMemo(() => getPerformanceGoals(currentEmployeeId), [currentEmployeeId, refreshKey]);
  const myReviews = useMemo(() => getPerformanceReviews({ employeeId: currentEmployeeId }), [currentEmployeeId, refreshKey]);
  const my360Feedback = useMemo(() => getFeedback360(currentEmployeeId), [currentEmployeeId, refreshKey]);
  const templates = useMemo(() => getReviewTemplates(), [refreshKey]);
  const schedules = useMemo(() => getReviewSchedules(), [refreshKey]);
  const meetings = useMemo(() => getOneOnOneMeetings(), [refreshKey]);
  const meetingTemplates = useMemo(() => getMeetingTemplates(), [refreshKey]);
  const calibrationSessions = useMemo(() => {
    const stored = getCalibrationSessions();
    return stored.length > 0 ? stored : mockCalibrationSessions;
  }, [refreshKey]);
  const skillsAssessments = useMemo(() => {
    const stored = getSkillsAssessments();
    return stored.length > 0 ? stored : mockSkillAssessments;
  }, [refreshKey]);
  const pips = useMemo(() => {
    const stored = getPIPs();
    return stored.length > 0 ? stored : mockPIPs;
  }, [refreshKey]);
  const successionPlans = useMemo(() => {
    const stored = getSuccessionPlans();
    return stored.length > 0 ? stored : mockSuccessionPlans;
  }, [refreshKey]);
  const employees = useMemo(() => getEmployees(), []);
  const currentEmployee = employees.find(e => e.id === currentEmployeeId) || employees[0];

  // Learning & Development data
  const courses = useMemo(() => getCourses(), [refreshKey]);
  const trainingPaths = useMemo(() => getTrainingPaths(), [refreshKey]);
  const courseEnrollments = useMemo(() => getCourseEnrollments(currentEmployeeId), [currentEmployeeId, refreshKey]);
  const employeeCertifications = useMemo(() => getEmployeeCertifications(currentEmployeeId), [currentEmployeeId, refreshKey]);
  const skillDevelopmentPrograms = useMemo(() => getSkillDevelopmentPrograms(currentEmployeeId), [currentEmployeeId, refreshKey]);
  const learningAnalytics = useMemo(() => getLearningAnalytics(currentEmployeeId), [currentEmployeeId, refreshKey]);

  // Apply filters and sorting
  const myGoals = useMemo(() => {
    let filtered = [...allGoals];

    // Search filter
    if (searchValue) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.title.toLowerCase().includes(search) ||
          g.description.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((g) => g.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((g) => g.priority === priorityFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((g) => g.category === categoryFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "progress-desc":
          return b.progress - a.progress;
        case "progress-asc":
          return a.progress - b.progress;
        case "priority-desc": {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        case "priority-asc": {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case "date-newest":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case "date-oldest":
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case "target-date":
          return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [allGoals, searchValue, statusFilter, priorityFilter, categoryFilter, sortBy]);

  const activeGoals = allGoals.filter(g => g.status === 'in-progress');
  const completedGoals = allGoals.filter(g => g.status === 'completed');
  const avgProgress = allGoals.length > 0 
    ? allGoals.reduce((sum, g) => sum + g.progress, 0) / allGoals.length 
    : 0;

  const activeFiltersCount = [
    searchValue !== "",
    statusFilter !== "all",
    priorityFilter !== "all",
    categoryFilter !== "all",
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    setSearchValue("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
  };

  const handleEditGoal = (goal: PerformanceGoal) => {
    setSelectedGoal(goal);
    setGoalDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setGoalDialogOpen(open);
    if (!open) {
      setSelectedGoal(undefined);
    }
  };

  const handleViewReview = (reviewId: string) => {
    const review = myReviews.find(r => r.id === reviewId);
    if (review) {
      setSelectedReview(review);
      setReviewDetailOpen(true);
    }
  };

  const handleApprovalUpdate = (reviewId: string, stageId: string, action: 'approve' | 'reject', comments: string) => {
    // In a real app, this would update the backend
    console.log('Approval action:', { reviewId, stageId, action, comments });
    setRefreshKey(prev => prev + 1);
    return Promise.resolve();
  };

  const handleCreateCalibrationSession = (session: Partial<CalibrationSession>) => {
    const newSession: CalibrationSession = {
      ...session as CalibrationSession,
      id: `cal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveCalibrationSession(newSession);
    setRefreshKey(prev => prev + 1);
  };

  const handleUpdateCalibrationSession = (id: string, updates: Partial<CalibrationSession>) => {
    updateCalibrationSession(id, updates);
    setRefreshKey(prev => prev + 1);
  };

  const handleCreateSkillsAssessment = (assessment: Partial<SkillAssessment>) => {
    const newAssessment: SkillAssessment = {
      ...assessment as SkillAssessment,
      id: `skills-assess-${Date.now()}`,
      employeeName: `${currentEmployee.firstName} ${currentEmployee.lastName}`,
      role: currentEmployee.jobTitle,
      department: currentEmployee.department,
      assessorId: currentEmployeeId,
      assessorName: `${currentEmployee.firstName} ${currentEmployee.lastName}`,
      assessmentDate: assessment.assessmentDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveSkillsAssessment(newAssessment);
    setRefreshKey(prev => prev + 1);
  };

  const handleUpdateSkillsAssessment = (id: string, updates: Partial<SkillAssessment>) => {
    updateSkillsAssessment(id, updates);
    setRefreshKey(prev => prev + 1);
  };

  const handleUpdatePIP = (id: string, updates: Partial<PerformanceImprovementPlan>) => {
    updatePIP(id, updates);
    setRefreshKey(prev => prev + 1);
  };

  const handleCreatePIPCheckIn = (pipId: string, checkIn: Partial<PIPCheckIn>) => {
    const pip = pips.find(p => p.id === pipId);
    if (!pip) return;

    const updatedCheckIns = [...pip.checkIns, checkIn as PIPCheckIn];
    updatePIP(pipId, { checkIns: updatedCheckIns });
    setRefreshKey(prev => prev + 1);
  };

  const handleEnrollCourse = (courseId: string) => {
    toast.success("Enrolled in course successfully");
    setRefreshKey(prev => prev + 1);
  };

  const handleStartCourse = (enrollmentId: string) => {
    toast.success("Course started");
    setRefreshKey(prev => prev + 1);
  };

  const handleViewCertificate = (certificationId: string) => {
    toast.success("Opening certificate");
  };

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
          <div className="flex gap-2">
            <Button onClick={() => setExportDialogOpen(true)} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button onClick={() => setFeedback360DialogOpen(true)} variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Request 360° Feedback
            </Button>
            <Button onClick={() => setReviewDialogOpen(true)} variant="outline">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Complete Review
            </Button>
            <Button onClick={() => {
              setSelectedGoal(undefined);
              setGoalDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              New Goal
            </Button>
          </div>
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
            <TabsTrigger value="insights">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="benchmarking">
              <TrendingUp className="mr-2 h-4 w-4" />
              Benchmarking
            </TabsTrigger>
            <TabsTrigger value="alignment">
              <Target className="mr-2 h-4 w-4" />
              Goal Alignment
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <FileText className="mr-2 h-4 w-4" />
              Performance Reviews
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <Users className="mr-2 h-4 w-4" />
              360° Feedback
            </TabsTrigger>
            <TabsTrigger value="meetings">
              <Users className="mr-2 h-4 w-4" />
              1-on-1s
            </TabsTrigger>
            <TabsTrigger value="calibration">
              <Users className="mr-2 h-4 w-4" />
              Calibration
            </TabsTrigger>
            <TabsTrigger value="skills">
              <Award className="mr-2 h-4 w-4" />
              Skills Matrix
            </TabsTrigger>
            <TabsTrigger value="pip">
              <AlertTriangle className="mr-2 h-4 w-4" />
              PIPs
            </TabsTrigger>
            <TabsTrigger value="succession">
              <Users className="mr-2 h-4 w-4" />
              Succession Planning
            </TabsTrigger>
            <TabsTrigger value="learning">
              <GraduationCap className="mr-2 h-4 w-4" />
              Learning & Development
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendar
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
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setRecommendationsDialogOpen(true)}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Recommendations
                  </Button>
                  <Button onClick={() => {
                    setSelectedGoal(undefined);
                    setGoalDialogOpen(true);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Goal
                  </Button>
                </div>
              </div>

              <GoalsFilterBar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityFilterChange={setPriorityFilter}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                onClearFilters={handleClearFilters}
                activeFiltersCount={activeFiltersCount}
              />

              {myGoals.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Goals Set</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start tracking your performance by setting goals
                    </p>
                    <Button onClick={() => {
                      setSelectedGoal(undefined);
                      setGoalDialogOpen(true);
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Goal
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {myGoals.map((goal) => (
                    <GoalCard 
                      key={goal.id} 
                      goal={goal} 
                      onEdit={handleEditGoal}
                      onProgressUpdate={() => setRefreshKey((prev) => prev + 1)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <PerformanceInsightsDashboard
              goals={allGoals}
              reviews={myReviews}
              employees={employees}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <GoalAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="benchmarking" className="space-y-6">
            <PerformanceBenchmarking 
              goals={allGoals}
              reviews={myReviews}
              employees={employees}
            />
          </TabsContent>

          <TabsContent value="alignment" className="space-y-6">
            <GoalAlignmentView
              goals={allGoals}
              companyOKRs={mockCompanyOKRs}
              teamObjectives={mockTeamObjectives}
              onViewGoal={handleEditGoal}
            />
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
                    <ReviewCard key={review.id} review={review} onView={handleViewReview} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">360° Feedback</h3>
                <Button onClick={() => setFeedback360DialogOpen(true)}>
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
                    <Button onClick={() => setFeedback360DialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Request Feedback
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {my360Feedback.map((feedback) => (
                    <div key={feedback.id} className="relative">
                      <Feedback360Card feedback={feedback} />
                      {feedback.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-4 right-4"
                          onClick={() => {
                            setSelectedFeedback(feedback);
                            setFeedbackResponseDialogOpen(true);
                          }}
                        >
                          Respond to Feedback
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <PerformanceCalendar
              goals={allGoals}
              reviews={myReviews}
              feedback={my360Feedback}
            />
          </TabsContent>

          <TabsContent value="meetings" className="space-y-6">
            <OneOnOneMeetingTracker
              meetings={meetings}
              templates={meetingTemplates}
              onScheduleMeeting={(meeting) => {
                saveOneOnOneMeeting(meeting);
                setRefreshKey(prev => prev + 1);
              }}
              onUpdateMeeting={(meeting) => {
                saveOneOnOneMeeting(meeting);
                setRefreshKey(prev => prev + 1);
              }}
              onUpdateActionItem={(meetingId, actionItem) => {
                const meeting = meetings.find(m => m.id === meetingId);
                if (meeting) {
                  const updated = {
                    ...meeting,
                    actionItems: meeting.actionItems.map(a => a.id === actionItem.id ? actionItem : a)
                  };
                  saveOneOnOneMeeting(updated);
                  setRefreshKey(prev => prev + 1);
                }
              }}
            />
          </TabsContent>

          <TabsContent value="calibration" className="space-y-6">
            <CalibrationSessionManager
              sessions={calibrationSessions}
              onCreateSession={handleCreateCalibrationSession}
              onUpdateSession={handleUpdateCalibrationSession}
            />
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <SkillsAssessmentMatrix
              categories={mockSkillCategories}
              assessments={skillsAssessments}
              roleRequirements={mockRoleSkillRequirements}
              currentEmployeeId={currentEmployeeId}
              onCreateAssessment={handleCreateSkillsAssessment}
              onUpdateAssessment={handleUpdateSkillsAssessment}
            />
          </TabsContent>

          <TabsContent value="pip" className="space-y-6">
            <PIPManager
              pips={pips}
              onUpdatePIP={handleUpdatePIP}
              onCreateCheckIn={handleCreatePIPCheckIn}
            />
          </TabsContent>

          <TabsContent value="succession" className="space-y-6">
            <SuccessionPlanning
              successionPlans={successionPlans}
              nineBoxData={mockNineBoxData}
              leadershipPipeline={mockLeadershipPipeline}
            />
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <LearningDevelopment
              courses={courses}
              trainingPaths={trainingPaths}
              enrollments={courseEnrollments}
              certifications={employeeCertifications}
              skillPrograms={skillDevelopmentPrograms}
              analytics={learningAnalytics!}
              onEnrollCourse={handleEnrollCourse}
              onStartCourse={handleStartCourse}
              onViewCertificate={handleViewCertificate}
            />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <ReviewTemplateBuilder />
          </TabsContent>
        </Tabs>

        <GoalFormDialog
          open={goalDialogOpen}
          onOpenChange={handleDialogClose}
          goal={selectedGoal}
          employeeId={currentEmployeeId}
          employeeName={currentEmployeeName}
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
        />

        <Feedback360RequestDialog
          open={feedback360DialogOpen}
          onOpenChange={setFeedback360DialogOpen}
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
        />

        {selectedFeedback && (
          <Feedback360ResponseDialog
            open={feedbackResponseDialogOpen}
            onOpenChange={setFeedbackResponseDialogOpen}
            feedback={selectedFeedback}
            providerId="current-user-id"
            providerName="Current User"
          />
        )}

        <ReviewCompletionDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          onComplete={() => setRefreshKey((prev) => prev + 1)}
        />

        <PerformanceReportExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
        />

        <GoalRecommendationsDialog
          open={recommendationsDialogOpen}
          onOpenChange={setRecommendationsDialogOpen}
          employee={currentEmployee}
          existingGoals={allGoals}
          onSelectGoal={(rec) => {
            // Pre-fill the goal form with recommendation
            setSelectedGoal({
              id: `goal-${Date.now()}`,
              employeeId: currentEmployeeId,
              employeeName: currentEmployeeName,
              title: rec.title,
              description: rec.description,
              category: rec.category,
              priority: rec.priority,
              status: 'not-started',
              progress: 0,
              startDate: new Date().toISOString().split('T')[0],
              targetDate: rec.timeline.includes('Q2') ? '2024-06-30' : '2024-12-31',
              kpis: [{
                id: 'kpi-1',
                name: rec.suggestedTarget,
                target: 100,
                current: 0,
                unit: '%'
              }],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: currentEmployeeId
            });
            setRecommendationsDialogOpen(false);
            setGoalDialogOpen(true);
          }}
        />

        {selectedReview && (
          <ReviewDetailDialog
            open={reviewDetailOpen}
            onOpenChange={setReviewDetailOpen}
            review={selectedReview}
            currentUserRole={currentUserRole}
            onApprovalUpdate={handleApprovalUpdate}
          />
        )}
      </div>
    </DashboardPageLayout>
  );
}
