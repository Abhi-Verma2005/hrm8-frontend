import { useMemo, useState } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { DashboardActionBar } from '@/components/dashboard/DashboardActionBar';
import { getRPODashboardMetrics } from '@/lib/rpoTrackingUtils';
import { getRenewalAlertsSummary } from '@/lib/rpoRenewalUtils';
import { getAllServiceProjects } from '@/lib/recruitmentServiceStorage';
import { FileText, AlertTriangle, BarChart3, UserCog, FileBarChart, Building2, Users, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RPOContractsTable } from '@/components/rpo/RPOContractsTable';
import { useToast } from '@/hooks/use-toast';
import type { DateRange } from 'react-day-picker';

export default function RPOOverviewPage() {
  const metrics = useMemo(() => getRPODashboardMetrics(), []);
  const renewalSummary = useMemo(() => getRenewalAlertsSummary(), []);
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

  // Get actual RPO contracts from storage
  const rpoContracts = useMemo(() => {
    return getAllServiceProjects().filter(project => project.isRPO && project.serviceType === 'rpo');
  }, []);

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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <h1 className="text-3xl font-bold">RPO Management</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/rpo/consultants">
                  <UserCog className="h-4 w-4 mr-2" />
                  Manage Consultants
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/rpo/performance">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/rpo/reports">
                  <FileBarChart className="h-4 w-4 mr-2" />
                  Reports
                </Link>
              </Button>
              <Button asChild>
                <Link to="/recruitment-services?type=rpo">
                  Create New Contract
                </Link>
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Comprehensive RPO contract management, consultant allocation, and performance tracking
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Active Contracts"
            value={metrics.totalActiveContracts.toString()}
            change="+12% vs last month"
            trend="up"
            icon={<Building2 className="h-6 w-6" />}
            variant="primary"
          />
          <EnhancedStatCard
            title="Dedicated Consultants"
            value={metrics.totalDedicatedConsultants.toString()}
            change="+8% vs last month"
            trend="up"
            icon={<Users className="h-6 w-6" />}
            variant="success"
          />
          <EnhancedStatCard
            title="Monthly Recurring Revenue"
            value=""
            isCurrency={true}
            rawValue={metrics.totalMonthlyRecurringRevenue}
            change="+15% vs last month"
            trend="up"
            icon={<DollarSign className="h-6 w-6" />}
            variant="primary"
          />
          <EnhancedStatCard
            title="Expiring Soon"
            value={renewalSummary.total.toString()}
            change={renewalSummary.critical > 0 ? `${renewalSummary.critical} critical within 30 days` : "All clear"}
            trend={renewalSummary.critical > 0 ? "down" : "up"}
            variant={renewalSummary.critical > 0 ? "warning" : "success"}
            icon={<Clock className="h-6 w-6" />}
          />
        </div>

        {/* Critical Alerts */}
        {renewalSummary.critical > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-destructive">Urgent Action Required</CardTitle>
                </div>
                <Button asChild variant="destructive" size="sm">
                  <Link to="/rpo/renewals">
                    View Details
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">
                <strong>{renewalSummary.critical}</strong> contract{renewalSummary.critical !== 1 ? 's' : ''} expiring within 30 days
              </p>
            </CardContent>
          </Card>
        )}

        {/* Contracts Table */}
        <RPOContractsTable contracts={rpoContracts} />
      </div>
    </DashboardPageLayout>
  );
}
