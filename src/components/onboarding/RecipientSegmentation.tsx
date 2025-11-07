import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getSentEmails } from "@/lib/scheduledEmails";
import { getOnboardingWorkflows } from "@/lib/onboardingStorage";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, TrendingUp, Target, Building2 } from "lucide-react";

interface SegmentData {
  name: string;
  sent: number;
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;
  deliveryRate: number;
}

export function RecipientSegmentation() {
  const [activeSegment, setActiveSegment] = useState<'department' | 'jobTitle' | 'status'>('department');
  
  const sentEmails = useMemo(() => getSentEmails(), []);
  const workflows = useMemo(() => getOnboardingWorkflows(), []);

  // Create a map of workflow IDs to workflow data
  const workflowMap = useMemo(() => {
    const map = new Map();
    workflows.forEach(w => map.set(w.id, w));
    return map;
  }, [workflows]);

  // Segment by Department
  const departmentSegments = useMemo(() => {
    const deptMap = new Map<string, { sent: number; opened: number; clicked: number; delivered: number }>();

    sentEmails.forEach(email => {
      email.recipientIds.forEach(id => {
        const workflow = workflowMap.get(id);
        if (workflow) {
          const dept = workflow.department;
          if (!deptMap.has(dept)) {
            deptMap.set(dept, { sent: 0, opened: 0, clicked: 0, delivered: 0 });
          }
          const stats = deptMap.get(dept)!;
          stats.sent++;
          if (email.deliveryStatus === 'delivered') stats.delivered++;
          if (email.openedAt) stats.opened++;
          if (email.clickedAt) stats.clicked++;
        }
      });
    });

    return Array.from(deptMap.entries()).map(([name, stats]): SegmentData => ({
      name,
      sent: stats.sent,
      opened: stats.opened,
      clicked: stats.clicked,
      openRate: stats.sent > 0 ? Math.round((stats.opened / stats.sent) * 100) : 0,
      clickRate: stats.sent > 0 ? Math.round((stats.clicked / stats.sent) * 100) : 0,
      deliveryRate: stats.sent > 0 ? Math.round((stats.delivered / stats.sent) * 100) : 0,
    })).sort((a, b) => b.openRate - a.openRate);
  }, [sentEmails, workflowMap]);

  // Segment by Job Title
  const jobTitleSegments = useMemo(() => {
    const titleMap = new Map<string, { sent: number; opened: number; clicked: number; delivered: number }>();

    sentEmails.forEach(email => {
      email.recipientIds.forEach(id => {
        const workflow = workflowMap.get(id);
        if (workflow) {
          const title = workflow.jobTitle;
          if (!titleMap.has(title)) {
            titleMap.set(title, { sent: 0, opened: 0, clicked: 0, delivered: 0 });
          }
          const stats = titleMap.get(title)!;
          stats.sent++;
          if (email.deliveryStatus === 'delivered') stats.delivered++;
          if (email.openedAt) stats.opened++;
          if (email.clickedAt) stats.clicked++;
        }
      });
    });

    return Array.from(titleMap.entries()).map(([name, stats]): SegmentData => ({
      name,
      sent: stats.sent,
      opened: stats.opened,
      clicked: stats.clicked,
      openRate: stats.sent > 0 ? Math.round((stats.opened / stats.sent) * 100) : 0,
      clickRate: stats.sent > 0 ? Math.round((stats.clicked / stats.sent) * 100) : 0,
      deliveryRate: stats.sent > 0 ? Math.round((stats.delivered / stats.sent) * 100) : 0,
    })).sort((a, b) => b.openRate - a.openRate);
  }, [sentEmails, workflowMap]);

  // Segment by Onboarding Status
  const statusSegments = useMemo(() => {
    const statusMap = new Map<string, { sent: number; opened: number; clicked: number; delivered: number }>();

    sentEmails.forEach(email => {
      email.recipientIds.forEach(id => {
        const workflow = workflowMap.get(id);
        if (workflow) {
          const status = workflow.status;
          if (!statusMap.has(status)) {
            statusMap.set(status, { sent: 0, opened: 0, clicked: 0, delivered: 0 });
          }
          const stats = statusMap.get(status)!;
          stats.sent++;
          if (email.deliveryStatus === 'delivered') stats.delivered++;
          if (email.openedAt) stats.opened++;
          if (email.clickedAt) stats.clicked++;
        }
      });
    });

    return Array.from(statusMap.entries()).map(([name, stats]): SegmentData => ({
      name,
      sent: stats.sent,
      opened: stats.opened,
      clicked: stats.clicked,
      openRate: stats.sent > 0 ? Math.round((stats.opened / stats.sent) * 100) : 0,
      clickRate: stats.sent > 0 ? Math.round((stats.clicked / stats.sent) * 100) : 0,
      deliveryRate: stats.sent > 0 ? Math.round((stats.delivered / stats.sent) * 100) : 0,
    })).sort((a, b) => b.openRate - a.openRate);
  }, [sentEmails, workflowMap]);

  const getCurrentSegments = () => {
    switch (activeSegment) {
      case 'department':
        return departmentSegments;
      case 'jobTitle':
        return jobTitleSegments;
      case 'status':
        return statusSegments;
      default:
        return departmentSegments;
    }
  };

  const currentSegments = getCurrentSegments();

  // Pie chart data for distribution
  const distributionData = useMemo(() => {
    return currentSegments.map((segment, index) => ({
      name: segment.name,
      value: segment.sent,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    }));
  }, [currentSegments]);

  // Top and bottom performers
  const topPerformers = currentSegments.slice(0, 3);
  const bottomPerformers = currentSegments.slice(-3).reverse();

  if (sentEmails.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No email data available yet.<br />
            Send some emails to see segmentation analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Total Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSegments.length}</div>
            <p className="text-xs text-muted-foreground">Active {activeSegment} groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Best Segment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {topPerformers[0]?.openRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {topPerformers[0]?.name || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Avg Open Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {currentSegments.length > 0
                ? Math.round(currentSegments.reduce((sum, s) => sum + s.openRate, 0) / currentSegments.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Across all segments</p>
          </CardContent>
        </Card>
      </div>

      {/* Segment Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Segment Analysis</CardTitle>
          <CardDescription>View engagement metrics by different recipient groups</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSegment} onValueChange={(v) => setActiveSegment(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="department">
                <Building2 className="h-4 w-4 mr-2" />
                Department
              </TabsTrigger>
              <TabsTrigger value="jobTitle">
                <Users className="h-4 w-4 mr-2" />
                Job Title
              </TabsTrigger>
              <TabsTrigger value="status">
                <Target className="h-4 w-4 mr-2" />
                Status
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeSegment} className="space-y-6 mt-6">
              {/* Charts */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Email Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Engagement Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={currentSegments}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" angle={-45} textAnchor="end" height={80} />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="openRate" fill="hsl(var(--chart-1))" name="Open Rate %" />
                        <Bar dataKey="clickRate" fill="hsl(var(--chart-2))" name="Click Rate %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Segment List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Segment Performance Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentSegments.map((segment, index) => (
                    <div key={segment.name} className="space-y-3 pb-4 border-b last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-semibold">
                            #{index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold">{segment.name}</h4>
                            <p className="text-sm text-muted-foreground">{segment.sent} emails sent</p>
                          </div>
                        </div>
                        {index < 3 && <Badge className="bg-green-600">Top Performer</Badge>}
                        {index >= currentSegments.length - 3 && <Badge variant="secondary">Needs Attention</Badge>}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Delivery Rate</p>
                          <p className="text-lg font-semibold">{segment.deliveryRate}%</p>
                          <Progress value={segment.deliveryRate} className="h-1 mt-1" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Open Rate</p>
                          <p className="text-lg font-semibold text-blue-600">{segment.openRate}%</p>
                          <Progress value={segment.openRate} className="h-1 mt-1" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Click Rate</p>
                          <p className="text-lg font-semibold text-purple-600">{segment.clickRate}%</p>
                          <Progress value={segment.clickRate} className="h-1 mt-1" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                          <p className="text-lg font-semibold">
                            {segment.opened + segment.clicked}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Insights */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-green-200 bg-green-50 dark:bg-green-950">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {topPerformers.map((segment, index) => (
                      <div key={segment.name} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{segment.name}</span>
                        <Badge className="bg-green-600">{segment.openRate}% open rate</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-4 w-4 text-yellow-600" />
                      Needs Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {bottomPerformers.map((segment, index) => (
                      <div key={segment.name} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{segment.name}</span>
                        <Badge variant="secondary">{segment.openRate}% open rate</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
