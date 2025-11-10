import { useMemo } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { RPOOverviewCards } from '@/components/rpo/RPOOverviewCards';
import { RPOContractsList } from '@/components/rpo/RPOContractsList';
import { RPORevenueForecastChart } from '@/components/rpo/RPORevenueForecastChart';
import { RPOConsultantAvailabilityTracker } from '@/components/rpo/RPOConsultantAvailabilityTracker';
import { getRPODashboardMetrics, getRevenueProjection } from '@/lib/rpoTrackingUtils';
import { getConsultantRPOAvailability, getConsultantRPOStats } from '@/lib/rpoConsultantAvailabilityUtils';
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RPODashboardPage() {
  const metrics = useMemo(() => getRPODashboardMetrics(), []);
  const revenueForecast = useMemo(() => getRevenueProjection(12), []);
  const consultantAvailability = useMemo(() => getConsultantRPOAvailability(), []);
  const availabilityStats = useMemo(() => getConsultantRPOStats(), []);

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

        <Tabs defaultValue="contracts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="forecast">Revenue Forecast</TabsTrigger>
            <TabsTrigger value="availability">Consultant Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="contracts">
            <RPOContractsList contracts={metrics.contracts} />
          </TabsContent>

          <TabsContent value="forecast">
            <RPORevenueForecastChart forecasts={revenueForecast} />
          </TabsContent>

          <TabsContent value="availability">
            <RPOConsultantAvailabilityTracker 
              consultants={consultantAvailability}
              stats={availabilityStats}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
