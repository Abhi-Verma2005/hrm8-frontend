import { useState } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, AlertCircle, Target, Download, Eye, BarChart3 } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { createForecastColumns } from "@/components/sales/ForecastTableColumns";
import { ForecastFilterBar } from "@/components/sales/ForecastFilterBar";
import { ForecastBulkActions } from "@/components/sales/ForecastBulkActions";
import { getAllOpportunities } from "@/lib/salesOpportunityStorage";
import { transformToForecastItems, getForecastStats, ConfidenceLevel } from "@/lib/salesForecastUtils";
import { getSalesAgentStats } from "@/lib/salesAgentStorage";
import { useToast } from "@/hooks/use-toast";
import { exportForecast } from "@/lib/salesExportService";
import { SalesExportDialog, ExportConfig } from "@/components/sales/SalesExportDialog";

export default function SalesForecastPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [quarterFilter, setQuarterFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceLevel | 'all'>('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const opportunities = getAllOpportunities();
  const forecastStats = getForecastStats(opportunities);
  const salesStats = getSalesAgentStats();
  const quotaGap = salesStats.totalQuota - salesStats.totalRevenue;
  
  const forecastItems = transformToForecastItems(opportunities);

  const filteredForecast = forecastItems.filter((item) => {
    const matchesSearch = 
      search === '' ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.employerName.toLowerCase().includes(search.toLowerCase()) ||
      item.salesAgentName.toLowerCase().includes(search.toLowerCase());
    
    const matchesQuarter = quarterFilter === 'all' || item.quarter === quarterFilter;
    const matchesConfidence = confidenceFilter === 'all' || item.confidenceLevel === confidenceFilter;
    const matchesAgent = agentFilter === 'all' || item.salesAgentId === agentFilter;
    
    return matchesSearch && matchesQuarter && matchesConfidence && matchesAgent;
  });

  const handleClearFilters = () => {
    setSearch("");
    setQuarterFilter('all');
    setConfidenceFilter('all');
    setAgentFilter('all');
  };

  const handleExport = () => {
    console.log("Bulk export not yet implemented");
  };

  const handleDelete = (selectedIds: string[]) => {
    toast({
      title: "Delete Opportunities",
      description: `Deleting ${selectedIds.length} opportunities...`,
    });
  };

  const handleAdjustProbability = (selectedIds: string[]) => {
    toast({
      title: "Adjust Probability",
      description: `Adjusting probability for ${selectedIds.length} opportunities...`,
    });
  };

  const handleSendReport = (selectedIds: string[]) => {
    toast({
      title: "Send Report",
      description: `Sending forecast report for ${selectedIds.length} opportunities...`,
    });
  };

  const handleExportDialog = (config: ExportConfig) => {
    const selectedOpportunities = opportunities.filter(opp => 
      filteredForecast.some(item => item.id === opp.id)
    );
    
    exportForecast(selectedOpportunities, config.format, 'sales-forecast', {
      fields: config.fields,
      dateRange: config.dateRange,
    });
    
    toast({
      title: "Export Complete",
      description: `Exported ${selectedOpportunities.length} forecast items as ${config.format.toUpperCase()}`,
    });
  };

  return (
    <DashboardPageLayout
      breadcrumbActions={
        <Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      }
    >
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Sales Forecasting</h1>
          <p className="text-muted-foreground mt-2">Revenue projections and sales forecasts</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <EnhancedStatCard
            title="Total Pipeline"
            value={forecastStats.totalPipeline.toString()}
            change={`${forecastStats.opportunityCount} active opportunities`}
            icon={<TrendingUp className="h-6 w-6" />}
            variant="neutral"
            isCurrency={true}
            rawValue={forecastStats.totalPipeline}
            showMenu={true}
            menuItems={[
              {
                label: "View Pipeline",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => {}
              },
              {
                label: "Export",
                icon: <Download className="h-4 w-4" />,
                onClick: () => setExportDialogOpen(true)
              }
            ]}
          />
          <EnhancedStatCard
            title="Weighted Forecast"
            value={forecastStats.weightedForecast.toString()}
            change="Most likely scenario"
            trend="up"
            icon={<Target className="h-6 w-6" />}
            variant="primary"
            isCurrency={true}
            rawValue={forecastStats.weightedForecast}
            showMenu={true}
            menuItems={[
              {
                label: "View Forecast",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => {}
              },
              {
                label: "View Report",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
          />
          <EnhancedStatCard
            title="Best Case"
            value={forecastStats.bestCase.toString()}
            change="Optimistic scenario"
            trend="up"
            icon={<TrendingUp className="h-6 w-6" />}
            variant="success"
            isCurrency={true}
            rawValue={forecastStats.bestCase}
            showMenu={true}
            menuItems={[
              {
                label: "View Analysis",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
          />
          <EnhancedStatCard
            title="Quota Gap"
            value={quotaGap.toString()}
            change="Remaining to reach quota"
            icon={<AlertCircle className="h-6 w-6" />}
            variant="warning"
            isCurrency={true}
            rawValue={quotaGap}
            showMenu={true}
            menuItems={[
              {
                label: "View Details",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
          />
        </div>

        <ForecastFilterBar
          search={search}
          onSearchChange={setSearch}
          quarterFilter={quarterFilter}
          onQuarterFilterChange={setQuarterFilter}
          confidenceFilter={confidenceFilter}
          onConfidenceFilterChange={setConfidenceFilter}
          agentFilter={agentFilter}
          onAgentFilterChange={setAgentFilter}
          onClearFilters={handleClearFilters}
        />

        <DataTable
          columns={createForecastColumns()}
          data={filteredForecast}
          selectable
          onSelectedRowsChange={() => {}}
          renderBulkActions={(selectedIds) => (
            <ForecastBulkActions
              selectedCount={selectedIds.length}
              onExport={() => handleExport()}
              onDelete={() => handleDelete(selectedIds)}
              onAdjustProbability={() => handleAdjustProbability(selectedIds)}
              onSendReport={() => handleSendReport(selectedIds)}
              onClearSelection={() => {}}
            />
          )}
          exportable
          exportFilename="sales-forecast"
        />

        <SalesExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          exportType="forecast"
          onExport={handleExportDialog}
          totalRecords={filteredForecast.length}
        />

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Forecast Analysis</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Best Case Scenario</span>
                <span className="text-green-600 font-semibold">
                  ${forecastStats.bestCase.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Assuming 30% higher win rates and deal sizes
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Most Likely</span>
                <span className="text-blue-600 font-semibold">
                  ${forecastStats.weightedForecast.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Based on current pipeline and win rates
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Worst Case Scenario</span>
                <span className="text-orange-600 font-semibold">
                  ${forecastStats.worstCase.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Conservative estimate with lower win rates
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
