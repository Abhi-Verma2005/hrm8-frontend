/**
 * Consultants Management Page
 * HRM8 Global Admin consultant management
 */

import { useState, useEffect } from 'react';
import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import { consultantManagementService, Consultant } from '@/lib/hrm8/consultantManagementService';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hrm8PageLayout } from '@/components/layouts/Hrm8PageLayout';
import { toast } from 'sonner';
import { FormDrawer } from '@/components/ui/form-drawer';
import { ConsultantForm } from '@/components/hrm8/ConsultantForm';

const columns = [
  {
    key: 'firstName',
    label: 'Name',
    render: (consultant: Consultant) => `${consultant.firstName} ${consultant.lastName}`,
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
  },
  {
    key: 'role',
    label: 'Role',
    render: (consultant: Consultant) => consultant.role.replace('_', ' '),
  },
  {
    key: 'status',
    label: 'Status',
    render: (consultant: Consultant) => (
      <span className={consultant.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}>
        {consultant.status}
      </span>
    ),
  },
];

export default function ConsultantsPage() {
  const { hrm8User } = useHrm8Auth();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingConsultantId, setEditingConsultantId] = useState<string | null>(null);

  const isGlobalAdmin = hrm8User?.role === 'GLOBAL_ADMIN';

  useEffect(() => {
    loadConsultants();
  }, []);

  const loadConsultants = async () => {
    try {
      setLoading(true);
      const response = await consultantManagementService.getAll();
      if (response.success && response.data?.consultants) {
        setConsultants(response.data.consultants);
      }
    } catch (error) {
      toast.error('Failed to load consultants');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingConsultantId(null);
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    await loadConsultants();
    setDrawerOpen(false);
    setEditingConsultantId(null);
  };

  return (
    <Hrm8PageLayout
      title="Consultants"
      subtitle="Manage HRM8 consultants"
      actions={
        isGlobalAdmin ? (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Consultant
          </Button>
        ) : undefined
      }
    >
      <div className="p-6 space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Consultants</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading consultants...</div>
          ) : (
            <DataTable
              data={consultants}
              columns={columns}
              searchable
              searchKeys={['firstName', 'lastName', 'email']}
              emptyMessage="No consultants found"
            />
          )}
        </CardContent>
      </Card>

      {isGlobalAdmin && (
        <FormDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          title={editingConsultantId ? 'Edit Consultant' : 'Create Consultant'}
        >
          <ConsultantForm
            consultantId={editingConsultantId}
            onSave={handleSave}
            onCancel={() => {
              setDrawerOpen(false);
              setEditingConsultantId(null);
            }}
          />
        </FormDrawer>
      )}
      </div>
    </Hrm8PageLayout>
  );
}
