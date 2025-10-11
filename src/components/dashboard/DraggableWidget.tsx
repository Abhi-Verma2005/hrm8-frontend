import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DashboardWidget } from '@/lib/dashboard/types';
import { ResizeHandle } from './ResizeHandle';
import { WIDGET_REGISTRY } from '@/lib/dashboard/widgetRegistry';
import { useToast } from '@/hooks/use-toast';

interface DraggableWidgetProps {
  widget: DashboardWidget;
  isEditMode: boolean;
  onRemove: () => void;
  onUpdate?: (updates: Partial<DashboardWidget>) => void;
  children: React.ReactNode;
}

export function DraggableWidget({
  widget,
  isEditMode,
  onRemove,
  onUpdate,
  children
}: DraggableWidgetProps) {
  const { toast } = useToast();
  const [tempSize, setTempSize] = useState(widget.gridArea);
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
  
  // Get widget definition for size constraints
  const widgetDef = Object.values(WIDGET_REGISTRY).find(
    w => w.component === widget.component
  );

  const handleResize = (delta: { width: number; height: number }) => {
    const newWidth = Math.max(
      widgetDef?.minSize.w || 2,
      Math.min(
        widgetDef?.maxSize?.w || 12,
        widget.gridArea.w + delta.width
      )
    );
    
    const newHeight = Math.max(
      widgetDef?.minSize.h || 1,
      Math.min(
        widgetDef?.maxSize?.h || 6,
        widget.gridArea.h + delta.height
      )
    );
    
    setTempSize({
      ...widget.gridArea,
      w: newWidth,
      h: newHeight
    });
  };

  const handleResizeEnd = () => {
    if (onUpdate && (tempSize.w !== widget.gridArea.w || tempSize.h !== widget.gridArea.h)) {
      onUpdate({ gridArea: tempSize });
    }
  };
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    gridColumn: `${tempSize.x + 1} / span ${tempSize.w}`,
    gridRow: `${tempSize.y + 1} / span ${tempSize.h}`
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
        <>
          <div className="absolute -top-9 left-0 right-0 flex items-center justify-between bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-t-lg border border-b-0 z-10 shadow-sm">
            <div
              {...attributes}
              {...listeners}
              className="flex items-center gap-2 cursor-move hover:text-primary transition-colors"
            >
              <GripVertical className="h-4 w-4" />
              <span className="text-xs font-medium truncate max-w-[200px]">{widget.title}</span>
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                {tempSize.w}×{tempSize.h}
              </Badge>
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
          
          {/* Resize Handles */}
          <ResizeHandle 
            direction="right" 
            onResize={handleResize}
            onResizeEnd={handleResizeEnd}
          />
          <ResizeHandle 
            direction="bottom" 
            onResize={handleResize}
            onResizeEnd={handleResizeEnd}
          />
          <ResizeHandle 
            direction="corner" 
            onResize={handleResize}
            onResizeEnd={handleResizeEnd}
          />
        </>
      )}
      
      {/* Widget Content */}
      <div className={cn("h-full", isEditMode && "pointer-events-none select-none")}>
        {children}
      </div>
    </div>
  );
}
