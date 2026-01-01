import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// Removed DashboardPageLayout import as it's no longer needed
import { AtsPageHeader } from "@/components/layouts/AtsPageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Target, DollarSign, TrendingUp, Award, LayoutGrid, List, Eye, Download, BarChart3, Loader2 } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { salesService, Opportunity, PipelineStats } from "@/lib/sales/salesService";
import type { SalesOpportunity, OpportunityStage, OpportunityType } from "@/types/salesOpportunity";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { createOpportunityColumns } from "@/components/sales/SalesOpportunityTableColumns";
import { OpportunitiesFilterBar } from "@/components/sales/OpportunitiesFilterBar";
import { OpportunityBulkActions } from "@/components/sales/OpportunityBulkActions";
import { useToast } from "@/hooks/use-toast";
import { exportOpportunities } from "@/lib/salesExportService";
import { SalesExportDialog, ExportConfig } from "@/components/sales/SalesExportDialog";
import { formatCurrency } from "@/lib/utils";

export default function SalesPipelinePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Filter state for table view
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<OpportunityStage | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<OpportunityType | 'all'>('all');

  const stages: OpportunityStage[] = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('[SalesPipelinePage] 🚀 Starting data fetch...');
      setLoading(true);

      const [oppsResponse, statsResponse] = await Promise.all([
        salesService.getOpportunities(),
        salesService.getPipelineStats()
      ]);

      console.log('[SalesPipelinePage] 📦 Raw opportunities response:', oppsResponse);
      console.log('[SalesPipelinePage] 📊 Raw stats response:', statsResponse);

      if (oppsResponse.data) {
        console.log('[SalesPipelinePage] ✅ Setting opportunities:', {
          count: oppsResponse.data.opportunities.length,
          opportunities: oppsResponse.data.opportunities,
        });
        setOpportunities(oppsResponse.data.opportunities);
      } else {
        console.warn('[SalesPipelinePage] ⚠️ No opportunities data in response');
      }

      if (statsResponse.data) {
        console.log('[SalesPipelinePage] ✅ Setting stats:', statsResponse.data);
        setStats(statsResponse.data);
      } else {
        console.warn('[SalesPipelinePage] ⚠️ No stats data in response');
      }

      console.log('[SalesPipelinePage] ✅ Data fetch complete');
    } catch (error) {
      console.error("[SalesPipelinePage] ❌ Failed to fetch pipeline data:", error);
      toast({
        title: "Error",
        description: "Failed to load pipeline data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map backend stages to frontend stages
  const mapStageToFrontend = (backendStage: string): OpportunityStage => {
    const stageMap: Record<string, OpportunityStage> = {
      'NEW': 'prospecting',
      'QUALIFICATION': 'qualification',
      'PROPOSAL': 'proposal',
      'NEGOTIATION': 'negotiation',
      'CLOSED_WON': 'closed-won',
      'CLOSED_LOST': 'closed-lost',
    };
    const mappedStage = stageMap[backendStage] || 'prospecting';
    console.log(`[SalesPipelinePage] 🔄 Mapping stage: "${backendStage}" → "${mappedStage}"`);
    return mappedStage;
  };

  // Transform API opportunities to match UI expected format if needed
  // Or update UI to use new format. Let's map for now to keep UI components happy.
  const mappedOpportunities: SalesOpportunity[] = opportunities.map(opp => {
    console.log('[SalesPipelinePage] 🔄 Transforming opportunity:', {
      id: opp.id,
      name: opp.name,
      backendStage: opp.stage,
      company: opp.company,
    });

    return {
      id: opp.id,
      employerId: opp.company_id, // Map company_id to employerId
      employerName: opp.company?.name || 'Unknown Company',
      salesAgentId: opp.sales_agent_id,
      salesAgentName: 'Me', // Since this is my pipeline

      // Opportunity Details
      name: opp.name,
      type: 'new-business', // Default or map from backend if available
      productType: 'ats-subscription', // Default

      // Financial
      estimatedValue: opp.amount || 0,
      probability: opp.probability || 0,
      expectedCloseDate: opp.expected_close_date ? new Date(opp.expected_close_date).toISOString() : new Date().toISOString(),

      // Sales Pipeline
      stage: mapStageToFrontend(opp.stage),
      priority: 'medium',

      // Tracking
      leadSource: 'outbound', // Default

      createdAt: new Date(opp.created_at).toISOString(),
      updatedAt: new Date(opp.updated_at).toISOString(),
    };
  });

  console.log('[SalesPipelinePage] 🎯 Mapped opportunities:', {
    count: mappedOpportunities.length,
    opportunities: mappedOpportunities,
  });

  const opportunitiesByStage = stages.reduce((acc, stage) => {
    acc[stage] = mappedOpportunities.filter(opp => opp.stage === stage);
    console.log(`[SalesPipelinePage] 📊 Stage "${stage}":`, {
      count: acc[stage].length,
      opportunities: acc[stage].map(o => ({ id: o.id, name: o.name })),
    });
    return acc;
  }, {} as Record<OpportunityStage, SalesOpportunity[]>);

  console.log('[SalesPipelinePage] 🎯 Final opportunities by stage:', {
    stages: Object.keys(opportunitiesByStage),
    counts: Object.entries(opportunitiesByStage).map(([stage, opps]) => ({
      stage,
      count: opps.length,
    })),
  });

  // Filter opportunities for table view
  const filteredOpportunities = mappedOpportunities.filter((opp) => {
    const matchesSearch = 
      search === '' ||
      opp.name.toLowerCase().includes(search.toLowerCase()) ||
      opp.employerName.toLowerCase().includes(search.toLowerCase());
    
    const matchesStage = stageFilter === 'all' || opp.stage === stageFilter;
    // const matchesType = typeFilter === 'all' || opp.type === typeFilter;
    
    return matchesSearch && matchesStage;
  });

  const handleClearFilters = () => {
    setSearch("");
    setStageFilter('all');
    setTypeFilter('all');
  };

  const handleExport = (selectedIds: string[], format: 'csv' | 'excel' = 'excel') => {
    const dataToExport = selectedIds.length > 0
      ? mappedOpportunities.filter(opp => selectedIds.includes(opp.id))
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <AtsPageHeader title="Sales Pipeline" subtitle="Visualize and manage your sales opportunities">
        <div className="text-base font-semibold flex items-center gap-2">
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
            <Link to="/sales-agent/dashboard">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Dashboard
            </Link>
          </Button>
        </div>
      </AtsPageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <EnhancedStatCard
          title="Total Opportunities"
          value={(stats?.dealCount || 0).toString()}
          change="Active in pipeline"
          icon={<Target className="h-6 w-6" />}
          variant="neutral"
          showMenu={false}
        />
        <EnhancedStatCard
          title="Pipeline Value"
          value={formatCurrency(stats?.totalPipelineValue || 0)}
          change="Total value"
          icon={<DollarSign className="h-6 w-6" />}
          variant="primary"
          showMenu={false}
        />
        <EnhancedStatCard
          title="Weighted Value"
          value={formatCurrency(stats?.weightedPipelineValue || 0)}
          change="Risk adjusted"
          icon={<Award className="h-6 w-6" />}
          variant="success"
          showMenu={false}
        />
        <EnhancedStatCard
          title="Avg Deal Size"
          value={formatCurrency((stats?.totalPipelineValue || 0) / (stats?.dealCount || 1))}
          change="Per opportunity"
          icon={<TrendingUp className="h-6 w-6" />}
          variant="warning"
          showMenu={false}
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
                      <h3 className="text-base font-semibold capitalize">
                        {stage.replace('-', ' ')}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
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
            <div className="overflow-x-auto -mx-1 px-1">
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
  );
}
