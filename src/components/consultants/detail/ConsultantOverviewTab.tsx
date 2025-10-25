import { ConsultantProfileCard } from './ConsultantProfileCard';
import { ConsultantEngagementPanel } from './ConsultantEngagementPanel';
import { ConsultantAssignmentsSection } from './ConsultantAssignmentsSection';
import type { Consultant } from '@/types/consultant';
import type { ConsultantMetrics } from '@/lib/consultantService';

interface ConsultantOverviewTabProps {
  consultant: Consultant;
  metrics: ConsultantMetrics;
}

export function ConsultantOverviewTab({ consultant, metrics }: ConsultantOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zone 1: Professional Profile (2 columns) */}
        <div className="lg:col-span-2">
          <ConsultantProfileCard consultant={consultant} metrics={metrics} />
        </div>

        {/* Zone 2: Engagement Panel (1 column) */}
        <div className="lg:col-span-1">
          <ConsultantEngagementPanel consultant={consultant} />
        </div>
      </div>

      {/* Zone 3: Assignments Section (Full width) */}
      <ConsultantAssignmentsSection consultantId={consultant.id} />
    </div>
  );
}
