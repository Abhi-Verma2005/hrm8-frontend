import { useState } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { AtsPageHeader } from "@/components/layouts/AtsPageHeader";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { Button } from "@/components/ui/button";
import { DollarSign, Clock, CheckCircle2, TrendingUp, Download, Eye, BarChart3 } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { createCommissionColumns } from "@/components/sales/CommissionTableColumns";
import { CommissionsFilterBar } from "@/components/sales/CommissionsFilterBar";
import { CommissionBulkActions } from "@/components/sales/CommissionBulkActions";
import { getAllCommissions, getCommissionStats } from "@/lib/salesCommissionStorage";
import { CommissionStatus } from "@/types/salesCommission";
import { useToast } from "@/hooks/use-toast";
import { exportCommissions } from "@/lib/salesExportService";
import { SalesExportDialog, ExportConfig } from "@/components/sales/SalesExportDialog";

export default function CommissionsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CommissionStatus | 'all'>('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const stats = getCommissionStats();
  const allCommissions = getAllCommissions();

  const filteredCommissions = allCommissions.filter((commission) => {
    const matchesSearch = 
      search === '' ||
      commission.salesAgentName.toLowerCase().includes(search.toLowerCase()) ||
      commission.opportunityName.toLowerCase().includes(search.toLowerCase()) ||
      commission.employerName.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter;
    const matchesAgent = agentFilter === 'all' || commission.salesAgentId === agentFilter;
    
    return matchesSearch && matchesStatus && matchesAgent;
  });

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter('all');
    setAgentFilter('all');
  };

  const handleExport = () => {
    console.log("Bulk export not yet implemented");
  };

  const handleDelete = (selectedIds: string[]) => {
    toast({
      title: "Delete Commissions",
      description: `Deleting ${selectedIds.length} commission records...`,
    });
  };

  const handleApprove = (selectedIds: string[]) => {
    toast({
      title: "Approve Commissions",
      description: `Approving ${selectedIds.length} commission records...`,
    });
  };

  const handleMarkPaid = (selectedIds: string[]) => {
    toast({
      title: "Mark as Paid",
      description: `Marking ${selectedIds.length} commissions as paid...`,
    });
  };

  const handleExportDialog = (config: ExportConfig) => {
    exportCommissions(filteredCommissions, config.format, 'sales-commissions', {
      fields: config.fields,
      dateRange: config.dateRange,
    });
    
    toast({
      title: "Export Complete",
      description: `Exported ${filteredCommissions.length} commissions as ${config.format.toUpperCase()}`,
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
        <AtsPageHeader title="Commission Management" subtitle="Track and manage sales commissions" />

        <div className="grid gap-4 md:grid-cols-4">
          <EnhancedStatCard
            title="Total Earned"
            value={stats.totalEarned.toString()}
            change={`${stats.paidCount} commissions paid`}
            trend="up"
            icon={<DollarSign className="h-6 w-6" />}
            variant="success"
            isCurrency={true}
            rawValue={stats.totalEarned}
            showMenu={true}
            menuItems={[
              {
                label: "View All Commissions",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => {}
              },
              {
                label: "View Report",
                icon: <BarChart3 className="h-4 w-4" />,
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
            title="Pending"
            value={stats.pending.toString()}
            change={`${stats.pendingCount + stats.approvedCount} awaiting payment`}
            icon={<Clock className="h-6 w-6" />}
            variant="warning"
            isCurrency={true}
            rawValue={stats.pending}
            showMenu={true}
            menuItems={[
              {
                label: "View Pending",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => setStatusFilter('pending')
              },
              {
                label: "Approve All",
                icon: <CheckCircle2 className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
          />
          <EnhancedStatCard
            title="Paid This Month"
            value={stats.paidThisMonth.toString()}
            change="Current month payments"
            trend="up"
            icon={<CheckCircle2 className="h-6 w-6" />}
            variant="primary"
            isCurrency={true}
            rawValue={stats.paidThisMonth}
            showMenu={true}
            menuItems={[
              {
                label: "View Paid",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => setStatusFilter('paid')
              },
              {
                label: "Export",
                icon: <Download className="h-4 w-4" />,
                onClick: () => setExportDialogOpen(true)
              }
            ]}
          />
          <EnhancedStatCard
            title="Average Commission"
            value={stats.averageCommission.toString()}
            change="Per deal average"
            trend="up"
            icon={<TrendingUp className="h-6 w-6" />}
            variant="neutral"
            isCurrency={true}
            rawValue={stats.averageCommission}
            showMenu={true}
            menuItems={[
              {
                label: "View Analytics",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => {}
              }
            ]}
          />
        </div>

        <CommissionsFilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          agentFilter={agentFilter}
          onAgentFilterChange={setAgentFilter}
          onClearFilters={handleClearFilters}
        />

        <div className="overflow-x-auto -mx-1 px-1">
          <DataTable
            columns={createCommissionColumns()}
            data={filteredCommissions}
            selectable
            onSelectedRowsChange={() => {}}
            renderBulkActions={(selectedIds) => (
              <CommissionBulkActions
                selectedCount={selectedIds.length}
                onExport={() => handleExport()}
                onDelete={() => handleDelete(selectedIds)}
                onApprove={() => handleApprove(selectedIds)}
                onMarkPaid={() => handleMarkPaid(selectedIds)}
                onClearSelection={() => {}}
              />
            )}
            exportable
            exportFilename="commissions"
          />
        </div>

        <SalesExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          exportType="commissions"
          onExport={handleExportDialog}
          totalRecords={filteredCommissions.length}
        />
      </div>
    </DashboardPageLayout>
  );
}
