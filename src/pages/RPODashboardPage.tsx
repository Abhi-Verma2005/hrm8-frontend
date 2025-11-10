import { useMemo } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { RPOOverviewCards } from '@/components/rpo/RPOOverviewCards';
import { RPOContractsList } from '@/components/rpo/RPOContractsList';
import { RPORevenueForecastChart } from '@/components/rpo/RPORevenueForecastChart';
import { RPOConsultantAvailabilityTracker } from '@/components/rpo/RPOConsultantAvailabilityTracker';
import { RPOContractRenewalAlerts } from '@/components/rpo/RPOContractRenewalAlerts';
import { getRPODashboardMetrics, getRevenueProjection } from '@/lib/rpoTrackingUtils';
import { getConsultantRPOAvailability, getConsultantRPOStats } from '@/lib/rpoConsultantAvailabilityUtils';
import { getRenewalAlerts, getRenewalAlertsSummary } from '@/lib/rpoRenewalUtils';
import { FileText, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function RPODashboardPage() {
  const metrics = useMemo(() => getRPODashboardMetrics(), []);
  const revenueForecast = useMemo(() => getRevenueProjection(12), []);
  const consultantAvailability = useMemo(() => getConsultantRPOAvailability(), []);
  const availabilityStats = useMemo(() => getConsultantRPOStats(), []);
  const renewalAlerts = useMemo(() => getRenewalAlerts(), []);
  const renewalSummary = useMemo(() => getRenewalAlertsSummary(), []);

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

        {renewalSummary.critical > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-destructive">
                {renewalSummary.critical} Contract{renewalSummary.critical !== 1 ? 's' : ''} Expiring Soon
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Action required: {renewalSummary.critical} contract{renewalSummary.critical !== 1 ? 's' : ''} expiring within 30 days. 
              Review the Renewals tab to take action.
            </p>
          </div>
        )}

        <Tabs defaultValue="contracts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="renewals" className="gap-2">
              Renewals
              {renewalSummary.total > 0 && (
                <Badge variant={renewalSummary.critical > 0 ? 'destructive' : 'secondary'} className="ml-1">
                  {renewalSummary.total}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="forecast">Revenue Forecast</TabsTrigger>
            <TabsTrigger value="availability">Consultant Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="contracts">
            <RPOContractsList contracts={metrics.contracts} />
          </TabsContent>

          <TabsContent value="renewals">
            <RPOContractRenewalAlerts 
              alerts={renewalAlerts}
              summary={renewalSummary}
            />
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
