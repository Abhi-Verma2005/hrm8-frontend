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
import { Users } from "lucide-react";
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

export default function Jobs() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const jobs = useMemo(() => getJobs(), [refreshKey]);

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
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{job.applicantsCount}</span>
        </div>
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

        <DataTable
          data={jobs}
          columns={columns}
          searchable
          searchKeys={['title', 'employerName', 'location', 'department']}
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
