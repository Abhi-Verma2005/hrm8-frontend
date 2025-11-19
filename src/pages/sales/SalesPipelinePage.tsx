import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Target, DollarSign, TrendingUp, Award, LayoutGrid, List, Eye, Download, BarChart3 } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { getAllOpportunities, getOpportunityStats } from "@/lib/salesOpportunityStorage";
import type { SalesOpportunity, OpportunityStage, OpportunityType } from "@/types/salesOpportunity";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { createOpportunityColumns } from "@/components/sales/SalesOpportunityTableColumns";
import { OpportunitiesFilterBar } from "@/components/sales/OpportunitiesFilterBar";
import { OpportunityBulkActions } from "@/components/sales/OpportunityBulkActions";
import { useToast } from "@/hooks/use-toast";
import { exportOpportunities } from "@/lib/salesExportService";
import { SalesExportDialog, ExportConfig } from "@/components/sales/SalesExportDialog";

export default function SalesPipelinePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [opportunities] = useState<SalesOpportunity[]>(getAllOpportunities());
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const stats = getOpportunityStats();

  // Filter state for table view
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<OpportunityStage | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<OpportunityType | 'all'>('all');

  const stages: OpportunityStage[] = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];

  const opportunitiesByStage = stages.reduce((acc, stage) => {
    acc[stage] = opportunities.filter(opp => opp.stage === stage);
    return acc;
  }, {} as Record<OpportunityStage, SalesOpportunity[]>);

  // Filter opportunities for table view
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = 
      search === '' ||
      opp.name.toLowerCase().includes(search.toLowerCase()) ||
      opp.employerName.toLowerCase().includes(search.toLowerCase()) ||
      opp.salesAgentName.toLowerCase().includes(search.toLowerCase());
    
    const matchesStage = stageFilter === 'all' || opp.stage === stageFilter;
    const matchesType = typeFilter === 'all' || opp.type === typeFilter;
    
    return matchesSearch && matchesStage && matchesType;
  });

  const handleClearFilters = () => {
    setSearch("");
    setStageFilter('all');
    setTypeFilter('all');
  };

  const handleExport = (selectedIds: string[], format: 'csv' | 'excel' = 'excel') => {
    const dataToExport = selectedIds.length > 0
      ? opportunities.filter(opp => selectedIds.includes(opp.id))
      : filteredOpportunities;
    
    exportOpportunities(dataToExport, format, 'sales-pipeline');
    
    toast({
      title: "Export Complete",
      description: `Exported ${dataToExport.length} opportunities as ${format.toUpperCase()}`,
    });
  };

  const handleDelete = (selectedIds: string[]) => {
    toast({
      title: "Delete Opportunities",
      description: `Deleting ${selectedIds.length} opportunities...`,
    });
  };

  const handleChangeStage = (selectedIds: string[]) => {
    toast({
      title: "Change Stage",
      description: `Updating stage for ${selectedIds.length} opportunities...`,
    });
  };

  const handleExportDialog = (config: ExportConfig) => {
    exportOpportunities(filteredOpportunities, config.format, 'sales-pipeline', {
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
      <div className="p-12 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sales Pipeline</h1>
            <p className="text-muted-foreground mt-2">Visualize and manage your sales opportunities</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg p-1 gap-1">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4 mr-2" />
                Table
              </Button>
            </div>
            <Button variant="outline" onClick={() => setExportDialogOpen(true)}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => navigate("/sales/opportunities/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Opportunity
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/sales">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Total Opportunities"
            value={stats.total.toString()}
            change={`${stats.active} in pipeline`}
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
              }
            ]}
          />
          <EnhancedStatCard
            title="Pipeline Value"
            value={stats.pipelineValue.toString()}
            change="Open opportunities"
            icon={<DollarSign className="h-6 w-6" />}
            variant="primary"
            isCurrency={true}
            rawValue={stats.pipelineValue}
            showMenu={true}
            menuItems={[
              {
                label: "View Forecast",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => navigate('/sales/forecast')
              },
              {
                label: "Export",
                icon: <Download className="h-4 w-4" />,
                onClick: () => setExportDialogOpen(true)
              }
            ]}
          />
          <EnhancedStatCard
            title="Win Rate"
            value={`${stats.conversionRate.toFixed(1)}%`}
            change="Conversion rate"
            icon={<Award className="h-6 w-6" />}
            variant="success"
            showMenu={true}
            menuItems={[
              {
                label: "View Report",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
          />
          <EnhancedStatCard
            title="Avg Deal Size"
            value={stats.avgDealSize.toString()}
            change="Per closed deal"
            icon={<TrendingUp className="h-6 w-6" />}
            variant="warning"
            isCurrency={true}
            rawValue={stats.avgDealSize}
            showMenu={true}
            menuItems={[
              {
                label: "View Analytics",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
          />
        </div>

        {viewMode === 'kanban' ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map(stage => {
              const stageOpps = opportunitiesByStage[stage];
              const stageValue = stageOpps.reduce((sum, opp) => sum + opp.estimatedValue, 0);
              
              return (
                <div key={stage} className="flex-shrink-0 w-80">
                  <Card>
                    <div className="p-4 border-b">
                      <h3 className="font-semibold capitalize">
                        {stage.replace('-', ' ')}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {stageOpps.length} opportunities • ${stageValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto">
                      {stageOpps.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No opportunities
                        </p>
                      ) : (
                        stageOpps.map(opp => (
                          <Card key={opp.id} className="p-3 cursor-pointer">
                            <h4 className="font-medium text-sm">{opp.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{opp.employerName}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm font-semibold">${opp.estimatedValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                              <span className="text-xs text-muted-foreground">{opp.probability}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{opp.salesAgentName}</p>
                          </Card>
                        ))
                      )}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <OpportunitiesFilterBar
              search={search}
              onSearchChange={setSearch}
              stageFilter={stageFilter}
              onStageFilterChange={(value) => setStageFilter(value as OpportunityStage | 'all')}
              typeFilter={typeFilter}
              onTypeFilterChange={(value) => setTypeFilter(value as OpportunityType | 'all')}
              onClearFilters={handleClearFilters}
            />
            <DataTable
              columns={createOpportunityColumns()}
              data={filteredOpportunities}
              selectable
              onSelectedRowsChange={() => {}}
              renderBulkActions={(selectedIds) => (
                <OpportunityBulkActions
                  selectedCount={selectedIds.length}
                  onExport={() => handleExport(selectedIds)}
                  onDelete={() => handleDelete(selectedIds)}
                  onChangeStage={() => handleChangeStage(selectedIds)}
                  onClearSelection={() => {}}
                />
              )}
              exportable
              exportFilename="sales-pipeline"
            />
          </div>
        )}

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
