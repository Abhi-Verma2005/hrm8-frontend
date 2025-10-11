import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import type { DashboardWidget } from '@/lib/dashboard/types';
import { ResizeHandle } from './ResizeHandle';
import { WidgetPlaceholder } from './WidgetPlaceholder';
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
      {/* Render placeholder in edit mode, actual content otherwise */}
      {isEditMode ? (
        <>
          <WidgetPlaceholder 
            widget={widget}
            tempSize={tempSize}
            onRemove={!widget.isLocked ? onRemove : undefined}
            dragHandleProps={{ ...attributes, ...listeners }}
          />
          
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
      ) : (
        <div className="h-full">
          {children}
        </div>
      )}
    </div>
  );
}
