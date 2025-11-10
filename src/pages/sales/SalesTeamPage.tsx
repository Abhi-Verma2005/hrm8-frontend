import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/tables/DataTable";
import { Plus } from "lucide-react";
import { getAllSalesAgents } from "@/lib/salesAgentStorage";
import type { SalesAgent } from "@/types/salesAgent";

export default function SalesTeamPage() {
  const navigate = useNavigate();
  const [salesAgents] = useState<SalesAgent[]>(getAllSalesAgents());

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
    <DashboardPageLayout
      title="Sales Team"
      subtitle="Manage your sales team and track performance"
      fullWidth={true}
      actions={
        <Button onClick={() => navigate("/sales/team/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Sales Agent
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={salesAgents}
        searchable
        searchKeys={["firstName", "lastName", "email"]}
        exportable
        exportFilename="sales-team"
      />
    </DashboardPageLayout>
  );
}
