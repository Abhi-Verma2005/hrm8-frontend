import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Application, ApplicationStage } from "@/types/application";
import { ApplicationCard } from "./ApplicationCard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { updateApplicationStatus, getApplications } from "@/lib/mockApplicationStorage";
import { toast } from "sonner";
import { ApplicationDetailPanel } from "./ApplicationDetailPanel";

interface ApplicationPipelineProps {
  jobId?: string;
  applications?: Application[];
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

export function ApplicationPipeline({ jobId, applications: providedApplications }: ApplicationPipelineProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

  useEffect(() => {
    loadApplications();
  }, [jobId, providedApplications]);

  const loadApplications = () => {
    if (providedApplications) {
      // Use provided filtered applications
      setApplications(providedApplications);
    } else {
      // Fetch and filter by jobId if provided
      const allApps = getApplications();
      const filtered = jobId ? allApps.filter(app => app.jobId === jobId) : allApps;
      setApplications(filtered);
    }
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
        toast.success(`Moved to ${targetStage}`);
      }
    }

    setActiveId(null);
  };

  const handleApplicationClick = (application: Application) => {
    setSelectedApplication(application);
    setDetailPanelOpen(true);
  };

  const activeApplication = activeId ? applications.find((app) => app.id === activeId) : null;

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipelineStages.map((stageConfig) => {
            const stageApplications = applications.filter((app) => app.stage === stageConfig.stage);
            return (
              <div key={stageConfig.stage} className="flex-shrink-0 w-80">
                <Card className={`${stageConfig.color} border-2`}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{stageConfig.label}</h3>
                      <Badge variant="secondary">{stageApplications.length}</Badge>
                    </div>
                    <SortableContext items={stageApplications.map((app) => app.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2 min-h-[200px]">
                        {stageApplications.map((application) => (
                          <ApplicationCard
                            key={application.id}
                            application={application}
                            onClick={() => handleApplicationClick(application)}
                          />
                        ))}
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

      <ApplicationDetailPanel
        application={selectedApplication}
        open={detailPanelOpen}
        onOpenChange={setDetailPanelOpen}
        onRefresh={loadApplications}
      />
    </>
  );
}
