import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { DashboardActionBar } from "@/components/dashboard/DashboardActionBar";
import { ActiveFiltersIndicator } from "@/components/dashboard/ActiveFiltersIndicator";
import { PendingActionsCard } from "@/components/backgroundChecks/PendingActionsCard";
import { RecentActivityTimeline } from "@/components/backgroundChecks/RecentActivityTimeline";
import { RefereeList } from "@/components/backgroundChecks/references/RefereeList";
import { ReminderStatusIndicator } from "@/components/backgroundChecks/ReminderStatusIndicator";
import { StandardChartCard } from "@/components/dashboard/charts/StandardChartCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Clock, Plus, FileText, BarChart3 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  getBackgroundCheckStats,
  getCheckVolumeData,
  getStatusDistributionData,
  getCheckTypeDistribution,
  getProviderUsageData,
  getResultsOverview,
  getRecentActivity,
} from "@/lib/backgroundChecks/dashboardStats";

export default function BackgroundChecksDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const stats = getBackgroundCheckStats();
  const checkVolumeData = getCheckVolumeData();
  const statusDistribution = getStatusDistributionData();
  const checkTypeDistribution = getCheckTypeDistribution();
  const providerUsage = getProviderUsageData();
  const resultsOverview = getResultsOverview();
  const recentActivity = getRecentActivity();

  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: "Your analytics report is being generated...",
    });
  };

  const handleResetFilters = () => {
    setDateRange(undefined);
    setSelectedCountry("all");
    setSelectedRegion("all");
  };

  const activeFiltersCount = [
    dateRange?.from ? 1 : 0,
    selectedCountry !== "all" ? 1 : 0,
    selectedRegion !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Background Checks Analytics</h1>
            <p className="text-muted-foreground">
              Monitor background check performance and compliance metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/background-checks')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Manage Checks
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <DashboardActionBar
          onDateRangeChange={setDateRange}
          onCountryChange={setSelectedCountry}
          onRegionChange={setSelectedRegion}
          onExport={handleExport}
          onResetFilters={handleResetFilters}
          selectedCountry={selectedCountry}
          selectedRegion={selectedRegion}
          dateRange={dateRange}
          hasActiveFilters={activeFiltersCount > 0}
        />

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <ActiveFiltersIndicator
            dateRange={dateRange}
            selectedCountry={selectedCountry}
            selectedRegion={selectedRegion}
            onClearDateRange={() => setDateRange(undefined)}
            onClearCountry={() => setSelectedCountry("all")}
            onClearRegion={() => setSelectedRegion("all")}
          />
        )}

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Total Background Checks"
            value={stats.total.toString()}
            change={`+${stats.changeFromLastMonth.total}%`}
            trend="up"
            icon={<Shield className="h-6 w-6" />}
            variant="neutral"
            showGradient={false}
            showBorder={true}
            elevation="sm"
            iconPosition="left"
          />
          <EnhancedStatCard
            title="Active Checks"
            value={stats.active.toString()}
            change={`${stats.changeFromLastMonth.active}%`}
            trend="down"
            icon={<Shield className="h-6 w-6" />}
            variant="primary"
            showGradient={false}
            showBorder={true}
            elevation="sm"
            iconPosition="left"
          />
          <EnhancedStatCard
            title="Completion Rate"
            value={`${stats.completionRate.toFixed(1)}%`}
            change={`+${stats.changeFromLastMonth.completionRate}%`}
            trend="up"
            icon={<CheckCircle className="h-6 w-6" />}
            variant="success"
            showGradient={false}
            showBorder={true}
            elevation="sm"
            iconPosition="left"
          />
          <EnhancedStatCard
            title="Avg. Completion Time"
            value={`${stats.avgCompletionTime} days`}
            change={`${stats.changeFromLastMonth.avgCompletionTime}%`}
            trend="down"
            icon={<Clock className="h-6 w-6" />}
            variant="warning"
            showGradient={false}
            showBorder={true}
            elevation="sm"
            iconPosition="left"
          />
        </div>

        {/* Pending Actions */}
        <PendingActionsCard
          pendingConsents={stats.pendingConsents}
          overdueReferees={stats.overdueReferees}
          requiresReview={stats.requiresReview}
          issuesFound={stats.issuesFound}
          onSendReminders={() => toast({ title: "Reminders Sent", description: "Consent reminders have been sent to all pending candidates." })}
          onViewConsents={() => navigate('/background-checks')}
          onViewReferees={() => navigate('/background-checks')}
          onViewReview={() => navigate('/background-checks')}
          onViewIssues={() => navigate('/background-checks')}
        />

        {/* Automated Reminders Status */}
        <ReminderStatusIndicator />

        {/* Reference Check Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Reference Check Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <RefereeList 
              backgroundCheckId="demo-bgc-1" 
              candidateId="demo-candidate-1"
            />
          </CardContent>
        </Card>

        {/* Charts & Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Charts & Analytics</CardTitle>
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
                  <StandardChartCard title="Check Volume Over Time">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={checkVolumeData}>
                        <defs>
                          <linearGradient id="colorInitiated" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Area type="monotone" dataKey="initiated" stroke="hsl(var(--primary))" fill="url(#colorInitiated)" name="Initiated" />
                        <Area type="monotone" dataKey="completed" stroke="hsl(var(--success))" fill="url(#colorCompleted)" name="Completed" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </StandardChartCard>
                  <StandardChartCard title="Status Distribution">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={statusDistribution}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="status" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </StandardChartCard>
                </div>
              </TabsContent>

              <TabsContent value="breakdown" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <StandardChartCard title="Check Type Distribution">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={checkTypeDistribution}
                          dataKey="count"
                          nameKey="type"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {checkTypeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </StandardChartCard>
                  <StandardChartCard title="Provider Usage">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={providerUsage}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="provider" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" name="Count" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="successRate" fill="hsl(var(--success))" name="Success Rate %" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </StandardChartCard>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <StandardChartCard title="Completion Time Trend">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={checkVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgDays" stroke="hsl(var(--warning))" strokeWidth={2} name="Avg. Days" />
                    </LineChart>
                  </ResponsiveContainer>
                </StandardChartCard>
              </TabsContent>

              <TabsContent value="quality" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <StandardChartCard title="Results Overview">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={resultsOverview}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {resultsOverview.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </StandardChartCard>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivityTimeline activities={recentActivity} />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Button onClick={() => navigate('/background-checks')} className="h-auto py-4">
                <Plus className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Initiate New Check</div>
                  <div className="text-xs text-muted-foreground">Start background verification</div>
                </div>
              </Button>
              <Button variant="outline" onClick={() => navigate('/questionnaire-templates')} className="h-auto py-4">
                <FileText className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Manage Templates</div>
                  <div className="text-xs text-muted-foreground">Edit questionnaire templates</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
