import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from "recharts";
import { 
  Briefcase, TrendingUp, TrendingDown, Clock,
  CheckCircle, AlertCircle, Download, Eye, Filter, BarChart3, Calendar
} from "lucide-react";
import { getJobs } from "@/lib/mockJobStorage";
import { Badge } from "@/components/ui/badge";
import { StandardChartCard } from "@/components/dashboard/charts/StandardChartCard";
import { useToast } from "@/hooks/use-toast";
import type { DateRange } from "react-day-picker";

export default function JobsDashboard() {
  const [timeRange, setTimeRange] = useState("90d");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { toast } = useToast();
  const jobs = getJobs();

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = jobs.length;
    const active = jobs.filter(j => j.status === 'open').length;
    const filled = jobs.filter(j => j.status === 'filled').length;
    const draft = jobs.filter(j => j.status === 'draft').length;
    
    return {
      total,
      active,
      filled,
      draft,
      fillRate: total > 0 ? ((filled / total) * 100).toFixed(1) : 0,
    };
  }, [jobs]);

  // Job posting trends
  const postingTrends = [
    { month: 'Jan', posted: 45, filled: 32, active: 89 },
    { month: 'Feb', posted: 52, filled: 38, active: 103 },
    { month: 'Mar', posted: 48, filled: 35, active: 116 },
    { month: 'Apr', posted: 61, filled: 42, active: 135 },
    { month: 'May', posted: 58, filled: 47, active: 146 },
    { month: 'Jun', posted: 67, filled: 51, active: 162 },
  ];

  // Department demand
  const departmentData = [
    { name: 'Engineering', openings: 67, filled: 45, color: '#3b82f6' },
    { name: 'Sales', openings: 34, filled: 28, color: '#10b981' },
    { name: 'Marketing', openings: 23, filled: 19, color: '#f59e0b' },
    { name: 'Product', openings: 18, filled: 14, color: '#8b5cf6' },
    { name: 'Operations', openings: 15, filled: 12, color: '#ec4899' },
    { name: 'HR', openings: 8, filled: 6, color: '#06b6d4' },
  ];

  // Time to fill analysis
  const timeToFillData = [
    { range: '0-15 days', count: 45 },
    { range: '16-30 days', count: 89 },
    { range: '31-45 days', count: 67 },
    { range: '46-60 days', count: 34 },
    { range: '60+ days', count: 18 },
  ];

  // Job type distribution
  const jobTypeData = [
    { type: 'Full-time', count: 178, color: '#3b82f6' },
    { type: 'Contract', count: 45, color: '#10b981' },
    { type: 'Part-time', count: 23, color: '#f59e0b' },
    { type: 'Internship', count: 18, color: '#8b5cf6' },
  ];

  // Application volume
  const applicationVolume = [
    { week: 'W1', applications: 234 },
    { week: 'W2', applications: 289 },
    { week: 'W3', applications: 312 },
    { week: 'W4', applications: 298 },
    { week: 'W5', applications: 345 },
    { week: 'W6', applications: 378 },
  ];

  // Cost per hire
  const costPerHireData = [
    { quarter: 'Q1', cost: 4200 },
    { quarter: 'Q2', cost: 3950 },
    { quarter: 'Q3', cost: 3800 },
    { quarter: 'Q4', cost: 3600 },
  ];

  // Location demand
  const locationData = [
    { location: 'New York', openings: 45 },
    { location: 'San Francisco', openings: 42 },
    { location: 'Remote', openings: 89 },
    { location: 'London', openings: 28 },
    { location: 'Austin', openings: 23 },
  ];

  // Hiring funnel
  const funnelData = [
    { stage: 'Posted', count: 264, percentage: 100 },
    { stage: 'Applications', count: 2145, percentage: 100 },
    { stage: 'Screened', count: 876, percentage: 41 },
    { stage: 'Interviewed', count: 432, percentage: 20 },
    { stage: 'Offered', count: 178, percentage: 8 },
    { stage: 'Filled', count: 142, percentage: 7 },
  ];

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Jobs Analytics</h1>
            <p className="text-muted-foreground">
              Job posting performance, hiring metrics, and recruitment efficiency
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Job Postings</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.total}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+18.2%</span>
                <span>vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.active}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Currently hiring</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Fill Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.fillRate}%</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+2.4%</span>
                <span>vs target</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time to Fill</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32 days</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3 text-green-500" />
                <span className="text-green-500">-5 days</span>
                <span>vs last period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="funnel">Hiring Funnel</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <StandardChartCard
                title="Job Posting Activity"
                description="Monthly job posting and fill rates"
                showDatePicker={true}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onDownload={() => toast({ title: "Downloading posting data..." })}
                menuItems={[
                  { label: "View Report", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                  { label: "Compare Periods", icon: <Calendar className="h-4 w-4" />, onClick: () => {} },
                  { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
                ]}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={postingTrends}>
                    <defs>
                      <linearGradient id="colorPosted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorFilled" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="posted" 
                      stroke="#3b82f6" 
                      fillOpacity={1}
                      fill="url(#colorPosted)"
                      name="Posted"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="filled" 
                      stroke="#10b981" 
                      fillOpacity={1}
                      fill="url(#colorFilled)"
                      name="Filled"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </StandardChartCard>

              <StandardChartCard
                title="Application Volume"
                description="Weekly application submissions"
                showDatePicker={true}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onDownload={() => toast({ title: "Downloading application data..." })}
                menuItems={[
                  { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                  { label: "Filter", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                  { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
                ]}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={applicationVolume}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </StandardChartCard>

              <StandardChartCard
                title="Job Type Distribution"
                description="Breakdown by employment type"
                onDownload={() => toast({ title: "Downloading job type data..." })}
                menuItems={[
                  { label: "View Breakdown", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                  { label: "Filter", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                  { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
                ]}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={jobTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {jobTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </StandardChartCard>

              <StandardChartCard
                title="Location Demand"
                description="Open positions by location"
                onDownload={() => toast({ title: "Downloading location data..." })}
                menuItems={[
                  { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                  { label: "Filter", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                  { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
                ]}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={locationData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="location" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="openings" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </StandardChartCard>
            </div>
          </TabsContent>

          <TabsContent value="departments" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <StandardChartCard
                title="Department Hiring Demand"
                description="Open positions vs filled by department"
                onDownload={() => toast({ title: "Downloading department data..." })}
                menuItems={[
                  { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                  { label: "View Report", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                  { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
                ]}
              >
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="openings" fill="#3b82f6" name="Open Positions" />
                    <Bar dataKey="filled" fill="#10b981" name="Filled" />
                  </BarChart>
                </ResponsiveContainer>
              </StandardChartCard>

              <StandardChartCard
                title="Department Fill Rates"
                description="Hiring success by department"
                onDownload={() => toast({ title: "Downloading fill rate data..." })}
                menuItems={[
                  { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                  { label: "Filter", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                  { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
                ]}
              >
                <div className="space-y-4">
                  {departmentData.map((dept, index) => {
                    const fillRate = ((dept.filled / dept.openings) * 100).toFixed(1);
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: dept.color }}
                            />
                            <span className="text-sm font-medium">{dept.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {dept.filled}/{dept.openings}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {fillRate}%
                            </Badge>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all"
                            style={{ 
                              width: `${fillRate}%`,
                              backgroundColor: dept.color 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </StandardChartCard>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <StandardChartCard
                title="Time to Fill Distribution"
                description="How quickly positions are being filled"
                onDownload={() => toast({ title: "Downloading time to fill data..." })}
                menuItems={[
                  { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                  { label: "Filter", icon: <Filter className="h-4 w-4" />, onClick: () => {} },
                  { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
                ]}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeToFillData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                      {timeToFillData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#ef4444'][index]} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </StandardChartCard>

              <StandardChartCard
                title="Cost Per Hire Trend"
                description="Quarterly recruitment cost efficiency"
                showDatePicker={true}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onDownload={() => toast({ title: "Downloading cost data..." })}
                menuItems={[
                  { label: "View Report", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                  { label: "Compare Periods", icon: <Calendar className="h-4 w-4" />, onClick: () => {} },
                  { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
                ]}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={costPerHireData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Line 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </StandardChartCard>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-500">32</div>
                      <div className="text-xs text-muted-foreground mt-1">Days to Fill</div>
                      <div className="text-xs text-green-500 mt-1">↓ 15% vs target</div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-500">$3,600</div>
                      <div className="text-xs text-muted-foreground mt-1">Cost Per Hire</div>
                      <div className="text-xs text-green-500 mt-1">↓ $600 vs last Q</div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-500">67%</div>
                      <div className="text-xs text-muted-foreground mt-1">Offer Accept Rate</div>
                      <div className="text-xs text-green-500 mt-1">↑ 5% vs last Q</div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-500">4.2</div>
                      <div className="text-xs text-muted-foreground mt-1">Quality of Hire</div>
                      <div className="text-xs text-green-500 mt-1">↑ 0.3 vs target</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="funnel" className="space-y-4">
            <StandardChartCard
              title="Hiring Funnel Analysis"
              description="Conversion rates through the recruitment process"
              onDownload={() => toast({ title: "Downloading funnel data..." })}
              menuItems={[
                { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
                { label: "View Report", icon: <BarChart3 className="h-4 w-4" />, onClick: () => {} },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {} }
              ]}
            >
              <div className="space-y-4">
                {funnelData.map((stage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-24 justify-center">
                          {stage.stage}
                        </Badge>
                        <span className="text-2xl font-bold">{stage.count.toLocaleString()}</span>
                        {index > 0 && (
                          <span className="text-sm text-muted-foreground">
                            ({stage.percentage}% conversion)
                          </span>
                        )}
                      </div>
                      {index > 0 && index < funnelData.length - 1 && (
                        <span className="text-sm text-muted-foreground">
                          {((stage.count / funnelData[index - 1].count) * 100).toFixed(1)}% pass rate
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-muted rounded-full h-8">
                      <div 
                        className="h-8 rounded-full flex items-center justify-end px-3 transition-all"
                        style={{ 
                          width: `${index === 0 ? 100 : (stage.count / funnelData[1].count * 100)}%`,
                          backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'][index] 
                        }}
                      >
                        {index === 0 ? (
                          <span className="text-sm font-medium text-white">
                            {stage.count} jobs
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-white">
                            {((stage.count / funnelData[1].count) * 100).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-500">6.6%</div>
                    <div className="text-xs text-muted-foreground">Overall Conversion</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">8.1</div>
                    <div className="text-xs text-muted-foreground">Applications Per Job</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-500">49%</div>
                    <div className="text-xs text-muted-foreground">Interview Success</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-500">80%</div>
                    <div className="text-xs text-muted-foreground">Offer-to-Hire Rate</div>
                  </div>
                </div>
              </div>
            </StandardChartCard>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
