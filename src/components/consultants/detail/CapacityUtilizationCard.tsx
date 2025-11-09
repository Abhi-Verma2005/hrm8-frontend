import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import type { Consultant } from '@/types/consultant';
import type { ConsultantMetrics } from '@/lib/consultantService';
import { Link } from 'react-router-dom';

interface CapacityUtilizationCardProps {
  consultant: Consultant;
  metrics: ConsultantMetrics;
}

export function CapacityUtilizationCard({ consultant, metrics }: CapacityUtilizationCardProps) {
  const { employers, jobs } = metrics.capacityUtilization;
  
  // Calculate overall utilization
  const overallUtilization = Math.round(
    ((employers.current + jobs.current) / (employers.max + jobs.max)) * 100
  );
  
  // Determine status and color
  const getStatusConfig = (percentage: number) => {
    if (percentage >= 90) {
      return {
        label: 'At Capacity',
        color: 'destructive',
        icon: <AlertCircle className="h-4 w-4" />,
        bgColor: 'bg-destructive/10',
      };
    } else if (percentage >= 70) {
      return {
        label: 'Busy',
        color: 'warning',
        icon: <TrendingUp className="h-4 w-4" />,
        bgColor: 'bg-warning/10',
      };
    } else {
      return {
        label: 'Available',
        color: 'success',
        icon: <CheckCircle className="h-4 w-4" />,
        bgColor: 'bg-success/10',
      };
    }
  };

  const statusConfig = getStatusConfig(overallUtilization);
  
  // Calculate available capacity
  const availableJobs = jobs.max - jobs.current;
  const availableEmployers = employers.max - employers.current;
  
  // Generate recommendation
  const getRecommendation = () => {
    if (overallUtilization >= 90) {
      return 'At full capacity. Consider redistributing workload.';
    } else if (overallUtilization >= 70) {
      return `Can take ${Math.min(availableJobs, 2)} more job${Math.min(availableJobs, 2) !== 1 ? 's' : ''} or ${Math.min(availableEmployers, 1)} employer.`;
    } else {
      return `Available for ${availableJobs} more job${availableJobs !== 1 ? 's' : ''} and ${availableEmployers} employer${availableEmployers !== 1 ? 's' : ''}.`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Capacity Utilization</CardTitle>
          <Badge variant={statusConfig.color as any} className="flex items-center gap-1">
            {statusConfig.icon}
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Jobs Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Jobs</span>
            <span className="text-muted-foreground">
              {jobs.current}/{jobs.max} ({jobs.percentage.toFixed(0)}%)
            </span>
          </div>
          <Progress value={jobs.percentage} className="h-2" />
        </div>

        {/* Employers Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Employers</span>
            <span className="text-muted-foreground">
              {employers.current}/{employers.max} ({employers.percentage.toFixed(0)}%)
            </span>
          </div>
          <Progress value={employers.percentage} className="h-2" />
        </div>

        {/* Overall Summary */}
        <div className={`p-3 rounded-lg ${statusConfig.bgColor}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold">Overall Utilization</span>
            <span className="text-lg font-bold">{overallUtilization}%</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {(employers.max + jobs.max - employers.current - jobs.current)} total slots available
          </p>
        </div>

        {/* Recommendation */}
        <div className="pt-2 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-1">Recommendation</p>
          <p className="text-sm">{getRecommendation()}</p>
        </div>

        {/* Link to Workload Page */}
        <Link to="/consultants/workload">
          <div className="text-xs text-primary hover:underline flex items-center gap-1">
            View Team Workload Dashboard →
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
