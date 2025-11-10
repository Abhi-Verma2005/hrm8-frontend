import { useState } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker-v2";
import type { DateRange } from "react-day-picker";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, TrendingUp, Users, Eye, Clock, Target, Plus, Filter, BarChart3 } from "lucide-react";
import { getJobAnalytics, getRecruitmentMetrics } from "@/lib/analyticsService";
import { exportJobAnalytics } from "@/lib/exportService";
import { useToast } from "@/hooks/use-toast";
import { getJobs } from "@/lib/mockJobStorage";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { useNavigate } from "react-router-dom";

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))"];

export default function JobAnalytics() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  const jobs = getJobs();
  const analytics = getJobAnalytics(jobs);
  const metrics = getRecruitmentMetrics();

  const handleExport = () => {
    toast({
      title: "Exporting Analytics",
      description: "Preparing your job analytics export...",
    });
  };

  const statusData = Object.entries(analytics.jobsByStatus).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const departmentData = Object.entries(analytics.jobsByDepartment).map(([name, value]) => ({
    name,
    count: value,
  }));

  const sourceData = metrics.sourceEffectiveness.map((s) => ({
    name: s.source,
    applicants: s.applicants,
    hires: s.hires,
    costPerHire: s.hires > 0 ? Math.round(s.cost / s.hires) : 0,
  }));

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Job Analytics & Reports</h1>
            <p className="text-muted-foreground">
              Track recruitment performance and gain insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="Select period"
              align="end"
            />
            
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Total Jobs"
            value={analytics.totalJobs.toString()}
            change={`${analytics.openJobs} currently open`}
            trend="up"
            icon={<Target className="h-6 w-6" />}
            variant="primary"
            showMenu={true}
            menuItems={[
              {
                label: "View All Jobs",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => navigate('/jobs')
              },
              {
                label: "Create Job",
                icon: <Plus className="h-4 w-4" />,
                onClick: () => navigate('/jobs/new')
              },
              {
                label: "View Analytics",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
          />

          <EnhancedStatCard
            title="Total Applicants"
            value={analytics.totalApplicants.toString()}
            change={`Avg ${analytics.averageApplicantsPerJob} per job`}
            trend="up"
            icon={<Users className="h-6 w-6" />}
            variant="success"
            showMenu={true}
            menuItems={[
              {
                label: "View Applicants",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => navigate('/candidates')
              },
              {
                label: "Add Applicant",
                icon: <Plus className="h-4 w-4" />,
                onClick: () => navigate('/candidates?action=create')
              },
              {
                label: "View Pipeline",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => navigate('/pipeline')
              }
            ]}
          />

          <EnhancedStatCard
            title="Total Views"
            value={analytics.totalViews.toLocaleString()}
            change={`${analytics.conversionRate}% conversion rate`}
            trend="up"
            icon={<Eye className="h-6 w-6" />}
            variant="warning"
            showMenu={true}
            menuItems={[
              {
                label: "View Analytics",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => {}
              },
              {
                label: "Export Report",
                icon: <Download className="h-4 w-4" />,
                onClick: handleExport
              }
            ]}
          />

          <EnhancedStatCard
            title="Avg Time to Fill"
            value={`${analytics.avgTimeToFill} days`}
            change="Across all filled positions"
            trend="down"
            icon={<Clock className="h-6 w-6" />}
            variant="neutral"
            showMenu={true}
            menuItems={[
              {
                label: "View Metrics",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => {}
              },
              {
                label: "Set Benchmarks",
                icon: <Target className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
          />
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Jobs by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="hsl(var(--primary))"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Jobs by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Jobs</CardTitle>
                <CardDescription>By applicant count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topPerformingJobs.slice(0, 5).map((job, index) => (
                    <div key={job.jobId} className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{job.jobTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {job.applicants} applicants • {job.views} views
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Applicant Trend</CardTitle>
                <CardDescription>Daily applicant submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.applicantsTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Applicants"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Views Trend</CardTitle>
                <CardDescription>Daily job post views</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.viewsTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      name="Views"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Source Effectiveness</CardTitle>
                <CardDescription>Applicants and hires by source</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="applicants" fill="hsl(var(--primary))" name="Applicants" />
                    <Bar dataKey="hires" fill="hsl(var(--accent))" name="Hires" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Per Hire by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="costPerHire" fill="hsl(var(--secondary))" name="Cost per Hire ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Time to Hire by Stage</CardTitle>
                <CardDescription>Average days per recruitment stage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.timeToHireByStage} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="avgDays" fill="hsl(var(--primary))" name="Avg Days" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Offer Acceptance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[200px]">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary">
                        {metrics.offerAcceptanceRate}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Of offers are accepted
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recruiter Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.recruiterPerformance.slice(0, 4).map((recruiter) => (
                      <div key={recruiter.recruiterId} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{recruiter.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {recruiter.jobsFilled} jobs filled
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{recruiter.avgTimeToFill} days</p>
                          <p className="text-xs text-muted-foreground">avg time</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
