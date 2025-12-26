/**
 * Regional Licensees Management Page
 * HRM8 Global Admin licensee management
 */

import { useState, useEffect } from 'react';
import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import { licenseeService, RegionalLicensee } from '@/lib/hrm8/licenseeService';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Edit, Trash2, Ban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hrm8PageLayout } from '@/components/layouts/Hrm8PageLayout';
import { toast } from 'sonner';
import { FormDrawer } from '@/components/ui/form-drawer';
import { LicenseeForm } from '@/components/hrm8/LicenseeForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const columns = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    render: (licensee: RegionalLicensee) => (
      <span className={licensee.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}>
        {licensee.status}
      </span>
    ),
  },
  {
    key: 'revenueSharePercent',
    label: 'Revenue Share %',
    render: (licensee: RegionalLicensee) => `${licensee.revenueSharePercent}%`,
  },
];

export default function LicenseesPage() {
  const { hrm8User } = useHrm8Auth();
  const [licensees, setLicensees] = useState<RegionalLicensee[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingLicenseeId, setEditingLicenseeId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isGlobalAdmin = hrm8User?.role === 'GLOBAL_ADMIN';

  useEffect(() => {
    loadLicensees();
  }, []);

  const loadLicensees = async () => {
    try {
      setLoading(true);
      const response = await licenseeService.getAll();
      if (response.success && response.data?.licensees) {
        setLicensees(response.data.licensees);
      }
    } catch (error) {
      toast.error('Failed to load licensees');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingLicenseeId(null);
    setDrawerOpen(true);
  };

  const handleEdit = (licensee: RegionalLicensee) => {
    setEditingLicenseeId(licensee.id);
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    await loadLicensees();
    setDrawerOpen(false);
    setDrawerOpen(false);
    setEditingLicenseeId(null);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await licenseeService.delete(deletingId);
      toast.success('Licensee deleted successfully');
      loadLicensees();
    } catch (error) {
      toast.error('Failed to delete licensee');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isGlobalAdmin) {
    return (
      <Hrm8PageLayout
        title="Regional Licensees"
        subtitle="Global Admin access required"
      >
        <div className="p-6" />
      </Hrm8PageLayout>
    );
  }

  return (
    <Hrm8PageLayout
      title="Regional Licensees"
      subtitle="Manage regional licensees"
      actions={
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Licensee
        </Button>
      }
    >
      <div className="p-6 space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Licensees</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading licensees...</div>
            ) : (
              <DataTable
                data={licensees}
                columns={[
                  ...columns,
                  {
                    key: 'actions',
                    label: 'Actions',
                    render: (licensee: RegionalLicensee) => (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(licensee)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => handleDeleteClick(licensee.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ),
                  },
                ]}
                searchable
                searchKeys={['name', 'email', 'legalEntityName']}
                emptyMessage="No licensees found"
              />
            )}
          </CardContent>
        </Card>

        <FormDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          title={editingLicenseeId ? 'Edit Licensee' : 'Create Licensee'}
        >
          <LicenseeForm
            licenseeId={editingLicenseeId}
            onSave={handleSave}
            onCancel={() => {
              setDrawerOpen(false);
              setEditingLicenseeId(null);
            }}
          />
        </FormDrawer>

        <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the Licensee and the associated Regional Admin account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Hrm8PageLayout>
  );
}
