import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  DollarSign, 
  AlertCircle, 
  Briefcase, 
  TrendingUp,
  FileText,
  Calendar,
  BarChart3
} from "lucide-react";
import {
  getRPODashboardMetrics,
  getContractStatusDistribution,
  getMonthlyRevenueProjection,
  getConsultantUtilizationData,
  getPlacementsByService,
  getRenewalTimeline
} from "@/lib/rpoDashboardUtils";
import { getAllServiceProjects } from "@/lib/recruitmentServiceStorage";
import { PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from "react-router-dom";

export default function DashboardRPOPage() {
  const navigate = useNavigate();
  const metrics = getRPODashboardMetrics();
  const statusData = getContractStatusDistribution();
  const revenueData = getMonthlyRevenueProjection();
  const utilizationData = getConsultantUtilizationData();
  const placementsData = getPlacementsByService();
  const renewalData = getRenewalTimeline();
  
  const projects = getAllServiceProjects();
  const rpoProjects = projects.filter(p => p.serviceType === 'rpo' && p.isRPO && p.status === 'active');

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
      title="RPO Dashboard"
      subtitle="Recruitment Process Outsourcing operations overview"
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Active Contracts"
            value={metrics.activeContracts.toString()}
            icon={Briefcase}
            description="Currently running"
            trend={{ value: 10.5, isPositive: true }}
            change="+2 new this quarter"
          />
          <StatsCard
            title="Dedicated Consultants"
            value={metrics.totalConsultants.toString()}
            icon={Users}
            description="On RPO projects"
            trend={{ value: 5.2, isPositive: true }}
            change="+3 since last month"
          />
          <StatsCard
            title="Monthly Recurring Revenue"
            value={formatCurrency(metrics.monthlyRecurringRevenue)}
            icon={DollarSign}
            description="Current MRR"
            trend={{ value: 8.7, isPositive: true }}
            change="+$45K from last month"
          />
          <StatsCard
            title="Contracts Expiring Soon"
            value={metrics.contractsExpiring.toString()}
            icon={AlertCircle}
            description="Within 90 days"
            trend={{ value: 0, isPositive: false }}
            change={metrics.contractsExpiring > 0 ? "Action required" : "All clear"}
            className={metrics.contractsExpiring > 0 ? "border-orange-500" : ""}
          />
          <StatsCard
            title="Average Contract Value"
            value={formatCurrency(metrics.averageContractValue)}
            icon={DollarSign}
            description="Per active contract"
            trend={{ value: 12.3, isPositive: true }}
            change="+$25K from average"
          />
          <StatsCard
            title="Placements This Month"
            value={metrics.totalPlacementsThisMonth.toString()}
            icon={TrendingUp}
            description="Successful hires"
            trend={{ value: 15.8, isPositive: true }}
            change="+8 vs last month"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contract Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.status}: ${entry.count}`}
                    outerRadius={100}
                    fill="hsl(var(--primary))"
                    dataKey="count"
                  >
                    {statusData.map((entry, index) => (
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
              <CardTitle className="text-lg">Revenue Forecast (12 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" />
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
              <CardTitle className="text-lg">Consultant Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={utilizationData.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={120} className="text-xs" />
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(0)}%`}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="utilization" radius={[0, 4, 4, 0]}>
                    {utilizationData.slice(0, 10).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.utilization > 80 ? '#10b981' : entry.utilization > 60 ? '#f59e0b' : '#ef4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Placements by Service Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={placementsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Bar dataKey="rpoFullService" stackId="a" fill="hsl(var(--chart-1))" name="RPO Full Service" />
                  <Bar dataKey="executiveSearch" stackId="a" fill="hsl(var(--chart-2))" name="Executive Search" />
                  <Bar dataKey="shortlisting" stackId="a" fill="hsl(var(--chart-3))" name="Shortlisting" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Renewal Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Renewals (Next 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 text-sm font-semibold">Contract</th>
                    <th className="text-left p-2 text-sm font-semibold">Employer</th>
                    <th className="text-left p-2 text-sm font-semibold">Renewal Date</th>
                    <th className="text-right p-2 text-sm font-semibold">Days Until</th>
                    <th className="text-right p-2 text-sm font-semibold">Value</th>
                    <th className="text-center p-2 text-sm font-semibold">Urgency</th>
                  </tr>
                </thead>
                <tbody>
                  {renewalData.map((renewal, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50 cursor-pointer" onClick={() => navigate('/rpo/renewals')}>
                      <td className="p-2 text-sm">{renewal.contractName}</td>
                      <td className="p-2 text-sm">{renewal.employer}</td>
                      <td className="p-2 text-sm">{new Date(renewal.renewalDate).toLocaleDateString()}</td>
                      <td className="p-2 text-sm text-right">{renewal.daysUntilRenewal}</td>
                      <td className="p-2 text-sm text-right">{formatCurrency(renewal.value)}</td>
                      <td className="p-2 text-sm text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          renewal.urgency === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          renewal.urgency === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {renewal.urgency}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {renewalData.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        No contracts expiring in the next 6 months
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Active Contracts Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 text-sm font-semibold">Contract Name</th>
                    <th className="text-left p-2 text-sm font-semibold">Client</th>
                    <th className="text-left p-2 text-sm font-semibold">Consultants</th>
                    <th className="text-right p-2 text-sm font-semibold">MRR</th>
                    <th className="text-left p-2 text-sm font-semibold">Start Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rpoProjects.slice(0, 10).map((project) => (
                    <tr key={project.id} className="border-b hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/recruitment-services/${project.id}`)}>
                      <td className="p-2 text-sm">{project.name}</td>
                      <td className="p-2 text-sm">{project.clientName}</td>
                      <td className="p-2 text-sm">{project.consultants.length}</td>
                      <td className="p-2 text-sm text-right">{formatCurrency(project.rpoMonthlyRetainer || 0)}</td>
                      <td className="p-2 text-sm">{new Date(project.startDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {rpoProjects.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        No active RPO contracts
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-4">
          <Button variant="outline" onClick={() => navigate('/rpo/contracts')} className="h-auto py-4 flex flex-col items-center gap-2">
            <Briefcase className="h-6 w-6" />
            <span>Manage Contracts</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/rpo/consultants')} className="h-auto py-4 flex flex-col items-center gap-2">
            <Users className="h-6 w-6" />
            <span>Consultants</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/rpo/performance')} className="h-auto py-4 flex flex-col items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span>Performance</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/rpo/renewals')} className="h-auto py-4 flex flex-col items-center gap-2">
            <Calendar className="h-6 w-6" />
            <span>Renewals</span>
          </Button>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
