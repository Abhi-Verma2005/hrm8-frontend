import { useMemo } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { RPOOverviewCards } from '@/components/rpo/RPOOverviewCards';
import { RPOContractsList } from '@/components/rpo/RPOContractsList';
import { getRPODashboardMetrics } from '@/lib/rpoTrackingUtils';
import { FileText } from 'lucide-react';

export default function RPODashboardPage() {
  const metrics = useMemo(() => getRPODashboardMetrics(), []);

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-6 w-6" />
            <h1 className="text-3xl font-bold">RPO Contracts Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Track dedicated consultants, monthly retainers, and contract timelines for all RPO services
          </p>
        </div>

        <RPOOverviewCards metrics={metrics} />

        <RPOContractsList contracts={metrics.contracts} />
      </div>
    </DashboardPageLayout>
  );
}
