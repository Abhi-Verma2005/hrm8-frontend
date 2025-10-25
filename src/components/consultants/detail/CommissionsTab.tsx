import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { getConsultantCommissions, getCommissionStats } from '@/lib/commissionStorage';
import { formatRevenue } from '@/lib/consultantUtils';
import { format } from 'date-fns';
import type { Consultant } from '@/types/consultant';
import type { CommissionStatus } from '@/types/commission';

interface CommissionsTabProps {
  consultantId: string;
  consultant: Consultant;
}

const getStatusBadge = (status: CommissionStatus) => {
  const config = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
    approved: { label: 'Approved', className: 'bg-blue-100 text-blue-800' },
    paid: { label: 'Paid', className: 'bg-green-100 text-green-800' },
    disputed: { label: 'Disputed', className: 'bg-red-100 text-red-800' },
    cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-800' },
  };
  const { label, className } = config[status];
  return <Badge variant="secondary" className={className}>{label}</Badge>;
};

export function CommissionsTab({ consultantId, consultant }: CommissionsTabProps) {
  const commissions = getConsultantCommissions(consultantId);
  const stats = getCommissionStats(consultantId);

  return (
    <div className="space-y-6">
      {/* Commission Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRevenue(stats.totalEarned)}</div>
            <p className="text-xs text-muted-foreground">{stats.total} commissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRevenue(stats.pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">{stats.pending} commissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRevenue(stats.approvedAmount)}</div>
            <p className="text-xs text-muted-foreground">{stats.approved} commissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRevenue(stats.paidAmount)}</div>
            <p className="text-xs text-muted-foreground">{stats.paid} commissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Commission History</CardTitle>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Commission
          </Button>
        </CardHeader>
        <CardContent>
          {commissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No commission records yet
            </div>
          ) : (
            <div className="space-y-4">
              {commissions.map(commission => (
                <div
                  key={commission.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{commission.description || commission.entityName}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {commission.entityType} • {format(new Date(commission.earnedDate), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold">${commission.commissionAmount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{commission.commissionRate}%</div>
                    </div>
                    {getStatusBadge(commission.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
