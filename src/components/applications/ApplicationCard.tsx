import { Application } from "@/types/application";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Mail, Phone, Calendar, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
      className="p-4 cursor-pointer hover:shadow-md transition-all"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={application.candidatePhoto} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(application.candidateName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold truncate">{application.candidateName}</h4>
          <p className="text-sm text-muted-foreground truncate">{application.jobTitle}</p>

          <div className="flex items-center gap-2 mt-2">
            {application.rating && (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < application.rating!
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            )}
            {application.score && (
              <Badge variant="secondary" className="text-xs">
                {application.score}% fit
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDistanceToNow(application.appliedDate, { addSuffix: true })}
            </div>
            {application.resumeUrl && (
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Resume
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
