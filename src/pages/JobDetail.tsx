import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { 
  ArrowLeft, 
  Edit, 
  Share2, 
  Archive, 
  MapPin, 
  Briefcase, 
  DollarSign,
  Calendar,
  Eye,
  Globe,
  MoreVertical
} from "lucide-react";
import { getJobById } from "@/lib/mockJobStorage";
import { mockJobActivities } from "@/data/mockJobsData";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { EmploymentTypeBadge } from "@/components/jobs/EmploymentTypeBadge";
import { ServiceTypeBadge } from "@/components/jobs/ServiceTypeBadge";
import { JobQuickStats } from "@/components/jobs/JobQuickStats";
import { JobActivityFeed } from "@/components/jobs/JobActivityFeed";
import { formatSalaryRange, formatExperienceLevel, formatRelativeDate } from "@/lib/jobUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormDrawer } from "@/components/ui/form-drawer";
import { JobWizard } from "@/components/jobs/JobWizard";
import { ExternalPromotionDialog } from "@/components/jobs/ExternalPromotionDialog";
import { Megaphone } from "lucide-react";

export default function JobDetail() {
  const { jobId } = useParams();
  const job = jobId ? getJobById(jobId) : null;
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!job) {
    return <Navigate to="/jobs" replace />;
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
    status: job.status === 'closed' || job.status === 'filled' || job.status === 'on-hold' ? 'draft' : job.status,
    jobBoardDistribution: job.jobBoardDistribution,
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/jobs">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            
            {/* Company Logo with 16:9 AspectRatio */}
            <div className="flex-shrink-0 w-[120px]">
              <div className="w-full aspect-[16/9] border border-gray-200 dark:border-gray-800 bg-card overflow-hidden shadow-sm">
                {job.employerLogo ? (
                  <img 
                    src={job.employerLogo}
                    alt={`${job.employerName} logo`}
                    className="h-full w-full object-contain p-2"
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        e.currentTarget.style.display = 'none';
                        const placeholder = document.createElement('div');
                        placeholder.className = 'h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5';
                        placeholder.innerHTML = `<span class="text-2xl font-bold text-primary">${job.employerName.substring(0, 2).toUpperCase()}</span>`;
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <span className="text-2xl font-bold text-primary">
                      {job.employerName.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold truncate">{job.title}</h1>
                <JobStatusBadge status={job.status} />
              </div>
              <p className="text-muted-foreground mb-4">{job.employerName}</p>
              <JobQuickStats 
                applicantsCount={job.applicantsCount}
                viewsCount={job.viewsCount}
                postingDate={job.postingDate}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEditJob}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applicants">
              Applicants
              {job.applicantsCount > 0 && (
                <Badge variant="secondary" className="ml-2">{job.applicantsCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Job Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Job Details</CardTitle>
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
                        <Badge variant="outline">
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
                        <Badge variant="outline">{job.visibility}</Badge>
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
                      <p className="text-sm text-muted-foreground mb-1">Job Code</p>
                      <p className="font-mono text-sm">{job.jobCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Posted</p>
                      <p className="text-sm">{formatRelativeDate(job.postingDate)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
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
                    <CardTitle>Requirements</CardTitle>
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
                    <CardTitle>Responsibilities</CardTitle>
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
                      <CardTitle>Job Board Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {job.jobBoardDistribution.map((board) => (
                          <Badge key={board} variant="secondary">{board}</Badge>
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
                    <CardTitle>Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <JobActivityFeed activities={activities} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Applicants Tab */}
          <TabsContent value="applicants">
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium mb-2">Applicant Pipeline</p>
                  <p className="text-sm">Applicant management will be available in Phase 2</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium mb-2">Job Analytics</p>
                  <p className="text-sm">Advanced analytics will be available in Phase 4</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {!job.hasJobTargetPromotion && (job.serviceType === 'self-managed' || job.serviceType === 'rpo') && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-primary" />
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
                <CardTitle>Job Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" onClick={handleEditJob} className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Job Details
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Job
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />
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
      </div>
    </DashboardPageLayout>
  );
}
