import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { AtsPageHeader } from "@/components/layouts/AtsPageHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import { Plus, Target, DollarSign, TrendingUp, Award, Eye, Download, BarChart3 } from "lucide-react";
import { getAllOpportunities, getOpportunityStats } from "@/lib/salesOpportunityStorage";
import type { SalesOpportunity } from "@/types/salesOpportunity";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { createOpportunityColumns } from "@/components/sales/SalesOpportunityTableColumns";
import { OpportunitiesFilterBar } from "@/components/sales/OpportunitiesFilterBar";
import { OpportunityBulkActions } from "@/components/sales/OpportunityBulkActions";
import { exportOpportunities } from "@/lib/salesExportService";
import { useToast } from "@/hooks/use-toast";
import { SalesExportDialog, ExportConfig } from "@/components/sales/SalesExportDialog";

export default function OpportunitiesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [opportunities] = useState<SalesOpportunity[]>(getAllOpportunities());
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
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
    console.log("Bulk export not yet implemented");
  };

  const handleDelete = (selectedIds: string[]) => {
    console.log("Deleting selected opportunities:", selectedIds);
  };

  const handleChangeStage = (selectedIds: string[]) => {
    console.log("Changing stage for selected opportunities:", selectedIds);
  };

  const handleExportDialog = (config: ExportConfig) => {
    exportOpportunities(filteredOpportunities, config.format, 'sales-opportunities', {
      fields: config.fields,
      dateRange: config.dateRange,
    });
    
    toast({
      title: "Export Complete",
      description: `Exported ${filteredOpportunities.length} opportunities as ${config.format.toUpperCase()}`,
    });
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <AtsPageHeader title="Opportunities" subtitle="Manage and track all sales opportunities">
          <div className="flex gap-2 items-center">
            <Button variant="outline" onClick={() => setExportDialogOpen(true)}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => navigate("/sales/opportunities/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Opportunity
            </Button>
          </div>
        </AtsPageHeader>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Total Opportunities"
            value={stats.total.toString()}
            change={`${stats.active} open`}
            icon={<Target className="h-6 w-6" />}
            variant="neutral"
            showMenu={true}
            menuItems={[
              {
                label: "View All Opportunities",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => navigate('/sales/opportunities')
              },
              {
                label: "Create Opportunity",
                icon: <Plus className="h-4 w-4" />,
                onClick: () => navigate('/sales/opportunities/new')
              },
              {
                label: "Export",
                icon: <Download className="h-4 w-4" />,
                onClick: () => setExportDialogOpen(true)
              }
            ]}
          />
          <EnhancedStatCard
            title="Open Value"
            value={stats.pipelineValue.toString()}
            change="Pipeline value"
            icon={<DollarSign className="h-6 w-6" />}
            variant="primary"
            isCurrency={true}
            rawValue={stats.pipelineValue}
            showMenu={true}
            menuItems={[
              {
                label: "View Pipeline",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => navigate('/sales/pipeline')
              },
              {
                label: "View Report",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => navigate('/sales/forecast')
              }
            ]}
          />
          <EnhancedStatCard
            title="Avg Deal Size"
            value={stats.avgDealSize.toString()}
            change="Per opportunity"
            icon={<TrendingUp className="h-6 w-6" />}
            variant="success"
            isCurrency={true}
            rawValue={stats.avgDealSize}
            showMenu={true}
            menuItems={[
              {
                label: "View Analytics",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
          />
          <EnhancedStatCard
            title="Win Rate"
            value={`${stats.conversionRate.toFixed(1)}%`}
            change="Conversion rate"
            icon={<Award className="h-6 w-6" />}
            variant="warning"
            showMenu={true}
            menuItems={[
              {
                label: "View Report",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
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

        <div className="overflow-x-auto -mx-1 px-1">
          <DataTable
            columns={columns}
            data={filteredOpportunities}
            selectable
            renderBulkActions={(selectedIds) => (
              <OpportunityBulkActions
                selectedCount={selectedIds.length}
                onExport={() => handleExport()}
                onDelete={() => handleDelete(selectedIds)}
                onChangeStage={() => handleChangeStage(selectedIds)}
                onClearSelection={() => {}}
              />
            )}
            exportable
            exportFilename="opportunities"
          />
        </div>

        <SalesExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          exportType="opportunities"
          onExport={handleExportDialog}
          totalRecords={filteredOpportunities.length}
        />
      </div>
    </DashboardPageLayout>
  );
}
