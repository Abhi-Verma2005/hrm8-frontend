import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, TrendingUp, DollarSign, Award } from 'lucide-react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/tables/DataTable';
import { TableFilters, ActiveFilter } from '@/components/tables/TableFilters';
import { createConsultantColumns } from '@/components/consultants/ConsultantTableColumns';
import { ConsultantStatsCard } from '@/components/consultants/ConsultantStatsCard';
import { getAllConsultants, getConsultantStats } from '@/lib/consultantStorage';
import { formatRevenue } from '@/lib/consultantUtils';
import type { Consultant } from '@/types/consultant';

export default function ConsultantsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const consultants = getAllConsultants();
  const stats = getConsultantStats();

  const filteredData = useMemo(() => {
    return consultants.filter(consultant => {
      const matchesSearch = searchQuery === '' || 
        consultant.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultant.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultant.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === 'all' || consultant.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || consultant.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [consultants, searchQuery, typeFilter, statusFilter]);

  const activeFilters: ActiveFilter[] = [
    ...(typeFilter !== 'all' ? [{ key: 'type', value: typeFilter, label: `Type: ${typeFilter}` }] : []),
    ...(statusFilter !== 'all' ? [{ key: 'status', value: statusFilter, label: `Status: ${statusFilter}` }] : []),
  ];

  const handleClearFilter = (key: string) => {
    if (key === 'type') setTypeFilter('all');
    if (key === 'status') setStatusFilter('all');
  };

  const handleClearAll = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Consultants</h1>
            <p className="text-muted-foreground">Manage your consultant team</p>
          </div>
          <Button onClick={() => navigate('/consultants/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Consultant
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ConsultantStatsCard
            title="Total Consultants"
            value={stats.total}
            icon={Users}
            description={`${stats.active} active`}
          />

          <ConsultantStatsCard
            title="Total Placements"
            value={stats.totalPlacements}
            icon={Award}
            description="Active consultants"
          />

          <ConsultantStatsCard
            title="Total Revenue"
            value={formatRevenue(stats.totalRevenue)}
            icon={TrendingUp}
            description="From active team"
          />

          <ConsultantStatsCard
            title="Commissions Paid"
            value={formatRevenue(stats.totalCommissionsPaid)}
            icon={DollarSign}
            description={`${formatRevenue(stats.pendingCommissions)} pending`}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Consultants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <TableFilters
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                typeFilter={typeFilter}
                onTypeFilterChange={setTypeFilter}
                typeOptions={[
                  { label: 'Sales Rep', value: 'sales-rep' },
                  { label: 'Recruiter', value: 'recruiter' },
                  { label: '360 Consultant', value: '360-consultant' },
                  { label: 'Industry Partner', value: 'industry-partner' },
                ]}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                statusOptions={[
                  { label: 'Active', value: 'active' },
                  { label: 'On Leave', value: 'on-leave' },
                  { label: 'Inactive', value: 'inactive' },
                  { label: 'Suspended', value: 'suspended' },
                ]}
                activeFilters={activeFilters}
                onClearFilter={handleClearFilter}
                onClearAll={handleClearAll}
              />

              <DataTable
                columns={createConsultantColumns()}
                data={filteredData}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
