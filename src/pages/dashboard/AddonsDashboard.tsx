import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { DashboardActionBar } from '@/components/dashboard/DashboardActionBar';
import { ActiveFiltersIndicator } from '@/components/dashboard/ActiveFiltersIndicator';
import type { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { CombinedRevenueChart } from '@/components/dashboard/addons/CombinedRevenueChart';
import { ServiceMixChart } from '@/components/dashboard/addons/ServiceMixChart';
import { ClientAdoptionChart } from '@/components/dashboard/addons/ClientAdoptionChart';
import { MRRBreakdownChart } from '@/components/dashboard/addons/MRRBreakdownChart';
import { YoYComparisonChart } from '@/components/dashboard/addons/YoYComparisonChart';
import { RevenueForecastChart } from '@/components/dashboard/addons/RevenueForecastChart';
import { MRRMetricsCards } from '@/components/dashboard/addons/MRRMetricsCards';
import { CohortRetentionMatrix } from '@/components/dashboard/addons/CohortRetentionMatrix';
import { LTVByServiceChart } from '@/components/dashboard/addons/LTVByServiceChart';
import { ChurnTrackingChart } from '@/components/dashboard/addons/ChurnTrackingChart';
import { RevenueRetentionChart } from '@/components/dashboard/addons/RevenueRetentionChart';
import { CohortMetricsCards } from '@/components/dashboard/addons/CohortMetricsCards';
import { ChurnRiskMetricsCards } from '@/components/dashboard/addons/ChurnRiskMetricsCards';
import { AtRiskCustomersTable } from '@/components/dashboard/addons/AtRiskCustomersTable';
import { ChurnFactorsChart } from '@/components/dashboard/addons/ChurnFactorsChart';
import { InterventionStrategiesCard } from '@/components/dashboard/addons/InterventionStrategiesCard';
import { EngagementTrendsChart } from '@/components/dashboard/addons/EngagementTrendsChart';
import { ChurnRiskDistributionChart } from '@/components/dashboard/addons/ChurnRiskDistributionChart';
import { CustomerHealthMetricsCards } from '@/components/dashboard/addons/CustomerHealthMetricsCards';
import { CustomerHealthTable } from '@/components/dashboard/addons/CustomerHealthTable';
import { HealthScoreDistributionChart } from '@/components/dashboard/addons/HealthScoreDistributionChart';
import { HealthTrendChart } from '@/components/dashboard/addons/HealthTrendChart';
import { HealthAlertsCard } from '@/components/dashboard/addons/HealthAlertsCard';
import { HealthFactorsBreakdown } from '@/components/dashboard/addons/HealthFactorsBreakdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCombinedAddonMetrics } from '@/lib/addons/combinedAnalytics';
import { getAIInterviewStats } from '@/lib/aiInterview/dashboardStats';
import { getAssessmentStats } from '@/lib/assessments/dashboardStats';
import { getBackgroundCheckStats } from '@/lib/backgroundChecks/dashboardStats';
import { useCurrencyFormat } from '@/contexts/CurrencyFormatContext';
import { 
  MessageSquare, ClipboardCheck, ShieldCheck, ArrowRight, 
  TrendingUp, Users, Percent, Target, Video, Award, Clock
} from 'lucide-react';

export default function AddonsDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatCurrency } = useCurrencyFormat();
  const activeTab = searchParams.get('tab') || 'overview';
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  
  const combinedMetrics = getCombinedAddonMetrics();
  const aiStats = getAIInterviewStats();
  const assessmentStats = getAssessmentStats();
  const checkStats = getBackgroundCheckStats();

  const hasActiveFilters = !!(dateRange?.from) || selectedCountry !== "all" || selectedRegion !== "all";

  const handleExport = () => {
    toast({ title: "Exporting Add-ons data..." });
  };

  const handleResetFilters = () => {
    setDateRange(undefined);
    setSelectedCountry("all");
    setSelectedRegion("all");
    toast({ title: "Filters reset" });
  };

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <DashboardPageLayout
      title="Add-ons Dashboard"
      subtitle="AI Interviews, Assessments, and Background Checks"
      breadcrumbActions={
        <DashboardActionBar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedCountry={selectedCountry}
          selectedRegion={selectedRegion}
          onCountryChange={setSelectedCountry}
          onRegionChange={setSelectedRegion}
          onExport={handleExport}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      }
    >
      <div className="px-6 pb-6 space-y-6">
        {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <ActiveFiltersIndicator
          selectedCountry={selectedCountry}
          selectedRegion={selectedRegion}
          dateRange={dateRange}
          onClearCountry={() => setSelectedCountry("all")}
          onClearRegion={() => setSelectedRegion("all")}
          onClearDateRange={() => setDateRange(undefined)}
        />
      )}

      {/* Top-level MRR Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MRRMetricsCards />
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cohorts">Cohorts & LTV</TabsTrigger>
          <TabsTrigger value="churn">Churn Prevention</TabsTrigger>
          <TabsTrigger value="health">Customer Health</TabsTrigger>
          <TabsTrigger value="ai-interviews">AI Interviews</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="background-checks">Background Checks</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Revenue Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MRRBreakdownChart />
            <YoYComparisonChart />
          </div>

          {/* Forecast and Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueForecastChart />
            <div className="space-y-6">
              <ServiceMixChart />
              <ClientAdoptionChart />
            </div>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Navigate to individual service modules</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto flex-col items-start p-4 space-y-2"
                onClick={() => navigate('/ai-interviews')}
              >
                <div className="flex items-center gap-2 w-full">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className="font-semibold">AI Interviews</span>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </div>
                <span className="text-sm text-muted-foreground text-left">
                  {aiStats.total} total • {aiStats.completed} completed
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col items-start p-4 space-y-2"
                onClick={() => navigate('/assessments')}
              >
                <div className="flex items-center gap-2 w-full">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Assessments</span>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </div>
                <span className="text-sm text-muted-foreground text-left">
                  {assessmentStats.total} total • {assessmentStats.completed} completed
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col items-start p-4 space-y-2"
                onClick={() => navigate('/background-checks')}
              >
                <div className="flex items-center gap-2 w-full">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Background Checks</span>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </div>
                <span className="text-sm text-muted-foreground text-left">
                  {checkStats.total} total • {checkStats.active} active
                </span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cohorts & LTV Tab */}
        <TabsContent value="cohorts" className="space-y-6">
          {/* Cohort Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <CohortMetricsCards />
          </div>

          {/* Cohort Retention Matrix */}
          <CohortRetentionMatrix />

          {/* LTV and Churn Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LTVByServiceChart />
            <div className="space-y-6">
              <ChurnTrackingChart />
              <RevenueRetentionChart />
            </div>
          </div>
        </TabsContent>

        {/* Churn Prevention Tab */}
        <TabsContent value="churn" className="space-y-6">
          <ChurnRiskMetricsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AtRiskCustomersTable />
            <div className="space-y-6">
              <ChurnRiskDistributionChart />
              <ChurnFactorsChart />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EngagementTrendsChart />
            <InterventionStrategiesCard />
          </div>
        </TabsContent>

        {/* Customer Health Tab */}
        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <CustomerHealthMetricsCards />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomerHealthTable />
            <div className="space-y-6">
              <HealthScoreDistributionChart />
              <HealthFactorsBreakdown />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HealthTrendChart />
            <HealthAlertsCard />
          </div>
        </TabsContent>

        {/* AI Interviews Tab */}
        <TabsContent value="ai-interviews" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EnhancedStatCard
              title="Total Interviews"
              icon={<Video />}
              value={aiStats.total.toString()}
              change="+15%"
              trend="up"
              variant="primary"
            />
            <EnhancedStatCard
              title="Completion Rate"
              icon={<Target />}
              value={`${aiStats.completionRate}%`}
              change="+5%"
              trend="up"
              variant="success"
            />
            <EnhancedStatCard
              title="Avg Score"
              icon={<Award />}
              value={`${aiStats.avgScore}/100`}
              change="+2"
              trend="up"
              variant="warning"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Interview Analytics</CardTitle>
              <CardDescription>Detailed performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                View detailed analytics and reports in the AI Interviews module.
              </p>
              <Button onClick={() => navigate('/ai-interviews/analytics')}>
                View Full Analytics
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EnhancedStatCard
              title="Total Assessments"
              icon={<ClipboardCheck />}
              value={assessmentStats.total.toString()}
              change="+12%"
              trend="up"
              variant="primary"
            />
            <EnhancedStatCard
              title="Completed"
              icon={<Target />}
              value={assessmentStats.completed.toString()}
              change="+8%"
              trend="up"
              variant="success"
            />
            <EnhancedStatCard
              title="Avg Score"
              icon={<Award />}
              value={`${assessmentStats.avgScore}%`}
              change="+3%"
              trend="up"
              variant="warning"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Assessment Insights</CardTitle>
              <CardDescription>Performance metrics and candidate evaluation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Manage assessments, templates, and view detailed analytics.
              </p>
              <Button onClick={() => navigate('/assessments')}>
                View All Assessments
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Background Checks Tab */}
        <TabsContent value="background-checks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EnhancedStatCard
              title="Total Checks"
              icon={<ShieldCheck />}
              value={checkStats.total.toString()}
              change="+20%"
              trend="up"
              variant="primary"
            />
            <EnhancedStatCard
              title="Active Checks"
              icon={<Clock />}
              value={checkStats.active.toString()}
              change="+5%"
              trend="up"
              variant="warning"
            />
            <EnhancedStatCard
              title="Completion Rate"
              icon={<Target />}
              value={`${checkStats.completionRate}%`}
              change="+7%"
              trend="up"
              variant="success"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Background Check Operations</CardTitle>
              <CardDescription>Track verification progress and compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Monitor active checks, review reports, and manage compliance requirements.
              </p>
              <Button onClick={() => navigate('/background-checks')}>
                View All Checks
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
