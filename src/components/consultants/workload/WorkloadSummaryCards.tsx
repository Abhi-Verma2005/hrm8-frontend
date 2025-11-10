import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import type { TeamWorkloadSummary } from '@/lib/consultantWorkloadUtils';
import { useCardConfig } from '@/hooks/useCardConfig';

interface WorkloadSummaryCardsProps {
  summary: TeamWorkloadSummary;
}

export function WorkloadSummaryCards({ summary }: WorkloadSummaryCardsProps) {
  // Get card configurations
  const totalActiveConfig = useCardConfig('Total Active');
  const atCapacityConfig = useCardConfig('At Capacity');
  const availableConfig = useCardConfig('Available');
  const overloadedConfig = useCardConfig('Overloaded');
  
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
        {...totalActiveConfig}
      />

      <EnhancedStatCard
        title="At Capacity"
        value={summary.atCapacity.toString()}
        change={`${atCapacityPercent}% of team`}
        {...atCapacityConfig}
      />

      <EnhancedStatCard
        title="Available"
        value={summary.available.toString()}
        change={`${availablePercent}% of team`}
        {...availableConfig}
      />

      <EnhancedStatCard
        title="Overloaded"
        value={summary.overloaded.toString()}
        change="Requires attention"
        {...overloadedConfig}
      />
    </div>
  );
}
