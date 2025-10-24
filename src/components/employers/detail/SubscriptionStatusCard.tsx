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
        {/* Large Icon + Tier Name */}
        <div className="flex items-start gap-2.5 mb-2">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
              Subscription Plan
            </p>
            <p className="text-base font-bold leading-tight">{tierConfig.name}</p>
          </div>
        </div>
        
        {/* Status Badge - Full Width */}
        <div className="mb-2">
          <EmployerStatusBadge status={employer.status} className="w-full justify-center text-xs" />
        </div>
        
        {/* Monthly Fee - Prominent */}
        <div className="text-center pt-1.5 border-t border-border/50">
          <p className="text-xl font-bold text-primary leading-tight">
            ${tierConfig.monthlyFee}
          </p>
          <p className="text-[10px] text-muted-foreground">per month</p>
        </div>
      </CardContent>
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-50" />
    </Card>
  );
}
