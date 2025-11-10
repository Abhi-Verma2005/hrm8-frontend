import { useState } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Plus } from "lucide-react";
import { getAllTerritories } from "@/lib/salesTerritoryStorage";
import type { SalesTerritory } from "@/types/salesTerritory";
import { ColumnDef } from "@tanstack/react-table";

export default function TerritoriesPage() {
  const [territories] = useState<SalesTerritory[]>(getAllTerritories());

  const columns: ColumnDef<SalesTerritory>[] = [
    {
      accessorKey: "name",
      header: "Territory",
    },
    {
      accessorKey: "region",
      header: "Region",
      cell: ({ getValue }) => {
        const region = getValue() as string;
        return region.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      },
    },
    {
      accessorKey: "primarySalesAgentName",
      header: "Primary Agent",
      cell: ({ getValue }) => getValue() || "Unassigned",
    },
    {
      accessorKey: "activeEmployers",
      header: "Active Employers",
    },
    {
      accessorKey: "totalEmployers",
      header: "Total Employers",
    },
    {
      accessorKey: "annualRevenue",
      header: "Revenue",
      cell: ({ getValue }) => `$${(getValue() as number / 1000).toFixed(0)}K`,
    },
    {
      id: "quotaAttainment",
      header: "Quota Attainment",
      cell: ({ row }) => {
        const attainment = (row.original.annualRevenue / row.original.quota * 100).toFixed(0);
        return `${attainment}%`;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ getValue }) => {
        const isActive = getValue() as boolean;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
  ];

  return (
    <DashboardPageLayout
      title="Territories"
      subtitle="Manage sales territories and assignments"
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Territory
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={territories}
        searchKey="name"
        searchPlaceholder="Search territories..."
      />
    </DashboardPageLayout>
  );
}
