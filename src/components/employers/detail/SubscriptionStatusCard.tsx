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
    <div className="relative space-y-3">
      {/* Tier Name with Icon - No box around icon */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Subscription Plan
          </p>
        </div>
        <p className="text-lg font-bold text-foreground">{tierConfig.name}</p>
      </div>
      
      {/* Status Badge - Minimal styling */}
      <div>
        <EmployerStatusBadge status={employer.status} className="text-xs" />
      </div>
      
      {/* Monthly Fee - Prominent but clean */}
      <div className="pt-2">
        <div className="inline-flex flex-col">
          <span className="text-2xl font-bold text-primary tabular-nums">
            ${tierConfig.monthlyFee}
          </span>
          <span className="text-[10px] text-muted-foreground -mt-1">per month</span>
        </div>
      </div>
      
      {/* Subtle accent line instead of decorative corner */}
      <div className="absolute -left-1 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent rounded-full" />
    </div>
  );
}
