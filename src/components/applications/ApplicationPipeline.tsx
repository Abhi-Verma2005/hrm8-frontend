import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Application, ApplicationStage } from "@/types/application";
import { ApplicationCard } from "./ApplicationCard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { updateApplicationStatus, getApplications } from "@/lib/mockApplicationStorage";
import { applicationService } from "@/lib/applicationService";
import { toast } from "sonner";
import { CandidateAssessmentView } from "../jobs/candidate-assessment/CandidateAssessmentView";

interface ApplicationPipelineProps {
  jobId?: string;
  jobTitle?: string;
  applications?: Application[];
  isCompareMode?: boolean;
  selectedForComparison?: string[];
  onToggleSelect?: (applicationId: string) => void;
}

const pipelineStages: { stage: ApplicationStage; label: string; color: string }[] = [
  { stage: "New Application", label: "New", color: "bg-blue-50 dark:bg-blue-950/30" },
  { stage: "Resume Review", label: "Screening", color: "bg-purple-50 dark:bg-purple-950/30" },
  { stage: "Phone Screen", label: "Phone Screen", color: "bg-amber-50 dark:bg-amber-950/30" },
  { stage: "Technical Interview", label: "Interview", color: "bg-cyan-50 dark:bg-cyan-950/30" },
  { stage: "Offer Extended", label: "Offer", color: "bg-green-50 dark:bg-green-950/30" },
  { stage: "Offer Accepted", label: "Hired", color: "bg-emerald-50 dark:bg-emerald-950/30" },
  { stage: "Rejected", label: "Rejected", color: "bg-red-50 dark:bg-red-950/30" },
];

