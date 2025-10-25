import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Upload, Download, FolderKanban, Users, Briefcase, Target, Building, DollarSign, CheckCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Button } from '@/components/ui/button';
import { ServiceStatsCard } from '@/components/recruitment-services/ServiceStatsCard';
import { RecruitmentServicesFilterBar } from '@/components/recruitment-services/RecruitmentServicesFilterBar';
import { ServiceProjectCard } from '@/components/recruitment-services/ServiceProjectCard';
import { ServiceProjectListItem } from '@/components/recruitment-services/ServiceProjectListItem';
import { ViewToggle } from '@/components/recruitment-services/ViewToggle';
import { getAllServiceProjects, getServiceStats } from '@/lib/recruitmentServiceStorage';
import { toast } from 'sonner';

export default function RecruitmentServices() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('recruitment-services-view');
    return (saved === 'list' || saved === 'grid') ? saved : 'grid';
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const projects = getAllServiceProjects();

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon based on current state
  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) {
      return <ArrowUpDown className="h-3 w-3" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };
  const stats = getServiceStats();

  // Persist view preference
  useEffect(() => {
    localStorage.setItem('recruitment-services-view', viewMode);
  }, [viewMode]);

  const filteredProjects = useMemo(() => {
    let result = projects.filter(project => {
      const matchesSearch = searchTerm === '' ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = serviceTypeFilter === 'all' || project.serviceType === serviceTypeFilter;
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesCountry = countryFilter === 'all' || project.country === countryFilter;

      return matchesSearch && matchesType && matchesStatus && matchesCountry;
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        // Map sort keys to project properties
        switch (sortConfig.key) {
          case 'serviceType':
            aValue = a.serviceType;
            bValue = b.serviceType;
            break;
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'location':
            aValue = a.location;
            bValue = b.location;
            break;
          case 'country':
            aValue = a.country;
            bValue = b.country;
            break;
          case 'projectValue':
            aValue = a.projectValue;
            bValue = b.projectValue;
            break;
          case 'startDate':
            aValue = new Date(a.startDate).getTime();
            bValue = new Date(b.startDate).getTime();
            break;
          case 'progress':
            aValue = a.progress;
            bValue = b.progress;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          default:
            return 0;
        }

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [projects, searchTerm, serviceTypeFilter, statusFilter, countryFilter, sortConfig]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (serviceTypeFilter !== 'all') count++;
    if (statusFilter !== 'all') count++;
    if (countryFilter !== 'all') count++;
    return count;
  }, [searchTerm, serviceTypeFilter, statusFilter, countryFilter]);

  const handleClearFilters = () => {
    setServiceTypeFilter('all');
    setStatusFilter('all');
    setCountryFilter('all');
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
          countryFilter={countryFilter}
          onCountryChange={setCountryFilter}
          onClearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          <ViewToggle value={viewMode} onChange={setViewMode} />
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
        ) : viewMode === 'grid' ? (
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
        ) : (
          <div className="space-y-3">
            {/* Column Headers */}
        <div className="border-b bg-muted/40 px-4 py-2 rounded-t-lg">
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
              {/* Left Edge - Fixed Columns */}
              <div className="flex items-center gap-4 flex-shrink-0">
                {/* Service Type - Sortable */}
                <div className="w-[200px] flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('serviceType')}
                    className="h-6 px-2 -ml-2 hover:bg-muted"
                  >
                    Service Type
                    {getSortIcon('serviceType')}
                  </Button>
                </div>

                {/* Project & Client - Sortable */}
                <div className="w-[300px] flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('name')}
                    className="h-6 px-2 -ml-2 hover:bg-muted"
                  >
                    Project & Client
                    {getSortIcon('name')}
                  </Button>
                </div>

                {/* Team - Not sortable */}
                <div className="hidden xl:block w-[120px] flex-shrink-0">Team</div>

                {/* Location - Sortable */}
                <div className="hidden xl:block w-[150px] flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('location')}
                    className="h-6 px-2 -ml-2 hover:bg-muted"
                  >
                    Location
                    {getSortIcon('location')}
                  </Button>
                </div>

                {/* Service Fee - Sortable */}
                <div className="hidden lg:block w-[100px] flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('projectValue')}
                    className="h-6 px-2 -ml-2 hover:bg-muted"
                  >
                    Service Fee
                    {getSortIcon('projectValue')}
                  </Button>
                </div>

                {/* Post Date - Sortable */}
                <div className="hidden xl:block w-[120px] flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('startDate')}
                    className="h-6 px-2 -ml-2 hover:bg-muted"
                  >
                    Post Date
                    {getSortIcon('startDate')}
                  </Button>
                </div>
              </div>
              
              {/* Middle - Flexible Progress Column - Sortable */}
              <div className="hidden md:flex flex-1 min-w-[120px] max-w-[300px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('progress')}
                  className="h-6 px-2 -ml-2 hover:bg-muted"
                >
                  Progress
                  {getSortIcon('progress')}
                </Button>
              </div>
              
              {/* Right Edge - Fixed Columns */}
              <div className="flex items-center gap-4 flex-shrink-0">
                {/* Status - Sortable */}
                <div className="w-[100px] flex-shrink-0 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('status')}
                    className="h-6 px-2 -ml-2 hover:bg-muted"
                  >
                    Status
                    {getSortIcon('status')}
                  </Button>
                </div>

                {/* Actions - Not sortable */}
                <div className="w-[120px] flex-shrink-0 text-right">Actions</div>
              </div>
            </div>
        </div>
            
            {/* Project List Items */}
            {filteredProjects.map(project => (
              <ServiceProjectListItem
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
