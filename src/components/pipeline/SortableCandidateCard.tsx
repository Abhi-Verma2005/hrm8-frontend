import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CandidateCard } from "./CandidateCard";
import { PipelineCandidate } from "@/lib/pipelineService";

interface SortableCandidateCardProps {
  candidate: PipelineCandidate;
  onPriorityChange: (priority: 'high' | 'medium' | 'low') => void;
  onViewDetails: () => void;
  onAIScore: () => void;
}

export function SortableCandidateCard({
  candidate,
  onPriorityChange,
  onViewDetails,
  onAIScore,
}: SortableCandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: candidate.id,
    data: {
      type: 'candidate',
      candidate,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CandidateCard
        candidate={candidate}
        onPriorityChange={onPriorityChange}
        onViewDetails={onViewDetails}
        onAIScore={onAIScore}
        isDragging={isDragging}
      />
    </div>
  );
}
