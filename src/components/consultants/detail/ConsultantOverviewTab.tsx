import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Briefcase, DollarSign, Award, Target } from 'lucide-react';
import { formatRevenue, getCapacityUsage } from '@/lib/consultantUtils';
import type { Consultant } from '@/types/consultant';

interface ConsultantOverviewTabProps {
  consultant: Consultant;
}

export function ConsultantOverviewTab({ consultant }: ConsultantOverviewTabProps) {
  const capacity = getCapacityUsage(consultant);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Placements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultant.totalPlacements}</div>
            <p className="text-xs text-muted-foreground">Lifetime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRevenue(consultant.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(consultant.successRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Placement success</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commissions Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRevenue(consultant.totalCommissionsPaid)}</div>
            <p className="text-xs text-muted-foreground">{formatRevenue(consultant.pendingCommissions)} pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{consultant.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Phone</span>
                <span className="text-sm font-medium">{consultant.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Office Location</span>
                <span className="text-sm font-medium">{consultant.officeLocation || 'Remote'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Employment Type</span>
                <Badge variant="secondary">{consultant.employmentType}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Experience</span>
                <span className="text-sm font-medium">{consultant.yearsOfExperience} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Department</span>
                <span className="text-sm font-medium">{consultant.department || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Capacity & Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Capacity & Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Employers</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {capacity.employers.current} / {capacity.employers.max}
                </span>
              </div>
              <Progress value={capacity.employers.percentage} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Active Jobs</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {capacity.jobs.current} / {capacity.jobs.max}
                </span>
              </div>
              <Progress value={capacity.jobs.percentage} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Specializations */}
      <Card>
        <CardHeader>
          <CardTitle>Specializations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {consultant.specialization.map(spec => (
              <Badge key={spec} variant="secondary">{spec}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bio */}
      {consultant.bio && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{consultant.bio}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
