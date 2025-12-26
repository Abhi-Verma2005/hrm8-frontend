import { Employer } from "@/types/entities";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { Sparkles, Briefcase, DollarSign, Activity } from "lucide-react";

interface EmployerMetrics {
  totalRevenue: number;
  lifetimeValue: number;
  activeJobs: number;
  totalJobs: number;
  activeUsers: number;
  totalUsers: number;
  daysAsCustomer: number;
  lastActivityDate: Date;
  monthlyRevenue: number;
}

interface EmployerQuickStatsProps {
  employer: Employer;
  metrics: EmployerMetrics;
}

export function EmployerQuickStats({ employer, metrics }: EmployerQuickStatsProps) {
  const getTierLabel = (tier: string) => {
    const labels: Record<string, string> = {
      small: "Small Plan",
      medium: "Medium Plan",
      large: "Large Plan"
    };
    return labels[tier] || tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const formatActivity = () => {
    const monthsAgo = Math.floor(
      (Date.now() - new Date(metrics.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    return monthsAgo === 0 ? "Active today" : `${monthsAgo} month${monthsAgo !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <EnhancedStatCard
        title="Subscription"
        value={getTierLabel(employer.subscriptionTier)}
        change={employer.status.charAt(0).toUpperCase() + employer.status.slice(1)}
        trend={employer.status === 'active' ? 'up' : 'down'}
        icon={<Sparkles className="h-6 w-6" />}
        variant="primary"
      />
      
      <EnhancedStatCard
        title="Capacity"
        value={`${metrics.activeJobs}/${employer.totalJobsPosted || 0}`}
        change={`${employer.currentUsers}/${employer.maxUsers === Infinity ? '∞' : employer.maxUsers} Users`}
        trend={metrics.activeJobs > 0 ? 'up' : 'down'}
        icon={<Briefcase className="h-6 w-6" />}
        variant="neutral"
      />
      
      <EnhancedStatCard
        title="Financial"
        value={`$${metrics.lifetimeValue.toLocaleString()}`}
        change={`$${metrics.monthlyRevenue}/mo MRR`}
        isCurrency={true}
        rawValue={metrics.lifetimeValue}
        trend={metrics.lifetimeValue > 0 ? 'up' : 'down'}
        icon={<DollarSign className="h-6 w-6" />}
        variant="success"
      />
      
      <EnhancedStatCard
        title="Activity"
        value={metrics.daysAsCustomer < 365 ? 
          `${Math.floor(metrics.daysAsCustomer / 30)} months` : 
          `${Math.floor(metrics.daysAsCustomer / 365)} years`}
        change={formatActivity()}
        trend="up"
        icon={<Activity className="h-6 w-6" />}
        variant="neutral"
      />
    </div>
  );
}
