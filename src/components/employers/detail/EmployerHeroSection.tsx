import { Employer } from "@/types/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SubscriptionStatusCard } from "./SubscriptionStatusCard";
import { Building2, MapPin, DollarSign, Briefcase, Users, MapPinIcon, CreditCard, Calendar } from "lucide-react";
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
      <CardContent className="p-6 lg:p-8 relative">
        {/* Subscription Card - Desktop: Absolute top-right, Mobile: Below logo */}
        <div className="hidden lg:block absolute top-6 right-6 w-[180px]">
          <SubscriptionStatusCard employer={employer} metrics={metrics} />
        </div>

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

        {/* Mobile: Show subscription card here */}
        <div className="block lg:hidden mb-6">
          <SubscriptionStatusCard employer={employer} metrics={metrics} />
        </div>
        
        <Separator className="mb-4" />
        
        {/* 6 Compact Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Lifetime Value */}
          <div className="flex items-center gap-2 p-3 rounded-lg border bg-card/50">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold truncate">
                ${metrics.lifetimeValue.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">Lifetime</p>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="flex items-center gap-2 p-3 rounded-lg border bg-card/50">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold">${metrics.monthlyRevenue}</p>
              <p className="text-[10px] text-muted-foreground">MRR</p>
            </div>
          </div>

          {/* Jobs Posted */}
          <div className="flex items-center gap-2 p-3 rounded-lg border bg-card/50">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold">{employer.totalJobsPosted}</p>
              <p className="text-[10px] text-muted-foreground">Jobs</p>
            </div>
          </div>

          {/* Users */}
          <div className="flex items-center gap-2 p-3 rounded-lg border bg-card/50">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold">
                {employer.currentUsers}/{employer.maxUsers === Infinity ? '∞' : employer.maxUsers}
              </p>
              <p className="text-[10px] text-muted-foreground">Users</p>
            </div>
          </div>

          {/* Locations */}
          <div className="flex items-center gap-2 p-3 rounded-lg border bg-card/50">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPinIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold">{employer.locations?.length || 0}</p>
              <p className="text-[10px] text-muted-foreground">Locations</p>
            </div>
          </div>

          {/* Customer Tenure */}
          <div className="flex items-center gap-2 p-3 rounded-lg border bg-card/50">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold">
                {metrics.daysAsCustomer < 365 
                  ? `${Math.floor(metrics.daysAsCustomer / 30)}mo` 
                  : `${Math.floor(metrics.daysAsCustomer / 365)}yr`}
              </p>
              <p className="text-[10px] text-muted-foreground">Member</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
