import { useState } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Download, TrendingUp, Users, Eye, Clock, Target } from "lucide-react";
import { getJobAnalytics, getRecruitmentMetrics } from "@/lib/analyticsService";
import { exportJobAnalytics } from "@/lib/exportService";
import { useToast } from "@/hooks/use-toast";
import { getJobs } from "@/lib/mockJobStorage";

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))"];

export default function JobAnalytics() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  
  const jobs = getJobs();
  const analytics = getJobAnalytics(jobs);
  const metrics = getRecruitmentMetrics();

  const handleExport = () => {
    exportJobAnalytics(analytics, "job-analytics");
    toast({
      title: "Export successful",
      description: "Analytics data has been exported to Excel.",
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Job Analytics & Reports</h1>
            <p className="text-muted-foreground">
              Track recruitment performance and gain insights
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalJobs}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.openJobs} currently open
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalApplicants}</div>
              <p className="text-xs text-muted-foreground">
                Avg {analytics.averageApplicantsPerJob} per job
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.conversionRate}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Time to Fill</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.avgTimeToFill} days</div>
              <p className="text-xs text-muted-foreground">
                Across all filled positions
              </p>
            </CardContent>
          </Card>
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
