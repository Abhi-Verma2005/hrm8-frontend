import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { AtsPageHeader } from "@/components/layouts/AtsPageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { applicationService, Application as RawApplication } from "@/lib/applicationService";
import { format } from "date-fns";
import { ApplicationStatusBadge } from "@/components/applications/ApplicationStatusBadge";
import { DetailSkeleton } from "@/components/skeletons/DetailSkeleton";

export default function ApplicationDetail() {
  const { id, jobId } = useParams<{ id: string; jobId?: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<RawApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await applicationService.getApplicationForAdmin(id);
        console.log('[ATS ApplicationDetail] getApplicationForAdmin response', res);

        if (!res.success) {
          setApplication(null);
          setError(res.error || "Unable to load application.");
          return;
        }

        setApplication(res.data?.application || null);
      } catch (e: any) {
        console.error("Failed to load application (admin)", e);
        setApplication(null);
        setError("Unable to load application.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

  const body = () => {
    if (isLoading) {
      return <DetailSkeleton />;
    }

    if (error || !application) {
      return (
        <div className="py-16 text-center space-y-4">
          <p className="text-muted-foreground">
            {error || "Application not found or no longer available."}
          </p>
        </div>
      );
    }

    const q = application.questionnaireData || {};
    const createdAt = application.appliedDate || application.createdAt;

    return (
      <div className="space-y-6">
        <AtsPageHeader
          title={`${q.jobMeta?.title || "Application"} – ${application.id.slice(0, 8)}`}
          subtitle={`Applied ${createdAt ? format(new Date(createdAt), "PPP p") : "Unknown date"}`}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-4">
              <ApplicationStatusBadge status={application.status} />
              {application.stage && (
                <Badge variant="outline" className="text-xs">
                  {application.stage}
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (jobId) {
                  navigate(`/jobs/${jobId}/applications`);
                } else {
                  navigate(-1);
                }
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </AtsPageHeader>

        <Card>
          <CardHeader>
            <CardTitle>Candidate</CardTitle>
            <CardDescription>
              {q.candidateName || "Unknown Candidate"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            {q.candidateEmail && (
              <p>
                <span className="font-medium">Email:</span>{" "}
                {q.candidateEmail}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents & Links</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>
              <span className="font-medium">Resume:</span>{" "}
              {application.resumeUrl ? "Uploaded (mock)" : "Not provided"}
            </p>
            <p>
              <span className="font-medium">Cover Letter:</span>{" "}
              {q.coverLetterMarkdown ? "Provided" : "Not provided"}
            </p>
            {application.portfolioUrl && (
              <p>
                <span className="font-medium">Portfolio:</span>{" "}
                "Uploaded (mock)"
              </p>
            )}
            {application.linkedInUrl && (
              <p>
                <span className="font-medium">LinkedIn:</span>{" "}
                <a
                  href={application.linkedInUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  {application.linkedInUrl}
                </a>
              </p>
            )}
            {application.websiteUrl && (
              <p>
                <span className="font-medium">Website:</span>{" "}
                <a
                  href={application.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  {application.websiteUrl}
                </a>
              </p>
            )}
          </CardContent>
        </Card>

        {q.coverLetterMarkdown && (
          <Card>
            <CardHeader>
              <CardTitle>Cover Letter</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-3 rounded-md">
                {q.coverLetterMarkdown}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <DashboardPageLayout>
      <div className="p-6">
        {body()}
      </div>
    </DashboardPageLayout>
  );
}


