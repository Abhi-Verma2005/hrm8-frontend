import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Pencil, Copy, Trash2, Briefcase, FileText, Clock, CheckCircle, Download, Upload, Archive } from "lucide-react";
import { JobStatsCard } from "@/components/jobs/JobStatsCard";
import { DataTable, Column } from "@/components/tables/DataTable";
import { getJobs, deleteJob, getJobById } from "@/lib/mockJobStorage";
import { Job } from "@/types/job";
import { FormDrawer } from "@/components/ui/form-drawer";
import { JobWizard } from "@/components/jobs/JobWizard";
import { ServiceTypeSelectionDialog } from "@/components/jobs/ServiceTypeSelectionDialog";
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
import { JobsFilterBar } from "@/components/jobs/JobsFilterBar";
import { getCountryFromLocation, expandRegionsToCountries, REGION_COUNTRY_MAP, getRegionForCountry } from "@/lib/countryRegions";
import { JobPostingCostDialog } from "@/components/jobs/JobPostingCostDialog";

export default function Jobs() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [showJobPostingDialog, setShowJobPostingDialog] = useState(false);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<'self-managed' | 'shortlisting' | 'full-service' | 'executive-search' | 'rpo'>('self-managed');
  
  // Filter states
  const [searchValue, setSearchValue] = useState("");
  const [selectedConsultant, setSelectedConsultant] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedService, setSelectedService] = useState("all");

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
  
  // Auto-open job posting dialog when navigating with action=create
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setEditingJobId(null);
      setShowJobPostingDialog(true);
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
          // For demo purposes, we'll filter by createdBy
          // In a real app, this would check against the current user ID
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

      return true;
    });
  }, [jobs, searchValue, selectedConsultant, selectedLocation, selectedService]);

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
    setShowJobPostingDialog(true);
  };

  const handleJobPostingContinue = () => {
    setShowJobPostingDialog(false);
    setShowServiceDialog(true);
  };

  const handleJobPostingUpgrade = () => {
    setShowJobPostingDialog(false);
    toast({
      title: "Upgrade Options",
      description: "Contact us to upgrade your subscription plan.",
    });
  };

  const handleJobPostingCancel = () => {
    setShowJobPostingDialog(false);
  };

  const handleServiceTypeSelect = (serviceType: 'self-managed' | 'shortlisting' | 'full-service' | 'executive-search') => {
    setSelectedServiceType(serviceType);
    setShowServiceDialog(false);
    setDrawerOpen(true);
  };

  const handleServiceDialogCancel = () => {
    setShowServiceDialog(false);
  };

  const handleEditJob = (jobId: string) => {
    const job = getJobById(jobId);
    if (job) {
      setSelectedServiceType(job.serviceType as 'self-managed' | 'shortlisting' | 'full-service' | 'executive-search' | 'rpo');
    }
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
    setShowServiceDialog(false);
  };

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
            <Link to={`/jobs/${job.id}`} className="font-medium hover:text-primary transition-colors group-hover:text-primary">
              {job.title}
            </Link>
            <p className="text-sm text-muted-foreground truncate">{job.employerName}</p>
          </div>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      width: "15%",
      render: (job) => (
        <div>
          <p className="text-sm">{job.location}</p>
          <Badge variant="outline" className="text-xs mt-1">
            {job.workArrangement === 'on-site' ? 'On-site' : job.workArrangement === 'remote' ? 'Remote' : 'Hybrid'}
          </Badge>
        </div>
      )
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
          <Button onClick={handleCreateJob}>
            <Plus className="h-4 w-4 mr-2" />
            Create Job
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <JobStatsCard
            title="Total Jobs"
            value={stats.total}
            icon={Briefcase}
            description={`${stats.active} currently active`}
          />
          <JobStatsCard
            title="Active Postings"
            value={stats.active}
            icon={Clock}
            description={`${stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(0) : 0}% of total`}
          />
          <JobStatsCard
            title="Total Applicants"
            value={stats.applicants}
            icon={FileText}
            description={`Avg ${stats.avgApplicants} per job`}
          />
          <JobStatsCard
            title="Filled Positions"
            value={stats.filled}
            icon={CheckCircle}
            description="Successfully filled"
          />
        </div>

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

          <DataTable
            data={filteredJobs}
            columns={columns}
            searchable={false}
            selectable
            renderBulkActions={(selectedIds) => (
              <>
                <Button variant="outline" size="sm" onClick={() => {
                  toast({
                    title: "Bulk Edit",
                    description: `Edit ${selectedIds.length} job${selectedIds.length !== 1 ? 's' : ''}`,
                  });
                }}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Selected
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  toast({
                    title: "Jobs Archived",
                    description: `Archived ${selectedIds.length} job${selectedIds.length !== 1 ? 's' : ''}`,
                  });
                }}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive Selected
                </Button>
                <Button variant="destructive" size="sm" onClick={() => {
                  if (confirm(`Delete ${selectedIds.length} selected job${selectedIds.length !== 1 ? 's' : ''}?`)) {
                    selectedIds.forEach(id => deleteJob(id));
                    toast({
                      title: "Jobs Deleted",
                      description: `Deleted ${selectedIds.length} job${selectedIds.length !== 1 ? 's' : ''}`,
                    });
                    window.location.reload();
                  }
                }}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
              </>
            )}
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
            serviceType={selectedServiceType}
            jobId={editingJobId || undefined}
            defaultValues={editingJobData || undefined}
            onSuccess={handleJobSuccess}
            onCancel={handleDrawerClose}
            embedded
          />
        </FormDrawer>

      <JobPostingCostDialog
        open={showJobPostingDialog}
        employerId="1"
        onContinue={handleJobPostingContinue}
        onUpgrade={handleJobPostingUpgrade}
        onCancel={handleJobPostingCancel}
      />

      <ServiceTypeSelectionDialog 
        open={showServiceDialog}
        onServiceTypeSelect={handleServiceTypeSelect}
        onCancel={handleServiceDialogCancel}
      />

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
      </div>
    </DashboardPageLayout>
  );
}
