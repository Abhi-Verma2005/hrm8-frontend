import { memo } from 'react';
import { DateRange } from 'react-day-picker';
import { Copy, Edit, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PresetItemProps {
  preset: { id: string; name: string; range: DateRange };
  onSelect: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const PresetItem = memo(function PresetItem({ 
  preset, 
  onSelect, 
  onDuplicate, 
  onEdit, 
  onDelete 
}: PresetItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: preset.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-1"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded"
      >
        <GripVertical className="h-3 w-3 text-muted-foreground" />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="flex-1 justify-start text-left font-normal"
        onClick={onSelect}
      >
        {preset.name}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onDuplicate}
      >
        <Copy className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onEdit}
      >
        <Edit className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onDelete}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
});
