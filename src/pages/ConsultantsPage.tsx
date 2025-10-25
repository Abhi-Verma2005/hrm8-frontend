import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, TrendingUp, DollarSign, Award } from 'lucide-react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/tables/DataTable';
import { TableFilters, ActiveFilter } from '@/components/tables/TableFilters';
import { TablePagination } from '@/components/tables/TablePagination';
import { ConsultantTableColumns } from '@/components/consultants/ConsultantTableColumns';
import { getAllConsultants, getConsultantStats } from '@/lib/consultantStorage';
import { formatRevenue } from '@/lib/consultantUtils';
import type { Consultant } from '@/types/consultant';

export default function ConsultantsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

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

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Consultants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">{stats.active} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Placements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlacements}</div>
              <p className="text-xs text-muted-foreground">Active consultants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatRevenue(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">From active team</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commissions Paid</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatRevenue(stats.totalCommissionsPaid)}</div>
              <p className="text-xs text-muted-foreground">{formatRevenue(stats.pendingCommissions)} pending</p>
            </CardContent>
          </Card>
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
                columns={ConsultantTableColumns}
                data={paginatedData}
                onRowClick={(consultant) => navigate(`/consultants/${consultant.id}`)}
              />

              <TablePagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredData.length / pageSize)}
                pageSize={pageSize}
                totalItems={filteredData.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
