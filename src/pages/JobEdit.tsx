import { useParams, Link, Navigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { JobWizard } from "@/components/jobs/JobWizard";
import { getJobById } from "@/lib/mockJobStorage";

export default function JobEdit() {
  const { jobId } = useParams();
  const job = jobId ? getJobById(jobId) : null;

  if (!job) {
    return <Navigate to="/jobs" replace />;
  }

  const defaultValues = {
    title: job.title,
    department: job.department,
    location: job.location,
    employmentType: job.employmentType,
    experienceLevel: job.experienceLevel,
    remoteOption: job.remoteOption,
    priority: job.priority,
    description: job.description,
    requirements: job.requirements,
    responsibilities: job.responsibilities,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: job.salaryCurrency,
    hideSalary: !job.salaryMin && !job.salaryMax,
    closeDate: job.closeDate,
    visibility: job.visibility,
    status: job.status === 'draft' ? 'draft' as const : 'open' as const,
    jobBoardDistribution: job.jobBoardDistribution,
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/jobs/${jobId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Job</h1>
            <p className="text-muted-foreground">{job.title}</p>
          </div>
        </div>
        <JobWizard defaultValues={defaultValues} jobId={jobId} />
      </div>
    </DashboardPageLayout>
  );
}
