/**
 * Consultant Commissions Page
 * View commissions for consultants
 */

import { useState, useEffect } from 'react';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import { consultantService } from '@/lib/consultant/consultantService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { ConsultantPageLayout } from '@/components/layouts/ConsultantPageLayout';
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
    <ConsultantPageLayout
      title="Commissions"
      subtitle="View your commission history"
    >
      <div className="p-6 space-y-6">

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <EnhancedStatCard
          title="Pending Commissions"
          value=""
          isCurrency={true}
          rawValue={totalPending}
          icon={<Clock className="h-6 w-6" />}
          variant="warning"
        />

        <EnhancedStatCard
          title="Total Paid"
          value=""
          isCurrency={true}
          rawValue={totalPaid}
          icon={<CheckCircle className="h-6 w-6" />}
          variant="success"
        />

        <EnhancedStatCard
          title="Total Commissions"
          value={commissions.length.toString()}
          icon={<DollarSign className="h-6 w-6" />}
          variant="neutral"
        />
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
    </ConsultantPageLayout>
  );
}



