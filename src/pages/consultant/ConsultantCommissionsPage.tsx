/**
 * Consultant Commissions Page
 * View commissions for consultants
 */

import { useState, useEffect } from 'react';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import { consultantService } from '@/lib/consultant/consultantService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ConsultantCommissionsPage() {
  const { consultant } = useConsultantAuth();
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = async () => {
    try {
      setLoading(true);
      const response = await consultantService.getCommissions();
      if (response.success && response.data?.commissions) {
        setCommissions(response.data.commissions);
      }
    } catch (error) {
      toast.error('Failed to load commissions');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'amount',
      label: 'Amount',
      render: (commission: any) => (
        <span className="font-semibold">
          {commission.currency || 'USD'} {commission.amount?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      key: 'commissionType',
      label: 'Type',
      render: (commission: any) => (
        <Badge variant="outline">
          {commission.commissionType?.replace('_', ' ') || 'N/A'}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (commission: any) => {
        const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
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
            {commission.status || 'PENDING'}
          </Badge>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (commission: any) => 
        commission.createdAt ? new Date(commission.createdAt).toLocaleDateString() : 'N/A',
    },
  ];

  const totalPending = commissions
    .filter(c => c.status === 'PENDING')
    .reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalPaid = commissions
    .filter(c => c.status === 'PAID')
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Commissions</h1>
        <p className="text-muted-foreground mt-2">View your commission history</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Commissions</CardTitle>
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
          <CardTitle>Commission History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading commissions...</div>
          ) : commissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No commissions yet
            </div>
          ) : (
            <DataTable
              data={commissions}
              columns={columns}
              searchable
              searchKeys={['commissionType', 'status']}
              emptyMessage="No commissions found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}



