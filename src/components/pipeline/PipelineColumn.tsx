import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { PipelineStage, PipelineCandidate } from "@/lib/pipelineService";
import { SortableCandidateCard } from "./SortableCandidateCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PipelineColumnProps {
  stage: PipelineStage;
  candidates: PipelineCandidate[];
  onPriorityChange: (candidateId: string, priority: 'high' | 'medium' | 'low') => void;
  onViewDetails: (candidate: PipelineCandidate) => void;
  onAIScore: (candidate: PipelineCandidate) => void;
}

export function PipelineColumn({
  stage,
  candidates,
  onPriorityChange,
  onViewDetails,
  onAIScore,
}: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  const candidateIds = candidates.map((c) => c.id);

  return (
    <div
      className={cn(
        "flex flex-col min-w-[320px] max-w-[320px] bg-muted/30 rounded-lg transition-all",
        isOver && "ring-2 ring-primary bg-primary/5"
      )}
    >
      {/* Column Header */}
      <div
        className="sticky top-0 z-10 bg-card border-b px-4 py-3 rounded-t-lg"
        style={{ borderTopColor: stage.color }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: stage.color }}
            />
            <h3 className="font-semibold text-sm">{stage.name}</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {candidates.length}
          </Badge>
        </div>
      </div>

      {/* Candidates List */}
      <div
        ref={setNodeRef}
        className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[200px] max-h-[calc(100vh-280px)]"
      >
        <SortableContext items={candidateIds} strategy={verticalListSortingStrategy}>
          {candidates.map((candidate) => (
            <SortableCandidateCard
              key={candidate.id}
              candidate={candidate}
              onPriorityChange={(priority) => onPriorityChange(candidate.id, priority)}
              onViewDetails={() => onViewDetails(candidate)}
              onAIScore={() => onAIScore(candidate)}
            />
          ))}
        </SortableContext>

        {candidates.length === 0 && (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            No candidates in this stage
          </div>
        )}
      </div>
    </div>
  );
}
