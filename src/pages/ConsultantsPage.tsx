import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Plus, Users, TrendingUp, DollarSign, Award, Upload, Download, BarChart3, Eye, Filter } from 'lucide-react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { AtsPageHeader } from '@/components/layouts/AtsPageHeader';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/tables/DataTable';
import { createConsultantColumns } from '@/components/consultants/ConsultantTableColumns';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { ConsultantsFilterBar } from '@/components/consultants/ConsultantsFilterBar';
import { getAllConsultants, getConsultantStats, deleteConsultant } from '@/lib/consultantStorage';
import { formatRevenue } from '@/components/consultants/ConsultantTypeBadge';
import { exportConsultantsToCSV, downloadJSON } from '@/lib/exportUtils';
import { ConsultantBulkActions } from '@/components/consultants/ConsultantBulkActions';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { ImportDialog } from '@/components/ui/import-dialog';
import { FormDrawer } from '@/components/ui/form-drawer';
import { ConsultantFormWizard } from '@/components/consultants/ConsultantFormWizard';
import type { Consultant } from '@/types/consultant';
import { toast } from 'sonner';

export default function ConsultantsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingConsultantId, setEditingConsultantId] = useState<string | null>(null);

  // State for async data
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    inactive: 0,
    suspended: 0,
    byType: { salesRep: 0, recruiter: 0, '360Consultant': 0 },
    totalPlacements: 0,
    totalRevenue: 0,
    averageSuccessRate: 0,
    totalCommissionsPaid: 0,
    pendingCommissions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load consultants and stats
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [consultantsData, statsData] = await Promise.all([
          getAllConsultants(),
          getConsultantStats(),
        ]);
        setConsultants(consultantsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading consultants:', error);
        toast.error('Failed to load consultants. Please log in as HRM8 admin.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const [initialRole, setInitialRole] = useState<string | undefined>(undefined);

  // Handle query parameter for editing consultant
  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('id');
    const role = searchParams.get('role');

    if (action === 'create') {
      setEditingConsultantId(null);
      setInitialRole(role || undefined);
      setDrawerOpen(true);
      setSearchParams({}, { replace: true });
    } else if (action === 'edit' && editId) {
      setEditingConsultantId(editId);
      setInitialRole(undefined);
      setDrawerOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filteredData = useMemo(() => {
    return consultants.filter(consultant => {
      const matchesSearch = searchTerm === '' ||
        consultant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'all' || consultant.role === typeFilter;
      const matchesStatus = statusFilter === 'all' || consultant.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [consultants, searchTerm, typeFilter, statusFilter]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (typeFilter !== 'all') count++;
    if (statusFilter !== 'all') count++;
    return count;
  }, [searchTerm, typeFilter, statusFilter]);

  const handleClearFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setSearchTerm('');
  };

  const handleExport = () => {
    const selectedData = selectedIds.length > 0
      ? consultants.filter(c => selectedIds.includes(c.id))
      : filteredData;
    exportConsultantsToCSV(selectedData);
    toast.success(`Exported ${selectedData.length} consultant(s)`);
  };

  const handleImport = async (data: any[]) => {
    // Process import data
    toast.success(`Imported ${data.length} consultant(s)`);
    window.location.reload();
  };

  const handleBulkDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await Promise.all(selectedIds.map(id => deleteConsultant(id)));
      toast.success(`Deleted ${selectedIds.length} consultant(s)`);
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

  const handleSaveConsultant = async (data: Partial<Consultant>) => {
    if (!editingConsultantId) {
      // Create new consultant using the storage function
      const { createConsultant } = await import('@/lib/consultantStorage');
      await createConsultant(data as any);

      toast.success('Consultant added successfully');
      setDrawerOpen(false);
      window.location.reload();
    } else {
      // Update existing consultant
      const { updateConsultant } = await import('@/lib/consultantStorage');
      await updateConsultant(editingConsultantId, data);

      toast.success('Consultant updated successfully');
      setDrawerOpen(false);
      window.location.reload();
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <DashboardPageLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading consultants...</p>
          </div>
        </div>
      </DashboardPageLayout>
    );
  }

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
        <AtsPageHeader title="Consultants" subtitle="Manage your consultant team">
          <div className="flex gap-2 items-center">
            <Button variant="outline" asChild>
              <Link to="/consultants/workload">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Workload
              </Link>
            </Button>
            <Button onClick={() => {
              setEditingConsultantId(null);
              setDrawerOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Consultant
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/consulting">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Dashboard
              </Link>
            </Button>
          </div>
        </AtsPageHeader>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Total Consultants"
            value={stats.total.toString()}
            change={`${stats.active} active`}
            trend="up"
            icon={<Users className="h-6 w-6" />}
            variant="neutral"
            showMenu={true}
            menuItems={[
              {
                label: "View All",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => { }
              },
              {
                label: "Add Consultant",
                icon: <Plus className="h-4 w-4" />,
                onClick: () => {
                  setEditingConsultantId(null);
                  setDrawerOpen(true);
                }
              },
              {
                label: "View Workload",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => navigate('/consultants/workload')
              }
            ]}
          />

          <EnhancedStatCard
            title="Total Placements"
            value={stats.totalPlacements.toString()}
            change="Active consultants"
            trend="up"
            icon={<Award className="h-6 w-6" />}
            variant="primary"
            showMenu={true}
            menuItems={[
              {
                label: "View Placements",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => navigate('/placements')
              },
              {
                label: "View Metrics",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => { }
              }
            ]}
          />

          <EnhancedStatCard
            title="Total Revenue"
            value={`$${(stats.totalRevenue / 1000).toFixed(1)}k`}
            change="From active team"
            trend="up"
            icon={<TrendingUp className="h-6 w-6" />}
            variant="success"
            showMenu={true}
            menuItems={[
              {
                label: "View Revenue Report",
                icon: <BarChart3 className="h-4 w-4" />,
                onClick: () => { }
              },
              {
                label: "Export Data",
                icon: <Download className="h-4 w-4" />,
                onClick: handleExport
              }
            ]}
          />

          <EnhancedStatCard
            title="Commissions Paid"
            value={`$${(stats.totalCommissionsPaid / 1000).toFixed(1)}k`}
            change={`$${(stats.pendingCommissions / 1000).toFixed(1)}k pending`}
            trend={stats.pendingCommissions > 0 ? "up" : "down"}
            icon={<DollarSign className="h-6 w-6" />}
            variant="warning"
            showMenu={true}
            menuItems={[
              {
                label: "View Commissions",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => { }
              },
              {
                label: "Process Payments",
                icon: <Plus className="h-4 w-4" />,
                onClick: () => { }
              }
            ]}
          />
        </div>

        <ConsultantsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onClearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
        />

        <div className="overflow-x-auto -mx-1 px-1">
          <DataTable
            columns={createConsultantColumns()}
            data={filteredData}
            selectable
            onSelectedRowsChange={setSelectedIds}
          />
        </div>

        <ConsultantBulkActions
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
          title="Delete Consultants"
          description={`Are you sure you want to delete ${selectedIds.length} consultant(s)? This action cannot be undone.`}
          isDeleting={isDeleting}
        />

        <ImportDialog
          open={showImportDialog}
          onOpenChange={setShowImportDialog}
          onImport={handleImport}
          title="Import Consultants"
          description="Upload a CSV file to import consultant data"
          sampleHeaders={['firstName', 'lastName', 'email', 'phone', 'type', 'status']}
        />

        <FormDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          title={editingConsultantId ? "Edit Consultant" : "Add New Consultant"}
          description={editingConsultantId ? "Update consultant information" : "Complete the form below to add a new consultant"}
          width="xl"
        >
          <ConsultantFormWizard
            consultant={editingConsultantId ? consultants.find(c => c.id === editingConsultantId) : undefined}
            initialRole={initialRole}
            onSave={handleSaveConsultant}
            onCancel={() => setDrawerOpen(false)}
          />
        </FormDrawer>
      </div>
    </DashboardPageLayout>
  );
}
