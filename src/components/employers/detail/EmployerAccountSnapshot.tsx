import { Employer } from "@/types/entities";
import { formatRelativeDate } from "@/lib/utils";

interface EmployerMetrics {
  lifetimeValue: number;
  monthlyRevenue: number;
  daysAsCustomer: number;
  lastActivityDate: Date;
  activeJobs: number;
  totalJobs: number;
  activeUsers: number;
  totalUsers: number;
}

interface EmployerAccountSnapshotProps {
  employer: Employer;
  metrics: EmployerMetrics;
}

export function EmployerAccountSnapshot({ employer, metrics }: EmployerAccountSnapshotProps) {
  const subscriptionLabel = employer.subscriptionTier === 'small' ? 'Small Plan' :
                           employer.subscriptionTier === 'medium' ? 'Medium Plan' :
                           employer.subscriptionTier === 'large' ? 'Large Plan' :
                           'Enterprise Plan';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-muted/30 rounded-lg border">
      {/* Subscription Stat */}
      <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded border border-purple-200 dark:border-purple-900">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          Subscription
        </p>
        <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
          {subscriptionLabel}
        </p>
        <p className="text-xs text-muted-foreground mt-1 capitalize">
          {employer.subscriptionStatus}
        </p>
      </div>

      {/* Capacity Stat */}
      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-900">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          Capacity
        </p>
        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {employer.currentOpenJobs}/{employer.maxOpenJobs === Infinity ? '∞' : employer.maxOpenJobs} Jobs
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {employer.currentUsers}/{employer.maxUsers === Infinity ? '∞' : employer.maxUsers} Users
        </p>
      </div>

      {/* Financial Stat */}
      <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          Financial
        </p>
        <p className="text-xl font-bold text-green-600 dark:text-green-400">
          ${metrics.lifetimeValue.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          ${metrics.monthlyRevenue}/mo
        </p>
      </div>

      {/* Activity Stat */}
      <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded border border-orange-200 dark:border-orange-900">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          Activity
        </p>
        <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
          {metrics.daysAsCustomer < 365 ? `${Math.floor(metrics.daysAsCustomer / 30)} mo` : `${Math.floor(metrics.daysAsCustomer / 365)} yr`}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatRelativeDate(metrics.lastActivityDate)}
        </p>
      </div>
    </div>
  );
}
