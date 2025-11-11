import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { DashboardActionBar } from "@/components/dashboard/DashboardActionBar";
import { ActiveFiltersIndicator } from "@/components/dashboard/ActiveFiltersIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Plus, FileText, Download, Settings } from "lucide-react";
import { getBackgroundChecks, saveBackgroundCheck, getBackgroundCheckById } from "@/lib/mockBackgroundCheckStorage";
import { getConsentsByBackgroundCheck } from "@/lib/backgroundChecks/consentStorage";
import { getRefereesByBackgroundCheck } from "@/lib/backgroundChecks/refereeStorage";
import { exportBackgroundCheckPDF } from "@/lib/backgroundChecks/backgroundCheckExport";
import { BackgroundCheck } from "@/types/backgroundCheck";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BackgroundCheckForm } from "@/components/backgroundChecks/BackgroundCheckForm";
import { toast } from "@/hooks/use-toast";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { PendingActionsCard } from "@/components/backgroundChecks/PendingActionsCard";
import { RecentActivityTimeline } from "@/components/backgroundChecks/RecentActivityTimeline";
import { BackgroundChecksTable } from "@/components/backgroundChecks/BackgroundChecksTable";
import { RefereeList } from "@/components/backgroundChecks/references/RefereeList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StandardChartCard } from "@/components/dashboard/charts/StandardChartCard";
import { DateRange } from "react-day-picker";
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

export default function BackgroundChecks() {
  const navigate = useNavigate();
  const [checks, setChecks] = useState<BackgroundCheck[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  useEffect(() => {
    loadChecks();
  }, []);

  const loadChecks = () => {
    setChecks(getBackgroundChecks());
  };

  const stats = getBackgroundCheckStats();
  const checkVolumeData = getCheckVolumeData();
  const statusDistribution = getStatusDistributionData();
  const checkTypeDistribution = getCheckTypeDistribution();
  const providerUsage = getProviderUsageData();
  const resultsOverview = getResultsOverview();
  const recentActivity = getRecentActivity();

  // Filter checks based on active filters
  const filteredChecks = useMemo(() => {
    let filtered = checks;

    if (dateRange?.from) {
      filtered = filtered.filter(check => {
        const checkDate = new Date(check.initiatedDate);
        return checkDate >= dateRange.from! && (!dateRange.to || checkDate <= dateRange.to);
      });
    }

    // Location filters would be applied here when location data is added to checks
    // For now, we'll just return the date-filtered results

    return filtered;
  }, [checks, dateRange, selectedCountry, selectedRegion]);

  const handleInitiateCheck = (data: any) => {
    const newCheck: BackgroundCheck = {
      id: `bgc-${Date.now()}`,
      candidateId: 'cand-temp',
      candidateName: 'Sample Candidate',
      provider: data.provider,
      checkTypes: data.checkTypes.map((type: string) => ({
        type: type as any,
        required: true,
      })),
      status: 'pending-consent',
      initiatedBy: 'current-user',
      initiatedByName: 'Current User',
      initiatedDate: new Date().toISOString(),
      consentGiven: false,
      results: [],
      overallStatus: 'clear',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveBackgroundCheck(newCheck);
    loadChecks();
    setIsFormOpen(false);
    toast({
      title: "Background Check Initiated",
      description: "Consent request has been sent to the candidate.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: "Your report is being generated...",
    });
  };

  const handleDownloadReport = (checkId: string) => {
    const check = getBackgroundCheckById(checkId);
    if (!check) {
      toast({
        title: "Error",
        description: "Background check not found.",
        variant: "destructive",
      });
      return;
    }

    const consents = getConsentsByBackgroundCheck(checkId);
    const referees = getRefereesByBackgroundCheck(checkId);
    
    try {
      exportBackgroundCheckPDF(check, consents, referees);
      toast({
        title: "Report Downloaded",
        description: "Background check report has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to generate PDF report.",
        variant: "destructive",
      });
    }
  };

  const handleSendReminder = (checkId: string) => {
    toast({
      title: "Reminder Sent",
      description: "Consent reminder has been sent to the candidate.",
    });
  };

  const handleCancelCheck = (checkId: string) => {
    toast({
      title: "Check Cancelled",
      description: "Background check has been cancelled successfully.",
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
            <h1 className="text-3xl font-bold">Background Checks</h1>
            <p className="text-muted-foreground">
              Manage candidate screening and verification
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/questionnaire-templates')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Manage Templates
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Initiate Check
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
            icon={<Shield className="h-6 w-6" />}
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
            icon={<Shield className="h-6 w-6" />}
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
          onViewConsents={() => {}}
          onViewReferees={() => {}}
          onViewReview={() => {}}
          onViewIssues={() => {}}
        />

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

        {/* Background Checks Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Background Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <BackgroundChecksTable
              checks={filteredChecks}
              onViewDetails={(id) => navigate(`/background-checks/${id}`)}
              onViewConsent={(id) => console.log('View consent:', id)}
              onViewReferees={(id) => console.log('View referees:', id)}
              onDownloadReport={handleDownloadReport}
              onSendReminder={handleSendReminder}
              onCancelCheck={handleCancelCheck}
            />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivityTimeline activities={recentActivity} />

        {/* Quick Actions Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Initiate New Check
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/questionnaire-templates')}>
              <FileText className="h-4 w-4 mr-2" />
              Manage Templates
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Dashboard
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Provider Settings
            </Button>
          </CardContent>
        </Card>

        {/* Initiate Check Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Initiate Background Check</DialogTitle>
            </DialogHeader>
            <BackgroundCheckForm
              candidateName="Sample Candidate"
              onSubmit={handleInitiateCheck}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardPageLayout>
  );
}
