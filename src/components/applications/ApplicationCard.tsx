import { Application } from "@/types/application";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AIMatchBadge } from "./AIMatchBadge";

interface ApplicationCardProps {
  application: Application;
  onClick?: () => void;
}

export function ApplicationCard({ application, onClick }: ApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2.5 cursor-pointer hover:shadow-md transition-all relative"
      onClick={onClick}
    >
      {/* New/Unread Indicator */}
      {(application.isNew || !application.isRead) && (
        <div className="absolute top-2 right-2 h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
      )}

      <div className="flex items-start gap-2">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={application.candidatePhoto} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {getInitials(application.candidateName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold truncate ${!application.isRead ? 'font-bold' : ''}`}>
            {application.candidateName}
          </h4>
          <p className="text-xs text-muted-foreground truncate leading-tight">
            {application.jobTitle}
          </p>

          {/* AI Match Badge - Prominent */}
          {application.aiMatchScore && (
            <div className="mt-1.5">
              <AIMatchBadge score={application.aiMatchScore} size="sm" />
            </div>
          )}

          {/* Compact Rating and Score */}
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {application.rating && (
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-2.5 w-2.5 ${
                      i < application.rating!
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            )}
            {application.score && (
              <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                {application.score}% fit
              </Badge>
            )}
          </div>

          {/* Compact Metadata */}
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-0.5">
              <Calendar className="h-2.5 w-2.5" />
              <span className="truncate">
                {formatDistanceToNow(application.appliedDate, { addSuffix: true })}
              </span>
            </div>
            {application.resumeUrl && (
              <div className="flex items-center gap-0.5">
                <FileText className="h-2.5 w-2.5" />
                <span>CV</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
