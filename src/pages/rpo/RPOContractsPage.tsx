import { useMemo } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { RPOContractsList } from '@/components/rpo/RPOContractsList';
import { getRPODashboardMetrics } from '@/lib/rpoTrackingUtils';
import { FileBarChart } from 'lucide-react';

export default function RPOContractsPage() {
  const metrics = useMemo(() => getRPODashboardMetrics(), []);

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileBarChart className="h-6 w-6" />
            <h1 className="text-3xl font-bold">RPO Contracts</h1>
          </div>
          <p className="text-muted-foreground">
            View and manage all RPO contracts with detailed tracking and status updates
          </p>
        </div>

        <RPOContractsList contracts={metrics.contracts} />
      </div>
    </DashboardPageLayout>
  );
}
