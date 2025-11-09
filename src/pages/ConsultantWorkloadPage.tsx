import { useMemo } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { WorkloadSummaryCards } from '@/components/consultants/workload/WorkloadSummaryCards';
import { ConsultantWorkloadChart } from '@/components/consultants/workload/ConsultantWorkloadChart';
import { ServiceTypeDistributionChart } from '@/components/consultants/workload/ServiceTypeDistributionChart';
import { ConsultantWorkloadTable } from '@/components/consultants/workload/ConsultantWorkloadTable';
import { getTeamWorkloadSummary, getServiceTypeDistribution } from '@/lib/consultantWorkloadUtils';

export default function ConsultantWorkloadPage() {
  const teamSummary = useMemo(() => getTeamWorkloadSummary(), []);
  const serviceDistribution = useMemo(() => getServiceTypeDistribution(), []);

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Consultant Workload & Capacity</h1>
          <p className="text-muted-foreground">Visual overview of team capacity and assignments</p>
        </div>

        <WorkloadSummaryCards summary={teamSummary} />

        <div className="grid gap-6 lg:grid-cols-2">
          <ConsultantWorkloadChart data={teamSummary.workloadData} />
          <ServiceTypeDistributionChart data={serviceDistribution} />
        </div>

        <ConsultantWorkloadTable data={teamSummary.workloadData} />
      </div>
    </DashboardPageLayout>
  );
}
