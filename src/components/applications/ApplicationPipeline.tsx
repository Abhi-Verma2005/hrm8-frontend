import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Application, ApplicationStage } from "@/types/application";
import { ApplicationCard } from "./ApplicationCard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { updateApplicationStatus } from "@/lib/mockApplicationStorage";
import { toast } from "sonner";

interface ApplicationPipelineProps {
  applications: Application[];
  onApplicationClick: (application: Application) => void;
  onRefresh: () => void;
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

export function ApplicationPipeline({ applications, onApplicationClick, onRefresh }: ApplicationPipelineProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

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
        toast.success(`Moved ${application.candidateName} to ${targetStage}`);
        onRefresh();
      }
    }

    setActiveId(null);
  };

  const getApplicationsByStage = (stage: ApplicationStage) => {
    return applications.filter((app) => app.stage === stage);
  };

  const activeApplication = activeId ? applications.find((app) => app.id === activeId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineStages.map((column) => {
          const stageApplications = getApplicationsByStage(column.stage);
          return (
            <div key={column.stage} className="flex-shrink-0 w-80">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-sm">{column.label}</h3>
                <Badge variant="secondary">{stageApplications.length}</Badge>
              </div>

              <SortableContext
                id={column.stage}
                items={stageApplications.map((app) => app.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={`min-h-[600px] p-3 rounded-lg space-y-3 ${column.color}`}>
                  {stageApplications.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      onClick={() => onApplicationClick(application)}
                    />
                  ))}
                  {stageApplications.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No applications
                    </p>
                  )}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeApplication ? <ApplicationCard application={activeApplication} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
