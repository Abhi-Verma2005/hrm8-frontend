import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DashboardWidget } from '@/lib/dashboard/types';

interface DraggableWidgetProps {
  widget: DashboardWidget;
  isEditMode: boolean;
  onRemove: () => void;
  children: React.ReactNode;
}

export function DraggableWidget({
  widget,
  isEditMode,
  onRemove,
  children
}: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: widget.id, 
    disabled: !isEditMode,
    data: { widget }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    gridColumn: `span ${widget.gridArea.w}`,
    gridRow: `span ${widget.gridArea.h}`
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative transition-all duration-200",
        isEditMode && "ring-2 ring-primary/30 rounded-lg"
      )}
    >
      {/* Edit Mode Controls */}
      {isEditMode && (
        <div className="absolute -top-9 left-0 right-0 flex items-center justify-between bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-t-lg border border-b-0 z-10 shadow-sm">
          <div
            {...attributes}
            {...listeners}
            className="flex items-center gap-2 cursor-move hover:text-primary transition-colors"
          >
            <GripVertical className="h-4 w-4" />
            <span className="text-xs font-medium truncate max-w-[200px]">{widget.title}</span>
          </div>
          <div className="flex gap-1">
            {!widget.isLocked && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-6 w-6 p-0 hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Widget Content */}
      <div className={cn("h-full", isEditMode && "pointer-events-none select-none")}>
        {children}
      </div>
    </div>
  );
}
