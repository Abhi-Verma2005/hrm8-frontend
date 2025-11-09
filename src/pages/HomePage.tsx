import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Users, Briefcase, TrendingUp, AlertCircle, DollarSign, Activity,
  Clock, CheckCircle, Server, Zap, Bell, MessageSquare, Target,
  ArrowUpRight, ArrowDownRight, Calendar, Building2, Plug, Shield
} from "lucide-react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatsCard } from "@/components/ui/stats-card";
import { RecentNotificationsCard } from "@/components/notifications/widgets/RecentNotificationsCard";
import { PendingServicesWidget } from "@/components/recruitment/widgets/PendingServicesWidget";
import {
  getPlatformMetrics,
  getSupportTickets,
  getRecruitmentQueue,
  getSystemIntegrations,
  getPlatformActivity,
  getTicketsByStatus,
  getTicketsByPriority,
  getServicesByStatus,
  type SupportTicket,
  type PlatformActivity,
} from "@/data/mockPlatformData";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const navigate = useNavigate();

  // Fetch platform data
  const metrics = useMemo(() => getPlatformMetrics(), []);
  const tickets = useMemo(() => getSupportTickets(), []);
  const recruitmentQueue = useMemo(() => getRecruitmentQueue(), []);
  const integrations = useMemo(() => getSystemIntegrations(), []);
  const activities = useMemo(() => getPlatformActivity(), []);

  // Calculate key stats
  const stats = useMemo(() => {
    const openTickets = getTicketsByStatus('open').length;
    const criticalTickets = getTicketsByPriority('critical').length;
    const pendingServices = getServicesByStatus('pending').length;
    const activeIntegrations = integrations.filter(i => i.status === 'active').length;
    const errorIntegrations = integrations.filter(i => i.status === 'error').length;

    return {
      openTickets,
      criticalTickets,
      pendingServices,
      activeIntegrations,
      errorIntegrations,
    };
  }, [integrations]);

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getActivityIcon = (type: PlatformActivity['type']) => {
    switch (type) {
      case 'user-signup': return Users;
      case 'job-posted': return Briefcase;
      case 'service-requested': return Target;
      case 'payment-received': return DollarSign;
      case 'support-ticket': return MessageSquare;
      case 'integration-connected': return Plug;
      default: return Activity;
    }
  };

  return (
    <DashboardPageLayout>
      <Helmet>
        <title>Home - Super Admin Dashboard</title>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
            <p className="text-muted-foreground">Monitor and manage your HRM8 platform operations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/support-tickets')}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Support
            </Button>
            <Button onClick={() => navigate('/admin-settings')}>
              <Shield className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Platform Health KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={metrics.totalActiveUsers.toLocaleString()}
            icon={Users}
            description={`${metrics.totalEmployers} employers`}
            trend={{ value: metrics.revenueGrowth, isPositive: true }}
          />
          <StatsCard
            title="Monthly Revenue"
            value={`$${(metrics.monthlyRecurringRevenue / 1000).toFixed(0)}K`}
            icon={DollarSign}
            description="MRR"
            trend={{ value: metrics.revenueGrowth, isPositive: true }}
          />
          <StatsCard
            title="Platform Uptime"
            value={`${metrics.platformUptime}%`}
            icon={Server}
            description="Last 30 days"
            className="border-l-4 border-l-green-500"
          />
          <StatsCard
            title="Avg Response Time"
            value={`${metrics.avgResponseTime}h`}
            icon={Clock}
            description={`${metrics.customerSatisfaction}/5 satisfaction`}
          />
        </div>

        {/* Priority Action Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-red-500" 
                onClick={() => navigate('/support-tickets')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  Critical Tickets
                </span>
                <Badge variant="destructive">{stats.criticalTickets}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.openTickets}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Open tickets requiring attention
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-orange-500"
                onClick={() => navigate('/recruitment-services')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  Pending Services
                </span>
                <Badge variant="secondary">{stats.pendingServices}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{recruitmentQueue.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Recruitment services in queue
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-500"
                onClick={() => navigate('/employers')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  New Sign-ups
                </span>
                <Badge variant="secondary">{metrics.newSignupsThisMonth}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{metrics.totalEmployers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total active employers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => navigate('/employers')}>
                <Building2 className="h-6 w-6 mb-2" />
                <span className="text-xs">Employers</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => navigate('/support-tickets')}>
                <MessageSquare className="h-6 w-6 mb-2" />
                <span className="text-xs">Tickets</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => navigate('/recruitment-services')}>
                <Target className="h-6 w-6 mb-2" />
                <span className="text-xs">Services</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => navigate('/users')}>
                <Users className="h-6 w-6 mb-2" />
                <span className="text-xs">Users</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => navigate('/integrations')}>
                <Plug className="h-6 w-6 mb-2" />
                <span className="text-xs">Integrations</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => navigate('/finance')}>
                <DollarSign className="h-6 w-6 mb-2" />
                <span className="text-xs">Finance</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4 relative" onClick={() => navigate('/notifications')}>
                <Bell className="h-6 w-6 mb-2" />
                <span className="text-xs">Notifications</span>
                {stats.openTickets > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                    {stats.openTickets > 9 ? '9+' : stats.openTickets}
                  </Badge>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Support Ticket Queue */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Support Ticket Queue</span>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/support-tickets')}>
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tickets.slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                         onClick={() => navigate('/support-tickets')}>
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border",
                        getPriorityColor(ticket.priority)
                      )}>
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{ticket.subject}</p>
                            <p className="text-xs text-muted-foreground">{ticket.employerName}</p>
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {ticket.ticketNumber}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {ticket.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Platform Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.slice(0, 8).map((activity) => {
                    const ActivityIcon = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-start gap-4 pb-3 border-b last:border-0 last:pb-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          <ActivityIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          {activity.employerName && (
                            <p className="text-xs text-muted-foreground">{activity.employerName}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Cards */}
          <div className="space-y-6">
            {/* Recent Notifications */}
            <RecentNotificationsCard userId="super-admin-001" maxItems={5} />

            {/* Pending Service Requests */}
            <PendingServicesWidget maxItems={5} />

            {/* System Integrations Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plug className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active Integrations</span>
                    <Badge variant="secondary">{stats.activeIntegrations}/{integrations.length}</Badge>
                  </div>
                  {stats.errorIntegrations > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Issues</span>
                      <Badge variant="destructive">{stats.errorIntegrations}</Badge>
                    </div>
                  )}
                </div>
                <div className="pt-2 border-t space-y-2">
                  {integrations.slice(0, 4).map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate">{integration.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {integration.connectedEmployers}
                        </span>
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          integration.status === 'active' && "bg-green-500",
                          integration.status === 'maintenance' && "bg-yellow-500",
                          integration.status === 'error' && "bg-red-500"
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full" onClick={() => navigate('/integrations')}>
                  Manage Integrations
                </Button>
              </CardContent>
            </Card>

            {/* Revenue Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-bold">
                      ${(metrics.monthlyRecurringRevenue / 1000).toFixed(1)}K
                    </span>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <ArrowUpRight className="h-3 w-3" />
                      <span>{metrics.revenueGrowth}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Monthly Recurring Revenue</p>
                </div>
                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Churn Rate</span>
                    <div className="flex items-center gap-1 text-red-600">
                      <span className="font-medium">{metrics.churnRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">New This Month</span>
                    <Badge variant="secondary">{metrics.newSignupsThisMonth}</Badge>
                  </div>
                </div>
                <Button className="w-full" onClick={() => navigate('/finance')}>
                  View Finance Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
