import { useState } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/tables/DataTable";
import { Plus, MapPin, Users, Building2, DollarSign } from "lucide-react";
import { getAllTerritories, getTerritoryStats } from "@/lib/salesTerritoryStorage";
import type { SalesTerritory } from "@/types/salesTerritory";
import { StatsCard } from "@/components/ui/stats-card";

export default function TerritoriesPage() {
  const [territories] = useState<SalesTerritory[]>(getAllTerritories());
  const stats = getTerritoryStats();

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
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Territories</h1>
            <p className="text-muted-foreground mt-2">Manage sales territories and assignments</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Territory
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Territories"
            value={stats.total}
            icon={MapPin}
            description={`${stats.active} active`}
          />
          <StatsCard
            title="Active Employers"
            value={stats.activeEmployers}
            icon={Building2}
            description="Across territories"
          />
          <StatsCard
            title="Total Employers"
            value={stats.totalEmployers}
            icon={Users}
            description="All employers"
          />
          <StatsCard
            title="Total Revenue"
            value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
            icon={DollarSign}
            description="All territories"
          />
        </div>

        <DataTable
          columns={columns}
          data={territories}
          searchable
          searchKeys={["name", "primarySalesAgentName"]}
          exportable
          exportFilename="territories"
        />
      </div>
    </DashboardPageLayout>
  );
}
