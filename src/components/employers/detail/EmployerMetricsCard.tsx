import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Briefcase, Users, DollarSign, Calendar, Activity } from "lucide-react";
import { formatRelativeDate } from "@/lib/jobUtils";

interface EmployerMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalJobs: number;
  activeJobs: number;
  totalUsers: number;
  activeUsers: number;
  lifetimeValue: number;
  daysAsCustomer: number;
  lastActivityDate: string;
  outstandingBalance?: number;
}

interface EmployerMetricsCardProps {
  metrics: EmployerMetrics;
}

export function EmployerMetricsCard({ metrics }: EmployerMetricsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Revenue Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <p className="text-xs">Lifetime Value</p>
            </div>
            <p className="text-2xl font-bold">
              ${metrics.lifetimeValue.toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <p className="text-xs">Monthly Revenue</p>
            </div>
            <p className="text-2xl font-bold">
              ${metrics.monthlyRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        <Separator />

        {/* Jobs Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <p className="text-xs">Total Jobs</p>
            </div>
            <p className="text-xl font-bold">{metrics.totalJobs}</p>
            <p className="text-xs text-muted-foreground">All-time</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <p className="text-xs">Active Jobs</p>
            </div>
            <p className="text-xl font-bold">{metrics.activeJobs}</p>
            <p className="text-xs text-muted-foreground">Currently open</p>
          </div>
        </div>

        <Separator />

        {/* Users Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <p className="text-xs">Total Users</p>
            </div>
            <p className="text-xl font-bold">{metrics.totalUsers}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <p className="text-xs">Active Users</p>
            </div>
            <p className="text-xl font-bold">{metrics.activeUsers}</p>
          </div>
        </div>

        <Separator />

        {/* Additional Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <p className="text-xs">Days as Customer</p>
            </div>
            <p className="text-sm font-medium">{metrics.daysAsCustomer}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4" />
              <p className="text-xs">Last Activity</p>
            </div>
            <p className="text-sm font-medium">
              {formatRelativeDate(metrics.lastActivityDate)}
            </p>
          </div>

          {metrics.outstandingBalance !== undefined && metrics.outstandingBalance > 0 && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <p className="text-xs">Outstanding Balance</p>
                </div>
                <p className="text-sm font-bold text-destructive">
                  ${metrics.outstandingBalance.toLocaleString()}
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
