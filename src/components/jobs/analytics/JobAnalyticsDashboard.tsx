import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Users, Clock, DollarSign, Target } from "lucide-react";
import { 
  getJobAnalytics, 
  getApplicationFunnel, 
  getSourceEffectiveness, 
  getGeographicData, 
  getTimeSeriesData,
  getBenchmarkData 
} from "@/lib/jobAnalyticsService";

interface JobAnalyticsDashboardProps {
  jobId: string;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--teal))', 'hsl(var(--coral))', 'hsl(var(--purple))', 'hsl(var(--orange))'];

export function JobAnalyticsDashboard({ jobId }: JobAnalyticsDashboardProps) {
  const analytics = getJobAnalytics(jobId);
  const funnel = getApplicationFunnel(jobId);
  const sources = getSourceEffectiveness(jobId);
  const geographic = getGeographicData(jobId);
  const timeSeries = getTimeSeriesData(jobId);
  const benchmark = getBenchmarkData(jobId);

  const funnelData = [
    { name: 'Views', value: funnel.views },
    { name: 'Applications', value: funnel.applications },
    { name: 'Screenings', value: funnel.screenings },
    { name: 'Interviews', value: funnel.interviews },
    { name: 'Offers', value: funnel.offers },
    { name: 'Hired', value: funnel.hired },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">{analytics.totalApplications}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-teal" />
                  {analytics.conversionRate.toFixed(1)}% conversion
                </p>
              </div>
              <Target className="h-8 w-8 text-teal" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Time to Hire</p>
                <p className="text-2xl font-bold">{analytics.timeToHire} days</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {analytics.timeToHire < benchmark.companyAverage.timeToHire ? (
                    <><TrendingDown className="h-3 w-3 text-teal" />Better than avg</>
                  ) : (
                    <><TrendingUp className="h-3 w-3 text-coral" />Above average</>
                  )}
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost per Hire</p>
                <p className="text-2xl font-bold">${analytics.costPerHire.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quality Score</p>
                <p className="text-2xl font-bold">{analytics.qualityScore.toFixed(0)}/100</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funnel">Application Funnel</TabsTrigger>
          <TabsTrigger value="sources">Source Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle>Application Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Source Effectiveness</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sources}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="applications" fill="hsl(var(--primary))" name="Applications" />
                  <Bar yAxisId="right" dataKey="quality" fill="hsl(var(--teal))" name="Quality Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Views & Applications Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" name="Views" />
                  <Line type="monotone" dataKey="applications" stroke="hsl(var(--teal))" name="Applications" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography">
          <Card>
            <CardHeader>
              <CardTitle>Applications by Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={geographic}
                        dataKey="applications"
                        nameKey="country"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {geographic.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1">
                  <div className="space-y-3">
                    {geographic.map((item, index) => (
                      <div key={item.country} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{item.country}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{item.applications}</p>
                          <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
