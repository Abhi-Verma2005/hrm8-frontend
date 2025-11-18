import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Calendar, Eye, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CandidateCard } from "./KanbanBoard";

interface KanbanCardProps {
  card: CandidateCard;
}

export function KanbanCard({ card }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const initials = card.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow bg-card group relative"
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h5 className="text-sm font-semibold truncate">{card.name}</h5>
          <p className="text-xs text-muted-foreground truncate">{card.position}</p>
        </div>
        <Badge 
          className={`
            ${card.score >= 90 ? "bg-success text-success-foreground" : ""}
            ${card.score >= 80 && card.score < 90 ? "bg-warning text-warning-foreground" : ""}
            ${card.score < 80 ? "bg-muted text-muted-foreground" : ""}
          `}
        >
          {card.score}
        </Badge>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="h-3 w-3" />
          <span className="truncate">{card.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{new Date(card.appliedDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {card.tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="text-xs bg-primary-light text-primary border-0"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Hover Actions Overlay */}
      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2 pointer-events-none">
        <Button
          variant="secondary"
          size="icon-sm"
          className="pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Mail className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon-sm"
          className="pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Calendar className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon-sm"
          className="pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>

      {/* Three-dot menu (always visible) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View full profile</DropdownMenuItem>
          <DropdownMenuItem>Send email</DropdownMenuItem>
          <DropdownMenuItem>Schedule interview</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Move to...</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Remove candidate</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}