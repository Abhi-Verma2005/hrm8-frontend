import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Upload, Download, FolderKanban, Users, Briefcase, Target, Building, DollarSign, FileText } from 'lucide-react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/tables/DataTable';
import { StatsCard } from '@/components/ui/stats-card';
import { createServiceProjectColumns } from '@/components/recruitment-services/ServiceProjectTableColumns';
import { getAllServiceProjects, getServiceStats, updateServiceProject } from '@/lib/recruitmentServiceStorage';
import { toast } from 'sonner';
import type { ServiceProject } from '@/types/recruitmentService';
import type { ServiceStats } from '@/types/recruitmentService';
import { useCurrencyFormat } from '@/contexts/CurrencyFormatContext';

export default function RecruitmentServices() {
  const { formatCurrency } = useCurrencyFormat();
  const [projects, setProjects] = useState<ServiceProject[]>([]);
  const [stats, setStats] = useState<ServiceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const projectsData = getAllServiceProjects();
      const statsData = getServiceStats();
      setProjects(projectsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load service projects:', err);
      toast.error('Failed to load service projects');
    } finally {
      setLoading(false);
    }
  }, []);

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
    try {
      const updated = updateServiceProject(id, { status: 'cancelled' });
      if (updated) {
        setProjects(projects.map(p => p.id === id ? { ...p, status: 'cancelled' } : p));
        toast.success('Project archived successfully!');
      } else {
        toast.error('Failed to archive project');
      }
    } catch (err) {
      console.error('Archive error:', err);
      toast.error('Failed to archive project');
    }
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
            <Button variant="outline" asChild>
              <Link to="/recruitment-services/rpo">
                <FileText className="mr-2 h-4 w-4" />
                RPO Dashboard
              </Link>
            </Button>
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
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : stats ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <StatsCard
              title="Active Projects"
              value={stats.totalActive}
              icon={FolderKanban}
              change="+7"
            />
            
            <StatsCard
              title="Shortlisting"
              value={stats.byType.shortlisting}
              icon={Users}
            />

            <StatsCard
              title="Full-Service"
              value={stats.byType.fullService}
              icon={Briefcase}
            />

            <StatsCard
              title="Executive Search"
              value={stats.byType.executiveSearch}
              icon={Target}
            />

            <StatsCard
              title="RPO"
              value={stats.byType.rpo}
              icon={Building}
            />

            <StatsCard
              title="Service Revenue"
              value={formatCurrency(stats.totalRevenue)}
              icon={DollarSign}
              change="+22%"
            />
          </div>
        ) : null}

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
