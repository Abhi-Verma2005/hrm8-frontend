import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Helmet } from "react-helmet-async";
import { 
  Server, Activity, Zap, AlertTriangle, CheckCircle, Clock,
  Cpu, HardDrive, Network, Database, Plug, RefreshCw, TrendingUp,
  XCircle, Shield, Bell
} from "lucide-react";
import { getSystemIntegrations, getPlatformMetrics, type SystemIntegration } from "@/data/mockPlatformData";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock system health data
const systemHealthData = [
  { time: '00:00', uptime: 99.9, cpu: 45, memory: 62, requests: 1200 },
  { time: '04:00', uptime: 99.8, cpu: 38, memory: 58, requests: 890 },
  { time: '08:00', uptime: 99.9, cpu: 68, memory: 71, requests: 3400 },
  { time: '12:00', uptime: 99.9, cpu: 72, memory: 75, requests: 4200 },
  { time: '16:00', uptime: 99.8, cpu: 81, memory: 78, requests: 4800 },
  { time: '20:00', uptime: 99.9, cpu: 65, memory: 70, requests: 2900 },
];

const performanceData = [
  { metric: 'API Response Time', value: '142ms', status: 'good', trend: 'down' },
  { metric: 'Database Query Time', value: '28ms', status: 'good', trend: 'stable' },
  { metric: 'Page Load Time', value: '1.8s', status: 'good', trend: 'down' },
  { metric: 'Error Rate', value: '0.02%', status: 'good', trend: 'down' },
];

const mockAlerts = [
  { id: '1', type: 'warning', message: 'High CPU usage detected on web server 2', time: new Date(Date.now() - 30 * 60 * 1000), resolved: false },
  { id: '2', type: 'info', message: 'Scheduled maintenance completed successfully', time: new Date(Date.now() - 2 * 60 * 60 * 1000), resolved: true },
  { id: '3', type: 'error', message: 'Integration sync failed for Workday Connector', time: new Date(Date.now() - 45 * 60 * 1000), resolved: false },
];

export default function SystemMonitoring() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const integrations = useMemo(() => getSystemIntegrations(), []);
  const metrics = useMemo(() => getPlatformMetrics(), []);

  const systemStats = useMemo(() => {
    const activeIntegrations = integrations.filter(i => i.status === 'active').length;
    const errorIntegrations = integrations.filter(i => i.status === 'error').length;
    const maintenanceIntegrations = integrations.filter(i => i.status === 'maintenance').length;
    
    return {
      activeIntegrations,
      errorIntegrations,
      maintenanceIntegrations,
      totalIntegrations: integrations.length,
    };
  }, [integrations]);

  const getStatusColor = (status: SystemIntegration['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'maintenance': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: SystemIntegration['status']) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'error': return XCircle;
      case 'maintenance': return AlertTriangle;
      case 'inactive': return Clock;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      case 'info': return CheckCircle;
      default: return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <DashboardPageLayout>
      <Helmet>
        <title>System Monitoring - HRM8</title>
      </Helmet>

      <div className="p-12 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Server className="h-8 w-8 text-primary" />
              System Monitoring
            </h1>
            <p className="text-muted-foreground">Platform health, performance metrics, and integration status</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", autoRefresh && "animate-spin")} />
              Auto-Refresh
            </Button>
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </Button>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Platform Uptime</span>
                <Activity className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600">{metrics.platformUptime}%</div>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold">{metrics.totalActiveUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently online</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Integrations</span>
                <Plug className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{systemStats.activeIntegrations}</span>
                <span className="text-sm text-muted-foreground">/ {systemStats.totalIntegrations}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {systemStats.errorIntegrations > 0 && `${systemStats.errorIntegrations} issues`}
                {systemStats.errorIntegrations === 0 && 'All operational'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg Response</span>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold">142ms</div>
              <Badge variant="secondary" className="mt-1">Good</Badge>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            {/* Performance Metrics Chart */}
            <Card>
              <CardHeader>
                <CardTitle>System Performance (24 Hours)</CardTitle>
                <CardDescription>Uptime, CPU, memory usage, and request volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={systemHealthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="uptime" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Uptime %" />
                    <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="CPU %" />
                    <Area type="monotone" dataKey="memory" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Memory %" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceData.map((metric) => (
                <Card key={metric.metric}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{metric.metric}</span>
                      {metric.trend === 'down' && <TrendingUp className="h-4 w-4 text-green-600 rotate-180" />}
                      {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-600" />}
                    </div>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <Badge variant={metric.status === 'good' ? 'secondary' : 'destructive'} className="mt-2 capitalize">
                      {metric.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Request Volume Chart */}
            <Card>
              <CardHeader>
                <CardTitle>API Request Volume</CardTitle>
                <CardDescription>Number of API requests over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={systemHealthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} name="Requests" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            {/* Integration Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-green-600">{systemStats.activeIntegrations}</div>
                  <p className="text-sm text-muted-foreground mt-1">Active</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-red-600">{systemStats.errorIntegrations}</div>
                  <p className="text-sm text-muted-foreground mt-1">Errors</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-yellow-600">{systemStats.maintenanceIntegrations}</div>
                  <p className="text-sm text-muted-foreground mt-1">Maintenance</p>
                </CardContent>
              </Card>
            </div>

            {/* Integration List */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
                <CardDescription>All system integrations and their current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {integrations.map((integration) => {
                    const StatusIcon = getStatusIcon(integration.status);
                    return (
                      <div
                        key={integration.id}
                        className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className={cn(
                          "flex items-center justify-center w-12 h-12 rounded-lg border-2",
                          getStatusColor(integration.status)
                        )}>
                          <StatusIcon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{integration.name}</h3>
                            <Badge variant="outline" className="text-xs capitalize">
                              {integration.type.replace('-', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{integration.connectedEmployers} employers</span>
                            {integration.lastSync && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Last sync: {formatDistanceToNow(new Date(integration.lastSync), { addSuffix: true })}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge className={cn("capitalize", getStatusColor(integration.status))}>
                          {integration.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent system alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAlerts.map((alert) => {
                    const AlertIcon = getAlertIcon(alert.type);
                    return (
                      <div
                        key={alert.id}
                        className={cn(
                          "flex items-start gap-4 p-4 rounded-lg border",
                          alert.resolved && "opacity-60"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-lg border-2",
                          getAlertColor(alert.type)
                        )}>
                          <AlertIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(alert.time, { addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={alert.resolved ? "secondary" : "destructive"} className="text-xs">
                            {alert.resolved ? 'Resolved' : 'Active'}
                          </Badge>
                          {!alert.resolved && (
                            <Button size="sm" variant="outline">
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    CPU Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Web Server 1</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Web Server 2</span>
                        <span className="text-sm font-medium">82%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '82%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Database Server</span>
                        <span className="text-sm font-medium">58%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '58%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Memory Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Web Server 1</span>
                        <span className="text-sm font-medium">62%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '62%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Web Server 2</span>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Database Server</span>
                        <span className="text-sm font-medium">68%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Connections</span>
                      <span className="text-lg font-semibold">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Query Time (avg)</span>
                      <span className="text-lg font-semibold">28ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Storage Used</span>
                      <span className="text-lg font-semibold">248 GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Slow Queries</span>
                      <span className="text-lg font-semibold">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Network Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Bandwidth In</span>
                      <span className="text-lg font-semibold">125 Mbps</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Bandwidth Out</span>
                      <span className="text-lg font-semibold">98 Mbps</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Requests</span>
                      <span className="text-lg font-semibold">3,421</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Failed Requests</span>
                      <span className="text-lg font-semibold">12</span>
                    </div>
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
