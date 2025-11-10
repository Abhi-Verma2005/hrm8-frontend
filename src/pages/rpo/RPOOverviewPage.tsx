import { useMemo } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { RPOOverviewCards } from '@/components/rpo/RPOOverviewCards';
import { getRPODashboardMetrics } from '@/lib/rpoTrackingUtils';
import { getRenewalAlertsSummary } from '@/lib/rpoRenewalUtils';
import { getTaskStats } from '@/lib/rpoTaskStorage';
import { FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RPOOverviewPage() {
  const metrics = useMemo(() => getRPODashboardMetrics(), []);
  const renewalSummary = useMemo(() => getRenewalAlertsSummary(), []);
  const taskStats = useMemo(() => getTaskStats(), []);

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <h1 className="text-3xl font-bold">RPO Management</h1>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/recruitment-services?type=rpo">
                  Create New Contract
                </Link>
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Comprehensive RPO contract management, consultant allocation, and performance tracking
          </p>
        </div>

        <RPOOverviewCards metrics={metrics} />

        {/* Critical Alerts */}
        {renewalSummary.critical > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-destructive">Urgent Action Required</CardTitle>
                </div>
                <Button asChild variant="destructive" size="sm">
                  <Link to="/rpo/renewals">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">
                <strong>{renewalSummary.critical}</strong> contract{renewalSummary.critical !== 1 ? 's' : ''} expiring within 30 days
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/rpo/contracts">
              <CardHeader>
                <CardTitle className="text-lg">Active Contracts</CardTitle>
                <CardDescription>Manage all RPO contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metrics.totalActiveContracts}</div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/rpo/consultants">
              <CardHeader>
                <CardTitle className="text-lg">Consultants</CardTitle>
                <CardDescription>Allocation & availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metrics.totalDedicatedConsultants}</div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/rpo/tasks">
              <CardHeader>
                <CardTitle className="text-lg">Active Tasks</CardTitle>
                <CardDescription>Pending & in progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold">
                    {taskStats.inProgress + taskStats.total - taskStats.completed}
                  </div>
                  {taskStats.overdue > 0 && (
                    <Badge variant="destructive">{taskStats.overdue} overdue</Badge>
                  )}
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/rpo/renewals">
              <CardHeader>
                <CardTitle className="text-lg">Renewals</CardTitle>
                <CardDescription>Upcoming renewals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold">{renewalSummary.total}</div>
                  {renewalSummary.critical > 0 && (
                    <Badge variant="destructive">{renewalSummary.critical} critical</Badge>
                  )}
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Monthly Recurring Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Recurring Revenue</CardTitle>
            <CardDescription>Total MRR from all active RPO contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              ${metrics.totalMonthlyRecurringRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Average contract duration: {metrics.averageContractDuration} months
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
