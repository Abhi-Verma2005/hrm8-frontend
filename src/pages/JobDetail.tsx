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
  MoreVertical,
  Building2,
  Users,
  Clock
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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

export default function JobDetail() {
  const { jobId } = useParams();
  const job = jobId ? getJobById(jobId) : null;
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
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
    requirements: job.requirements,
    responsibilities: job.responsibilities,
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
      <div className="space-y-0">
        {/* Enhanced Hero Banner Section */}
        <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-background border-b">
          <div className="p-6 pb-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              {/* Back button, Logo, and Title Section */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <Button variant="ghost" size="icon" asChild className="mt-1">
                  <Link to="/jobs">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                
                {/* Company Logo with 16:9 AspectRatio */}
                <div className="flex-shrink-0">
                  <AspectRatio ratio={16/9} className="w-[120px]">
                    <div className="h-full w-full rounded-lg border-2 border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {job.employerLogo ? (
                        <img 
                          src={job.employerLogo}
                          alt={job.employerName}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted">
                          <Building2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </AspectRatio>
                </div>
                
                {/* Title and Company Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <h1 className="text-4xl font-bold tracking-tight">{job.title}</h1>
                    <JobStatusBadge status={job.status} />
                  </div>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <p className="text-xl text-muted-foreground">{job.employerName}</p>
                    <Separator orientation="vertical" className="h-5" />
                    <span className="text-sm font-mono text-muted-foreground">{job.jobCode}</span>
                  </div>
                  
                  {/* Key Details as Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1.5">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5">
                      <Briefcase className="h-3 w-3" />
                      {job.workArrangement === 'on-site' ? 'On-site' : job.workArrangement === 'remote' ? 'Remote' : 'Hybrid'}
                    </Badge>
                    <EmploymentTypeBadge type={job.employmentType} />
                    {(job.salaryMin || job.salaryMax) && (
                      <Badge variant="secondary" className="gap-1.5">
                        <DollarSign className="h-3 w-3" />
                        {formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
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
            
            {/* Stats Row */}
            <div className="ml-[152px]">
              <JobQuickStats 
                applicantsCount={job.applicantsCount}
                viewsCount={job.viewsCount}
                postingDate={job.postingDate}
              />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">

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
                {/* Enhanced Job Details */}
                <Card className="border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-colors">
                  <CardHeader className="bg-muted/30">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      Job Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="p-2 rounded-md bg-primary/10 mt-0.5">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Location</p>
                          <p className="text-sm font-medium">{job.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="p-2 rounded-md bg-primary/10 mt-0.5">
                          <Briefcase className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Work Arrangement</p>
                          <Badge variant="outline">
                            {job.workArrangement === 'on-site' ? 'On-site' : job.workArrangement === 'remote' ? 'Remote' : 'Hybrid'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="p-2 rounded-md bg-primary/10 mt-0.5">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Employment Type</p>
                          <EmploymentTypeBadge type={job.employmentType} />
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="p-2 rounded-md bg-primary/10 mt-0.5">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Experience Level</p>
                          <p className="text-sm font-medium">{formatExperienceLevel(job.experienceLevel)}</p>
                        </div>
                      </div>
                      
                      {(job.salaryMin || job.salaryMax) && (
                        <div className="md:col-span-2 flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors">
                          <div className="p-2 rounded-md bg-primary/20 mt-0.5">
                            <DollarSign className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Compensation</p>
                            <p className="text-sm font-semibold mb-1">
                              {formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
                            </p>
                            {job.salaryDescription && (
                              <p className="text-sm text-muted-foreground italic">
                                {job.salaryDescription}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="p-2 rounded-md bg-primary/10 mt-0.5">
                          <Eye className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Visibility</p>
                          <Badge variant="outline">{job.visibility}</Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="p-2 rounded-md bg-primary/10 mt-0.5">
                          <Globe className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Service Type</p>
                          <div className="flex items-center gap-2">
                            <ServiceTypeBadge type={job.serviceType} />
                            {!job.serviceType || job.serviceType === 'self-managed' ? (
                              <span className="text-xs text-muted-foreground">Self-Managed</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Job Code</p>
                        <p className="font-mono text-sm font-medium">{job.jobCode}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Posted</p>
                        <p className="text-sm font-medium">{formatRelativeDate(job.postingDate)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Description */}
                <Card className="border-l-4 border-l-blue-500/20">
                  <CardHeader className="bg-blue-500/5">
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div 
                      className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-ul:text-foreground/90"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                  </CardContent>
                </Card>

                {/* Enhanced Requirements */}
                <Card className="border-l-4 border-l-green-500/20">
                  <CardHeader className="bg-green-500/5">
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                            <span className="text-green-600 text-sm font-bold">✓</span>
                          </span>
                          <span className="text-sm leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Enhanced Responsibilities */}
                <Card className="border-l-4 border-l-purple-500/20">
                  <CardHeader className="bg-purple-500/5">
                    <CardTitle>Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {job.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center mt-0.5">
                            <span className="text-purple-600 text-sm">→</span>
                          </span>
                          <span className="text-sm leading-relaxed">{resp}</span>
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
          <TabsContent value="settings">
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
        </div>

        <FormDrawer
          open={editDrawerOpen}
          onOpenChange={handleDrawerClose}
          title="Edit Job"
          description="Update the job posting details"
          width="xl"
        >
          <JobWizard
            key={refreshKey}
            jobId={jobId}
            defaultValues={editingJobData}
            onSuccess={handleJobSuccess}
            onCancel={handleDrawerClose}
            embedded
          />
        </FormDrawer>
      </div>
    </DashboardPageLayout>
  );
}
