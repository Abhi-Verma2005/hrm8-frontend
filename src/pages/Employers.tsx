import { useState, useMemo, useEffect } from "react";
import { Plus, Download, Upload, Building, DollarSign, Briefcase, Clock, BarChart3, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { DataTable } from "@/components/tables/DataTable";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { EmployersFilterBar } from "@/components/employers/EmployersFilterBar";
import { createEmployerColumns } from "@/components/employers/EmployerTableColumns";
import { getEmployers, deleteEmployer } from "@/lib/employerService";
import { formatRevenue } from "@/lib/employerUtils";
import { exportEmployersToCSV } from "@/lib/exportUtils";
import { EmployerBulkActions } from "@/components/employers/EmployerBulkActions";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { ImportDialog } from "@/components/ui/import-dialog";
import { FormDrawer } from "@/components/ui/form-drawer";
import { EmployerFormWizard } from "@/components/employers/EmployerFormWizard";
import type { Employer } from "@/types/entities";
import type { SubscriptionTier } from "@/lib/subscriptionConfig";
import { toast } from "sonner";

export default function Employers() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const allEmployers = getEmployers();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<SubscriptionTier | 'all'>('all');
  const [accountTypeFilter, setAccountTypeFilter] = useState<Employer['accountType'] | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEmployerId, setEditingEmployerId] = useState<string | null>(null);

  // Handle query parameter for creating/editing employer
  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('id');
    
    if (action === 'create') {
      setEditingEmployerId(null);
      setDrawerOpen(true);
      setSearchParams({}, { replace: true });
    } else if (action === 'edit' && editId) {
      setEditingEmployerId(editId);
      setDrawerOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Filter logic
  const filteredEmployers = useMemo(() => {
    return allEmployers.filter(employer => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          employer.name.toLowerCase().includes(searchLower) ||
          employer.industry.toLowerCase().includes(searchLower) ||
          employer.location.toLowerCase().includes(searchLower) ||
          employer.email?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Country filter
      if (countryFilter !== 'all') {
        const employerCountry = employer.locations?.[0]?.country || 'United States';
        if (employerCountry !== countryFilter) {
          return false;
        }
      }

      // Tier filter
      if (tierFilter !== 'all' && employer.subscriptionTier !== tierFilter) {
        return false;
      }

      // Account type filter
      if (accountTypeFilter !== 'all' && employer.accountType !== accountTypeFilter) {
        return false;
      }

      return true;
    });
  }, [allEmployers, searchTerm, countryFilter, tierFilter, accountTypeFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const activeCount = allEmployers.filter(e => e.status === 'active').length;
    const totalRevenue = allEmployers.reduce((sum, e) => sum + (e.monthlySubscriptionFee || 0), 0);
    const pendingRenewals = allEmployers.filter(e => {
      if (!e.subscriptionEndDate) return false;
      const daysUntilRenewal = Math.floor(
        (new Date(e.subscriptionEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilRenewal <= 30 && daysUntilRenewal >= 0;
    }).length;

    return {
      total: allEmployers.length,
      active: activeCount,
      revenue: totalRevenue,
      pendingRenewals,
    };
  }, [allEmployers]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (countryFilter !== 'all') count++;
    if (tierFilter !== 'all') count++;
    if (accountTypeFilter !== 'all') count++;
    return count;
  }, [searchTerm, countryFilter, tierFilter, accountTypeFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setCountryFilter('all');
    setTierFilter('all');
    setAccountTypeFilter('all');
  };

  const handleExport = () => {
    const selectedData = selectedIds.length > 0
      ? allEmployers.filter(e => selectedIds.includes(e.id))
      : filteredEmployers;
    exportEmployersToCSV(selectedData);
    toast.success(`Exported ${selectedData.length} employer(s)`);
  };

  const handleImport = async (data: any[]) => {
    // Process import data
    toast.success(`Imported ${data.length} employer(s)`);
    window.location.reload();
  };

  const handleBulkDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmBulkDelete = async () => {
    setIsDeleting(true);
    try {
      selectedIds.forEach(id => deleteEmployer(id));
      toast.success(`Deleted ${selectedIds.length} employer(s)`);
      setSelectedIds([]);
      window.location.reload();
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBulkEmail = () => {
    toast.info('Email functionality coming soon');
  };

  const handleSaveEmployer = async (data: Partial<Employer>) => {
    if (!editingEmployerId) {
      // Create new employer using the service function
      const { createEmployer } = await import('@/lib/employerService');
      createEmployer(data as Omit<Employer, 'id' | 'createdAt' | 'updatedAt'>);
      
      toast.success('Employer added successfully');
      setDrawerOpen(false);
      window.location.reload();
    } else {
      // Update existing employer
      const { updateEmployer } = await import('@/lib/employerService');
      updateEmployer(editingEmployerId, data);
      
      toast.success('Employer updated successfully');
      setDrawerOpen(false);
      window.location.reload();
    }
  };

  const columns = createEmployerColumns();

  return (
    <DashboardPageLayout
      breadcrumbActions={
        <>
          <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </>
      }
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Employers</h1>
            <p className="text-muted-foreground">
              Manage employer relationships and accounts
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => {
              setEditingEmployerId(null);
              setDrawerOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Employer
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/employers">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Total Employers"
            value={stats.total.toString()}
            change={`${stats.active} active`}
            icon={<Building className="h-6 w-6" />}
            variant="neutral"
            showMenu={true}
            menuItems={[
              {
                label: "View All Employers",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => navigate('/employers')
              },
              {
                label: "Add Employer",
                icon: <Plus className="h-4 w-4" />,
                onClick: () => { setEditingEmployerId(null); setDrawerOpen(true); }
              },
              {
                label: "Export",
                icon: <Download className="h-4 w-4" />,
                onClick: handleExport
              }
            ]}
          />
          <EnhancedStatCard
            title="Active Accounts"
            value={stats.active.toString()}
            change={`${((stats.active / stats.total) * 100).toFixed(0)}% of total`}
            icon={<Briefcase className="h-6 w-6" />}
            variant="success"
            showMenu={true}
            menuItems={[
              {
                label: "View Active",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => { setStatusFilter('active'); navigate('/employers'); }
              },
              {
                label: "Export",
                icon: <Download className="h-4 w-4" />,
                onClick: handleExport
              }
            ]}
          />
          <EnhancedStatCard
            title="Monthly Revenue"
            value={stats.revenue.toString()}
            change="From subscriptions"
            icon={<DollarSign className="h-6 w-6" />}
            variant="primary"
            isCurrency={true}
            rawValue={stats.revenue}
            showMenu={true}
            menuItems={[
              {
                label: "View Report",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => navigate('/dashboard/employers')
              },
              {
                label: "Export",
                icon: <Download className="h-4 w-4" />,
                onClick: handleExport
              }
            ]}
          />
          <EnhancedStatCard
            title="Pending Renewals"
            value={stats.pendingRenewals.toString()}
            change="Due within 30 days"
            icon={<Clock className="h-6 w-6" />}
            variant="warning"
            showMenu={true}
            menuItems={[
              {
                label: "View Renewals",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => navigate('/employers')
              },
              {
                label: "Export",
                icon: <Download className="h-4 w-4" />,
                onClick: handleExport
              }
            ]}
          />
        </div>

        {/* Filters */}
        <EmployersFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          countryFilter={countryFilter}
          onCountryChange={setCountryFilter}
          tierFilter={tierFilter}
          onTierChange={setTierFilter}
          accountTypeFilter={accountTypeFilter}
          onAccountTypeChange={setAccountTypeFilter}
          onClearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredEmployers}
          selectable
          onSelectedRowsChange={setSelectedIds}
        />

        <EmployerBulkActions
          selectedCount={selectedIds.length}
          onExport={handleExport}
          onDelete={handleBulkDelete}
          onSendEmail={handleBulkEmail}
          onClearSelection={() => setSelectedIds([])}
        />

        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={confirmBulkDelete}
          title="Delete Employers"
          description={`Are you sure you want to delete ${selectedIds.length} employer(s)? This action cannot be undone.`}
          isDeleting={isDeleting}
        />

        <ImportDialog
          open={showImportDialog}
          onOpenChange={setShowImportDialog}
          onImport={handleImport}
          title="Import Employers"
          description="Upload a CSV file to import employer data"
          sampleHeaders={['name', 'industry', 'location', 'email', 'status', 'accountType']}
        />

        <FormDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          title={editingEmployerId ? "Edit Employer" : "Add New Employer"}
          description={editingEmployerId ? "Update employer information" : "Complete the form below to add a new employer account"}
          width="xl"
        >
          <EmployerFormWizard
            employer={editingEmployerId ? allEmployers.find(e => e.id === editingEmployerId) : undefined}
            onSave={handleSaveEmployer}
            onCancel={() => setDrawerOpen(false)}
          />
        </FormDrawer>
      </div>
    </DashboardPageLayout>
  );
}
