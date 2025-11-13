import { Application } from "@/types/application";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Calendar, FileText, MoreVertical, Mail, Phone, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AIMatchBadge } from "./AIMatchBadge";
import { TagManager } from "./TagManager";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { AIInterviewQuestionDialog } from "./AIInterviewQuestionDialog";
import { generateQuestionsFromApplication } from "@/lib/aiInterviewQuestions";

interface ApplicationCardProps {
  application: Application;
  onClick?: () => void;
  isCompareMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (applicationId: string) => void;
}

export function ApplicationCard({ 
  application, 
  onClick,
  isCompareMode = false,
  isSelected = false,
  onToggleSelect
}: ApplicationCardProps) {
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<ReturnType<typeof generateQuestionsFromApplication>>([]);

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

  const handleGenerateQuestions = (e: React.MouseEvent) => {
    e.stopPropagation();
    const questions = generateQuestionsFromApplication(
      application,
      application.jobTitle,
      application.employerName
    );
    setGeneratedQuestions(questions);
    setShowQuestionDialog(true);
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`p-2.5 cursor-pointer hover:shadow-md transition-all relative group ${isSelected ? 'ring-2 ring-primary' : ''}`}
        onClick={onClick}
      >
        {/* Comparison Checkbox */}
        {isCompareMode && (
          <div className="absolute top-2 left-2 z-10" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelect?.(application.id)}
              className="bg-background"
            />
          </div>
        )}
        {/* New/Unread Indicator */}
        {(application.isNew || !application.isRead) && (
          <div className="absolute top-2 right-2 h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
        )}

        {/* Quick Actions Menu */}
        <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={handleGenerateQuestions}>
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Generate Interview Questions
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Mail className="mr-2 h-3.5 w-3.5" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="mr-2 h-3.5 w-3.5" />
                Schedule Call
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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

            {/* Tags */}
            {!isCompareMode && (
              <div className="mt-1.5">
                <TagManager
                  applicationId={application.id}
                  tags={application.tags || []}
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      <AIInterviewQuestionDialog
        open={showQuestionDialog}
        onOpenChange={setShowQuestionDialog}
        questions={generatedQuestions}
        candidateName={application.candidateName}
        jobTitle={application.jobTitle}
      />
    </>
  );
}
