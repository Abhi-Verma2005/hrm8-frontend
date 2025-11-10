import { useMemo, useState } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { RPOOverviewCards } from '@/components/rpo/RPOOverviewCards';
import { DashboardActionBar } from '@/components/dashboard/DashboardActionBar';
import { RPOContractsList } from '@/components/rpo/RPOContractsList';
import { RPORevenueForecastChart } from '@/components/rpo/RPORevenueForecastChart';
import { RPOConsultantAvailabilityTracker } from '@/components/rpo/RPOConsultantAvailabilityTracker';
import { RPOContractRenewalAlerts } from '@/components/rpo/RPOContractRenewalAlerts';
import { RPOPerformanceDashboard } from '@/components/rpo/RPOPerformanceDashboard';
import { getRPODashboardMetrics, getRevenueProjection } from '@/lib/rpoTrackingUtils';
import { getConsultantRPOAvailability, getConsultantRPOStats } from '@/lib/rpoConsultantAvailabilityUtils';
import { getRenewalAlerts, getRenewalAlertsSummary } from '@/lib/rpoRenewalUtils';
import { 
  getAllContractPerformanceMetrics,
  getPerformanceMetricsSummary,
  getYearOverYearComparison,
  getMonthlyPerformanceTrend,
  getPerformanceBenchmarks
} from '@/lib/rpoPerformanceUtils';
import { FileText, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { DateRange } from 'react-day-picker';
import { applyLocationFilterToMetric, applyLocationFilterToTimeSeries } from '@/lib/mockDataWithLocations';

export default function RPODashboardPage() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const hasActiveFilters = !!(dateRange?.from) || selectedCountry !== "all" || selectedRegion !== "all";

  const handleExport = () => {
    toast({ title: "Exporting RPO data..." });
  };

  const handleResetFilters = () => {
    setDateRange(undefined);
    setSelectedCountry("all");
    setSelectedRegion("all");
    toast({ title: "Filters reset" });
  };

  const metrics = useMemo(() => getRPODashboardMetrics(), []);
  const renewalAlerts = useMemo(() => getRenewalAlerts(), []);
  const renewalSummary = useMemo(() => getRenewalAlertsSummary(), []);
  
  // Performance metrics
  const performanceMetrics = useMemo(() => getAllContractPerformanceMetrics(), []);
  const performanceSummary = useMemo(() => getPerformanceMetricsSummary(), []);
  const yoyComparison = useMemo(() => getYearOverYearComparison(), []);
  const benchmarks = useMemo(() => getPerformanceBenchmarks(), []);

  // Apply location filters to metrics
  const filteredMetrics = useMemo(() => ({
    ...metrics,
    totalActiveContracts: Math.round(applyLocationFilterToMetric(metrics.totalActiveContracts, selectedCountry, selectedRegion)),
    totalDedicatedConsultants: Math.round(applyLocationFilterToMetric(metrics.totalDedicatedConsultants, selectedCountry, selectedRegion)),
    totalMonthlyRecurringRevenue: applyLocationFilterToMetric(metrics.totalMonthlyRecurringRevenue, selectedCountry, selectedRegion),
  }), [metrics, selectedCountry, selectedRegion]);

  const revenueForecast = useMemo(() => getRevenueProjection(12), []);
  const consultantAvailability = useMemo(() => getConsultantRPOAvailability(), []);
  const availabilityStats = useMemo(() => getConsultantRPOStats(), []);
  const monthlyTrend = useMemo(() => getMonthlyPerformanceTrend(12), []);

  return (
    <DashboardPageLayout
      breadcrumbActions={
        <DashboardActionBar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedCountry={selectedCountry}
          selectedRegion={selectedRegion}
          onCountryChange={setSelectedCountry}
          onRegionChange={setSelectedRegion}
          onExport={handleExport}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      }
    >
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

        <RPOOverviewCards metrics={filteredMetrics} />

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
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
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
            <RPOContractsList contracts={filteredMetrics.contracts} />
          </TabsContent>

          <TabsContent value="performance">
            <RPOPerformanceDashboard
              contracts={performanceMetrics}
              summary={performanceSummary}
              yoyComparison={yoyComparison}
              monthlyTrend={monthlyTrend}
              benchmarks={benchmarks}
            />
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
