import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, DollarSign, AlertTriangle } from 'lucide-react';
import type { RPODashboardMetrics } from '@/lib/rpoTrackingUtils';

interface RPOOverviewCardsProps {
  metrics: RPODashboardMetrics;
}

export function RPOOverviewCards({ metrics }: RPOOverviewCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalActiveContracts}</div>
          <p className="text-xs text-muted-foreground">
            Avg. {metrics.averageContractDuration} months duration
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dedicated Consultants</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalDedicatedConsultants}</div>
          <p className="text-xs text-muted-foreground">
            Full-time RPO assignments
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${metrics.totalMonthlyRecurringRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Total contract value: ${metrics.totalContractValue.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <AlertTriangle className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{metrics.expiringContracts}</div>
          <p className="text-xs text-muted-foreground">
            Contracts ending within 30 days
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
