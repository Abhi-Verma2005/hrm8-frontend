import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card } from "@/components/ui/card";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
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

export default function SalesDashboardPage() {
  const { toast } = useToast();
  const { formatCurrency } = useCurrencyFormat();
  const salesAgentStats = getSalesAgentStats();
  const opportunityStats = getOpportunityStats();
  const activityStats = getActivityStats();
  const territoryStats = getTerritoryStats();

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
    ? (salesAgentStats.totalRevenue / salesAgentStats.totalQuota * 100)
    : 0;

  const pipelineCoverage = salesAgentStats.totalQuota > 0
    ? (opportunityStats.pipelineValue / salesAgentStats.totalQuota * 100)
    : 0;

  const handleExport = () => {
    toast({
      title: "Exporting Dashboard Data",
      description: "Preparing your sales dashboard export...",
    });
  };

  return (
    <DashboardPageLayout
      breadcrumbActions={
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
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
            rawValue={salesAgentStats.totalRevenue}
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
            rawValue={opportunityStats.pipelineValue}
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
            value={opportunityStats.active.toString()}
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
            rawValue={opportunityStats.avgDealSize}
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
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Pipeline by Stage</h3>
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
        </Card>

        {/* Activity Overview */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Sales Activities</h3>
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
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Territory Performance</h3>
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
          </Card>
        </div>

        {/* Data Tables */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Top Opportunities</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sales/opportunities">
                  View All
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            <DataTable
              columns={createTopDealsColumns()}
              data={topOpportunities}
              searchable={false}
            />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Activities</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sales/activities">
                  View All
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            <DataTable
              columns={createActivityColumns()}
              data={recentActivities}
              searchable={false}
            />
          </Card>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
