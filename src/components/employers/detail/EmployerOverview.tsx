import { Employer } from "@/types/entities";
import { EmployerProfileCard } from "./EmployerProfileCard";
import { EmployerMetricsCard } from "./EmployerMetricsCard";
import { EmployerStatsCard } from "../EmployerStatsCard";
import { Building2, Briefcase, Users, MapPin, DollarSign, TrendingUp } from "lucide-react";
import { calculateEmployerMetrics } from "@/lib/employerService";

interface EmployerOverviewProps {
  employer: Employer;
  onEdit?: () => void;
}

export function EmployerOverview({ employer, onEdit }: EmployerOverviewProps) {
  const metrics = calculateEmployerMetrics(employer);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Profile Card */}
      <div className="space-y-6">
        <EmployerProfileCard employer={employer} onEdit={onEdit} />
        <EmployerMetricsCard metrics={metrics} />
      </div>

      {/* Right Column - Stats Cards */}
      <div className="lg:col-span-2 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <EmployerStatsCard
            title="Active Jobs"
            value={employer.activeJobs}
            icon={Briefcase}
            description={`${employer.currentOpenJobs} / ${employer.maxOpenJobs === Infinity ? '∞' : employer.maxOpenJobs} open`}
          />
          <EmployerStatsCard
            title="Total Jobs Posted"
            value={employer.totalJobsPosted}
            icon={Building2}
            description="All-time"
          />
          <EmployerStatsCard
            title="Active Users"
            value={employer.currentUsers}
            icon={Users}
            description={`${employer.currentUsers} / ${employer.maxUsers === Infinity ? '∞' : employer.maxUsers}`}
          />
          <EmployerStatsCard
            title="Locations"
            value={employer.locations?.length || 0}
            icon={MapPin}
            description={`${employer.departments?.length || 0} departments`}
          />
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <EmployerStatsCard
            title="Total Spent"
            value={`$${employer.totalSpent.toLocaleString()}`}
            icon={DollarSign}
            description="Lifetime value"
          />
          {employer.monthlySubscriptionFee && (
            <EmployerStatsCard
              title="Monthly Fee"
              value={`$${employer.monthlySubscriptionFee}`}
              icon={TrendingUp}
              description="Subscription"
            />
          )}
          {employer.accountType === 'approved' && employer.outstandingBalance !== undefined && (
            <EmployerStatsCard
              title="Outstanding Balance"
              value={`$${employer.outstandingBalance.toLocaleString()}`}
              icon={DollarSign}
              description={`Credit: $${employer.creditLimit?.toLocaleString() || 0}`}
            />
          )}
        </div>

        {/* Subscription Info Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Subscription Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Account Type</p>
              <p className="text-sm font-medium capitalize">{employer.accountType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tier</p>
              <p className="text-sm font-medium capitalize">{employer.subscriptionTier}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className="text-sm font-medium capitalize">{employer.subscriptionStatus}</p>
            </div>
            {employer.monthlySubscriptionFee && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Fee</p>
                <p className="text-sm font-medium">${employer.monthlySubscriptionFee}</p>
              </div>
            )}
            {employer.subscriptionStartDate && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                <p className="text-sm font-medium">
                  {new Date(employer.subscriptionStartDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {employer.subscriptionEndDate && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">End Date</p>
                <p className="text-sm font-medium">
                  {new Date(employer.subscriptionEndDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Capacity Overview */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Capacity Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Open Jobs</span>
                <span className="text-sm text-muted-foreground">
                  {employer.currentOpenJobs} / {employer.maxOpenJobs === Infinity ? '∞' : employer.maxOpenJobs}
                </span>
              </div>
              {employer.maxOpenJobs !== Infinity && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ 
                      width: `${Math.min((employer.currentOpenJobs / employer.maxOpenJobs) * 100, 100)}%` 
                    }}
                  />
                </div>
              )}
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Users</span>
                <span className="text-sm text-muted-foreground">
                  {employer.currentUsers} / {employer.maxUsers === Infinity ? '∞' : employer.maxUsers}
                </span>
              </div>
              {employer.maxUsers !== Infinity && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ 
                      width: `${Math.min((employer.currentUsers / employer.maxUsers) * 100, 100)}%` 
                    }}
                  />
                </div>
              )}
            </div>

            {employer.accountType === 'approved' && employer.creditLimit && (
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Credit Utilization</span>
                  <span className="text-sm text-muted-foreground">
                    ${employer.outstandingBalance?.toLocaleString() || 0} / ${employer.creditLimit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ 
                      width: `${Math.min(((employer.outstandingBalance || 0) / employer.creditLimit) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
