import { Link } from 'react-router-dom';
import { Plus, Upload, Download, FolderKanban, Users, Briefcase, Target, Building, DollarSign } from 'lucide-react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/tables/DataTable';
import { ServiceStatsCard } from '@/components/recruitment-services/ServiceStatsCard';
import { createServiceProjectColumns } from '@/components/recruitment-services/ServiceProjectTableColumns';
import { getAllServiceProjects, getServiceStats } from '@/lib/recruitmentServiceStorage';
import { toast } from 'sonner';

export default function RecruitmentServices() {
  const projects = getAllServiceProjects();
  const stats = getServiceStats();

  const handleView = (id: string) => {
    toast.info('Project detail view coming soon!');
  };

  const handleEdit = (id: string) => {
    toast.info('Edit project coming soon!');
  };

  const handleViewTasks = (id: string) => {
    toast.info('Task management coming soon!');
  };

  const handleArchive = (id: string) => {
    toast.success('Project archived successfully!');
  };

  const columns = createServiceProjectColumns(
    handleView,
    handleEdit,
    handleViewTasks,
    handleArchive
  );

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Recruitment Services</h1>
            <p className="text-muted-foreground">Manage and track all recruitment service projects</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => toast.info('New service project coming soon!')}>
              <Plus className="mr-2 h-4 w-4" />
              New Service Project
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/recruitment-services">
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <ServiceStatsCard
            title="Active Projects"
            value={stats.totalActive}
            icon={FolderKanban}
            trend="up"
            change="+7"
          />
          
          <ServiceStatsCard
            title="Shortlisting"
            value={stats.byType.shortlisting}
            icon={Users}
          />

          <ServiceStatsCard
            title="Full-Service"
            value={stats.byType.fullService}
            icon={Briefcase}
          />

          <ServiceStatsCard
            title="Executive Search"
            value={stats.byType.executiveSearch}
            icon={Target}
          />

          <ServiceStatsCard
            title="RPO"
            value={stats.byType.rpo}
            icon={Building}
          />

          <ServiceStatsCard
            title="Service Revenue"
            value={`$${(stats.totalRevenue / 1000000).toFixed(1)}M`}
            icon={DollarSign}
            trend="up"
            change="+22%"
          />
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={projects}
          selectable
          searchable
          searchKeys={['name', 'clientName']}
          typeFilter
          typeOptions={[
            { label: 'Shortlisting', value: 'shortlisting' },
            { label: 'Full-Service', value: 'full-service' },
            { label: 'Executive Search', value: 'executive-search' },
            { label: 'RPO', value: 'rpo' }
          ]}
          typeKey="serviceType"
          statusFilter
          statusOptions={[
            { label: 'Active', value: 'active' },
            { label: 'On Hold', value: 'on-hold' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' }
          ]}
          statusKey="status"
          emptyMessage="No service projects found"
        />
      </div>
    </DashboardPageLayout>
  );
}
