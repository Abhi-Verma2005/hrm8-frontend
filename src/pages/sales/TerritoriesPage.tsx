import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import { Plus, MapPin, Users, Building2, DollarSign } from "lucide-react";
import { getAllTerritories, getTerritoryStats } from "@/lib/salesTerritoryStorage";
import type { SalesTerritory } from "@/types/salesTerritory";
import { StatsCard } from "@/components/ui/stats-card";
import { createTerritoryColumns } from "@/components/sales/SalesTerritoryTableColumns";
import { TerritoriesFilterBar } from "@/components/sales/TerritoriesFilterBar";
import { TerritoryBulkActions } from "@/components/sales/TerritoryBulkActions";

export default function TerritoriesPage() {
  const [territories] = useState<SalesTerritory[]>(getAllTerritories());
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const stats = getTerritoryStats();

  const columns = useMemo(() => createTerritoryColumns(), []);

  const filteredTerritories = useMemo(() => {
    return territories.filter((territory) => {
      const matchesSearch = 
        search === "" ||
        territory.name.toLowerCase().includes(search.toLowerCase()) ||
        (territory.primarySalesAgentName && territory.primarySalesAgentName.toLowerCase().includes(search.toLowerCase()));
      
      const matchesRegion = regionFilter === "all" || territory.region === regionFilter;
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" && territory.isActive) ||
        (statusFilter === "inactive" && !territory.isActive);
      
      return matchesSearch && matchesRegion && matchesStatus;
    });
  }, [territories, search, regionFilter, statusFilter]);

  const handleClearFilters = () => {
    setSearch("");
    setRegionFilter("all");
    setStatusFilter("all");
  };

  const handleExport = (selectedIds: string[]) => {
    console.log("Exporting selected territories:", selectedIds);
  };

  const handleDelete = (selectedIds: string[]) => {
    console.log("Deleting selected territories:", selectedIds);
  };

  const handleAssignAgents = (selectedIds: string[]) => {
    console.log("Assigning agents to territories:", selectedIds);
  };

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

        <TerritoriesFilterBar
          search={search}
          onSearchChange={setSearch}
          regionFilter={regionFilter}
          onRegionFilterChange={setRegionFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onClearFilters={handleClearFilters}
        />

        <DataTable
          columns={columns}
          data={filteredTerritories}
          selectable
          renderBulkActions={(selectedIds) => (
            <TerritoryBulkActions
              selectedCount={selectedIds.length}
              onExport={() => handleExport(selectedIds)}
              onDelete={() => handleDelete(selectedIds)}
              onAssignAgents={() => handleAssignAgents(selectedIds)}
              onClearSelection={() => {}}
            />
          )}
          exportable
          exportFilename="territories"
        />
      </div>
    </DashboardPageLayout>
  );
}
