import { Employer } from "@/types/entities";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
      <CardContent className="p-3">
        {/* Icon + Tier Name Row - Horizontal */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center ring-1 ring-primary/20 flex-shrink-0">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide leading-tight">
              Subscription Plan
            </p>
            <p className="text-sm font-bold leading-tight truncate">{tierConfig.name}</p>
          </div>
        </div>
        
        {/* Status Badge - Full Width */}
        <div className="mb-2">
          <EmployerStatusBadge status={employer.status} className="w-full justify-center text-xs py-1" />
        </div>
        
        {/* Monthly Fee - Centered */}
        <div className="text-center pt-1.5 border-t border-border/50">
          <p className="text-lg font-bold text-primary leading-none">
            ${tierConfig.monthlyFee}
          </p>
          <p className="text-[9px] text-muted-foreground mt-0.5">per month</p>
        </div>
      </CardContent>
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 h-12 w-12 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-40" />
    </Card>
  );
}
