import { Employer } from "@/types/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmployerStatusBadge } from "../EmployerStatusBadge";
import { AccountTypeBadge } from "../AccountTypeBadge";
import { SubscriptionTierBadge } from "../SubscriptionTierBadge";
import { Building2, MapPin, DollarSign, Briefcase, Users, MapPinIcon } from "lucide-react";
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
        
        <Separator className="mb-4" />
        
        {/* Simplified Stats - Inline */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold text-foreground">
              ${metrics.lifetimeValue.toLocaleString()}
            </span>
            <span>lifetime value</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="font-semibold text-foreground">
              {employer.totalJobsPosted}
            </span>
            <span>jobs posted</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="font-semibold text-foreground">
              {employer.currentUsers}/{employer.maxUsers === Infinity ? '∞' : employer.maxUsers}
            </span>
            <span>user capacity</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            <span className="font-semibold text-foreground">
              {employer.locations?.length || 0}
            </span>
            <span>locations</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
