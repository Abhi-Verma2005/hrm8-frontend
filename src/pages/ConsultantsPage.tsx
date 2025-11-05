import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Users, TrendingUp, DollarSign, Award, Upload, Download, BarChart3 } from 'lucide-react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/tables/DataTable';
import { createConsultantColumns } from '@/components/consultants/ConsultantTableColumns';
import { StatsCard } from '@/components/ui/stats-card';
import { ConsultantsFilterBar } from '@/components/consultants/ConsultantsFilterBar';
import { getAllConsultants, getConsultantStats } from '@/lib/consultantStorage';
import { formatRevenue } from '@/lib/consultantUtils';
import type { Consultant } from '@/types/consultant';

export default function ConsultantsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const consultants = getAllConsultants();
  const stats = getConsultantStats();

  const filteredData = useMemo(() => {
    return consultants.filter(consultant => {
      const matchesSearch = searchTerm === '' || 
        consultant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || consultant.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || consultant.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [consultants, searchTerm, typeFilter, statusFilter]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (typeFilter !== 'all') count++;
    if (statusFilter !== 'all') count++;
    return count;
  }, [searchTerm, typeFilter, statusFilter]);

  const handleClearFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setSearchTerm('');
  };

  return (
    <DashboardPageLayout
      breadcrumbActions={
        <>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </>
      }
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Consultants</h1>
            <p className="text-muted-foreground">Manage your consultant team</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/consultants/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Consultant
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/consulting">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Consultants"
            value={stats.total}
            icon={Users}
            description={`${stats.active} active`}
          />

          <StatsCard
            title="Total Placements"
            value={stats.totalPlacements}
            icon={Award}
            description="Active consultants"
          />

          <StatsCard
            title="Total Revenue"
            value={formatRevenue(stats.totalRevenue)}
            icon={TrendingUp}
            description="From active team"
          />

          <StatsCard
            title="Commissions Paid"
            value={formatRevenue(stats.totalCommissionsPaid)}
            icon={DollarSign}
            description={`${formatRevenue(stats.pendingCommissions)} pending`}
          />
        </div>

        <ConsultantsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onClearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
        />

        <DataTable
          columns={createConsultantColumns()}
          data={filteredData}
          selectable
        />
      </div>
    </DashboardPageLayout>
  );
}
