/**
 * Leads Management Page
 * HRM8 Lead management and assignment
 */

import { useState, useEffect } from 'react';
import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import { leadService, Lead } from '@/lib/hrm8/leadService';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Users, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hrm8PageLayout } from '@/components/layouts/Hrm8PageLayout';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    NEW: 'default',
    CONTACTED: 'secondary',
    QUALIFIED: 'default',
    CONVERTED: 'default', // 'success' is not a standard badge variant usually, verify this
    LOST: 'destructive',
    NURTURING: 'outline',
  };
  return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
};

const getRoleBadge = (role: string) => {
  if (role === 'SALES_AGENT') {
    return <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-400">Sales Agent</Badge>;
  }
  if (role === 'CONSULTANT_360') {
    return <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-400">360 Consultant</Badge>;
  }
  return <Badge variant="outline">{role}</Badge>;
};

const columns = [
  {
    key: 'companyName',
    label: 'Company',
    render: (lead: Lead) => (
      <div>
        <div className="font-medium">{lead.companyName}</div>
        <div className="text-sm text-muted-foreground">{lead.email}</div>
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (lead: Lead) => getStatusBadge(lead.status),
  },
  {
    key: 'attributionStatus',
    label: 'Attribution',
    render: (lead: Lead) => {
      const isValidated = !!lead.validatedBy && !!lead.validatedAt;
      if (isValidated) {
        return (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 border-green-200">
            Validated
          </Badge>
        );
      }
      return (
        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          Pending
        </Badge>
      );
    },
  },
  {
    key: 'createdBy',
    label: 'Created By',
    render: (lead: Lead) => {
      return (
        <div className="text-sm">
          {lead.createdBy ? (
            <span className="font-medium">Agent #{lead.createdBy.substring(0, 8)}</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
          {lead.referredBy && (
            <div className="text-xs text-muted-foreground">
              Ref: {lead.referredBy.substring(0, 8)}
            </div>
          )}
        </div>
      );
    },
  },
  {
    key: 'assignedConsultant',
    label: 'Assigned Sales Agent',
    render: (lead: Lead) => {
      if (!lead.assignedConsultant) {
        return <span className="text-muted-foreground">Unassigned</span>;
      }
      return (
        <div>
          <div className="font-medium">
            {lead.assignedConsultant.firstName} {lead.assignedConsultant.lastName}
          </div>
          <div className="text-sm">{getRoleBadge(lead.assignedConsultant.role)}</div>
        </div>
      );
    },
  },
  {
    key: 'region',
    label: 'Region',
    render: (lead: Lead) => lead.region?.name || '-',
  },
  {
    key: 'createdAt',
    label: 'Created',
    render: (lead: Lead) => new Date(lead.createdAt).toLocaleDateString(),
    sortable: true,
  },
];

export default function LeadsPage() {
  const { hrm8User } = useHrm8Auth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [attributionStatusFilter, setAttributionStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadLeads();
  }, [statusFilter, attributionStatusFilter]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.list({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        attributionStatus: attributionStatusFilter !== 'all' ? attributionStatusFilter : undefined,
      });
      if (response.success && response.data) {
        setLeads(response.data);
      } else {
        toast.error(response.error || 'Failed to load leads');
      }
    } catch (error) {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (lead: Lead) => {
    navigate(`/hrm8/leads/${lead.id}`);
  };

  return (
    <Hrm8PageLayout
      title="Leads Management"
      subtitle="Manage leads and assign to Sales Agents"
      actions={
        <Button onClick={() => navigate('/hrm8/leads/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Lead
        </Button>
      }
    >
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Leads</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={attributionStatusFilter} onValueChange={setAttributionStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Attribution Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Attribution</SelectItem>
                    <SelectItem value="PENDING_VALIDATION">Pending Validation</SelectItem>
                    <SelectItem value="VALIDATED">Validated</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="CONTACTED">Contacted</SelectItem>
                    <SelectItem value="QUALIFIED">Qualified</SelectItem>
                    <SelectItem value="CONVERTED">Converted</SelectItem>
                    <SelectItem value="LOST">Lost</SelectItem>
                    <SelectItem value="NURTURING">Nurturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading leads...</div>
            ) : (
              <DataTable
                data={leads}
                columns={columns}
                searchable
                searchKeys={['companyName', 'email']}
                emptyMessage="No leads found"
                onRowClick={handleRowClick}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Hrm8PageLayout>
  );
}





