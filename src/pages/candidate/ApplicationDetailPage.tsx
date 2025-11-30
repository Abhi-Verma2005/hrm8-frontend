/**
 * Candidate Application Detail Page
 * View a single submitted application
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { applicationService, Application } from '@/lib/applicationService';
import { CandidateAuthGuard } from '@/components/auth/CandidateAuthGuard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await applicationService.getApplication(id);
        setApplication(res.data?.application || null);
      } catch (e: any) {
        setError(e?.response?.data?.error || 'Unable to load application.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

  const renderStatus = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="default">New</Badge>;
      case 'SCREENING':
        return <Badge variant="secondary">Screening</Badge>;
      case 'INTERVIEW':
        return <Badge variant="outline">Interview</Badge>;
      case 'OFFER':
        return <Badge className="bg-green-500">Offer</Badge>;
      case 'HIRED':
        return <Badge className="bg-green-600">Hired</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'WITHDRAWN':
        return <Badge variant="outline">Withdrawn</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const content = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (error || !application) {
      return (
        <div className="py-16 text-center space-y-4">
          <p className="text-muted-foreground">
            {error || 'Application not found or you do not have access.'}
          </p>
          <Button variant="outline" onClick={() => navigate('/candidate/applications')}>
            Back to My Applications
          </Button>
        </div>
      );
    }

    const createdAt = application.appliedDate || application.createdAt;
    const q = application.questionnaireData || {};

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Application #{application.id.slice(0, 8)}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Applied{' '}
              {createdAt
                ? format(new Date(createdAt), 'PPP p')
                : 'Unknown date'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {renderStatus(application.status)}
            {application.stage && (
              <Badge variant="outline" className="text-xs">
                {application.stage.replace(/_/g, ' ')}
              </Badge>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job</CardTitle>
            <CardDescription>
              Job ID: <span className="font-mono">{application.jobId}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            {q.jobMeta?.title && (
              <p>
                <span className="font-medium">Title:</span> {q.jobMeta.title}
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
              <span className="font-medium">Resume:</span>{' '}
              {application.resumeUrl ? 'Uploaded (mock)' : 'Not provided'}
            </p>
            <p>
              <span className="font-medium">Cover Letter:</span>{' '}
              {q.coverLetterMarkdown ? 'Provided' : 'Not provided'}
            </p>
            {application.portfolioUrl && (
              <p>
                <span className="font-medium">Portfolio:</span> Uploaded (mock)
              </p>
            )}
            {application.linkedInUrl && (
              <p>
                <span className="font-medium">LinkedIn:</span>{' '}
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
                <span className="font-medium">Website:</span>{' '}
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
    <CandidateAuthGuard>
      <div className="p-6 space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => navigate('/candidate/applications')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to My Applications
        </Button>
        {content()}
      </div>
    </CandidateAuthGuard>
  );
}












