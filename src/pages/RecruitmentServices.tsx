import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Upload, Download, FolderKanban, Users, Briefcase, Target, Building, DollarSign, CheckCircle } from 'lucide-react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Button } from '@/components/ui/button';
import { ServiceStatsCard } from '@/components/recruitment-services/ServiceStatsCard';
import { RecruitmentServicesFilterBar } from '@/components/recruitment-services/RecruitmentServicesFilterBar';
import { ServiceProjectCard } from '@/components/recruitment-services/ServiceProjectCard';
import { getAllServiceProjects, getServiceStats } from '@/lib/recruitmentServiceStorage';
import { toast } from 'sonner';

export default function RecruitmentServices() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const projects = getAllServiceProjects();
  const stats = getServiceStats();

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchTerm === '' ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = serviceTypeFilter === 'all' || project.serviceType === serviceTypeFilter;
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;

      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });
  }, [projects, searchTerm, serviceTypeFilter, statusFilter, priorityFilter]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (serviceTypeFilter !== 'all') count++;
    if (statusFilter !== 'all') count++;
    if (priorityFilter !== 'all') count++;
    return count;
  }, [searchTerm, serviceTypeFilter, statusFilter, priorityFilter]);

  const handleClearFilters = () => {
    setServiceTypeFilter('all');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSearchTerm('');
  };

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

        {/* Filter Bar */}
        <RecruitmentServicesFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          serviceTypeFilter={serviceTypeFilter}
          onServiceTypeChange={setServiceTypeFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          onClearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No service projects found</h3>
            <p className="text-muted-foreground mb-4">
              {activeFilterCount > 0 
                ? 'Try adjusting your filters or search term'
                : 'Get started by creating your first service project'
              }
            </p>
            {activeFilterCount > 0 ? (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            ) : (
              <Button onClick={() => toast.info('New service project coming soon!')}>
                <Plus className="mr-2 h-4 w-4" />
                New Service Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map(project => (
              <ServiceProjectCard
                key={project.id}
                project={project}
                onView={handleView}
                onEdit={handleEdit}
                onViewTasks={handleViewTasks}
                onArchive={handleArchive}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardPageLayout>
  );
}
