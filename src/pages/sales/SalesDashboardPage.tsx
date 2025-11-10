import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Target, Users, Award, TrendingDown } from "lucide-react";
import { getSalesAgentStats } from "@/lib/salesAgentStorage";
import { getOpportunityStats } from "@/lib/salesOpportunityStorage";
import { getActivityStats } from "@/lib/salesActivityStorage";
import { getTerritoryStats } from "@/lib/salesTerritoryStorage";

export default function SalesDashboardPage() {
  const salesAgentStats = getSalesAgentStats();
  const opportunityStats = getOpportunityStats();
  const activityStats = getActivityStats();
  const territoryStats = getTerritoryStats();

  const quotaAttainment = salesAgentStats.totalQuota > 0 
    ? (salesAgentStats.totalRevenue / salesAgentStats.totalQuota * 100).toFixed(1)
    : 0;

  const pipelineCoverage = salesAgentStats.totalQuota > 0
    ? (opportunityStats.pipelineValue / salesAgentStats.totalQuota * 100).toFixed(1)
    : 0;

  const stats = [
    {
      title: "Total Revenue",
      value: `$${(salesAgentStats.totalRevenue / 1000000).toFixed(2)}M`,
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "Pipeline Value",
      value: `$${(opportunityStats.pipelineValue / 1000000).toFixed(2)}M`,
      change: `${pipelineCoverage}% coverage`,
      isPositive: Number(pipelineCoverage) >= 300,
      icon: TrendingUp,
    },
    {
      title: "Quota Attainment",
      value: `${quotaAttainment}%`,
      change: "vs target 100%",
      isPositive: Number(quotaAttainment) >= 100,
      icon: Target,
    },
    {
      title: "Active Opportunities",
      value: opportunityStats.active.toString(),
      change: `${opportunityStats.conversionRate.toFixed(1)}% win rate`,
      isPositive: opportunityStats.conversionRate >= 30,
      icon: Award,
    },
    {
      title: "Sales Team",
      value: salesAgentStats.active.toString(),
      change: `${salesAgentStats.total} total`,
      isPositive: true,
      icon: Users,
    },
    {
      title: "Avg Deal Size",
      value: `$${(opportunityStats.avgDealSize / 1000).toFixed(0)}K`,
      change: "per closed deal",
      isPositive: true,
      icon: DollarSign,
    },
  ];

  return (
    <DashboardPageLayout
      title="Sales Dashboard"
      subtitle="Monitor sales performance, pipeline, and team activity"
      fullWidth={true}
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    <p className={`text-sm mt-1 flex items-center gap-1 ${stat.isPositive ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {stat.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {stat.change}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Sales Funnel */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Pipeline by Stage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Prospecting</span>
                <span className="font-medium">$250K</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '20%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Qualification</span>
                <span className="font-medium">$350K</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '30%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Proposal</span>
                <span className="font-medium">$420K</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-700" style={{ width: '40%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Negotiation</span>
                <span className="font-medium">$180K</span>
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
      </div>
    </DashboardPageLayout>
  );
}
