import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import { Plus, Users, DollarSign, Target, TrendingUp } from "lucide-react";
import { getAllSalesAgents, getSalesAgentStats } from "@/lib/salesAgentStorage";
import type { SalesAgent } from "@/types/salesAgent";
import { StatsCard } from "@/components/ui/stats-card";
import { createSalesAgentColumns } from "@/components/sales/SalesAgentTableColumns";
import { SalesTeamFilterBar } from "@/components/sales/SalesTeamFilterBar";
import { SalesAgentBulkActions } from "@/components/sales/SalesAgentBulkActions";

export default function SalesTeamPage() {
  const navigate = useNavigate();
  const [salesAgents] = useState<SalesAgent[]>(getAllSalesAgents());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const stats = getSalesAgentStats();
  
  const quotaAttainment = stats.totalQuota > 0 
    ? (stats.totalRevenue / stats.totalQuota * 100).toFixed(1)
    : '0';

  const columns = useMemo(() => createSalesAgentColumns(), []);

  const filteredAgents = useMemo(() => {
    return salesAgents.filter((agent) => {
      const matchesSearch = 
        search === "" ||
        `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        agent.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
      const matchesRole = roleFilter === "all" || agent.salesRole === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [salesAgents, search, statusFilter, roleFilter]);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setRoleFilter("all");
  };

  const handleExport = (selectedIds: string[]) => {
    console.log("Exporting selected agents:", selectedIds);
  };

  const handleDelete = (selectedIds: string[]) => {
    console.log("Deleting selected agents:", selectedIds);
  };

  const handleSendEmail = (selectedIds: string[]) => {
    console.log("Sending email to selected agents:", selectedIds);
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sales Team</h1>
            <p className="text-muted-foreground mt-2">Manage your sales team and track performance</p>
          </div>
          <Button onClick={() => navigate("/sales/team/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Sales Agent
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Agents"
            value={stats.total}
            icon={Users}
            description={`${stats.active} active`}
          />
          <StatsCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            icon={DollarSign}
            description="All-time"
          />
          <StatsCard
            title="Avg Win Rate"
            value={`${stats.avgConversionRate.toFixed(1)}%`}
            icon={TrendingUp}
            description="Conversion rate"
          />
          <StatsCard
            title="Quota Attainment"
            value={`${quotaAttainment}%`}
            icon={Target}
            description="Team average"
          />
        </div>

        <SalesTeamFilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          onClearFilters={handleClearFilters}
        />

        <DataTable
          columns={columns}
          data={filteredAgents}
          selectable
          renderBulkActions={(selectedIds) => (
            <SalesAgentBulkActions
              selectedCount={selectedIds.length}
              onExport={() => handleExport(selectedIds)}
              onDelete={() => handleDelete(selectedIds)}
              onSendEmail={() => handleSendEmail(selectedIds)}
              onClearSelection={() => {}}
            />
          )}
          exportable
          exportFilename="sales-team"
        />
      </div>
    </DashboardPageLayout>
  );
}
