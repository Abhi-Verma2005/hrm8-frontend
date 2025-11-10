import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import { Plus, Target, DollarSign, TrendingUp, Award } from "lucide-react";
import { getAllOpportunities, getOpportunityStats } from "@/lib/salesOpportunityStorage";
import type { SalesOpportunity } from "@/types/salesOpportunity";
import { StatsCard } from "@/components/ui/stats-card";
import { createOpportunityColumns } from "@/components/sales/SalesOpportunityTableColumns";
import { OpportunitiesFilterBar } from "@/components/sales/OpportunitiesFilterBar";
import { OpportunityBulkActions } from "@/components/sales/OpportunityBulkActions";

export default function OpportunitiesPage() {
  const navigate = useNavigate();
  const [opportunities] = useState<SalesOpportunity[]>(getAllOpportunities());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const stats = getOpportunityStats();

  const columns = useMemo(() => createOpportunityColumns(), []);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesSearch = 
        search === "" ||
        opp.name.toLowerCase().includes(search.toLowerCase()) ||
        opp.employerName.toLowerCase().includes(search.toLowerCase());
      
      const matchesStage = stageFilter === "all" || opp.stage === stageFilter;
      const matchesType = typeFilter === "all" || opp.type === typeFilter;
      
      return matchesSearch && matchesStage && matchesType;
    });
  }, [opportunities, search, stageFilter, typeFilter]);

  const handleClearFilters = () => {
    setSearch("");
    setStageFilter("all");
    setTypeFilter("all");
  };

  const handleExport = () => {
    console.log("Exporting selected opportunities:", selectedIds);
  };

  const handleDelete = () => {
    console.log("Deleting selected opportunities:", selectedIds);
  };

  const handleChangeStage = () => {
    console.log("Changing stage for selected opportunities:", selectedIds);
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-muted-foreground mt-2">Manage and track all sales opportunities</p>
          </div>
          <Button onClick={() => navigate("/sales/opportunities/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Opportunity
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Opportunities"
            value={stats.total}
            icon={Target}
            description={`${stats.active} open`}
          />
          <StatsCard
            title="Open Value"
            value={`$${(stats.pipelineValue / 1000).toFixed(0)}K`}
            icon={DollarSign}
            description="Pipeline value"
          />
          <StatsCard
            title="Avg Deal Size"
            value={`$${(stats.avgDealSize / 1000).toFixed(0)}K`}
            icon={TrendingUp}
            description="Per opportunity"
          />
          <StatsCard
            title="Win Rate"
            value={`${stats.conversionRate.toFixed(1)}%`}
            icon={Award}
            description="Conversion rate"
          />
        </div>

        <OpportunitiesFilterBar
          search={search}
          onSearchChange={setSearch}
          stageFilter={stageFilter}
          onStageFilterChange={setStageFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          onClearFilters={handleClearFilters}
        />

        <DataTable
          columns={columns}
          data={filteredOpportunities}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          exportable
          exportFilename="opportunities"
        />

        <OpportunityBulkActions
          selectedCount={selectedIds.length}
          onExport={handleExport}
          onDelete={handleDelete}
          onChangeStage={handleChangeStage}
          onClearSelection={() => setSelectedIds([])}
        />
      </div>
    </DashboardPageLayout>
  );
}
