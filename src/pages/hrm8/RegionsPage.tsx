/**
 * Regions Management Page
 * HRM8 Global Admin region management
 */

import { useState, useEffect } from 'react';
import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import { regionService, Region } from '@/lib/hrm8/regionService';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, MoreVertical, Link2, ArrowRightLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hrm8PageLayout } from '@/components/layouts/Hrm8PageLayout';
import { toast } from 'sonner';
import { FormDrawer } from '@/components/ui/form-drawer';
import { RegionForm } from '@/components/hrm8/RegionForm';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { AssignLicenseeDialog } from '@/components/hrm8/AssignLicenseeDialog';
import { TransferRegionDialog } from '@/components/hrm8/TransferRegionDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { TableSkeleton } from '@/components/tables/TableSkeleton';

const createColumns = (
  onEdit: (region: Region) => void,
  onDelete: (region: Region) => void,
  onAssignLicensee: (region: Region) => void,
  onTransfer: (region: Region) => void
) => [
  {
    key: 'code',
    label: 'Code',
    sortable: true,
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'country',
    label: 'Country',
    sortable: true,
  },
  {
    key: 'ownerType',
    label: 'Owner',
    render: (region: Region) => (
      <span className={region.ownerType === 'HRM8' ? 'text-blue-600' : 'text-purple-600'}>
        {region.ownerType}
      </span>
    ),
  },
  {
    key: 'licensee',
    label: 'Licensee',
    render: (region: Region) => {
      if (!region.licensee) {
        return (
          <span className="text-muted-foreground text-sm">—</span>
        );
      }
      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{region.licensee.name}</span>
          <span className="text-xs text-muted-foreground">{region.licensee.legalEntityName}</span>
        </div>
      );
    },
  },
  {
    key: 'isActive',
    label: 'Status',
    render: (region: Region) => (
      <Badge variant={region.isActive ? 'default' : 'secondary'}>
        {region.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    width: '100px',
    render: (region: Region) => (
      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(region)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Region
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAssignLicensee(region)}>
              {region.licensee ? (
                <>
                  <Link2 className="h-4 w-4 mr-2" />
                  Change Licensee
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4 mr-2" />
                  Assign Licensee
                </>
              )}
            </DropdownMenuItem>
            {region.licensee && (
              <DropdownMenuItem onClick={() => onTransfer(region)}>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Transfer Ownership
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(region)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

export default function RegionsPage() {
  const { hrm8User } = useHrm8Auth();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRegionId, setEditingRegionId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [regionToDelete, setRegionToDelete] = useState<string | null>(null);
  const [assignLicenseeDialogOpen, setAssignLicenseeDialogOpen] = useState(false);
  const [regionForLicensee, setRegionForLicensee] = useState<Region | null>(null);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [regionForTransfer, setRegionForTransfer] = useState<Region | null>(null);

  const isGlobalAdmin = hrm8User?.role === 'GLOBAL_ADMIN';

  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    try {
      setLoading(true);
      const response = await regionService.getAll();
      if (response.success && response.data?.regions) {
        setRegions(response.data.regions);
      }
    } catch (error) {
      toast.error('Failed to load regions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRegionId(null);
    setDrawerOpen(true);
  };

  const handleEdit = (region: Region) => {
    setEditingRegionId(region.id);
    setDrawerOpen(true);
  };

  const handleDelete = (region: Region) => {
    setRegionToDelete(region.id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!regionToDelete) return;

    try {
      const response = await regionService.delete(regionToDelete);
      if (response.success) {
        toast.success('Region deleted successfully');
        await loadRegions();
      } else {
        toast.error(response.error || 'Failed to delete region');
      }
    } catch (error) {
      toast.error('Failed to delete region');
    } finally {
      setDeleteDialogOpen(false);
      setRegionToDelete(null);
    }
  };

  const handleSave = async () => {
    await loadRegions();
    setDrawerOpen(false);
    setEditingRegionId(null);
  };

  const handleAssignLicensee = (region: Region) => {
    setRegionForLicensee(region);
    setAssignLicenseeDialogOpen(true);
  };

  const handleLicenseeAssigned = async () => {
    await loadRegions();
  };

  const handleTransfer = (region: Region) => {
    setRegionForTransfer(region);
    setTransferDialogOpen(true);
  };

  const handleTransferComplete = async () => {
    await loadRegions();
  };

  const columns = createColumns(handleEdit, handleDelete, handleAssignLicensee, handleTransfer);

  if (!isGlobalAdmin) {
    return (
      <Hrm8PageLayout
        title="Regions Management"
        subtitle="Global Admin access required"
      >
        <div className="p-6" />
      </Hrm8PageLayout>
    );
  }

  return (
    <Hrm8PageLayout
      title="Regions Management"
      subtitle="Manage geographic regions"
      actions={
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Region
        </Button>
      }
    >
      <div className="p-6 space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Regions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton columns={6} />
          ) : (
            <DataTable
              data={regions}
              columns={columns}
              searchable
              searchKeys={['code', 'name', 'country']}
              emptyMessage="No regions found"
            />
          )}
        </CardContent>
      </Card>

      <FormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editingRegionId ? 'Edit Region' : 'Create Region'}
      >
        <RegionForm
          regionId={editingRegionId}
          onSave={handleSave}
          onCancel={() => {
            setDrawerOpen(false);
            setEditingRegionId(null);
          }}
        />
      </FormDrawer>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Region"
        description="Are you sure you want to delete this region? This action cannot be undone."
      />

      <AssignLicenseeDialog
        open={assignLicenseeDialogOpen}
        onOpenChange={setAssignLicenseeDialogOpen}
        region={regionForLicensee}
        onSuccess={handleLicenseeAssigned}
      />

      <TransferRegionDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        region={regionForTransfer}
        onSuccess={handleTransferComplete}
      />
      </div>
    </Hrm8PageLayout>
  );
}
