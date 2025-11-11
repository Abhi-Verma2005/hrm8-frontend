import { useState, useMemo } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { DashboardActionBar } from '@/components/dashboard/DashboardActionBar';
import { ActiveFiltersIndicator } from '@/components/dashboard/ActiveFiltersIndicator';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { PendingActionsCard } from '@/components/assessments/PendingActionsCard';
import { RecentActivityTimeline } from '@/components/assessments/RecentActivityTimeline';
import { EditModeToggle } from '@/components/dashboard/EditModeToggle';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck, TrendingUp, Award, Clock, Users, FileCheck, List } from 'lucide-react';
import { getAssessmentStats, getAssessmentVolumeData, getAssessmentTypeDistribution, getProviderPerformanceData, getScoreDistributionData, getRecentActivity } from '@/lib/assessments/dashboardStats';
import { applyLocationFilterToTimeSeries } from '@/lib/assessments/mockDataWithLocations';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import type { DateRange } from 'react-day-picker';

export default function AssessmentsDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [country, setCountry] = useState('all');
  const [region, setRegion] = useState('all');

  const stats = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return getAssessmentStats({ from: dateRange.from, to: dateRange.to }, country, region);
    }
    return getAssessmentStats(undefined, country, region);
  }, [dateRange, country, region]);

  const volumeData = useMemo(() => {
    const dateFilter = dateRange?.from && dateRange?.to ? { from: dateRange.from, to: dateRange.to } : undefined;
    const data = getAssessmentVolumeData(dateFilter, country, region);
    return applyLocationFilterToTimeSeries(data, country, region);
  }, [dateRange, country, region]);

  const typeDistribution = useMemo(() => {
    const dateFilter = dateRange?.from && dateRange?.to ? { from: dateRange.from, to: dateRange.to } : undefined;
    return getAssessmentTypeDistribution(dateFilter, country, region);
  }, [dateRange, country, region]);

  const providerPerformance = useMemo(() => {
    const dateFilter = dateRange?.from && dateRange?.to ? { from: dateRange.from, to: dateRange.to } : undefined;
    return getProviderPerformanceData(dateFilter, country, region);
  }, [dateRange, country, region]);

  const scoreDistribution = useMemo(() => {
    const dateFilter = dateRange?.from && dateRange?.to ? { from: dateRange.from, to: dateRange.to } : undefined;
    return getScoreDistributionData(dateFilter, country, region);
  }, [dateRange, country, region]);

  const recentActivity = useMemo(() => 
    getRecentActivity(),
    []
  );

  const hasActiveFilters = dateRange !== undefined || country !== 'all' || region !== 'all';

  const clearFilters = () => {
    setDateRange(undefined);
    setCountry('all');
    setRegion('all');
  };

  const handleExport = () => {
    toast({ title: "Exporting assessment analytics..." });
  };

  return (
    <DashboardPageLayout
      title="Assessments Analytics"
      dashboardActions={<EditModeToggle isEditMode={isEditMode} onToggle={() => setIsEditMode(!isEditMode)} />}
    >
      <div className="min-h-screen bg-background p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight transition-colors duration-500">Assessments Analytics</h1>
            <p className="text-muted-foreground transition-colors duration-500">
              Monitor candidate assessment performance and insights
            </p>
          </div>
          {!isEditMode && (
            <DashboardActionBar
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              selectedCountry={country}
              selectedRegion={region}
              onCountryChange={setCountry}
              onRegionChange={setRegion}
              onExport={handleExport}
              onResetFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          )}
        </div>

        {hasActiveFilters && (
          <ActiveFiltersIndicator
            dateRange={dateRange}
            selectedCountry={country}
            selectedRegion={region}
            onClearCountry={() => setCountry('all')}
            onClearRegion={() => setRegion('all')}
            onClearDateRange={() => setDateRange(undefined)}
          />
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Total Assessments"
            value={stats.total}
            icon={<ClipboardCheck className="h-6 w-6" />}
            change={`${Math.abs(stats.changeFromLastMonth.total)}%`}
            trend={stats.changeFromLastMonth.total > 0 ? 'up' : 'down'}
            showGradient={false}
            showBorder={true}
            elevation="sm"
            variant="neutral"
          />
          <EnhancedStatCard
            title="Active Assessments"
            value={stats.active}
            icon={<TrendingUp className="h-6 w-6" />}
            change={`${Math.abs(stats.changeFromLastMonth.active)}%`}
            trend={stats.changeFromLastMonth.active > 0 ? 'up' : 'down'}
            showGradient={false}
            showBorder={true}
            elevation="sm"
            variant="primary"
          />
          <EnhancedStatCard
            title="Avg. Score"
            value={`${stats.avgScore}%`}
            icon={<Award className="h-6 w-6" />}
            change={`${Math.abs(stats.changeFromLastMonth.avgScore)}%`}
            trend={stats.changeFromLastMonth.avgScore > 0 ? 'up' : 'down'}
            showGradient={false}
            showBorder={true}
            elevation="sm"
            variant="success"
          />
          <EnhancedStatCard
            title="Pass Rate"
            value={`${stats.passRate}%`}
            icon={<Clock className="h-6 w-6" />}
            change={`${Math.abs(stats.changeFromLastMonth.completed)}%`}
            trend={stats.changeFromLastMonth.completed > 0 ? 'up' : 'down'}
            showGradient={false}
            showBorder={true}
            elevation="sm"
            variant="warning"
          />
        </div>

        <PendingActionsCard
          pendingInvitations={stats.pendingInvitations}
          expiringSoon={stats.expiringSoon}
          needsReview={stats.needsReview}
          lowScores={stats.lowScores}
          onSendInvitations={() => navigate('/assessments')}
          onViewExpiring={() => navigate('/assessments')}
          onViewReview={() => navigate('/assessments')}
          onViewLowScores={() => navigate('/assessments')}
        />

        <Card className="transition-[background,border-color,box-shadow,color] duration-500">
          <CardHeader>
            <CardTitle className="transition-colors duration-500">Assessment Overview</CardTitle>
            <CardDescription className="transition-colors duration-500">
              Summary of assessment activity and statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm font-medium transition-colors duration-500">Completion Rate</p>
                <p className="text-2xl font-bold transition-colors duration-500">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground transition-colors duration-500">
                  {stats.completed} of {stats.total} completed
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium transition-colors duration-500">Avg. Completion Time</p>
                <p className="text-2xl font-bold transition-colors duration-500">{stats.avgCompletionTime} min</p>
                <p className="text-xs text-muted-foreground transition-colors duration-500">
                  Across all assessments
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium transition-colors duration-500">In Progress</p>
                <p className="text-2xl font-bold transition-colors duration-500">{stats.active}</p>
                <p className="text-xs text-muted-foreground transition-colors duration-500">
                  Currently active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-[background,border-color,box-shadow,color] duration-500">
          <CardHeader>
            <CardTitle className="transition-colors duration-500">Charts & Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="trends" className="space-y-4">
              <TabsList>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="quality">Quality</TabsTrigger>
              </TabsList>

              <TabsContent value="trends" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="transition-[background,border-color,box-shadow,color] duration-500">
                    <CardHeader>
                      <CardTitle className="transition-colors duration-500">Assessment Volume Trends</CardTitle>
                      <CardDescription className="transition-colors duration-500">Monthly assessment activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground transition-colors duration-500">
                          Volume chart: {volumeData.length} months of data
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="transition-[background,border-color,box-shadow,color] duration-500">
                    <CardHeader>
                      <CardTitle className="transition-colors duration-500">Status Distribution</CardTitle>
                      <CardDescription className="transition-colors duration-500">Current assessment statuses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground transition-colors duration-500">
                          Status distribution chart
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="breakdown" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="transition-[background,border-color,box-shadow,color] duration-500">
                    <CardHeader>
                      <CardTitle className="transition-colors duration-500">Assessment Type Distribution</CardTitle>
                      <CardDescription className="transition-colors duration-500">Breakdown by assessment type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground transition-colors duration-500">
                          {typeDistribution.length} assessment types
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="transition-[background,border-color,box-shadow,color] duration-500">
                    <CardHeader>
                      <CardTitle className="transition-colors duration-500">Provider Performance</CardTitle>
                      <CardDescription className="transition-colors duration-500">Completion rates by provider</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground transition-colors duration-500">
                          {providerPerformance.length} providers
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="transition-[background,border-color,box-shadow,color] duration-500">
                    <CardHeader>
                      <CardTitle className="transition-colors duration-500">Score Distribution</CardTitle>
                      <CardDescription className="transition-colors duration-500">Assessment scores by range</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground transition-colors duration-500">
                          Score distribution chart
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="transition-[background,border-color,box-shadow,color] duration-500">
                    <CardHeader>
                      <CardTitle className="transition-colors duration-500">Provider Avg. Scores</CardTitle>
                      <CardDescription className="transition-colors duration-500">Average scores by provider</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground transition-colors duration-500">
                          Provider scores chart
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="quality" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="transition-[background,border-color,box-shadow,color] duration-500">
                    <CardHeader>
                      <CardTitle className="transition-colors duration-500">Pass/Fail Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm transition-colors duration-500">Pass Rate</span>
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {stats.passRate}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-green-600 dark:bg-green-400 transition-all"
                            style={{ width: `${stats.passRate}%` }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground transition-colors duration-500">Passed</p>
                            <p className="text-xl font-semibold transition-colors duration-500">
                              {Math.round((stats.passRate / 100) * stats.completed)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground transition-colors duration-500">Failed</p>
                            <p className="text-xl font-semibold transition-colors duration-500">
                              {stats.completed - Math.round((stats.passRate / 100) * stats.completed)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="transition-[background,border-color,box-shadow,color] duration-500">
                    <CardHeader>
                      <CardTitle className="transition-colors duration-500">Quality Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm transition-colors duration-500">Needs Review</span>
                          </div>
                          <span className="font-semibold transition-colors duration-500">{stats.needsReview}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm transition-colors duration-500">Low Scores</span>
                          </div>
                          <span className="font-semibold transition-colors duration-500">{stats.lowScores}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm transition-colors duration-500">Avg. Score</span>
                          </div>
                          <span className="font-semibold transition-colors duration-500">{stats.avgScore}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <RecentActivityTimeline activities={recentActivity} />

        <Card className="transition-[background,border-color,box-shadow,color] duration-500">
          <CardHeader>
            <CardTitle className="transition-colors duration-500">Quick Actions</CardTitle>
            <CardDescription className="transition-colors duration-500">
              Common assessment management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <Button variant="outline" className="justify-start" onClick={() => navigate('/assessments')}>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Invite Candidate
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate('/assessment-templates')}>
              <List className="h-4 w-4 mr-2" />
              Manage Templates
            </Button>
            <Button variant="outline" className="justify-start" onClick={handleExport}>
              <FileCheck className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
