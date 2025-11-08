import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from "recharts";
import { 
  Users, TrendingUp, TrendingDown, Calendar, Clock, 
  CheckCircle, XCircle, Target, Award, Download, Filter
} from "lucide-react";
import { getCandidates } from "@/lib/mockCandidateStorage";
import { Badge } from "@/components/ui/badge";

export default function CandidatesDashboard() {
  const [timeRange, setTimeRange] = useState("30d");
  const candidates = getCandidates();

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = candidates.length;
    const active = candidates.filter(c => c.status === 'active').length;
    const placed = candidates.filter(c => c.status === 'placed').length;
    const inactive = candidates.filter(c => c.status === 'inactive').length;
    
    return {
      total,
      active,
      placed,
      inactive,
      placementRate: total > 0 ? ((placed / total) * 100).toFixed(1) : 0,
      activeRate: total > 0 ? ((active / total) * 100).toFixed(1) : 0,
    };
  }, [candidates]);

  // Monthly trends data
  const monthlyTrends = [
    { month: 'Jan', applications: 145, placed: 23, active: 89, inactive: 33 },
    { month: 'Feb', applications: 167, placed: 28, active: 102, inactive: 37 },
    { month: 'Mar', applications: 189, placed: 31, active: 118, inactive: 40 },
    { month: 'Apr', applications: 203, placed: 35, active: 128, inactive: 40 },
    { month: 'May', applications: 221, placed: 38, active: 139, inactive: 44 },
    { month: 'Jun', applications: 238, placed: 42, active: 151, inactive: 45 },
  ];

  // Source breakdown
  const sourceData = [
    { name: 'LinkedIn', value: 145, color: '#0077b5' },
    { name: 'Indeed', value: 98, color: '#2164f3' },
    { name: 'Referral', value: 87, color: '#10b981' },
    { name: 'Career Site', value: 76, color: '#f59e0b' },
    { name: 'Agency', value: 54, color: '#8b5cf6' },
    { name: 'Other', value: 42, color: '#6b7280' },
  ];

  // Experience level distribution
  const experienceData = [
    { level: 'Entry', count: 123, percentage: 24.6 },
    { level: 'Mid-Level', count: 198, percentage: 39.6 },
    { level: 'Senior', count: 145, percentage: 29.0 },
    { level: 'Executive', count: 34, percentage: 6.8 },
  ];

  // Time to hire trends
  const timeToHireData = [
    { month: 'Jan', days: 28 },
    { month: 'Feb', days: 26 },
    { month: 'Mar', days: 25 },
    { month: 'Apr', days: 23 },
    { month: 'May', days: 21 },
    { month: 'Jun', days: 20 },
  ];

  // Top skills in demand
  const topSkills = [
    { skill: 'React', count: 234 },
    { skill: 'TypeScript', count: 198 },
    { skill: 'Python', count: 176 },
    { skill: 'Node.js', count: 156 },
    { skill: 'AWS', count: 145 },
    { skill: 'SQL', count: 134 },
    { skill: 'Docker', count: 123 },
    { skill: 'GraphQL', count: 98 },
  ];

  // Conversion funnel
  const funnelData = [
    { stage: 'Applied', count: 1250, color: '#3b82f6' },
    { stage: 'Screening', count: 875, color: '#8b5cf6' },
    { stage: 'Interview', count: 420, color: '#ec4899' },
    { stage: 'Offer', count: 125, color: '#f59e0b' },
    { stage: 'Placed', count: 98, color: '#10b981' },
  ];

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Candidates Analytics</h1>
            <p className="text-muted-foreground">
              Track recruitment metrics and candidate pipeline performance
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
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
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.total}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+12.5%</span>
                <span>vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Candidates</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.active}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{metrics.activeRate}% of total</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.placementRate}%</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+3.2%</span>
                <span>vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time to Hire</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">21 days</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3 text-green-500" />
                <span className="text-green-500">-2 days</span>
                <span>vs last period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="funnel">Funnel</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Application Trends</CardTitle>
                  <CardDescription>Monthly candidate applications over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyTrends}>
                      <defs>
                        <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="applications" 
                        stroke="#3b82f6" 
                        fillOpacity={1}
                        fill="url(#colorApplications)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                  <CardDescription>Candidate pipeline by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="active" fill="#10b981" name="Active" />
                      <Bar dataKey="placed" fill="#3b82f6" name="Placed" />
                      <Bar dataKey="inactive" fill="#6b7280" name="Inactive" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time to Hire Trend</CardTitle>
                  <CardDescription>Average days from application to placement</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timeToHireData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="days" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        dot={{ fill: '#8b5cf6', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Experience Level Distribution</CardTitle>
                  <CardDescription>Candidates by experience level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={experienceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="level" type="category" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6">
                        {experienceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][index % 4]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Sources</CardTitle>
                  <CardDescription>Where candidates are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Source Performance</CardTitle>
                  <CardDescription>Candidates by source channel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sourceData.map((source, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: source.color }}
                          />
                          <span className="text-sm font-medium">{source.name}</span>
                        </div>
                        <span className="text-sm font-bold">{source.value}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all"
                          style={{ 
                            width: `${(source.value / 502) * 100}%`,
                            backgroundColor: source.color 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Skills in Demand</CardTitle>
                <CardDescription>Most requested skills across open positions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topSkills} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="skill" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funnel" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Funnel</CardTitle>
                <CardDescription>Candidate progression through hiring stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnelData.map((stage, index) => {
                    const percentage = index === 0 ? 100 : ((stage.count / funnelData[0].count) * 100).toFixed(1);
                    const dropOff = index > 0 
                      ? ((funnelData[index - 1].count - stage.count) / funnelData[index - 1].count * 100).toFixed(1)
                      : 0;
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant="outline" 
                              className="w-20 justify-center"
                              style={{ borderColor: stage.color, color: stage.color }}
                            >
                              {stage.stage}
                            </Badge>
                            <span className="text-2xl font-bold">{stage.count}</span>
                            <span className="text-sm text-muted-foreground">
                              ({percentage}% of total)
                            </span>
                          </div>
                          {index > 0 && (
                            <span className="text-sm text-destructive">
                              -{dropOff}% drop-off
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-muted rounded-full h-8">
                          <div 
                            className="h-8 rounded-full flex items-center justify-end px-3 transition-all"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: stage.color 
                            }}
                          >
                            <span className="text-sm font-medium text-white">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-500">7.8%</div>
                      <div className="text-xs text-muted-foreground">Conversion Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-500">30%</div>
                      <div className="text-xs text-muted-foreground">Screening Pass</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-500">48%</div>
                      <div className="text-xs text-muted-foreground">Interview Pass</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-500">78%</div>
                      <div className="text-xs text-muted-foreground">Offer Acceptance</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
