import { useMemo, useState } from 'react';
import { Info, TrendingUp } from 'lucide-react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { WorkloadSummaryCards } from '@/components/consultants/workload/WorkloadSummaryCards';
import { ConsultantWorkloadChart } from '@/components/consultants/workload/ConsultantWorkloadChart';
import { ServiceTypeDistributionChart } from '@/components/consultants/workload/ServiceTypeDistributionChart';
import { ConsultantWorkloadTable } from '@/components/consultants/workload/ConsultantWorkloadTable';
import { ServiceHoursConfigDialog } from '@/components/consultants/workload/ServiceHoursConfig';
import { WorkloadForecastChart } from '@/components/consultants/workload/WorkloadForecastChart';
import { ConsultantForecastTable } from '@/components/consultants/workload/ConsultantForecastTable';
import { CapacityAlerts } from '@/components/consultants/workload/CapacityAlerts';
import { getTeamWorkloadSummary, getServiceTypeDistribution } from '@/lib/consultantWorkloadUtils';
import { generateWorkloadForecast } from '@/lib/workloadForecastUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ConsultantWorkloadPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const teamSummary = useMemo(() => getTeamWorkloadSummary(), [refreshKey]);
  const serviceDistribution = useMemo(() => getServiceTypeDistribution(), [refreshKey]);
  const forecast = useMemo(() => generateWorkloadForecast(6), [refreshKey]);

  const handleConfigUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <div>
              <h1 className="text-3xl font-bold">Consultant Workload & Capacity</h1>
              <p className="text-muted-foreground">Hours-based workload tracking (160h/month capacity)</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground mt-1" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Workload is calculated based on estimated hours per service type, assuming each 
                    consultant has 160 hours available per month and services are completed within 30 days.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ServiceHoursConfigDialog onUpdate={handleConfigUpdate} />
        </div>

        <WorkloadSummaryCards summary={teamSummary} />

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList>
            <TabsTrigger value="current">Current Workload</TabsTrigger>
            <TabsTrigger value="forecast" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Capacity Forecast
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ConsultantWorkloadChart data={teamSummary.workloadData} />
              <ServiceTypeDistributionChart data={serviceDistribution} />
            </div>

            <ConsultantWorkloadTable data={teamSummary.workloadData} />
          </TabsContent>

          <TabsContent value="forecast" className="space-y-6">
            <CapacityAlerts forecasts={forecast} />

            <WorkloadForecastChart forecasts={forecast} />

            <ConsultantForecastTable forecasts={forecast} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
