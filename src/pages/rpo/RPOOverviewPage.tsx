import { useMemo } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { getRPODashboardMetrics } from '@/lib/rpoTrackingUtils';
import { getRenewalAlertsSummary } from '@/lib/rpoRenewalUtils';
import { getAllServiceProjects } from '@/lib/recruitmentServiceStorage';
import { FileText, AlertTriangle, Building2, Users, DollarSign, Clock, BarChart3, UserCog, FileBarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { RPOContractsTable } from '@/components/rpo/RPOContractsTable';

export default function RPOOverviewPage() {
  const metrics = useMemo(() => getRPODashboardMetrics(), []);
  const renewalSummary = useMemo(() => getRenewalAlertsSummary(), []);

  // Get actual RPO contracts from storage
  const rpoContracts = useMemo(() => {
    return getAllServiceProjects().filter(project => project.isRPO && project.serviceType === 'rpo');
  }, []);

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
              <Button variant="outline" asChild>
                <Link to="/rpo/consultants">
                  <UserCog className="h-4 w-4 mr-2" />
                  Manage Consultants
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/rpo/performance">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/rpo/reports">
                  <FileBarChart className="h-4 w-4 mr-2" />
                  Reports
                </Link>
              </Button>
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

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active Contracts"
            value={metrics.totalActiveContracts}
            icon={Building2}
            description="Currently active RPO contracts"
            trend={{ value: 12, isPositive: true }}
            change="vs last month"
          />
          <StatsCard
            title="Dedicated Consultants"
            value={metrics.totalDedicatedConsultants}
            icon={Users}
            description="Consultants assigned to RPO"
            trend={{ value: 8, isPositive: true }}
            change="vs last month"
          />
          <StatsCard
            title="Monthly Recurring Revenue"
            value={`$${metrics.totalMonthlyRecurringRevenue.toLocaleString()}`}
            icon={DollarSign}
            description="Total MRR from active contracts"
            trend={{ value: 15, isPositive: true }}
            change="vs last month"
          />
          <StatsCard
            title="Expiring Soon"
            value={renewalSummary.total}
            icon={Clock}
            description={`${renewalSummary.critical} critical within 30 days`}
            trend={{ value: renewalSummary.critical, isPositive: false }}
            change="requiring action"
          />
        </div>

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
                    View Details
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

        {/* Contracts Table */}
        <RPOContractsTable contracts={rpoContracts} />
      </div>
    </DashboardPageLayout>
  );
}
