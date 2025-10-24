import { Employer } from "@/types/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    <Card className="border-2 border-primary/20 bg-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{tierConfig.name} Plan</p>
            <EmployerStatusBadge status={employer.status} className="text-[10px] px-1.5 py-0.5" />
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Jobs</span>
            <span className="font-medium">
              {metrics.activeJobs}/{tierConfig.maxOpenJobs === Infinity ? '∞' : tierConfig.maxOpenJobs}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Users</span>
            <span className="font-medium">
              {employer.currentUsers}/{employer.maxUsers === Infinity ? '∞' : employer.maxUsers}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
