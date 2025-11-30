/**
 * Regions Management Page
 * HRM8 Global Admin region management
 */

import { useState, useEffect } from 'react';
import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import { regionService, Region } from '@/lib/hrm8/regionService';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Edit, Trash2, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { FormDrawer } from '@/components/ui/form-drawer';
import { RegionForm } from '@/components/hrm8/RegionForm';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';

const columns = [
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
    key: 'isActive',
    label: 'Status',
    render: (region: Region) => (
      <span className={region.isActive ? 'text-green-600' : 'text-gray-500'}>
        {region.isActive ? 'Active' : 'Inactive'}
      </span>
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

  if (!isGlobalAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Regions Management</h1>
          <p className="text-muted-foreground mt-2">Global Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Regions Management</h1>
          <p className="text-muted-foreground mt-2">Manage geographic regions</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Region
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading regions...</div>
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
    </div>
  );
}
