import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Helmet } from "react-helmet-async";
import { 
  DollarSign, TrendingUp, TrendingDown, Users, Building2, 
  CreditCard, Receipt, ArrowUpRight, ArrowDownRight, Calendar,
  PieChart, BarChart3, Download
} from "lucide-react";
import { getPlatformMetrics } from "@/data/mockPlatformData";
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 118000, expenses: 45000, profit: 73000 },
  { month: 'Feb', revenue: 125000, expenses: 47000, profit: 78000 },
  { month: 'Mar', revenue: 132000, expenses: 48000, profit: 84000 },
  { month: 'Apr', revenue: 128000, expenses: 46000, profit: 82000 },
  { month: 'May', revenue: 138000, expenses: 49000, profit: 89000 },
  { month: 'Jun', revenue: 142500, expenses: 50000, profit: 92500 },
];

const customerValueData = [
  { segment: 'Enterprise', value: 850, color: '#3b82f6' },
  { segment: 'Medium', value: 450, color: '#10b981' },
  { segment: 'Small', value: 280, color: '#f59e0b' },
  { segment: 'Startup', value: 180, color: '#8b5cf6' },
];

const subscriptionData = [
  { tier: 'Enterprise', count: 12, revenue: 36000 },
  { tier: 'Professional', count: 45, revenue: 67500 },
  { tier: 'Standard', count: 89, revenue: 35600 },
  { tier: 'Basic', count: 10, revenue: 3400 },
];

const churnData = [
  { month: 'Jan', churn: 2.8, target: 2.0 },
  { month: 'Feb', churn: 2.5, target: 2.0 },
  { month: 'Mar', churn: 2.2, target: 2.0 },
  { month: 'Apr', churn: 2.4, target: 2.0 },
  { month: 'May', churn: 2.0, target: 2.0 },
  { month: 'Jun', churn: 2.1, target: 2.0 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function Finance() {
  const metrics = useMemo(() => getPlatformMetrics(), []);

  const revenueMetrics = useMemo(() => {
    const currentRevenue = metrics.monthlyRecurringRevenue;
    const previousRevenue = currentRevenue / (1 + metrics.revenueGrowth / 100);
    const revenueIncrease = currentRevenue - previousRevenue;

    const avgCustomerValue = currentRevenue / metrics.totalEmployers;
    const lifetimeValue = avgCustomerValue * 24; // 2 years average
    
    const projectedAnnual = currentRevenue * 12 * (1 + metrics.revenueGrowth / 100);

    return {
      currentRevenue,
      revenueIncrease,
      avgCustomerValue,
      lifetimeValue,
      projectedAnnual,
    };
  }, [metrics]);

  return (
    <DashboardPageLayout>
      <Helmet>
        <title>Revenue Analytics - HRM8</title>
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              Revenue Analytics
            </h1>
            <p className="text-muted-foreground">Financial performance, growth metrics, and forecasting</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  ${(metrics.monthlyRecurringRevenue / 1000).toFixed(0)}K
                </span>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>{metrics.revenueGrowth}%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +${(revenueMetrics.revenueIncrease / 1000).toFixed(1)}K from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg Customer Value</span>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold">
                ${revenueMetrics.avgCustomerValue.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                per month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Customer LTV</span>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold">
                ${(revenueMetrics.lifetimeValue / 1000).toFixed(1)}K
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                24-month average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Churn Rate</span>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{metrics.churnRate}%</span>
                <Badge variant={metrics.churnRate <= 2.0 ? "secondary" : "destructive"} className="text-xs">
                  {metrics.churnRate <= 2.0 ? 'Good' : 'High'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Target: &lt;2.0%
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList>
            <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
            <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="churn">Churn Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            {/* Revenue Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend (6 Months)</CardTitle>
                <CardDescription>Monthly revenue, expenses, and profit comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Revenue" />
                    <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Expenses" />
                    <Area type="monotone" dataKey="profit" stackId="3" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Subscription Tier</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subscriptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tier" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Annual Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Projected Annual Revenue</span>
                      </div>
                      <div className="text-4xl font-bold mb-1">
                        ${(revenueMetrics.projectedAnnual / 1000000).toFixed(2)}M
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Based on current growth rate of {metrics.revenueGrowth}%
                      </p>
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Current MRR</span>
                        <span className="font-semibold">${(metrics.monthlyRecurringRevenue / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Q1 Target</span>
                        <span className="font-semibold">${((metrics.monthlyRecurringRevenue * 3) / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Annual Target</span>
                        <span className="font-semibold">${((metrics.monthlyRecurringRevenue * 12) / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Value Distribution</CardTitle>
                  <CardDescription>Average revenue per customer segment</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={customerValueData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ segment, value }) => `${segment}: $${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {customerValueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total Customers</span>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="text-3xl font-bold">{metrics.totalEmployers}</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        +{metrics.newSignupsThisMonth} new this month
                      </p>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Active Users</span>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="text-3xl font-bold">{metrics.totalActiveUsers.toLocaleString()}</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Across all customers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>Customer count by subscription tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptionData.map((sub, index) => (
                    <div key={sub.tier} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{sub.tier}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">{sub.count} customers</span>
                          <span className="font-semibold">${sub.revenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo</span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${(sub.count / subscriptionData.reduce((acc, s) => acc + s.count, 0)) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptionData.map((tier) => (
                    <div key={tier.tier} className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h3 className="font-semibold">{tier.tier}</h3>
                        <p className="text-sm text-muted-foreground">{tier.count} active subscriptions</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${tier.revenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                        <p className="text-xs text-muted-foreground">monthly revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="churn" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Churn Rate Trend</CardTitle>
                <CardDescription>Monthly churn rate vs target</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={churnData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="churn" stroke="#ef4444" strokeWidth={2} name="Actual Churn" />
                    <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground mb-2">Current Month</div>
                  <div className="text-3xl font-bold mb-1">{metrics.churnRate}%</div>
                  <Badge variant={metrics.churnRate <= 2.0 ? "secondary" : "destructive"}>
                    {metrics.churnRate <= 2.0 ? 'On Target' : 'Above Target'}
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground mb-2">Churned Customers</div>
                  <div className="text-3xl font-bold mb-1">
                    {Math.ceil(metrics.totalEmployers * (metrics.churnRate / 100))}
                  </div>
                  <p className="text-xs text-muted-foreground">this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground mb-2">Revenue at Risk</div>
                  <div className="text-3xl font-bold mb-1">
                    ${((metrics.monthlyRecurringRevenue * metrics.churnRate) / 100 / 1000).toFixed(1)}K
                  </div>
                  <p className="text-xs text-muted-foreground">monthly</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
