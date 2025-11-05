import { Employer } from "@/types/entities";
import { StatsCard } from "@/components/ui/stats-card";
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
      <StatsCard
        title="Subscription"
        value={getTierLabel(employer.subscriptionTier)}
        icon={Sparkles}
        description={employer.status.charAt(0).toUpperCase() + employer.status.slice(1)}
      />
      
      <StatsCard
        title="Capacity"
        value={`${metrics.activeJobs}/${employer.totalJobsPosted || 0}`}
        icon={Briefcase}
        description={`${employer.currentUsers}/${employer.maxUsers === Infinity ? '∞' : employer.maxUsers} Users`}
      />
      
      <StatsCard
        title="Financial"
        value={`$${metrics.lifetimeValue.toLocaleString()}`}
        icon={DollarSign}
        description={`$${metrics.monthlyRevenue}/mo MRR`}
      />
      
      <StatsCard
        title="Activity"
        value={metrics.daysAsCustomer < 365 ? 
          `${Math.floor(metrics.daysAsCustomer / 30)} months` : 
          `${Math.floor(metrics.daysAsCustomer / 365)} years`}
        icon={Activity}
        description={formatActivity()}
      />
    </div>
  );
}
