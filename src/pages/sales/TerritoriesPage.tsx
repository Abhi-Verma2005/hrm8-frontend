import { useState } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/tables/DataTable";
import { Plus } from "lucide-react";
import { getAllTerritories } from "@/lib/salesTerritoryStorage";
import type { SalesTerritory } from "@/types/salesTerritory";

export default function TerritoriesPage() {
  const [territories] = useState<SalesTerritory[]>(getAllTerritories());

  const columns: Column<SalesTerritory>[] = [
    {
      key: "name",
      label: "Territory",
    },
    {
      key: "region",
      label: "Region",
      render: (territory) => territory.region.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    },
    {
      key: "primarySalesAgentName",
      label: "Primary Agent",
      render: (territory) => territory.primarySalesAgentName || "Unassigned",
    },
    {
      key: "activeEmployers",
      label: "Active Employers",
    },
    {
      key: "totalEmployers",
      label: "Total Employers",
    },
    {
      key: "annualRevenue",
      label: "Revenue",
      render: (territory) => `$${(territory.annualRevenue / 1000).toFixed(0)}K`,
    },
    {
      key: "quotaAttainment",
      label: "Quota Attainment",
      render: (territory) => {
        const attainment = (territory.annualRevenue / territory.quota * 100).toFixed(0);
        return `${attainment}%`;
      },
    },
    {
      key: "isActive",
      label: "Status",
      render: (territory) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${territory.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {territory.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
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
        searchable
        searchKeys={["name", "primarySalesAgentName"]}
        exportable
        exportFilename="territories"
      />
    </DashboardPageLayout>
  );
}
