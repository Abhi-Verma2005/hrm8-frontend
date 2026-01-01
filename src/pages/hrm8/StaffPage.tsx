/**
 * Staff Management Page
 * HRM8 Global Admin staff management (Consultants, Sales Agents, etc.)
 */

import { useState, useEffect } from 'react';
import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import { staffService, StaffMember } from '@/lib/hrm8/staffService';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hrm8PageLayout } from '@/components/layouts/Hrm8PageLayout';
import { toast } from 'sonner';
import { FormDrawer } from '@/components/ui/form-drawer';
import { StaffForm } from '@/components/hrm8/StaffForm';

const columns = [
  {
    key: 'firstName',
    label: 'Name',
    render: (staff: StaffMember) => `${staff.firstName} ${staff.lastName}`,
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
  },
  {
    key: 'role',
    label: 'Role',
    render: (staff: StaffMember) => staff.role.replace('_', ' '),
  },
  {
    key: 'status',
    label: 'Status',
    render: (staff: StaffMember) => (
      <span className={staff.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}>
        {staff.status}
      </span>
    ),
  },
];

export default function StaffPage() {
  const { hrm8User } = useHrm8Auth();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  const isGlobalAdmin = hrm8User?.role === 'GLOBAL_ADMIN';
  const canCreate = isGlobalAdmin || hrm8User?.role === 'REGIONAL_LICENSEE';

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const response = await staffService.getAll();
      if (response.success && response.data?.consultants) {
        setStaffList(response.data.consultants);
      }
    } catch (error) {
      toast.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingStaffId(null);
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    await loadStaff();
    setDrawerOpen(false);
    setEditingStaffId(null);
  };

  return (
    <Hrm8PageLayout
      title="Staff Management"
      subtitle="Manage Consultants and Sales Agents"
      actions={
        canCreate ? (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Staff
          </Button>
        ) : undefined
      }
    >
      <div className="p-6 space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading staff members...</div>
          ) : (
            <DataTable
              data={staffList}
              columns={columns}
              searchable
              searchKeys={['firstName', 'lastName', 'email']}
              emptyMessage="No staff members found"
            />
          )}
        </CardContent>
      </Card>

      {canCreate && (
        <FormDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          title={editingStaffId ? 'Edit Staff Member' : 'Create Staff Member'}
        >
          <StaffForm
            consultantId={editingStaffId}
            onSave={handleSave}
            onCancel={() => {
              setDrawerOpen(false);
              setEditingStaffId(null);
            }}
          />
        </FormDrawer>
      )}
      </div>
    </Hrm8PageLayout>
  );
}
