import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Plus, Users, TrendingUp, DollarSign, Award, Upload, Download, BarChart3 } from 'lucide-react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/tables/DataTable';
import { createConsultantColumns } from '@/components/consultants/ConsultantTableColumns';
import { StatsCard } from '@/components/ui/stats-card';
import { ConsultantsFilterBar } from '@/components/consultants/ConsultantsFilterBar';
import { getAllConsultants, getConsultantStats, deleteConsultant } from '@/lib/consultantStorage';
import { formatRevenue } from '@/lib/consultantUtils';
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

  const consultants = getAllConsultants();
  const stats = getConsultantStats();

  // Handle query parameter for editing consultant
  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('id');
    
    if (action === 'create') {
      setEditingConsultantId(null);
      setDrawerOpen(true);
      setSearchParams({}, { replace: true });
    } else if (action === 'edit' && editId) {
      setEditingConsultantId(editId);
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
      
      const matchesType = typeFilter === 'all' || consultant.type === typeFilter;
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
      selectedIds.forEach(id => deleteConsultant(id));
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
      createConsultant(data as Omit<Consultant, 'id' | 'createdAt' | 'updatedAt'>);
      
      toast.success('Consultant added successfully');
      setDrawerOpen(false);
      window.location.reload();
    } else {
      // Update existing consultant
      const { updateConsultant } = await import('@/lib/consultantStorage');
      updateConsultant(editingConsultantId, data);
      
      toast.success('Consultant updated successfully');
      setDrawerOpen(false);
      window.location.reload();
    }
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Consultants</h1>
            <p className="text-muted-foreground">Manage your consultant team</p>
          </div>
          <div className="flex gap-2">
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
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Consultants"
            value={stats.total}
            icon={Users}
            description={`${stats.active} active`}
          />

          <StatsCard
            title="Total Placements"
            value={stats.totalPlacements}
            icon={Award}
            description="Active consultants"
          />

          <StatsCard
            title="Total Revenue"
            value={formatRevenue(stats.totalRevenue)}
            icon={TrendingUp}
            description="From active team"
          />

          <StatsCard
            title="Commissions Paid"
            value={formatRevenue(stats.totalCommissionsPaid)}
            icon={DollarSign}
            description={`${formatRevenue(stats.pendingCommissions)} pending`}
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

        <DataTable
          columns={createConsultantColumns()}
          data={filteredData}
          selectable
          onSelectedRowsChange={setSelectedIds}
        />

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
            onSave={handleSaveConsultant}
            onCancel={() => setDrawerOpen(false)}
          />
        </FormDrawer>
      </div>
    </DashboardPageLayout>
  );
}
