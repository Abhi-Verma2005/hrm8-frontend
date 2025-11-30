/**
 * Commissions Management Page
 * HRM8 Global Admin commission tracking
 */

import { useState, useEffect } from 'react';
import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import { commissionService, Commission } from '@/lib/hrm8/commissionService';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const columns = [
  {
    key: 'consultantId',
    label: 'Consultant',
    render: (commission: Commission) => commission.consultantId.substring(0, 8) + '...',
  },
  {
    key: 'amount',
    label: 'Amount',
    render: (commission: Commission) => (
      <span className="font-semibold">
        {commission.currency} {commission.amount.toLocaleString()}
      </span>
    ),
  },
  {
    key: 'commissionType',
    label: 'Type',
    render: (commission: Commission) => (
      <Badge variant="outline">{commission.commissionType.replace('_', ' ')}</Badge>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (commission: Commission) => {
      const statusConfig = {
        PENDING: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        CONFIRMED: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
        PAID: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        CANCELLED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
      };
      const config = statusConfig[commission.status] || statusConfig.PENDING;
      const Icon = config.icon;
      
      return (
        <Badge className={`${config.color} ${config.bg}`}>
          <Icon className="mr-1 h-3 w-3" />
          {commission.status}
        </Badge>
      );
    },
  },
  {
    key: 'createdAt',
    label: 'Created',
    render: (commission: Commission) => new Date(commission.createdAt).toLocaleDateString(),
  },
];

export default function CommissionsPage() {
  const { hrm8User } = useHrm8Auth();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const isGlobalAdmin = hrm8User?.role === 'GLOBAL_ADMIN';

  useEffect(() => {
    loadCommissions();
  }, [statusFilter]);

  const loadCommissions = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      
      const response = await commissionService.getAll(filters);
      if (response.success && response.data?.commissions) {
        setCommissions(response.data.commissions);
      }
    } catch (error) {
      toast.error('Failed to load commissions');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      const response = await commissionService.confirm(id);
      if (response.success) {
        toast.success('Commission confirmed');
        await loadCommissions();
      } else {
        toast.error(response.error || 'Failed to confirm commission');
      }
    } catch (error) {
      toast.error('Failed to confirm commission');
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      const response = await commissionService.markAsPaid(id);
      if (response.success) {
        toast.success('Commission marked as paid');
        await loadCommissions();
      } else {
        toast.error(response.error || 'Failed to mark commission as paid');
      }
    } catch (error) {
      toast.error('Failed to mark commission as paid');
    }
  };

  const totalPending = commissions.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.amount, 0);
  const totalPaid = commissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commissions</h1>
          <p className="text-muted-foreground mt-2">Track and manage consultant commissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Label>Filter by Status:</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commissions.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading commissions...</div>
          ) : (
            <DataTable
              data={commissions}
              columns={columns}
              searchable
              searchKeys={['consultantId', 'commissionType']}
              emptyMessage="No commissions found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
