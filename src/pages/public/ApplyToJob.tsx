import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Briefcase, DollarSign, Building2, CheckCircle } from "lucide-react";
import { PublicApplicationForm } from "@/components/public/PublicApplicationForm";
import { getJobById } from "@/lib/mockJobStorage";
import { Job } from "@/types/job";
import { formatSalaryRange } from "@/lib/jobUtils";

export default function ApplyToJob() {
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const [job, setJob] = useState<Job | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (jobId) {
      const foundJob = getJobById(jobId);
      if (foundJob) {
        setJob(foundJob);
      }
    }
  }, [jobId]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
              <p className="text-muted-foreground">
                Thank you for applying to {job?.title}. We've received your application and will review it shortly.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              You'll receive a confirmation email at the address you provided.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-12 pb-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
            <p className="text-muted-foreground">
              The job posting you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Job Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl">{job.title}</CardTitle>
                <CardDescription className="text-lg flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {job.employerId || "Company Name"}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {job.employmentType}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{job.location}</span>
                {job.workArrangement && (
                  <Badge variant="outline" className="ml-2">
                    {job.workArrangement}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{job.department}</span>
              </div>
              {(job.salaryMin || job.salaryMax) && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>{formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
                </div>
              )}
            </div>

            {job.description && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">About the Role</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Application Form */}
        <PublicApplicationForm 
          job={job} 
          onSuccess={() => setSubmitted(true)}
        />
      </div>
    </div>
  );
}
