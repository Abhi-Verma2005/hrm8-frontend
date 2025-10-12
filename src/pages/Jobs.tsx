import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Pencil, Copy, Trash2 } from "lucide-react";
import { DataTable, Column } from "@/components/tables/DataTable";
import { getJobs, deleteJob } from "@/lib/mockJobStorage";
import { Job } from "@/types/job";
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
import { toast } from "@/hooks/use-toast";
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

export default function Jobs() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Filter states
  const [searchValue, setSearchValue] = useState("");
  const [selectedConsultants, setSelectedConsultants] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedService, setSelectedService] = useState("all");

  const jobs = useMemo(() => getJobs(), [refreshKey]);

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

  // Helper function to extract country from location
  const extractCountry = (location: string): string => {
    if (location === 'Remote') return 'Remote';
    const parts = location.split(',').map(p => p.trim());
    return parts[parts.length - 1];
  };

  const uniqueCountries = useMemo(() => {
    const countries = new Set<string>();
    jobs.forEach(job => {
      const country = extractCountry(job.location);
      countries.add(country);
    });
    return Array.from(countries).sort();
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
      if (selectedConsultants.length > 0) {
        if (selectedConsultants.includes('my-jobs')) {
          // For demo purposes, we'll filter by createdBy
          // In a real app, this would check against the current user ID
          if (job.createdBy !== 'admin-1') return false;
        } else {
          const consultantName = job.assignedConsultantName || 'Unassigned';
          if (!selectedConsultants.includes(consultantName)) {
            return false;
          }
        }
      }

      // Country filter
      if (selectedCountry !== 'all') {
        const jobCountry = extractCountry(job.location);
        if (jobCountry !== selectedCountry) return false;
      }

      // Service filter
      if (selectedService !== 'all') {
        if (job.serviceType !== selectedService) return false;
      }

      return true;
    });
  }, [jobs, searchValue, selectedConsultants, selectedCountry, selectedService]);

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
          {job.remoteOption && (
            <Badge variant="outline" className="text-xs mt-1">Remote</Badge>
          )}
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
            <DropdownMenuItem asChild>
              <Link to={`/jobs/${job.id}/edit`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
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
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Jobs</h1>
            <p className="text-muted-foreground">Create and manage job postings</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/jobs/templates">
                View Templates
              </Link>
            </Button>
            <Button asChild>
              <Link to="/jobs/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Job
              </Link>
            </Button>
          </div>
        </div>

        <JobsFilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          selectedConsultants={selectedConsultants}
          onConsultantsChange={setSelectedConsultants}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          selectedService={selectedService}
          onServiceChange={setSelectedService}
          consultantOptions={uniqueConsultants}
          countryOptions={uniqueCountries}
          currentUserId="admin-1"
        />

        <DataTable
          data={filteredJobs}
          columns={columns}
          searchable={false}
          emptyMessage="No jobs found"
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
