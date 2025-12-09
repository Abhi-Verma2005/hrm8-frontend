import { useState, useEffect } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { AtsPageHeader } from "@/components/layouts/AtsPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  ArrowLeft,
  Edit,
  Share2,
  Archive,
  ArchiveRestore,
  Trash2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Eye,
  Globe,
  MoreVertical,
  Megaphone,
  Sparkles,
  Video,
  ArrowUpCircle,
  UserPlus
} from "lucide-react";
import { getJobById } from "@/lib/mockJobStorage";
import { mockJobActivities } from "@/data/mockJobsData";
import { Job } from "@/types/job";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { EmploymentTypeBadge } from "@/components/jobs/EmploymentTypeBadge";
import { ServiceTypeBadge } from "@/components/jobs/ServiceTypeBadge";
import { JobQuickStats } from "@/components/jobs/JobQuickStats";
import { DetailSkeleton } from "@/components/skeletons/DetailSkeleton";
import { JobActivityFeed } from "@/components/jobs/JobActivityFeed";
import { JobLifecycleActions } from "@/components/jobs/JobLifecycleActions";
import { formatSalaryRange, formatExperienceLevel, formatRelativeDate } from "@/lib/jobUtils";
import { ApplicationPipeline } from "@/components/applications/ApplicationPipeline";
import { JobApplicantsList } from "@/components/applications/JobApplicantsList";
import { AllApplicantsCard } from "@/components/applications/AllApplicantsCard";
import { InitialScreeningTab } from "@/components/applications/InitialScreeningTab";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormDrawer } from "@/components/ui/form-drawer";
import { JobWizard } from "@/components/jobs/JobWizard";
import { ExternalPromotionDialog } from "@/components/jobs/ExternalPromotionDialog";
import { JobAnalyticsDashboard } from "@/components/jobs/analytics/JobAnalyticsDashboard";
import { JobCollaborationPanel } from "@/components/jobs/collaboration/JobCollaborationPanel";
import { JobVersionHistory } from "@/components/jobs/history/JobVersionHistory";
import { JobBudgetTracker } from "@/components/jobs/budget/JobBudgetTracker";
import { CandidateMatchingPanel } from "@/components/jobs/matching/CandidateMatchingPanel";
import { JobAIInterviewsTab } from "@/components/jobs/aiInterview/JobAIInterviewsTab";
import { useToast } from "@/hooks/use-toast";
import { jobService } from "@/lib/api/jobService";
import { mapBackendJobToFrontend } from "@/lib/jobDataMapper";
import { UpgradeServiceDialog } from "@/components/jobs/UpgradeServiceDialog";
import { JobDetailPageSkeleton } from "@/components/jobs/JobDetailPageSkeleton";
import { JobBoardVisibilityControl } from "@/components/jobs/JobBoardVisibilityControl";
import { ArchiveJobDialog } from "@/components/jobs/ArchiveJobDialog";
import { DeleteJobDialog } from "@/components/jobs/DeleteJobDialog";
import { applicationService } from "@/lib/applicationService";
import { TalentPoolSearchDialog } from "@/components/applications/TalentPoolSearchDialog";

