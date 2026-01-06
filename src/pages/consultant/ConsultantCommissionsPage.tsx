/**
 * Consultant Commissions Page
 * View commissions for consultants
 */

import { useState, useEffect } from 'react';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import { consultantService } from '@/lib/consultant/consultantService';
import { Commission } from '@/lib/hrm8/commissionService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { ConsultantPageLayout } from '@/components/layouts/ConsultantPageLayout';
import { AtsPageHeader } from '@/components/layouts/AtsPageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ConsultantCommissionsPage() {
  const { consultant } = useConsultantAuth();
  const [commissions, setCommissions] = useState<Commission[]>([]);
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
      render: (commission: Commission) => (
        <span className="text-sm font-semibold">
          {commission.currency || 'USD'} {commission.amount?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (commission: Commission) => (
        <Badge variant="outline" className="h-6 px-2 text-xs rounded-full">
          {(commission.type || commission.commissionType || 'N/A').replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (commission: Commission) => {
        const status = commission.status || 'PENDING';
        
        if (status === 'PENDING') {
          return (
            <Badge variant="outline" className="h-6 px-2 text-xs rounded-full bg-warning/10 text-warning border-warning/20">
              Pending
            </Badge>
          );
        }
        
        if (status === 'CONFIRMED') {
          return (
            <Badge variant="outline" className="h-6 px-2 text-xs rounded-full bg-primary/10 text-primary border-primary/20">
              Confirmed
            </Badge>
          );
        }
        
        if (status === 'PAID') {
          return (
            <Badge variant="outline" className="h-6 px-2 text-xs rounded-full bg-success/10 text-success border-success/20">
              Paid
            </Badge>
          );
        }
        
        if (status === 'CANCELLED') {
          return (
            <Badge variant="outline" className="h-6 px-2 text-xs rounded-full bg-destructive/10 text-destructive border-destructive/20">
              Cancelled
            </Badge>
          );
        }
        
        return (
          <Badge variant="outline" className="h-6 px-2 text-xs rounded-full">
            {status}
          </Badge>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (commission: Commission) => (
        <span className="text-sm text-muted-foreground">
          {commission.createdAt ? new Date(commission.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
  ];

  const totalPending = commissions
    .filter(c => c.status === 'PENDING')
    .reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalPaid = commissions
    .filter(c => c.status === 'PAID')
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  return (
    <ConsultantPageLayout>
      <div className="p-6 space-y-6">
        <AtsPageHeader
          title="Commissions"
          subtitle="View your commission history"
        />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <EnhancedStatCard
          title="Pending Commissions"
          value=""
          change="To be paid"
          isCurrency={true}
          rawValue={totalPending}
            icon={<Clock className="h-5 w-5" />}
            variant="neutral"
        />

        <EnhancedStatCard
          title="Total Paid"
          value=""
          change="All time"
          isCurrency={true}
          rawValue={totalPaid}
            icon={<CheckCircle className="h-5 w-5" />}
            variant="neutral"
        />

        <EnhancedStatCard
          title="Total Commissions"
          value={commissions.length.toString()}
          change="In history"
            icon={<DollarSign className="h-5 w-5" />}
          variant="neutral"
        />
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="text-base font-semibold">Commission History</CardTitle>
            <CardDescription className="text-sm">
              {commissions.length} total commission{commissions.length !== 1 ? 's' : ''}
            </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-sm">Loading commissions...</div>
              </div>
          ) : commissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No commissions yet</p>
            </div>
          ) : (
            <DataTable
              data={commissions}
              columns={columns}
              searchable
              searchKeys={['type', 'commissionType', 'status']}
              emptyMessage="No commissions found"
            />
          )}
        </CardContent>
      </Card>
      </div>
    </ConsultantPageLayout>
  );
}
