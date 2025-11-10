import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/tables/DataTable";
import { Plus, Users, DollarSign, Target, TrendingUp } from "lucide-react";
import { getAllSalesAgents, getSalesAgentStats } from "@/lib/salesAgentStorage";
import type { SalesAgent } from "@/types/salesAgent";
import { StatsCard } from "@/components/ui/stats-card";

export default function SalesTeamPage() {
  const navigate = useNavigate();
  const [salesAgents] = useState<SalesAgent[]>(getAllSalesAgents());
  const stats = getSalesAgentStats();
  
  const quotaAttainment = stats.totalQuota > 0 
    ? (stats.totalRevenue / stats.totalQuota * 100).toFixed(1)
    : '0';

  const columns: Column<SalesAgent>[] = [
    {
      key: "name",
      label: "Name",
      render: (agent) => `${agent.firstName} ${agent.lastName}`,
    },
    {
      key: "salesRole",
      label: "Role",
      render: (agent) => agent.salesRole.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    },
    {
      key: "salesType",
      label: "Type",
      render: (agent) => agent.salesType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    },
    {
      key: "status",
      label: "Status",
      render: (agent) => {
        const colors: Record<string, string> = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-800",
          "on-leave": "bg-yellow-100 text-yellow-800",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[agent.status] || colors.active}`}>
            {agent.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </span>
        );
      },
    },
    {
      key: "currentRevenue",
      label: "Revenue",
      render: (agent) => `$${(agent.currentRevenue / 1000).toFixed(0)}K`,
    },
    {
      key: "closedDeals",
      label: "Closed Deals",
    },
    {
      key: "activeOpportunities",
      label: "Active Opps",
    },
    {
      key: "conversionRate",
      label: "Win Rate",
      render: (agent) => `${agent.conversionRate.toFixed(1)}%`,
    },
    {
      key: "quota",
      label: "Quota Attainment",
      render: (agent) => {
        const attainment = (agent.currentRevenue / agent.quotaAmount * 100).toFixed(0);
        return `${attainment}%`;
      },
    },
  ];

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sales Team</h1>
            <p className="text-muted-foreground mt-2">Manage your sales team and track performance</p>
          </div>
          <Button onClick={() => navigate("/sales/team/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Sales Agent
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Agents"
            value={stats.total}
            icon={Users}
            description={`${stats.active} active`}
          />
          <StatsCard
            title="Total Revenue"
            value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
            icon={DollarSign}
            description="All-time"
          />
          <StatsCard
            title="Avg Win Rate"
            value={`${stats.avgConversionRate.toFixed(1)}%`}
            icon={TrendingUp}
            description="Conversion rate"
          />
          <StatsCard
            title="Quota Attainment"
            value={`${quotaAttainment}%`}
            icon={Target}
            description="Team average"
          />
        </div>

        <DataTable
          columns={columns}
          data={salesAgents}
          searchable
          searchKeys={["firstName", "lastName", "email"]}
          exportable
          exportFilename="sales-team"
        />
      </div>
    </DashboardPageLayout>
  );
}
