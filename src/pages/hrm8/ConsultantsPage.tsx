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
import { Badge } from '@/components/ui/badge';

const getRoleBadge = (role: string) => {
  if (role === 'SALES_AGENT') {
    return <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-400">Sales Agent</Badge>;
  }
  if (role === 'RECRUITER') {
    return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">Recruiter</Badge>;
  }
  if (role === 'CONSULTANT_360') {
    return <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-400">360 Consultant</Badge>;
  }
  return <Badge variant="outline">{role.replace('_', ' ')}</Badge>;
};

const getCapacityDisplay = (consultant: Consultant) => {
  if (consultant.role === 'SALES_AGENT' || consultant.role === 'CONSULTANT_360') {
    return `${consultant.currentLeads || 0} Leads`;
  }
  if (consultant.role === 'RECRUITER' || consultant.role === 'CONSULTANT_360') {
    return `${consultant.currentJobs || 0} Jobs`;
  }
  return '-';
};

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
    label: 'Consultant Type',
    render: (consultant: Consultant) => getRoleBadge(consultant.role),
  },
  {
    key: 'capacity',
    label: 'Active Leads/Jobs',
    render: (consultant: Consultant) => {
      const parts: string[] = [];
      if (consultant.role === 'SALES_AGENT' || consultant.role === 'CONSULTANT_360') {
        parts.push(`${consultant.currentLeads || 0} Leads`);
      }
      if (consultant.role === 'RECRUITER' || consultant.role === 'CONSULTANT_360') {
        parts.push(`${consultant.currentJobs || 0} Jobs`);
      }
      return parts.length > 0 ? parts.join(', ') : '-';
    },
  },
  {
    key: 'status',
    label: 'Status',
    render: (consultant: Consultant) => (
      <Badge variant={consultant.status === 'ACTIVE' ? 'default' : 'secondary'}>
        {consultant.status}
      </Badge>
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
  const isLicensee = hrm8User?.role === 'REGIONAL_LICENSEE';
  const canCreate = isGlobalAdmin || isLicensee;

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
      title="Consultants Management"
      subtitle="Manage all consultants: Sales Agents, Recruiters, and 360 Consultants"
      actions={
        canCreate ? (
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

        {canCreate && (
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
