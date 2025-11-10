import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Target, DollarSign, TrendingUp, Award, LayoutGrid, List } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { getAllOpportunities, getOpportunityStats } from "@/lib/salesOpportunityStorage";
import type { SalesOpportunity, OpportunityStage, OpportunityType } from "@/types/salesOpportunity";
import { StatsCard } from "@/components/ui/stats-card";
import { createOpportunityColumns } from "@/components/sales/SalesOpportunityTableColumns";
import { OpportunitiesFilterBar } from "@/components/sales/OpportunitiesFilterBar";
import { OpportunityBulkActions } from "@/components/sales/OpportunityBulkActions";
import { useToast } from "@/hooks/use-toast";
import { exportOpportunities } from "@/lib/salesExportService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SalesPipelinePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [opportunities] = useState<SalesOpportunity[]>(getAllOpportunities());
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

  const stageColors: Record<OpportunityStage, string> = {
    prospecting: 'border-blue-300',
    qualification: 'border-purple-300',
    proposal: 'border-yellow-300',
    negotiation: 'border-orange-300',
    'closed-won': 'border-green-300',
    'closed-lost': 'border-red-300',
  };

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

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport([], 'excel')}>
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport([], 'csv')}>
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => navigate("/sales/opportunities/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Opportunity
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Opportunities"
            value={stats.total}
            icon={Target}
            description={`${stats.active} in pipeline`}
          />
          <StatsCard
            title="Pipeline Value"
            value={`$${stats.pipelineValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            icon={DollarSign}
            description="Open opportunities"
          />
          <StatsCard
            title="Win Rate"
            value={`${stats.conversionRate.toFixed(1)}%`}
            icon={Award}
            description="Conversion rate"
          />
          <StatsCard
            title="Avg Deal Size"
            value={`$${stats.avgDealSize.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            icon={TrendingUp}
            description="Per closed deal"
          />
        </div>

        {viewMode === 'kanban' ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map(stage => {
              const stageOpps = opportunitiesByStage[stage];
              const stageValue = stageOpps.reduce((sum, opp) => sum + opp.estimatedValue, 0);
              
              return (
                <div key={stage} className="flex-shrink-0 w-80">
                  <Card className={`border-t-4 ${stageColors[stage]}`}>
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
                          <Card key={opp.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
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
      </div>
    </DashboardPageLayout>
  );
}
