import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { DraggableWidget } from './DraggableWidget';
import { WidgetRenderer } from './WidgetRenderer';
import type { DashboardLayout, DashboardWidget } from '@/lib/dashboard/types';

interface DashboardGridProps {
  layout: DashboardLayout;
  isEditMode: boolean;
  onUpdateWidget: (id: string, updates: Partial<DashboardWidget>) => void;
  onRemoveWidget: (id: string) => void;
}

export function DashboardGrid({
  layout,
  isEditMode,
  onUpdateWidget,
  onRemoveWidget
}: DashboardGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    const activeWidget = layout.widgets.find(w => w.id === active.id);
    const overWidget = layout.widgets.find(w => w.id === over.id);
    
    if (!activeWidget || !overWidget) return;
    
    // Swap positions
    const activePos = { ...activeWidget.gridArea };
    const overPos = { ...overWidget.gridArea };
    
    onUpdateWidget(activeWidget.id, { gridArea: overPos });
    onUpdateWidget(overWidget.id, { gridArea: activePos });
  };
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={layout.widgets.map(w => w.id)}
        strategy={rectSortingStrategy}
      >
        <div
          className="grid gap-6 relative"
          style={{
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridAutoRows: 'minmax(200px, auto)',
            gridAutoFlow: 'dense'
          }}
        >
          {/* Grid overlay in edit mode */}
          {isEditMode && (
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="grid grid-cols-12 h-full">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border-r border-primary/10" />
                ))}
              </div>
            </div>
          )}
          {layout.widgets
            .filter(w => w.isVisible)
            .map(widget => (
              <DraggableWidget
                key={widget.id}
                widget={widget}
                isEditMode={isEditMode}
                onRemove={() => onRemoveWidget(widget.id)}
                onUpdate={(updates) => onUpdateWidget(widget.id, updates)}
              >
                <WidgetRenderer widget={widget} />
              </DraggableWidget>
            ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