export default function JobDetail() {
  const { jobId } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [upgradeServiceDialogOpen, setUpgradeServiceDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isProcessingArchive, setIsProcessingArchive] = useState(false);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const [applicantsCount, setApplicantsCount] = useState<number | undefined>(undefined);
  const [talentPoolDialogOpen, setTalentPoolDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch job from API to get latest data
  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await jobService.getJobById(jobId);
        if (response.success && response.data) {
          const mappedJob = mapBackendJobToFrontend(response.data);
          setJob(mappedJob);
        } else {
          // If API fails, try to get from mock storage as fallback
          const mockJob = getJobById(jobId);
          if (mockJob) {
            setJob(mockJob);
          } else {
            toast({
              title: "Job not found",
              description: response.error || "The job you're looking for doesn't exist.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        // Try to get from mock storage as fallback
        const mockJob = jobId ? getJobById(jobId) : null;
        if (mockJob) {
          setJob(mockJob);
        } else {
          toast({
            title: "Error",
            description: "Failed to load job details",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, refreshKey, toast]);

  // Fetch applicant count from applications API so the All Applicants card shows real total
  useEffect(() => {
    const loadCount = async () => {
      if (!jobId) return;
      try {
        console.log('[JobDetail] Loading applicant count for jobId:', jobId);
        const res = await applicationService.getJobApplications(jobId);
        console.log('[JobDetail] Applicant count API response:', res);
        const list = res.data?.applications || [];
        console.log('[JobDetail] Applications found:', list.length, list);
        setApplicantsCount(list.length);
      } catch (err) {
        console.error("[JobDetail] Failed to load applicants count", err);
        setApplicantsCount(undefined);
      }
    };

    loadCount();
  }, [jobId, refreshKey]);

  const handleJobUpdate = async () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!job && !loading) {
    return <Navigate to="/jobs" replace />;
  }

  if (loading || !job) {
    return (
      <DashboardPageLayout>
        <JobDetailPageSkeleton />
      </DashboardPageLayout>
    );
  }

  const activities = mockJobActivities.filter(a => a.jobId === job.id);

  const handleEditJob = () => {
    setEditDrawerOpen(true);
  };

  const handleJobSuccess = () => {
    setEditDrawerOpen(false);
    setRefreshKey(prev => prev + 1);
    // Optionally reload job data or use the refreshKey to trigger re-render
  };

  const handleDrawerClose = () => {
    setEditDrawerOpen(false);
  };

  const handleArchive = async () => {
    if (!job) return;
    setIsProcessingArchive(true);
    try {
      const response = job.archived
        ? await jobService.unarchiveJob(job.id)
        : await jobService.archiveJob(job.id);

      if (response.success) {
        toast({
          title: job.archived ? "Job unarchived" : "Job archived",
          description: job.archived
            ? "The job has been restored to active listings."
            : "The job has been archived and hidden from active listings.",
        });
        handleJobUpdate();
        setArchiveDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.error || `Failed to ${job.archived ? 'unarchive' : 'archive'} job`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${job.archived ? 'unarchive' : 'archive'} job`,
        variant: "destructive",
      });
    } finally {
      setIsProcessingArchive(false);
    }
  };

  const handleDelete = async () => {
    if (!job) return;
    setIsProcessingDelete(true);
    try {
      const response = await jobService.deleteJob(job.id);
      if (response.success) {
        toast({
          title: "Job deleted",
          description: "The job posting has been permanently deleted.",
        });
        // Navigate back to jobs list after successful deletion
        navigate('/jobs');
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete job",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    } finally {
      setIsProcessingDelete(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleRevertVersion = (version: number) => {
    toast({
      title: "Version reverted",
      description: `Job reverted to version ${version}. Changes will be applied.`,
    });
    setRefreshKey(prev => prev + 1);
  };

  const editingJobData = {
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
    status: (job.status === 'open' ? 'open' : 'draft') as 'open' | 'draft',
    jobBoardDistribution: job.jobBoardDistribution,
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <AtsPageHeader
          title={job.title}
          subtitle={`${job.employerName}${job.department ? ` • ${job.department}` : ''} • ${job.location}`}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-4">
              <JobStatusBadge status={job.status} />
              {job.assignedConsultantName ? (
                <Badge variant="outline" className="h-6 px-2 text-xs rounded-full">
                  Consultant: {job.assignedConsultantName}
                </Badge>
              ) : (
                <ServiceTypeBadge type="self-managed" />
              )}
              {job.pipeline?.stage && (
                <Badge variant="outline" className="h-6 px-2 text-xs rounded-full">
                  Pipeline: {job.pipeline.stage.replace(/_/g, ' ')}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/jobs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <JobLifecycleActions
              job={job}
              onJobUpdate={handleJobUpdate}
              onEdit={handleEditJob}
            />
          </div>
        </AtsPageHeader>

        {/* Quick Stats */}
        <JobQuickStats
          applicantsCount={job.applicantsCount}
          viewsCount={job.viewsCount}
          postingDate={job.postingDate}
        />

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="overflow-x-auto -mx-1 px-1">
            <TabsList className="inline-flex w-auto gap-1 rounded-full border bg-muted/40 px-1 py-1 shadow-sm">
              <TabsTrigger
                value="overview"
                className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="applicants"
                className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Applicants
                {job.applicantsCount > 0 && (
                  <Badge variant="outline" className="h-5 px-1.5 text-xs rounded-full ml-1">{job.applicantsCount}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="screening"
                className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Initial Screening
              </TabsTrigger>
              <TabsTrigger 
                value="matching"
                className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
                Matching
              </TabsTrigger>
              <TabsTrigger
                value="ai-interviews"
                className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Video className="h-3.5 w-3.5 flex-shrink-0" />
                AI Interviews
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="collaboration"
                className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Collaboration
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                History
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Upgrade to Recruitment Service Banner for Self-Managed Jobs */}
            {job.serviceType === 'self-managed' && (job.status === 'open' || job.status === 'draft') && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ArrowUpCircle className="h-4 w-4 text-primary" />
                    Upgrade to HRM8 Recruitment Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Need additional support? Upgrade to one of our recruitment services to get expert help with candidate sourcing, screening, and hiring.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Professional candidate screening and evaluation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Dedicated recruitment consultant support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>End-to-end recruitment process management</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => setUpgradeServiceDialogOpen(true)}
                  >
                    <ArrowUpCircle className="h-4 w-4 mr-2" />
                    Upgrade to Recruitment Service
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Job Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Location:</span>
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Arrangement:</span>
                        <Badge variant="outline" className="h-6 px-2 text-xs rounded-full">
                          {job.workArrangement === 'on-site' ? 'On-site' : job.workArrangement === 'remote' ? 'Remote' : 'Hybrid'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Type:</span>
                        <EmploymentTypeBadge type={job.employmentType} />
                      </div>
                      {(job.salaryMin || job.salaryMax) && (
                        <div className="space-y-2 col-span-2">
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Salary:</span>
                            <span>{formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}</span>
                          </div>

                          {job.salaryDescription && (
                            <div className="ml-6 text-sm bg-primary/10 border border-primary/20 rounded-md px-3 py-2">
                              <p className="text-foreground italic">
                                💰 {job.salaryDescription}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Experience:</span>
                        <span>{formatExperienceLevel(job.experienceLevel)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Visibility:</span>
                        <Badge variant="outline" className="h-6 px-2 text-xs rounded-full capitalize">
                          {job.visibility}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Service:</span>
                        <ServiceTypeBadge type={job.serviceType} />
                        {!job.serviceType || job.serviceType === 'self-managed' ? (
                          <span className="text-muted-foreground">Self-Managed</span>
                        ) : null}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Job Code</p>
                      <p className="font-mono text-sm font-medium">{job.jobCode}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Posted</p>
                      <p className="text-sm font-medium">{formatRelativeDate(job.postingDate)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Description</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Responsibilities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Distribution */}
                {job.jobBoardDistribution.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">Job Board Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {job.jobBoardDistribution.map((board) => (
                          <Badge key={board} variant="outline" className="h-6 px-2 text-xs rounded-full">
                            {board}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Activity Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <JobActivityFeed activities={activities} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Applicants Tab */}
          <TabsContent value="applicants" className="mt-6 space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <AllApplicantsCard
                onClick={() => navigate(`/jobs/${job.id}/applications`)}
                count={applicantsCount ?? job.applicantsCount}
              />
              </div>
              <Button 
                onClick={() => setTalentPoolDialogOpen(true)}
                className="ml-4"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add from Talent Pool
              </Button>
            </div>

            {/* Kanban pipeline */}
            <ApplicationPipeline 
              jobId={job.id} 
              jobTitle={job.title}
              key={refreshKey}
            />
          </TabsContent>

          {/* Initial Screening Tab */}
          <TabsContent value="screening" className="mt-6">
            <InitialScreeningTab
              jobId={job.id}
              jobTitle={job.title}
              jobRequirements={job.requirements}
              jobDescription={job.description}
              job={job}
            />
          </TabsContent>

          {/* Matching Tab */}
          <TabsContent value="matching" className="mt-6">
            <CandidateMatchingPanel job={job} />
          </TabsContent>

          {/* AI Interviews Tab */}
          <TabsContent value="ai-interviews" className="mt-6">
            <JobAIInterviewsTab job={job} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <JobAnalyticsDashboard jobId={job.id} />
          </TabsContent>

          {/* Collaboration Tab */}
          <TabsContent value="collaboration" className="mt-6">
            <JobCollaborationPanel jobId={job.id} />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            <JobVersionHistory jobId={job.id} onRevert={handleRevertVersion} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6 space-y-6">
            {/* Job Board Visibility Control */}
            <JobBoardVisibilityControl job={job} onUpdate={handleJobUpdate} />
            <JobBudgetTracker jobId={job.id} />

            {!job.hasJobTargetPromotion && (job.serviceType === 'self-managed' || job.serviceType === 'rpo') && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-primary" />
                    Promote to External Job Boards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Maximize your job's reach by promoting it to 50M+ candidates across major job boards like Indeed, LinkedIn, and Glassdoor.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Get 3-5x more qualified applicants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Reduce time-to-hire with broader exposure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Flexible budget options starting from $500</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => setPromotionDialogOpen(true)}
                  >
                    <Megaphone className="h-4 w-4 mr-2" />
                    Promote to External Job Boards
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Job Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" onClick={handleEditJob} className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Job Details
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setArchiveDialogOpen(true)}
                >
                  {job.archived ? (
                    <>
                      <ArchiveRestore className="h-4 w-4 mr-2" />
                      Unarchive Job
                    </>
                  ) : (
                    <>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive Job
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Job
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <FormDrawer
          open={editDrawerOpen}
          onOpenChange={handleDrawerClose}
          title="Edit Job"
          description="Update the job posting details"
          width="2xl"
        >
          <JobWizard
            key={refreshKey}
            serviceType={job?.serviceType || 'self-managed'}
            jobId={jobId}
            defaultValues={editingJobData}
            onSuccess={handleJobSuccess}
            onCancel={handleDrawerClose}
            embedded
          />
        </FormDrawer>

        <ExternalPromotionDialog
          open={promotionDialogOpen}
          onOpenChange={setPromotionDialogOpen}
          job={job}
          onSuccess={() => {
            setRefreshKey(prev => prev + 1);
          }}
        />

        <UpgradeServiceDialog
          open={upgradeServiceDialogOpen}
          onServiceTypeSelect={async (serviceType) => {
            // Handle service upgrade - this will be implemented in the upgrade flow
            toast({
              title: "Service upgrade initiated",
              description: `Upgrade to ${serviceType === 'shortlisting' ? 'Shortlisting Service' : serviceType === 'full-service' ? 'Full Recruitment Service' : 'Executive Search'} has been initiated.`,
            });
            setUpgradeServiceDialogOpen(false);
            handleJobUpdate();
          }}
          onCancel={() => setUpgradeServiceDialogOpen(false)}
        />

        {/* Archive/Unarchive Dialog */}
        {job && (
          <ArchiveJobDialog
            open={archiveDialogOpen}
            onOpenChange={setArchiveDialogOpen}
            job={job}
            onConfirm={handleArchive}
            isProcessing={isProcessingArchive}
            isArchive={!job.archived}
          />
        )}

        {/* Delete Job Dialog */}
        {job && (
          <DeleteJobDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            job={job}
            onConfirm={handleDelete}
            isProcessing={isProcessingDelete}
          />
        )}

        {/* Talent Pool Search Dialog */}
        {job && (
          <TalentPoolSearchDialog
            open={talentPoolDialogOpen}
            onOpenChange={setTalentPoolDialogOpen}
            jobId={job.id}
            jobTitle={job.title}
            onCandidateAdded={() => {
              setRefreshKey(prev => prev + 1);
              // Refresh applicants count
              const loadCount = async () => {
                try {
                  const res = await applicationService.getJobApplications(job.id);
                  const list = res.data?.applications || [];
                  setApplicantsCount(list.length);
                } catch (err) {
                  console.error("[JobDetail] Failed to load applicants count", err);
                }
              };
              loadCount();
            }}
          />
        )}
      </div>
    </DashboardPageLayout>
  );
}
