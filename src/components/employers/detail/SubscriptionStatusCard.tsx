import { Employer } from "@/types/entities";
import { EmployerStatusBadge } from "../EmployerStatusBadge";
import { Sparkles } from "lucide-react";
import { SUBSCRIPTION_TIERS } from "@/lib/subscriptionConfig";

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

interface SubscriptionStatusCardProps {
  employer: Employer;
  metrics: EmployerMetrics;
}

export function SubscriptionStatusCard({ employer, metrics }: SubscriptionStatusCardProps) {
  const tierConfig = SUBSCRIPTION_TIERS[employer.subscriptionTier];
  
  return (
    <div className="relative flex flex-col items-center">
      {/* Status Badge - At the top */}
      <div className="flex justify-center">
        <EmployerStatusBadge status={employer.status} className="text-xs" />
      </div>
      
      {/* Tier Name with Icon - Below badge */}
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Subscription Plan
          </p>
        </div>
        <p className="text-lg font-bold text-foreground text-center">{tierConfig.name}</p>
      </div>
      
      {/* Monthly Fee - At the bottom */}
      <div className="mt-2 flex flex-col items-center">
        <span className="text-2xl font-bold text-primary tabular-nums">
          ${tierConfig.monthlyFee}
        </span>
        <span className="text-[10px] text-muted-foreground -mt-1">per month</span>
      </div>
      
      {/* Subtle accent line - Keep on left for visual anchor */}
      <div className="absolute -left-1 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent rounded-full" />
    </div>
  );
}
