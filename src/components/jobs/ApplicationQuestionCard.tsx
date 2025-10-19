import { ApplicationQuestion } from "@/types/applicationForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GripVertical, MoreVertical, Edit, Copy, Trash2, BookmarkPlus } from "lucide-react";
import { questionTypeLabels, questionTypeIcons } from "@/lib/applicationFormUtils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ApplicationQuestionCardProps {
  question: ApplicationQuestion;
  onEdit: (question: ApplicationQuestion) => void;
  onDuplicate: (question: ApplicationQuestion) => void;
  onDelete: (questionId: string) => void;
  onSaveToLibrary?: (question: ApplicationQuestion) => void;
}

export function ApplicationQuestionCard({
  question,
  onEdit,
  onDuplicate,
  onDelete,
  onSaveToLibrary,
}: ApplicationQuestionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const TypeIcon = questionTypeIcons[question.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-4 border rounded-lg bg-card"
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing mt-1"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1">
            <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-medium">{question.order}.</span>
            <span className="flex-1">{question.label}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="text-xs">
              {questionTypeLabels[question.type]}
            </Badge>
            {question.required && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
          </div>
        </div>

        {question.description && (
          <p className="text-sm text-muted-foreground mb-2">
            {question.description}
          </p>
        )}

        {question.options && question.options.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {question.options.slice(0, 3).map((option) => (
              <Badge key={option.id} variant="outline" className="text-xs">
                {option.label}
              </Badge>
            ))}
            {question.options.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{question.options.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon" className="shrink-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(question)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDuplicate(question)}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          
          {onSaveToLibrary && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onSaveToLibrary(question)}>
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Save to Library
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(question.id)}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
