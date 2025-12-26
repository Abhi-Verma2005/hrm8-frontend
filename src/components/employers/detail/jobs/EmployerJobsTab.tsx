import { DataTable, Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { getEmployerJobs, getEmployerJobStats } from "@/lib/employerJobService";
import { Job } from "@/types/job";
import EmployerJobStatsCards from "./EmployerJobStatsCards";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { EmploymentTypeBadge } from "@/components/jobs/EmploymentTypeBadge";
import { formatDate } from "date-fns";

interface EmployerJobsTabProps {
  employerId: string;
}

export default function EmployerJobsTab({ employerId }: EmployerJobsTabProps) {
  const navigate = useNavigate();
  const jobs = getEmployerJobs(employerId);
  const stats = getEmployerJobStats(employerId);

  const columns: Column<Job>[] = [
    {
      key: "title",
      label: "Job Title",
      render: (job) => (
        <div>
          <div className="font-medium">{job.title}</div>
          <div className="text-sm text-muted-foreground">{job.location}</div>
        </div>
      ),
    },
    {
      key: "employmentType",
      label: "Type",
      render: (job) => <EmploymentTypeBadge type={job.employmentType} />,
    },
    {
      key: "status",
      label: "Status",
      render: (job) => <JobStatusBadge status={job.status} />,
    },
    {
      key: "applicantsCount",
      label: "Applicants",
      render: (job) => <span className="font-medium">{job.applicantsCount}</span>,
    },
    {
      key: "postingDate",
      label: "Posted",
      render: (job) => <span className="text-sm">{formatDate(job.postingDate, 'MMM d, yyyy')}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      width: "80px",
      render: (job) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/jobs/${job.id}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Job
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <EmployerJobStatsCards stats={stats} />
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All Jobs</h3>
        <Button onClick={() => navigate(`/jobs/create?employerId=${employerId}`)}>
          <Plus className="h-4 w-4 mr-2" />
          Post Job
        </Button>
      </div>

      <DataTable
        data={jobs}
        columns={columns}
        searchable
        searchKeys={["title", "location"]}
        emptyMessage="No jobs found"
      />
    </div>
  );
}
