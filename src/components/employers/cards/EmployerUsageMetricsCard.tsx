import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Employer } from "@/types/entities";
import { 
  Briefcase, 
  Users, 
  UserCheck, 
  Database, 
  Activity,
  Calendar
} from "lucide-react";
import { formatStorageSize, getUsagePercentage, getUsageStatusColor } from "@/lib/employerModuleUtils";
import { format } from "date-fns";

interface EmployerUsageMetricsCardProps {
  employer: Employer;
}

export function EmployerUsageMetricsCard({ employer }: EmployerUsageMetricsCardProps) {
  const { usage } = employer;
  
  const jobsUsagePercent = getUsagePercentage(usage.activeJobs, employer.maxOpenJobs);
  const usersUsagePercent = getUsagePercentage(usage.activeUsers, employer.maxUsers);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Usage Metrics
        </CardTitle>
        <CardDescription>Current platform usage statistics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Jobs Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Active Jobs</span>
            </div>
            <span className={`font-semibold ${getUsageStatusColor(jobsUsagePercent)}`}>
              {usage.activeJobs} / {employer.maxOpenJobs === Infinity ? '∞' : employer.maxOpenJobs}
            </span>
          </div>
          {employer.maxOpenJobs !== Infinity && (
            <Progress value={jobsUsagePercent} className="h-2" />
          )}
          <p className="text-xs text-muted-foreground">
            {usage.totalJobs} total jobs posted
          </p>
        </div>

        {/* Users Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Active Users</span>
            </div>
            <span className={`font-semibold ${getUsageStatusColor(usersUsagePercent)}`}>
              {usage.activeUsers} / {employer.maxUsers === Infinity ? '∞' : employer.maxUsers}
            </span>
          </div>
          {employer.maxUsers !== Infinity && (
            <Progress value={usersUsagePercent} className="h-2" />
          )}
        </div>

        {/* Candidates */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Candidates</span>
          </div>
          <div className="text-right">
            <div className="font-semibold">{usage.activeCandidates.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {usage.totalCandidates.toLocaleString()} total
            </div>
          </div>
        </div>

        {/* Employees (if HRMS enabled) */}
        {employer.modules.hrmsEnabled && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Employees</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{usage.activeEmployees.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                {usage.totalEmployees.toLocaleString()} total
              </div>
            </div>
          </div>
        )}

        {/* Storage */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Storage Used</span>
          </div>
          <span className="font-semibold">{formatStorageSize(usage.storageUsedMB)}</span>
        </div>

        {/* API Calls */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">API Calls (This Month)</span>
          </div>
          <span className="font-semibold">{usage.apiCallsThisMonth.toLocaleString()}</span>
        </div>

        {/* Last Login */}
        {usage.lastLoginAt && (
          <div className="flex items-center justify-between text-sm pt-4 border-t">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Last Login</span>
            </div>
            <span className="text-muted-foreground">
              {format(new Date(usage.lastLoginAt), 'MMM d, yyyy')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
