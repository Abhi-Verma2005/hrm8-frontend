import { useState } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { DollarSign, Clock, CheckCircle2, TrendingUp, Download } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { createCommissionColumns } from "@/components/sales/CommissionTableColumns";
import { CommissionsFilterBar } from "@/components/sales/CommissionsFilterBar";
import { CommissionBulkActions } from "@/components/sales/CommissionBulkActions";
import { getAllCommissions, getCommissionStats } from "@/lib/salesCommissionStorage";
import { CommissionStatus } from "@/types/salesCommission";
import { useToast } from "@/hooks/use-toast";

export default function CommissionsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CommissionStatus | 'all'>('all');
  const [agentFilter, setAgentFilter] = useState('all');

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

  const handleExport = (selectedIds: string[]) => {
    const dataToExport = selectedIds.length > 0
      ? allCommissions.filter(c => selectedIds.includes(c.id))
      : filteredCommissions;
    
    toast({
      title: "Exporting Commissions",
      description: `Exporting ${dataToExport.length} commission records...`,
    });
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

  return (
    <DashboardPageLayout
      breadcrumbActions={
        <Button variant="outline" size="sm" onClick={() => handleExport([])}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      }
    >
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Commission Management</h1>
          <p className="text-muted-foreground mt-2">Track and manage sales commissions</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Total Earned"
            value={`$${(stats.totalEarned / 1000).toFixed(1)}K`}
            icon={DollarSign}
            description={`${stats.paidCount} commissions paid`}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Pending"
            value={`$${(stats.pending / 1000).toFixed(1)}K`}
            icon={Clock}
            description={`${stats.pendingCount + stats.approvedCount} awaiting payment`}
          />
          <StatsCard
            title="Paid This Month"
            value={`$${(stats.paidThisMonth / 1000).toFixed(1)}K`}
            icon={CheckCircle2}
            description="Current month payments"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Average Commission"
            value={`$${(stats.averageCommission / 1000).toFixed(1)}K`}
            icon={TrendingUp}
            description="Per deal average"
            trend={{ value: 5, isPositive: true }}
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

        <DataTable
          columns={createCommissionColumns()}
          data={filteredCommissions}
          selectable
          onSelectedRowsChange={() => {}}
          renderBulkActions={(selectedIds) => (
            <CommissionBulkActions
              selectedCount={selectedIds.length}
              onExport={() => handleExport(selectedIds)}
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
    </DashboardPageLayout>
  );
}
