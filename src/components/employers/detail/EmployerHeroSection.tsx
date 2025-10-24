import { Employer } from "@/types/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmployerStatusBadge } from "../EmployerStatusBadge";
import { AccountTypeBadge } from "../AccountTypeBadge";
import { SubscriptionTierBadge } from "../SubscriptionTierBadge";
import { Building2, MapPin } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";

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

interface EmployerHeroSectionProps {
  employer: Employer;
  metrics: EmployerMetrics;
}

export function EmployerHeroSection({ employer, metrics }: EmployerHeroSectionProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-muted/50">
      <CardContent className="p-6 lg:p-8">
        {/* Top Section: Logo + Info */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
          {/* Logo */}
          <div className="w-[100px] h-[100px] rounded-lg border-2 border-border bg-background flex items-center justify-center flex-shrink-0">
            {employer.logo ? (
              <img
                src={employer.logo}
                alt={employer.name}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="text-3xl font-bold text-muted-foreground">
                {employer.name.charAt(0)}
              </div>
            )}
          </div>
          
          {/* Company Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{employer.name}</h1>
              <EmployerStatusBadge status={employer.status} />
              <AccountTypeBadge accountType={employer.accountType} />
              <SubscriptionTierBadge tier={employer.subscriptionTier} />
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground mb-3">
              <Building2 className="h-4 w-4" />
              <span className="text-sm">{employer.industry}</span>
              <span className="hidden sm:inline">•</span>
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{employer.location}</span>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Account Manager: {employer.accountManagerName || 'Not assigned'}</p>
              <p>Member since {formatRelativeDate(employer.createdAt)}</p>
            </div>
          </div>
        </div>
        
    <Separator className="mb-6" />
    
    {/* Bottom Section: Simplified Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="text-center p-4 rounded-lg border bg-card">
        <p className="text-2xl font-bold">${metrics.lifetimeValue.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
          Lifetime Value
        </p>
      </div>

      <div className="text-center p-4 rounded-lg border bg-card">
        <p className="text-2xl font-bold">{employer.totalJobsPosted}</p>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
          Jobs Posted
        </p>
      </div>

      <div className="text-center p-4 rounded-lg border bg-card">
        <p className="text-2xl font-bold">
          {employer.currentUsers}/{employer.maxUsers === Infinity ? '∞' : employer.maxUsers}
        </p>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
          User Capacity
        </p>
      </div>

      <div className="text-center p-4 rounded-lg border bg-card">
        <p className="text-2xl font-bold">{employer.locations?.length || 0}</p>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
          Locations
        </p>
      </div>
    </div>
      </CardContent>
    </Card>
  );
}
