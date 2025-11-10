import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { DashboardActionBar } from "@/components/dashboard/DashboardActionBar";
import { Card } from "@/components/ui/card";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { StandardChartCard } from "@/components/dashboard/charts/StandardChartCard";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import { DateRangePicker } from "@/components/ui/date-range-picker-v2";
import type { DateRange } from "react-day-picker";
import { TrendingUp, DollarSign, Target, Users, Award, Download, ArrowRight, Eye, Plus, Filter, BarChart3 } from "lucide-react";
import { getSalesAgentStats } from "@/lib/salesAgentStorage";
import { getAllOpportunities, getOpportunityStats } from "@/lib/salesOpportunityStorage";
import { getAllActivities, getActivityStats } from "@/lib/salesActivityStorage";
import { getTerritoryStats } from "@/lib/salesTerritoryStorage";
import { createTopDealsColumns } from "@/components/sales/TopDealsTableColumns";
import { createActivityColumns } from "@/components/sales/SalesActivityTableColumns";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useCurrencyFormat } from "@/contexts/CurrencyFormatContext";
import { applyLocationFilterToMetric } from "@/lib/mockDataWithLocations";

export default function SalesDashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatCurrency } = useCurrencyFormat();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  
  const hasActiveFilters = !!(dateRange?.from) || selectedCountry !== "all" || selectedRegion !== "all";
  const salesAgentStats = getSalesAgentStats();
  const opportunityStats = getOpportunityStats();
  const activityStats = getActivityStats();
  const territoryStats = getTerritoryStats();

  // Apply location filters to metrics
  const filteredTotalRevenue = useMemo(() => 
    applyLocationFilterToMetric(salesAgentStats.totalRevenue, selectedCountry, selectedRegion), 
    [salesAgentStats.totalRevenue, selectedCountry, selectedRegion]
  );

  const filteredPipelineValue = useMemo(() => 
    applyLocationFilterToMetric(opportunityStats.pipelineValue, selectedCountry, selectedRegion), 
    [opportunityStats.pipelineValue, selectedCountry, selectedRegion]
  );

  const filteredActiveOpportunities = useMemo(() => 
    applyLocationFilterToMetric(opportunityStats.active, selectedCountry, selectedRegion), 
    [opportunityStats.active, selectedCountry, selectedRegion]
  );

  const filteredAvgDealSize = useMemo(() => 
    applyLocationFilterToMetric(opportunityStats.avgDealSize, selectedCountry, selectedRegion), 
    [opportunityStats.avgDealSize, selectedCountry, selectedRegion]
  );

  const allOpportunities = getAllOpportunities();
  const allActivities = getAllActivities();

  // Get top opportunities by value
  const topOpportunities = [...allOpportunities]
    .filter(opp => opp.stage !== 'closed-lost')
    .sort((a, b) => b.estimatedValue - a.estimatedValue)
    .slice(0, 10);

  // Get recent activities
  const recentActivities = [...allActivities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const quotaAttainment = salesAgentStats.totalQuota > 0 
    ? (filteredTotalRevenue / salesAgentStats.totalQuota * 100)
    : 0;

  const pipelineCoverage = salesAgentStats.totalQuota > 0
    ? (filteredPipelineValue / salesAgentStats.totalQuota * 100)
    : 0;

  const handleExport = () => {
    toast({
      title: "Exporting Dashboard Data",
      description: "Preparing your sales dashboard export...",
    });
  };

  const handleResetFilters = () => {
    setDateRange(undefined);
    setSelectedCountry("all");
    setSelectedRegion("all");
    toast({ title: "Filters reset" });
  };

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
          <h1 className="text-3xl font-bold">Sales Dashboard</h1>
          <p className="text-muted-foreground mt-2">Monitor sales performance, pipeline, and team activity</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <EnhancedStatCard
            title="Total Revenue"
            value=""
            isCurrency={true}
            rawValue={filteredTotalRevenue}
            change="+12.5%"
            trend="up"
            icon={<DollarSign className="h-6 w-6" />}
            variant="success"
            showMenu={true}
            menuItems={[
              {
                label: "View Revenue Report",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => {}
              },
              {
                label: "Export Data",
                icon: <Download className="h-4 w-4" />,
                onClick: handleExport
              },
              {
                label: "View Trends",
                icon: <TrendingUp className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
          />
          <EnhancedStatCard
            title="Pipeline Value"
            value=""
            isCurrency={true}
            rawValue={filteredPipelineValue}
            change={`${pipelineCoverage.toFixed(0)}% quota coverage`}
            trend={pipelineCoverage >= 300 ? "up" : "down"}
            icon={<TrendingUp className="h-6 w-6" />}
            variant="primary"
            showMenu={true}
            menuItems={[
              {
                label: "View Pipeline",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => {}
              },
              {
                label: "Add Opportunity",
                icon: <Plus className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
          />
          <EnhancedStatCard
            title="Quota Attainment"
            value={`${quotaAttainment.toFixed(1)}%`}
            change="vs target 100%"
            trend={quotaAttainment >= 100 ? "up" : "down"}
            icon={<Target className="h-6 w-6" />}
            variant={quotaAttainment >= 100 ? "success" : "warning"}
            showMenu={true}
            menuItems={[
              {
                label: "View Quota Details",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => {}
              },
              {
                label: "Set Targets",
                icon: <Target className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
          />
          <EnhancedStatCard
            title="Active Opportunities"
            value={Math.round(filteredActiveOpportunities).toString()}
            change={`${opportunityStats.conversionRate.toFixed(1)}% win rate`}
            trend={opportunityStats.conversionRate >= 30 ? "up" : "down"}
            icon={<Award className="h-6 w-6" />}
            variant="neutral"
            showMenu={true}
            menuItems={[
              {
                label: "View All",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => {}
              },
              {
                label: "Create New",
                icon: <Plus className="h-4 w-4" />,
                onClick: () => {}
              },
              {
                label: "Filter",
                icon: <Filter className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
          />
          <EnhancedStatCard
            title="Sales Team"
            value={salesAgentStats.active.toString()}
            change={`${salesAgentStats.total} total agents`}
            trend="up"
            icon={<Users className="h-6 w-6" />}
            variant="primary"
            showMenu={true}
            menuItems={[
              {
                label: "View Team",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => {}
              },
              {
                label: "Add Agent",
                icon: <Plus className="h-4 w-4" />,
                onClick: () => {}
              },
              {
                label: "View Performance",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
          />
          <EnhancedStatCard
            title="Avg Deal Size"
            value=""
            isCurrency={true}
            rawValue={filteredAvgDealSize}
            change="+7%"
            trend="up"
            icon={<DollarSign className="h-6 w-6" />}
            variant="success"
            showMenu={true}
            menuItems={[
              {
                label: "View Deal Analysis",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => {}
              },
              {
                label: "Export Report",
                icon: <Download className="h-4 w-4" />,
                onClick: handleExport
              }
            ]}
          />
        </div>

        {/* Sales Funnel */}
        <StandardChartCard
          title="Sales Pipeline by Stage"
          onDownload={() => toast({ title: "Downloading pipeline data..." })}
          menuItems={[
            { label: "View Pipeline", onClick: () => navigate('/sales/pipeline') },
            { label: "Add Opportunity", onClick: () => navigate('/sales/opportunities/new') },
            { label: "Export", onClick: () => toast({ title: "Exporting..." }) }
          ]}
        >
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Prospecting</span>
                <span className="font-medium">{formatCurrency(250000)}</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '20%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Qualification</span>
                <span className="font-medium">{formatCurrency(350000)}</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '30%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Proposal</span>
                <span className="font-medium">{formatCurrency(420000)}</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-700" style={{ width: '40%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Negotiation</span>
                <span className="font-medium">{formatCurrency(180000)}</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '15%' }} />
              </div>
            </div>
          </div>
        </StandardChartCard>

        {/* Activity Overview */}
        <div className="grid gap-4 md:grid-cols-2">
          <StandardChartCard
            title="Sales Activities"
            onDownload={() => toast({ title: "Downloading activities..." })}
            menuItems={[
              { label: "View All Activities", onClick: () => navigate('/sales/activities') },
              { label: "Schedule Activity", onClick: () => {} },
              { label: "Export", onClick: () => toast({ title: "Exporting..." }) }
            ]}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completed Today</span>
                <span className="font-semibold">{activityStats.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Scheduled</span>
                <span className="font-semibold">{activityStats.upcoming}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Follow-ups Needed</span>
                <span className="font-semibold text-orange-600">{activityStats.followUpNeeded}</span>
              </div>
            </div>
          </StandardChartCard>

          <StandardChartCard
            title="Territory Performance"
            onDownload={() => toast({ title: "Downloading territory data..." })}
            menuItems={[
              { label: "View Territories", onClick: () => navigate('/sales/territories') },
              { label: "Manage Territories", onClick: () => {} },
              { label: "Export", onClick: () => toast({ title: "Exporting..." }) }
            ]}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Territories</span>
                <span className="font-semibold">{territoryStats.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Employers</span>
                <span className="font-semibold">{territoryStats.activeEmployers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Quota Attainment</span>
                <span className="font-semibold">{territoryStats.avgQuotaAttainment.toFixed(1)}%</span>
              </div>
            </div>
          </StandardChartCard>
        </div>

        {/* Data Tables */}
        <div className="grid gap-4 md:grid-cols-2">
          <StandardChartCard
            title="Top Opportunities"
            onDownload={() => toast({ title: "Downloading opportunities..." })}
            menuItems={[
              { label: "View All Opportunities", onClick: () => navigate('/sales/opportunities') },
              { label: "Create New", onClick: () => navigate('/sales/opportunities/new') },
              { label: "Export", onClick: () => toast({ title: "Exporting..." }) }
            ]}
          >
            <DataTable
              columns={createTopDealsColumns()}
              data={topOpportunities}
              searchable={false}
            />
          </StandardChartCard>

          <StandardChartCard
            title="Recent Activities"
            onDownload={() => toast({ title: "Downloading activities..." })}
            menuItems={[
              { label: "View All", onClick: () => navigate('/sales/activities') },
              { label: "Schedule New", onClick: () => {} },
              { label: "Export", onClick: () => toast({ title: "Exporting..." }) }
            ]}
          >
            <DataTable
              columns={createActivityColumns()}
              data={recentActivities}
              searchable={false}
            />
          </StandardChartCard>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
