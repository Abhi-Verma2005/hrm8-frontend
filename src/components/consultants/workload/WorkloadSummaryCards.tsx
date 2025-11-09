import { Users, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { StatsCard } from '@/components/ui/stats-card';
import type { TeamWorkloadSummary } from '@/lib/consultantWorkloadUtils';

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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Active"
        value={summary.totalActive}
        icon={Users}
        description={`${summary.averageUtilization}% avg utilization`}
      />

      <StatsCard
        title="At Capacity"
        value={summary.atCapacity}
        icon={AlertCircle}
        description={`${atCapacityPercent}% of team`}
      />

      <StatsCard
        title="Available"
        value={summary.available}
        icon={CheckCircle}
        description={`${availablePercent}% of team`}
      />

      <StatsCard
        title="Overloaded"
        value={summary.overloaded}
        icon={AlertTriangle}
        description="Requires attention"
      />
    </div>
  );
}
