import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import type { TeamWorkloadSummary } from '@/lib/consultantWorkloadUtils';
import { Users, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface WorkloadSummaryCardsProps {
  summary: TeamWorkloadSummary;
}

export function WorkloadSummaryCards({ summary }: WorkloadSummaryCardsProps) {
  
  const atCapacityPercent = summary.totalActive > 0
    ? Math.round((summary.atCapacity / summary.totalActive) * 100) 
    : 0;

  const availablePercent = summary.totalActive > 0 
    ? Math.round((summary.available / summary.totalActive) * 100) 
    : 0;

  const avgHoursPerConsultant = summary.totalActive > 0
    ? Math.round(summary.totalHoursAssigned / summary.totalActive)
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <EnhancedStatCard
        title="Total Active"
        value={summary.totalActive.toString()}
        change={`${avgHoursPerConsultant}h avg per consultant`}
        trend="up"
        icon={<Users className="h-6 w-6" />}
        variant="neutral"
      />

      <EnhancedStatCard
        title="At Capacity"
        value={summary.atCapacity.toString()}
        change={`${atCapacityPercent}% of team`}
        trend={summary.atCapacity > 0 ? "up" : "down"}
        icon={<AlertCircle className="h-6 w-6" />}
        variant="warning"
      />

      <EnhancedStatCard
        title="Available"
        value={summary.available.toString()}
        change={`${availablePercent}% of team`}
        trend={summary.available > 0 ? "up" : "down"}
        icon={<CheckCircle className="h-6 w-6" />}
        variant="success"
      />

      <EnhancedStatCard
        title="Overloaded"
        value={summary.overloaded.toString()}
        change="Requires attention"
        trend={summary.overloaded > 0 ? "up" : "down"}
        icon={<AlertTriangle className="h-6 w-6" />}
        variant="warning"
      />
    </div>
  );
}
