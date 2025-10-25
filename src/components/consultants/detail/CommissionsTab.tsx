import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, DollarSign, TrendingUp, Clock, CheckCircle, Search } from 'lucide-react';
import { getConsultantCommissions, getCommissionStats } from '@/lib/commissionStorage';
import { formatRevenue } from '@/lib/consultantUtils';
import { format } from 'date-fns';
import { useState } from 'react';
import { CommissionStatusBadge } from './CommissionStatusBadge';
import type { Consultant } from '@/types/consultant';
import type { CommissionStatus } from '@/types/commission';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CommissionsTabProps {
  consultantId: string;
  consultant: Consultant;
}

export function CommissionsTab({ consultantId, consultant }: CommissionsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const commissions = getConsultantCommissions(consultantId);
  const stats = getCommissionStats(consultantId);

  // Filter commissions
  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = searchTerm === '' || 
      (commission.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       commission.entityName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search commissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {filteredCommissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {commissions.length === 0 ? 'No commission records yet' : 'No commissions match your filters'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCommissions.map(commission => (
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
                    <CommissionStatusBadge status={commission.status as 'pending' | 'approved' | 'paid' | 'disputed'} />
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