export function ApplicationPipeline({ 
  jobId,
  jobTitle = "Position",
  applications: providedApplications,
  isCompareMode = false,
  selectedForComparison = [],
  onToggleSelect
}: ApplicationPipelineProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

  useEffect(() => {
    loadApplications();
  }, [jobId, providedApplications]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadApplications = async () => {
    if (providedApplications) {
      // Use provided filtered applications
      setApplications(providedApplications);
    } else if (jobId) {
      // Load from API if jobId is provided
      try {
        console.log('[ApplicationPipeline] Loading applications for jobId:', jobId);
        const response = await applicationService.getJobApplications(jobId);
        console.log('[ApplicationPipeline] API response:', response);
        const apiApplications = response.data?.applications || [];
        console.log('[ApplicationPipeline] Applications received:', apiApplications.length, apiApplications);
        // Map API applications to frontend Application type
        const mappedApplications: Application[] = apiApplications.map((app: any) => ({
          id: app.id,
          candidateId: app.candidateId,
          candidateName: app.candidate?.firstName && app.candidate?.lastName
            ? `${app.candidate.firstName} ${app.candidate.lastName}`
            : 'Unknown Candidate',
          candidateEmail: app.candidate?.email || '',
          candidatePhoto: app.candidate?.photo,
          jobId: app.jobId,
          jobTitle: app.job?.title || 'Unknown Job',
          employerName: app.job?.company?.name || 'Unknown Company',
          appliedDate: app.appliedDate ? new Date(app.appliedDate) : new Date(),
          status: mapApplicationStatus(app.status),
          stage: mapApplicationStage(app.stage),
          resumeUrl: app.resumeUrl,
          coverLetterUrl: app.coverLetterUrl,
          portfolioUrl: app.portfolioUrl,
          linkedInUrl: app.linkedInUrl,
          customAnswers: app.customAnswers || [],
          isRead: app.isRead,
          isNew: app.isNew,
          tags: app.tags || [],
          notes: [],
          activities: [],
          interviews: [],
          createdAt: app.createdAt ? new Date(app.createdAt) : new Date(),
          updatedAt: app.updatedAt ? new Date(app.updatedAt) : new Date(),
        }));
        setApplications(mappedApplications);
      } catch (error) {
        console.error('Failed to load applications:', error);
        // Fallback to mock data
        const allApps = getApplications();
        const filtered = allApps.filter(app => app.jobId === jobId);
        setApplications(filtered);
      }
    } else {
      // Fetch all from mock storage
      const allApps = getApplications();
      setApplications(allApps);
    }
  };

  // Map backend ApplicationStatus to frontend ApplicationStatus
  const mapApplicationStatus = (status: string): Application['status'] => {
    const statusMap: Record<string, Application['status']> = {
      'NEW': 'applied',
      'SCREENING': 'screening',
      'INTERVIEW': 'interview',
      'OFFER': 'offer',
      'HIRED': 'hired',
      'REJECTED': 'rejected',
      'WITHDRAWN': 'withdrawn',
    };
    return statusMap[status] || 'applied';
  };

  // Map backend ApplicationStage to frontend ApplicationStage
  const mapApplicationStage = (stage: string): ApplicationStage => {
    const stageMap: Record<string, ApplicationStage> = {
      'NEW_APPLICATION': 'New Application',
      'RESUME_REVIEW': 'Resume Review',
      'PHONE_SCREEN': 'Phone Screen',
      'TECHNICAL_INTERVIEW': 'Technical Interview',
      'ONSITE_INTERVIEW': 'Manager Interview',
      'OFFER_EXTENDED': 'Offer Extended',
      'OFFER_ACCEPTED': 'Offer Accepted',
      'REJECTED': 'Rejected',
    };
    return stageMap[stage] || 'New Application';
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const application = applications.find((app) => app.id === active.id);
      const targetStage = over.id as ApplicationStage;

      if (application && targetStage) {
        const statusMap: Record<ApplicationStage, Application['status']> = {
          "New Application": "applied",
          "Resume Review": "screening",
          "Phone Screen": "screening",
          "Technical Interview": "interview",
          "Manager Interview": "interview",
          "Final Round": "interview",
          "Reference Check": "interview",
          "Offer Extended": "offer",
          "Offer Accepted": "hired",
          "Rejected": "rejected",
          "Withdrawn": "withdrawn",
        };

        updateApplicationStatus(application.id, statusMap[targetStage], targetStage);
        loadApplications();
        
        // Auto-trigger AI interview notification for interview stages
        const interviewStages: ApplicationStage[] = ['Technical Interview', 'Manager Interview', 'Final Round'];
        if (interviewStages.includes(targetStage)) {
          // Dynamically import to check for existing interviews
          import('@/lib/aiInterview/aiInterviewStorage').then(({ getAIInterviewsByCandidate }) => {
            const existingInterviews = getAIInterviewsByCandidate(application.candidateId);
            const hasScheduledInterview = existingInterviews.some(
              i => i.jobId === application.jobId && (i.status === 'scheduled' || i.status === 'in-progress' || i.status === 'completed')
            );
            
            if (!hasScheduledInterview) {
              toast.success(`Moved to ${targetStage}`, {
                description: 'Consider scheduling an AI interview for automated screening'
              });
            } else {
              toast.success(`Moved to ${targetStage}`);
            }
          });
        } else {
          toast.success(`Moved to ${targetStage}`);
        }
      }
    }

    setActiveId(null);
  };

  const handleApplicationClick = (application: Application) => {
    setSelectedApplication(application);
    setDetailPanelOpen(true);
  };

  const handleNext = () => {
    if (!selectedApplication) return;
    const currentIndex = applications.findIndex(app => app.id === selectedApplication.id);
    if (currentIndex < applications.length - 1) {
      setSelectedApplication(applications[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (!selectedApplication) return;
    const currentIndex = applications.findIndex(app => app.id === selectedApplication.id);
    if (currentIndex > 0) {
      setSelectedApplication(applications[currentIndex - 1]);
    }
  };

  const currentIndex = selectedApplication 
    ? applications.findIndex(app => app.id === selectedApplication.id)
    : -1;
  const hasNext = currentIndex < applications.length - 1;
  const hasPrevious = currentIndex > 0;

  const activeApplication = activeId ? applications.find((app) => app.id === activeId) : null;

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto">
          {pipelineStages.map((stageConfig) => {
            const stageApplications = applications.filter((app) => app.stage === stageConfig.stage);
            return (
              <div key={stageConfig.stage} className="min-w-0">
                <Card className={`${stageConfig.color} border-2 h-full flex flex-col`}>
                  <div className="p-3 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3 flex-shrink-0">
                      <h3 className="font-semibold text-sm">{stageConfig.label}</h3>
                      <Badge variant="outline" className="text-xs h-6 px-2 rounded-full">
                        {stageApplications.length}
                      </Badge>
                    </div>
                    <SortableContext items={stageApplications.map((app) => app.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-1.5 flex-1 overflow-y-auto min-h-[150px]">
                        {stageApplications.map((application) => (
                          <ApplicationCard
                            key={application.id}
                            application={application}
                            onClick={() => handleApplicationClick(application)}
                            isCompareMode={isCompareMode}
                            isSelected={selectedForComparison.includes(application.id)}
                            onToggleSelect={onToggleSelect}
                          />
                        ))}
                        {stageApplications.length === 0 && (
                          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                            No applications
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeApplication && <ApplicationCard application={activeApplication} onClick={() => {}} />}
        </DragOverlay>
      </DndContext>

      {selectedApplication && (
        <CandidateAssessmentView
          application={selectedApplication}
          open={detailPanelOpen}
          onOpenChange={setDetailPanelOpen}
          jobTitle={jobTitle}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
        />
      )}
    </>
  );
}
