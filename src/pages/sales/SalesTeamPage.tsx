import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Plus } from "lucide-react";
import { getAllSalesAgents } from "@/lib/salesAgentStorage";
import type { SalesAgent } from "@/types/salesAgent";
import { ColumnDef } from "@tanstack/react-table";

export default function SalesTeamPage() {
  const navigate = useNavigate();
  const [salesAgents] = useState<SalesAgent[]>(getAllSalesAgents());

  const columns: ColumnDef<SalesAgent>[] = [
    {
      accessorKey: "firstName",
      header: "Name",
      cell: ({ row }) => {
        return `${row.original.firstName} ${row.original.lastName}`;
      },
    },
    {
      accessorKey: "salesRole",
      header: "Role",
      cell: ({ getValue }) => {
        const role = getValue() as string;
        return role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      },
    },
    {
      accessorKey: "salesType",
      header: "Type",
      cell: ({ getValue }) => {
        const type = getValue() as string;
        return type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const colors: Record<string, string> = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-800",
          "on-leave": "bg-yellow-100 text-yellow-800",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.active}`}>
            {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </span>
        );
      },
    },
    {
      accessorKey: "currentRevenue",
      header: "Revenue",
      cell: ({ getValue }) => `$${(getValue() as number / 1000).toFixed(0)}K`,
    },
    {
      accessorKey: "closedDeals",
      header: "Closed Deals",
    },
    {
      accessorKey: "activeOpportunities",
      header: "Active Opps",
    },
    {
      accessorKey: "conversionRate",
      header: "Win Rate",
      cell: ({ getValue }) => `${(getValue() as number).toFixed(1)}%`,
    },
    {
      id: "quota",
      header: "Quota Attainment",
      cell: ({ row }) => {
        const attainment = (row.original.currentRevenue / row.original.quotaAmount * 100).toFixed(0);
        return `${attainment}%`;
      },
    },
  ];

  return (
    <DashboardPageLayout
      title="Sales Team"
      subtitle="Manage your sales team and track performance"
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
        searchKey="firstName"
        searchPlaceholder="Search sales agents..."
      />
    </DashboardPageLayout>
  );
}
