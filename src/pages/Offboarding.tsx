import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserMinus, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { getOffboardingWorkflows, calculateOffboardingStats } from "@/lib/offboardingStorage";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays } from "date-fns";
import { OffboardingChecklistDialog } from "@/components/offboarding/OffboardingChecklistDialog";

export default function Offboarding() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [offboardingDialogOpen, setOffboardingDialogOpen] = useState(false);

  const workflows = useMemo(() => getOffboardingWorkflows(), [refreshKey]);
  const stats = useMemo(() => calculateOffboardingStats(), [refreshKey]);

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  const activeWorkflows = workflows.filter(w => w.status === 'in-progress');
  const completedWorkflows = workflows.filter(w => w.status === 'completed');

  return (
    <DashboardPageLayout>
      <div className="space-y-6 p-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Offboarding Management</h1>
          <p className="text-muted-foreground">Manage employee separations and exit processes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeOffboarding}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <UserMinus className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedThisMonth}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Notice Period</CardTitle>
              <AlertCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageNoticePeriod.toFixed(0)} days</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rehire Eligible</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rehireEligibleRate.toFixed(0)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="active" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="active">Active ({activeWorkflows.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <Button size="sm" onClick={() => setOffboardingDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Start Offboarding
            </Button>
          </div>

          <TabsContent value="active" className="space-y-4">
            {activeWorkflows.map(workflow => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{workflow.employeeName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{workflow.jobTitle} • {workflow.department}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {workflow.separationType.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Notice Date</p>
                      <p className="font-medium">{format(new Date(workflow.noticeDate), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Working Day</p>
                      <p className="font-medium">{format(new Date(workflow.lastWorkingDay), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Days Remaining</p>
                      <p className="font-medium text-warning">
                        {differenceInDays(new Date(workflow.lastWorkingDay), new Date())} days
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Exit Interview</p>
                      <p className="font-medium">
                        {workflow.exitInterviewCompleted ? (
                          <span className="text-success">Completed</span>
                        ) : workflow.exitInterviewScheduled ? (
                          <span className="text-warning">Scheduled</span>
                        ) : (
                          <span className="text-muted-foreground">Not Scheduled</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Clearance Progress</span>
                      <span className="font-medium">
                        {workflow.clearanceItems.filter(i => i.status === 'approved').length} / {workflow.clearanceItems.length}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${(workflow.clearanceItems.filter(i => i.status === 'approved').length / workflow.clearanceItems.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    {workflow.exitInterviewScheduled && !workflow.exitInterviewCompleted && (
                      <Button size="sm">Conduct Exit Interview</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Offboarding</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedWorkflows.map(workflow => (
                    <div key={workflow.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{workflow.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{workflow.jobTitle}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-right">
                          <p className="text-muted-foreground">Last Working Day</p>
                          <p className="font-medium">{format(new Date(workflow.lastWorkingDay), 'MMM dd, yyyy')}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {workflow.separationType.replace('-', ' ')}
                        </Badge>
                        {workflow.rehireEligible && (
                          <Badge variant="secondary">Rehire Eligible</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Separation Reasons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.topSeparationReasons.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{item.reason.replace('-', ' ')}</span>
                        <Badge variant="outline">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Offboarding Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Offboarding</span>
                      <span className="font-bold">{stats.totalOffboarding}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg Notice Period</span>
                      <span className="font-bold">{stats.averageNoticePeriod.toFixed(0)} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rehire Eligible Rate</span>
                      <span className="font-bold">{stats.rehireEligibleRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <OffboardingChecklistDialog 
          open={offboardingDialogOpen} 
          onOpenChange={setOffboardingDialogOpen}
          onSuccess={handleRefresh}
        />
      </div>
    </DashboardPageLayout>
  );
}
