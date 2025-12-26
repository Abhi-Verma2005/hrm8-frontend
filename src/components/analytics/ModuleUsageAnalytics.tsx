import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from "recharts";
import { getModuleUsage, getModuleAdoptionRate } from "@/lib/mockModuleUsageStorage";
import { TrendingUp, Users, Clock, Activity } from "lucide-react";
import { useMemo } from "react";

interface ModuleUsageAnalyticsProps {
  employerId: string;
}

export function ModuleUsageAnalytics({ employerId }: ModuleUsageAnalyticsProps) {
  const usage = getModuleUsage(employerId, 30);

  const moduleStats = useMemo(() => {
    const stats: Record<string, { sessions: number; users: Set<string>; avgDuration: number }> = {};
    
    usage.forEach(metric => {
      if (!stats[metric.moduleName]) {
        stats[metric.moduleName] = { sessions: 0, users: new Set(), avgDuration: 0 };
      }
      stats[metric.moduleName].sessions += metric.totalSessions;
      stats[metric.moduleName].avgDuration += metric.avgSessionDuration;
    });

    return Object.entries(stats).map(([module, data]) => ({
      module: module.replace('ats.', '').replace('hrms.', ''),
      sessions: data.sessions,
      avgDuration: Math.round(data.avgDuration / usage.filter(u => u.moduleName === module).length)
    }));
  }, [usage]);

  const dailyUsage = useMemo(() => {
    const daily: Record<string, { date: string; sessions: number; users: number }> = {};
    
    usage.forEach(metric => {
      const dateKey = metric.date.toISOString().split('T')[0];
      if (!daily[dateKey]) {
        daily[dateKey] = { date: dateKey, sessions: 0, users: 0 };
      }
      daily[dateKey].sessions += metric.totalSessions;
      daily[dateKey].users += metric.activeUsers;
    });

    return Object.values(daily).sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  }, [usage]);

  const moduleDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    
    usage.forEach(metric => {
      const category = metric.moduleName.startsWith('ats.') ? 'ATS' : 'HRMS';
      dist[category] = (dist[category] || 0) + metric.totalSessions;
    });

    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [usage]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const totalSessions = usage.reduce((sum, u) => sum + u.totalSessions, 0);
  const avgSessionDuration = Math.round(
    usage.reduce((sum, u) => sum + u.avgSessionDuration, 0) / usage.length
  );
  const totalUsers = new Set(usage.map(u => u.activeUsers)).size;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Usage Analytics</CardTitle>
        <CardDescription>Last 30 days of activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </div>
            <p className="text-2xl font-bold">{totalSessions.toLocaleString()}</p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-green-500" />
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <p className="text-sm text-muted-foreground">Avg Duration</p>
            </div>
            <p className="text-2xl font-bold">{avgSessionDuration}m</p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <p className="text-sm text-muted-foreground">Active Modules</p>
            </div>
            <p className="text-2xl font-bold">{moduleStats.length}</p>
          </div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily Usage</TabsTrigger>
            <TabsTrigger value="modules">By Module</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sessions" stroke="#3b82f6" name="Sessions" />
                  <Line type="monotone" dataKey="users" stroke="#10b981" name="Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moduleStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="module" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sessions" fill="#3b82f6" name="Total Sessions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moduleDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {moduleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        {/* Module Performance */}
        <div>
          <h3 className="font-semibold mb-3">Module Performance</h3>
          <div className="space-y-2">
            {moduleStats.slice(0, 5).map((stat, idx) => (
              <div key={stat.module} className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{idx + 1}</Badge>
                  <span className="font-medium capitalize">{stat.module}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">{stat.sessions} sessions</span>
                  <span className="text-muted-foreground">{stat.avgDuration}m avg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
