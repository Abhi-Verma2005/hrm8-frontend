import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Pencil, Copy, Trash2, Briefcase, FileText, Clock, CheckCircle, Download, Upload, Archive, BarChart3, Filter, X, Zap } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { DataTable, Column } from "@/components/tables/DataTable";
import { getJobs, deleteJob, getJobById } from "@/lib/mockJobStorage";
import { Job } from "@/types/job";
import { FormDrawer } from "@/components/ui/form-drawer";
import { JobWizard } from "@/components/jobs/JobWizard";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { EmploymentTypeBadge } from "@/components/jobs/EmploymentTypeBadge";
import { ServiceTypeBadge } from "@/components/jobs/ServiceTypeBadge";
import { EntityAvatar } from "@/components/tables/EntityAvatar";
import { formatRelativeDate } from "@/lib/jobUtils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { JobsFilterBar } from "@/components/jobs/JobsFilterBar";
import { getCountryFromLocation, expandRegionsToCountries, REGION_COUNTRY_MAP, getRegionForCountry } from "@/lib/countryRegions";

import { AdvancedFilterBuilder } from "@/components/jobs/filters/AdvancedFilterBuilder";
import { SavedFiltersPanel } from "@/components/jobs/filters/SavedFiltersPanel";
import { BulkActionsToolbar } from "@/components/jobs/bulk/BulkActionsToolbar";
import { FilterCriteria, SavedFilter } from "@/lib/savedFiltersService";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function Jobs() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  
  // Filter states
  const [searchValue, setSearchValue] = useState("");
  const [selectedConsultant, setSelectedConsultant] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  
  // Advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterCriteria>({});
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  const jobs = useMemo(() => getJobs(), [refreshKey]);

  // Calculate stats
  const stats = useMemo(() => {
    const activeJobs = jobs.filter(j => j.status === 'open').length;
    const totalApplicants = jobs.reduce((sum, j) => sum + j.applicantsCount, 0);
    const avgApplicants = jobs.length > 0 ? Math.round(totalApplicants / jobs.length) : 0;
    const filledJobs = jobs.filter(j => j.status === 'filled').length;

    return {
      total: jobs.length,
      active: activeJobs,
      applicants: totalApplicants,
      filled: filledJobs,
      avgApplicants,
    };
  }, [jobs]);
  
  // Auto-open job wizard when navigating with action=create
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setEditingJobId(null);
      setDrawerOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Extract unique consultants and countries
  const uniqueConsultants = useMemo(() => {
    const consultants = new Set<string>();
    jobs.forEach(job => {
      if (job.assignedConsultantName) {
        consultants.add(job.assignedConsultantName);
      }
    });
    return ['Unassigned', ...Array.from(consultants).sort()];
  }, [jobs]);

  // Generate location options grouped by region
  const locationOptions = useMemo(() => {
    // Get all unique countries from jobs
    const jobCountries = new Set<string>();
    jobs.forEach(job => {
      const country = getCountryFromLocation(job.location);
      jobCountries.add(country);
    });
    
    // Group countries by region
    const optionsByRegion: Record<string, string[]> = {
      'Americas': [],
      'Europe': [],
      'APAC': [],
      'Middle East & Africa': [],
      'Global': []
    };
    
    jobCountries.forEach(country => {
      const region = getRegionForCountry(country);
      if (region && optionsByRegion[region]) {
        optionsByRegion[region].push(country);
      }
    });
    
    // Build hierarchical structure
    return Object.entries(optionsByRegion)
      .filter(([_, countries]) => countries.length > 0)
      .map(([region, countries]) => ({
        region,
        countries: countries.sort()
      }));
  }, [jobs]);

  // Apply all filters
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search filter
      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        const searchFields = [
          job.title,
          job.employerName,
          job.location,
          job.department,
        ];
        if (!searchFields.some(field => field.toLowerCase().includes(searchLower))) {
          return false;
        }
      }

      // Consultant filter
      if (selectedConsultant !== 'all') {
        if (selectedConsultant === 'my-jobs') {
          if (job.createdBy !== 'admin-1') return false;
        } else {
          const consultantName = job.assignedConsultantName || 'Unassigned';
          if (consultantName !== selectedConsultant) return false;
        }
      }

      // Location filter
      if (selectedLocation !== 'all') {
        const jobCountry = getCountryFromLocation(job.location);
        if (jobCountry !== selectedLocation) return false;
      }

      // Service filter
      if (selectedService !== 'all') {
        if (job.serviceType !== selectedService) return false;
      }

      // Advanced filters
      if (advancedFilters.status && advancedFilters.status.length > 0) {
        if (!advancedFilters.status.includes(job.status)) return false;
      }

      if (advancedFilters.department && advancedFilters.department.length > 0) {
        if (!advancedFilters.department.includes(job.department)) return false;
      }

      if (advancedFilters.employmentType && advancedFilters.employmentType.length > 0) {
        if (!advancedFilters.employmentType.includes(job.employmentType)) return false;
      }

      if (advancedFilters.experienceLevel && advancedFilters.experienceLevel.length > 0) {
        if (!advancedFilters.experienceLevel.includes(job.experienceLevel)) return false;
      }

      if (advancedFilters.salaryRange) {
        if (advancedFilters.salaryRange.min && job.salaryMax && job.salaryMax < advancedFilters.salaryRange.min) return false;
        if (advancedFilters.salaryRange.max && job.salaryMin && job.salaryMin > advancedFilters.salaryRange.max) return false;
      }

      if (advancedFilters.applicantRange) {
        if (advancedFilters.applicantRange.min && job.applicantsCount < advancedFilters.applicantRange.min) return false;
        if (advancedFilters.applicantRange.max && job.applicantsCount > advancedFilters.applicantRange.max) return false;
      }

      return true;
    });
  }, [jobs, searchValue, selectedConsultant, selectedLocation, selectedService, advancedFilters]);

  const handleDelete = (id: string) => {
    setJobToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (jobToDelete) {
      deleteJob(jobToDelete);
      toast({
        title: "Job Deleted",
        description: "The job posting has been removed.",
      });
      setRefreshKey(prev => prev + 1);
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const handleCreateJob = () => {
    setEditingJobId(null);
    setDrawerOpen(true);
  };

  const handleEditJob = (jobId: string) => {
    setEditingJobId(jobId);
    setDrawerOpen(true);
  };

  const handleJobSuccess = () => {
    setDrawerOpen(false);
    setEditingJobId(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditingJobId(null);
  };

  const handleApplyAdvancedFilters = (filters: FilterCriteria) => {
    setAdvancedFilters(filters);
    setShowAdvancedFilters(false);
  };

  const handleSelectSavedFilter = (filter: SavedFilter) => {
    setAdvancedFilters(filter.filters);
    setShowSavedFilters(false);
    toast({
      title: "Filter applied",
      description: `"${filter.name}" filter has been applied.`,
    });
  };

  const handleBulkAction = (action: string) => {
    if (action.startsWith('status:')) {
      const status = action.split(':')[1];
      toast({
        title: "Status updated",
        description: `${selectedJobs.length} job(s) status changed to ${status}.`,
      });
    } else if (action.startsWith('assign:')) {
      const consultant = action.split(':')[1];
      toast({
        title: "Consultant assigned",
        description: `${selectedJobs.length} job(s) assigned to ${consultant}.`,
      });
    } else if (action === 'archive') {
      toast({
        title: "Jobs archived",
        description: `${selectedJobs.length} job(s) have been archived.`,
      });
    } else if (action === 'delete') {
      setShowBulkDeleteDialog(true);
    }
  };

  const confirmBulkDelete = async () => {
    setIsDeletingBulk(true);
    try {
      selectedJobs.forEach(id => deleteJob(id));
      toast({
        title: "Jobs deleted",
        description: `${selectedJobs.length} job(s) have been deleted.`,
      });
      setSelectedJobs([]);
      setRefreshKey(prev => prev + 1);
    } finally {
      setIsDeletingBulk(false);
      setShowBulkDeleteDialog(false);
    }
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (advancedFilters.status?.length) count++;
    if (advancedFilters.department?.length) count++;
    if (advancedFilters.employmentType?.length) count++;
    if (advancedFilters.experienceLevel?.length) count++;
    if (advancedFilters.salaryRange?.min || advancedFilters.salaryRange?.max) count++;
    if (advancedFilters.applicantRange?.min || advancedFilters.applicantRange?.max) count++;
    return count;
  }, [advancedFilters]);

  const editingJobData = editingJobId ? (() => {
    const job = getJobById(editingJobId);
    if (!job) return null;
    // Convert Job to JobFormData (only include form fields)
    return {
      serviceType: job.serviceType,
      postAsHRM8: job.employerId === "hrm8-platform",
      employerId: job.employerId,
      title: job.title,
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel,
      workArrangement: job.workArrangement,
      tags: job.tags,
      description: job.description,
      requirements: job.requirements.map((text, index) => ({
        id: `req-${Date.now()}-${index}`,
        text,
        order: index + 1,
      })),
      responsibilities: job.responsibilities.map((text, index) => ({
        id: `resp-${Date.now()}-${index}`,
        text,
        order: index + 1,
      })),
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      salaryCurrency: job.salaryCurrency,
      salaryPeriod: job.salaryPeriod || 'annual',
      salaryDescription: job.salaryDescription,
      hideSalary: false,
      closeDate: job.closeDate,
      visibility: job.visibility,
      stealth: job.stealth,
      hiringTeam: job.hiringTeam || [],
      applicationForm: job.applicationForm || {
        id: `form-${Date.now()}`,
        name: "Application Form",
        questions: [],
        includeStandardFields: {
          resume: { included: true, required: true },
          coverLetter: { included: false, required: false },
          portfolio: { included: false, required: false },
          linkedIn: { included: false, required: false },
          website: { included: false, required: false },
        },
      },
      status: job.status === 'closed' || job.status === 'filled' || job.status === 'on-hold' ? 'draft' : job.status,
      jobBoardDistribution: job.jobBoardDistribution,
    };
  })() : null;

  const columns: Column<Job>[] = [
    {
      key: 'name',
      label: 'Job Title',
      sortable: true,
      width: "35%",
      render: (job) => (
        <div className="flex items-center gap-3">
          <EntityAvatar
            name={job.employerName}
            src={job.employerLogo}
            type="logo"
          />
          <div className="min-w-0 flex-1">
            <Link 
              to={`/jobs/${job.id}`} 
              className="font-semibold text-base hover:underline cursor-pointer line-clamp-1 block"
            >
              {job.title}
            </Link>
            <Link
              to={`/employers/${job.employerId}`}
              className="text-sm text-muted-foreground hover:text-foreground hover:underline line-clamp-1 block transition-colors"
            >
              {job.employerName}
            </Link>
          </div>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      width: "15%",
      render: (job) => {
        if (job.location.toLowerCase() === 'remote') {
          return (
            <div className="text-sm">
              <p className="font-medium">Remote</p>
              {job.country && (
                <p className="text-xs text-muted-foreground">{job.country}</p>
              )}
              <Badge variant="outline" className="text-xs mt-1">
                {job.workArrangement === 'on-site' ? 'On-site' : job.workArrangement === 'remote' ? 'Remote' : 'Hybrid'}
              </Badge>
            </div>
          );
        }
        
        return (
          <div>
            <div className="text-sm">
              <p className="font-medium">{job.location}</p>
              {job.country && (
                <p className="text-xs text-muted-foreground">{job.country}</p>
              )}
            </div>
            <Badge variant="outline" className="text-xs mt-1">
              {job.workArrangement === 'on-site' ? 'On-site' : job.workArrangement === 'remote' ? 'Remote' : 'Hybrid'}
            </Badge>
          </div>
        );
      }
    },
    {
      key: 'employmentType',
      label: 'Type',
      sortable: true,
      width: "12%",
      render: (job) => <EmploymentTypeBadge type={job.employmentType} />
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: "10%",
      render: (job) => <JobStatusBadge status={job.status} />
    },
    {
      key: 'applicants',
      label: 'Applicants',
      sortable: true,
      width: "10%",
      render: (job) => (
        <Link 
          to={`/jobs/${job.id}?tab=applicants`}
          className="flex items-center gap-2 group"
        >
          <span className="font-medium group-hover:text-primary transition-colors">
            {job.applicantsCount}
          </span>
          {job.unreadApplicants && job.unreadApplicants > 0 && (
            <span className="text-xs text-muted-foreground/70">
              {job.unreadApplicants} unread
            </span>
          )}
        </Link>
      )
    },
    {
      key: 'serviceType',
      label: 'Service',
      width: "12%",
      render: (job) => <ServiceTypeBadge type={job.serviceType} />
    },
    {
      key: 'postedDate',
      label: 'Posted',
      sortable: true,
      width: "10%",
      render: (job) => (
        <span className="text-sm text-muted-foreground">
          {formatRelativeDate(job.postingDate)}
        </span>
      )
    },
    {
      key: 'actions',
      label: '',
      width: "60px",
      render: (job) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditJob(job.id)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => handleDelete(job.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  ];

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
            <h1 className="text-3xl font-bold">Jobs</h1>
            <p className="text-muted-foreground">Create and manage job postings</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowSavedFilters(!showSavedFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Saved Filters
            </Button>
            <Button variant="outline" asChild>
              <Link to="/jobs/templates">
                <FileText className="h-4 w-4 mr-2" />
                Templates
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/jobs/automation">
                <Zap className="h-4 w-4 mr-2" />
                Automation
              </Link>
            </Button>
            <Button onClick={handleCreateJob}>
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/jobs">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Jobs"
            value={stats.total}
            icon={Briefcase}
            description={`${stats.active} currently active`}
          />
          <StatsCard
            title="Active Postings"
            value={stats.active}
            icon={Clock}
            description={`${stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(0) : 0}% of total`}
          />
          <StatsCard
            title="Total Applicants"
            value={stats.applicants}
            icon={FileText}
            description={`Avg ${stats.avgApplicants} per job`}
          />
          <StatsCard
            title="Filled Positions"
            value={stats.filled}
            icon={CheckCircle}
            description="Successfully filled"
          />
        </div>

        {showSavedFilters && (
          <SavedFiltersPanel onSelectFilter={handleSelectSavedFilter} />
        )}

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <JobsFilterBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              selectedConsultants={selectedConsultant === 'all' ? [] : [selectedConsultant]}
              onConsultantsChange={(consultants) => setSelectedConsultant(consultants[0] || 'all')}
              selectedLocations={selectedLocation === 'all' ? [] : [selectedLocation]}
              onLocationsChange={(locations) => setSelectedLocation(locations[0] || 'all')}
              selectedService={selectedService}
              onServiceChange={setSelectedService}
              consultantOptions={uniqueConsultants}
              locationOptions={locationOptions}
              currentUserId="admin-1"
            />
          </div>
          <Button
            variant={showAdvancedFilters ? "default" : "outline"}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="shrink-0"
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
          <CollapsibleContent>
            <AdvancedFilterBuilder
              onApply={handleApplyAdvancedFilters}
              initialFilters={advancedFilters}
            />
          </CollapsibleContent>
        </Collapsible>

        {selectedJobs.length > 0 && (
          <BulkActionsToolbar
            selectedCount={selectedJobs.length}
            onClearSelection={() => setSelectedJobs([])}
            onBulkAction={handleBulkAction}
          />
        )}

        <DataTable
          data={filteredJobs}
          columns={columns}
          searchable={false}
          selectable
          onSelectedRowsChange={setSelectedJobs}
          emptyMessage="No jobs found"
        />

        <FormDrawer
          open={drawerOpen}
          onOpenChange={handleDrawerClose}
          title={editingJobId ? "Edit Job" : "Create Job"}
          description={editingJobId ? "Update the job posting details" : "Fill in the details to create a new job posting"}
          width="2xl"
        >
          <JobWizard
            key={editingJobId || 'new'}
            jobId={editingJobId || undefined}
            defaultValues={editingJobData || undefined}
            onSuccess={handleJobSuccess}
            onCancel={handleDrawerClose}
            embedded
          />
        </FormDrawer>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the job posting and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DeleteConfirmationDialog
          open={showBulkDeleteDialog}
          onOpenChange={setShowBulkDeleteDialog}
          onConfirm={confirmBulkDelete}
          title="Delete Jobs"
          description={`Are you sure you want to delete ${selectedJobs.length} job(s)? This action cannot be undone.`}
          isDeleting={isDeletingBulk}
        />
      </div>
    </DashboardPageLayout>
  );
}
