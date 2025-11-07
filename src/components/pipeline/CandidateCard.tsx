import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PipelineCandidate } from "@/lib/pipelineService";
import {
  Mail,
  Phone,
  MoreVertical,
  Calendar,
  Star,
  FileText,
  Trash2,
  Flag,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  candidate: PipelineCandidate;
  onPriorityChange?: (priority: 'high' | 'medium' | 'low') => void;
  onViewDetails?: () => void;
  onAIScore?: () => void;
  isDragging?: boolean;
}

export function CandidateCard({
  candidate,
  onPriorityChange,
  onViewDetails,
  onAIScore,
  isDragging,
}: CandidateCardProps) {
  const initials = candidate.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const priorityColors = {
    high: 'text-red-600 bg-red-50 dark:bg-red-950/20',
    medium: 'text-orange-600 bg-orange-50 dark:bg-orange-950/20',
    low: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20',
  };

  return (
    <div
      className={cn(
        "group bg-card border rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary",
        "animate-fade-in"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{candidate.name}</h4>
          <p className="text-xs text-muted-foreground truncate">{candidate.jobTitle}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onViewDetails}>
              <FileText className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAIScore}>
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              AI Score
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onPriorityChange?.('high')}>
              <Flag className="h-4 w-4 mr-2 text-red-600" />
              High Priority
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange?.('medium')}>
              <Flag className="h-4 w-4 mr-2 text-orange-600" />
              Medium Priority
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange?.('low')}>
              <Flag className="h-4 w-4 mr-2 text-blue-600" />
              Low Priority
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Match Score */}
      {candidate.matchScore && (
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-medium">{candidate.matchScore}% match</span>
        </div>
      )}

      {/* Tags */}
      {candidate.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {candidate.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
              {tag}
            </Badge>
          ))}
          {candidate.tags.length > 3 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              +{candidate.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Contact Info */}
      <div className="space-y-1 mb-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Mail className="h-3 w-3" />
          <span className="truncate">{candidate.email}</span>
        </div>
        {candidate.phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3" />
            <span>{candidate.phone}</span>
          </div>
        )}
      </div>

      {/* Next Interview */}
      {candidate.nextInterviewDate && (
        <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 rounded px-2 py-1 mb-3">
          <Calendar className="h-3 w-3" />
          <span>
            Interview in {formatDistanceToNow(new Date(candidate.nextInterviewDate))}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t text-xs">
        <span className="text-muted-foreground">
          Applied {formatDistanceToNow(new Date(candidate.appliedDate), { addSuffix: true })}
        </span>
        <Badge
          variant="outline"
          className={cn("text-xs", priorityColors[candidate.priority])}
        >
          {candidate.priority}
        </Badge>
      </div>
    </div>
  );
}
