/**
 * Candidate Job Detail Page
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCandidateAuth } from '@/contexts/CandidateAuthContext';
import { jobService, PublicJob } from '@/lib/jobService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Clock, DollarSign, Building2, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { CandidatePageLayout } from '@/components/layouts/CandidatePageLayout';
import { AtsPageHeader } from '@/components/layouts/AtsPageHeader';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<PublicJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useCandidateAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadJob();
    }
  }, [id]);

  const loadJob = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await jobService.getPublicJobById(id);
      setJob(response.data?.job || null);
    } catch (error) {
      console.error('Failed to load job:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/candidate/login', { state: { from: `/candidate/jobs/${id}`, action: 'apply' } });
    } else {
      navigate(`/candidate/jobs/${id}/apply`);
    }
  };

  const formatSalary = (job: PublicJob) => {
    if (!job.salaryMin && !job.salaryMax) {
      return job.salaryDescription || 'Salary not specified';
    }
    const min = job.salaryMin?.toLocaleString();
    const max = job.salaryMax?.toLocaleString();
    return `${job.salaryCurrency} ${min}${max ? ` - ${max}` : '+'}`;
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
          <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/candidate/jobs')}>Browse Jobs</Button>
        </div>
      </div>
    );
  }

  return (
    <CandidatePageLayout>
      <div className="p-6 space-y-6">
        <AtsPageHeader
          title={job.title}
          subtitle={`${job.company.name} • ${job.location}`}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/candidate/jobs')}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </AtsPageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardDescription className="flex items-center gap-4 flex-wrap mt-2">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {job.company.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.employmentType.replace('_', ' ')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.postingDate
                          ? formatDistanceToNow(new Date(job.postingDate), { addSuffix: true })
                          : 'Recently'}
                      </span>
                    </CardDescription>
                  </div>
                  {job.featured && (
                    <Badge variant="outline" className="h-6 px-2 text-xs rounded-full bg-primary/10 text-primary border-primary/20 ml-4">
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {job.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Responsibilities */}
            {job.responsibilities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {job.promotionalTags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {job.promotionalTags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="h-6 px-2 text-xs rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Apply for this Job</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatSalary(job)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{job.employmentType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{job.workArrangement.replace('_', ' ')}</span>
                  </div>
                </div>
                <Button
                  onClick={handleApply}
                  className="w-full"
                  size="lg"
                >
                  Apply Now
                </Button>
                {!isAuthenticated && (
                  <p className="text-xs text-center text-muted-foreground">
                    You'll need to sign in or create an account to apply
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">About {job.company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn more about this company
                </p>
                {job.company.website && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(job.company.website, '_blank')}
                  >
                    Visit Website
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CandidatePageLayout>
  );
}

