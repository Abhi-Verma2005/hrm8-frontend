import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Users, 
  BarChart3, 
  FileText,
  Download,
  Calendar
} from "lucide-react";
import {
  getSalesDashboardMetrics,
  getSalesFunnelData,
  getRevenueForecastData,
  getPipelineByRegion,
  getWinRateTrend,
  getTopPerformers
} from "@/lib/salesDashboardUtils";
import { getAllOpportunities } from "@/lib/salesOpportunityStorage";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useNavigate } from "react-router-dom";

export default function DashboardSalesPage() {
  const navigate = useNavigate();
  const metrics = getSalesDashboardMetrics();
  const funnelData = getSalesFunnelData();
  const forecastData = getRevenueForecastData();
  const regionData = getPipelineByRegion();
  const winRateData = getWinRateTrend();
  const topPerformers = getTopPerformers();
  const opportunities = getAllOpportunities();

  const topOpportunities = opportunities
    .filter(o => o.stage !== 'closed-won' && o.stage !== 'closed-lost')
    .sort((a, b) => b.estimatedValue - a.estimatedValue)
    .slice(0, 10);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardPageLayout
      title="Sales Dashboard"
      subtitle="Track sales opportunities, pipeline, and forecasts"
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Pipeline Value"
            value={formatCurrency(metrics.totalPipelineValue)}
            icon={DollarSign}
            description="Active opportunities value"
            trend={{ value: 12.5, isPositive: true }}
            change="+$250K from last month"
          />
          <StatsCard
            title="Active Opportunities"
            value={metrics.activeOpportunities.toString()}
            icon={Target}
            description="Open deals in pipeline"
            trend={{ value: 8.2, isPositive: true }}
            change="+5 new this month"
          />
          <StatsCard
            title="Conversion Rate"
            value={`${metrics.conversionRate.toFixed(1)}%`}
            icon={TrendingUp}
            description="Win rate"
            trend={{ value: 4.5, isPositive: true }}
            change="+2.1% vs last quarter"
          />
          <StatsCard
            title="Average Deal Size"
            value={formatCurrency(metrics.averageDealSize)}
            icon={BarChart3}
            description="Per closed deal"
            trend={{ value: 6.3, isPositive: true }}
            change="+$8K from average"
          />
          <StatsCard
            title="Quota Attainment"
            value={`${metrics.quotaAttainment.toFixed(1)}%`}
            icon={Target}
            description="Team performance"
            trend={{ value: metrics.quotaAttainment >= 100 ? 0 : 100 - metrics.quotaAttainment, isPositive: metrics.quotaAttainment >= 80 }}
            change={metrics.quotaAttainment >= 100 ? "Quota exceeded!" : "On track"}
          />
          <StatsCard
            title="Expected Revenue (Q1)"
            value={formatCurrency(metrics.expectedRevenueThisQuarter)}
            icon={DollarSign}
            description="Weighted forecast"
            trend={{ value: 15.2, isPositive: true }}
            change="High confidence"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sales Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="stage" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Area type="monotone" dataKey="projected" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorProjected)" />
                  {forecastData.some(d => d.actual) && (
                    <Area type="monotone" dataKey="actual" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.3} />
                  )}
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pipeline by Territory</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.region}: ${entry.percentage.toFixed(0)}%`}
                    outerRadius={100}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Win Rate Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={winRateData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Line type="monotone" dataKey="winRate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPerformers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" width={120} className="text-xs" />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Opportunities Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top 10 Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 text-sm font-semibold">Opportunity</th>
                    <th className="text-left p-2 text-sm font-semibold">Employer</th>
                    <th className="text-left p-2 text-sm font-semibold">Stage</th>
                    <th className="text-right p-2 text-sm font-semibold">Value</th>
                    <th className="text-right p-2 text-sm font-semibold">Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {topOpportunities.map((opp) => (
                    <tr key={opp.id} className="border-b hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/sales/opportunities`)}>
                      <td className="p-2 text-sm">{opp.name}</td>
                      <td className="p-2 text-sm">{opp.employerName}</td>
                      <td className="p-2 text-sm capitalize">{opp.stage.replace('-', ' ')}</td>
                      <td className="p-2 text-sm text-right">{formatCurrency(opp.estimatedValue)}</td>
                      <td className="p-2 text-sm text-right">{opp.probability}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-4">
          <Button variant="outline" onClick={() => navigate('/sales/pipeline')} className="h-auto py-4 flex flex-col items-center gap-2">
            <Target className="h-6 w-6" />
            <span>View Pipeline</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/sales/team')} className="h-auto py-4 flex flex-col items-center gap-2">
            <Users className="h-6 w-6" />
            <span>Sales Team</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/sales/forecast')} className="h-auto py-4 flex flex-col items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span>Forecast Reports</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/sales/commissions')} className="h-auto py-4 flex flex-col items-center gap-2">
            <FileText className="h-6 w-6" />
            <span>Commissions</span>
          </Button>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
