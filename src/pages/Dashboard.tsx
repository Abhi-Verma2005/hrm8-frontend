import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  Calendar
} from 'lucide-react';
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
} from 'recharts';

// Mock data for charts
const applicationsByStage = [
  { name: 'New', value: 45, color: '#3b82f6' },
  { name: 'Screening', value: 32, color: '#8b5cf6' },
  { name: 'Interview', value: 28, color: '#6366f1' },
  { name: 'Offer', value: 12, color: '#10b981' },
  { name: 'Hired', value: 8, color: '#22c55e' },
  { name: 'Rejected', value: 15, color: '#ef4444' },
];

const applicationsTrend = [
  { date: 'Week 1', applications: 24, interviews: 8, offers: 2 },
  { date: 'Week 2', applications: 32, interviews: 12, offers: 3 },
  { date: 'Week 3', applications: 28, interviews: 15, offers: 5 },
  { date: 'Week 4', applications: 38, interviews: 18, offers: 4 },
  { date: 'Week 5', applications: 45, interviews: 22, offers: 6 },
];

const recruiterPerformance = [
  { name: 'Sarah Johnson', applications: 42, hired: 8 },
  { name: 'Michael Chen', applications: 38, hired: 6 },
  { name: 'Emily Rodriguez', applications: 35, hired: 7 },
  { name: 'David Kim', applications: 29, hired: 5 },
];

const topPositions = [
  { position: 'Senior Developer', applications: 48, avgTime: 12 },
  { position: 'Product Manager', applications: 32, avgTime: 15 },
  { position: 'UX Designer', applications: 28, avgTime: 10 },
  { position: 'Data Analyst', applications: 24, avgTime: 14 },
  { position: 'Marketing Manager', applications: 20, avgTime: 11 },
];

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your recruitment metrics and performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">140</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">117</div>
            <p className="text-xs text-muted-foreground">
              83.6% of total applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers Extended</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time to Hire</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.3 days</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-2 days</span> improvement
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Applications by Stage</CardTitle>
                <CardDescription>Current distribution across hiring stages</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={applicationsByStage}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {applicationsByStage.map((entry, index) => (
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
                <CardTitle>Application Trends</CardTitle>
                <CardDescription>Activity over the last 5 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={applicationsTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="interviews" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="offers" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Candidate progression through stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { stage: 'Applied', count: 140, percentage: 100, color: 'bg-blue-500' },
                  { stage: 'Screening', count: 105, percentage: 75, color: 'bg-purple-500' },
                  { stage: 'Interview', count: 75, percentage: 54, color: 'bg-indigo-500' },
                  { stage: 'Offer', count: 28, percentage: 20, color: 'bg-green-500' },
                  { stage: 'Hired', count: 20, percentage: 14, color: 'bg-emerald-500' },
                ].map((item) => (
                  <div key={item.stage} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.count} candidates</span>
                        <Badge variant="secondary">{item.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className={`${item.color} h-3 rounded-full transition-all`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recruiter Performance</CardTitle>
              <CardDescription>Applications managed and successful hires</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={recruiterPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applications" fill="#3b82f6" name="Applications" />
                  <Bar dataKey="hired" fill="#10b981" name="Hired" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Positions</CardTitle>
              <CardDescription>Most active job openings and hiring times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPositions.map((pos, index) => (
                  <div key={pos.position} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{pos.position}</div>
                        <div className="text-sm text-muted-foreground">
                          {pos.applications} applications
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{pos.avgTime} days</div>
                      <div className="text-sm text-muted-foreground">avg. time to hire</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
