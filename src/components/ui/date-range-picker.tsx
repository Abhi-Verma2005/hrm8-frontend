import * as React from 'react';
import { Calendar as CalendarIcon, Save, Trash2, Edit, Copy, GripVertical } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format, subDays, subMonths, startOfQuarter, startOfYear } from 'date-fns';
import { getCustomPresets, saveCustomPreset, updateCustomPreset, deleteCustomPreset, duplicateCustomPreset, reorderCustomPresets } from '@/lib/dateRangePresetStorage';
import { useToast } from '@/hooks/use-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface DateRangePickerProps {
  date?: DateRange;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
}

interface SortablePresetItemProps {
  preset: { id: string; name: string; range: DateRange };
  onSelect: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function SortablePresetItem({ preset, onSelect, onDuplicate, onEdit, onDelete }: SortablePresetItemProps) {
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
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  const [customPresets, setCustomPresets] = React.useState(getCustomPresets());
  const [presetName, setPresetName] = React.useState('');
  const [editingPreset, setEditingPreset] = React.useState<{ id: string; name: string } | null>(null);
  const [editName, setEditName] = React.useState('');
  const [updateRange, setUpdateRange] = React.useState(false);
  const [duplicatingPreset, setDuplicatingPreset] = React.useState<{ id: string; name: string } | null>(null);
  const [duplicateName, setDuplicateName] = React.useState('');
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const defaultPresets = [
    {
      label: 'Last 7 days',
      range: { from: subDays(new Date(), 6), to: new Date() },
    },
    {
      label: 'Last 30 days',
      range: { from: subDays(new Date(), 29), to: new Date() },
    },
    {
      label: 'Last quarter',
      range: { from: startOfQuarter(subMonths(new Date(), 3)), to: new Date() },
    },
    {
      label: 'Last year',
      range: { from: startOfYear(subMonths(new Date(), 12)), to: new Date() },
    },
  ];

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for this preset",
        variant: "destructive",
      });
      return;
    }

    if (!date?.from || !date?.to) {
      toast({
        title: "Date range required",
        description: "Please select a date range first",
        variant: "destructive",
      });
      return;
    }

    saveCustomPreset(presetName, date);
    setCustomPresets(getCustomPresets());
    setPresetName('');
    
    toast({
      title: "Preset saved",
      description: `"${presetName}" has been saved successfully`,
    });
  };

  const handleEditPreset = (id: string, name: string) => {
    setEditingPreset({ id, name });
    setEditName(name);
    setUpdateRange(false);
  };

  const handleUpdatePreset = () => {
    if (!editingPreset) return;

    if (!editName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for this preset",
        variant: "destructive",
      });
      return;
    }

    if (updateRange && (!date?.from || !date?.to)) {
      toast({
        title: "Date range required",
        description: "Please select a date range to update",
        variant: "destructive",
      });
      return;
    }

    updateCustomPreset(editingPreset.id, editName, updateRange ? date : undefined);
    setCustomPresets(getCustomPresets());
    setEditingPreset(null);
    setEditName('');
    setUpdateRange(false);

    toast({
      title: "Preset updated",
      description: `"${editName}" has been updated successfully`,
    });
  };

  const handleDeletePreset = (id: string, name: string) => {
    deleteCustomPreset(id);
    setCustomPresets(getCustomPresets());
    
    toast({
      title: "Preset deleted",
      description: `"${name}" has been removed`,
    });
  };

  const handleDuplicatePreset = (id: string, name: string) => {
    setDuplicatingPreset({ id, name });
    setDuplicateName(`${name} (copy)`);
  };

  const handleSaveDuplicate = () => {
    if (!duplicatingPreset) return;

    if (!duplicateName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for the duplicate preset",
        variant: "destructive",
      });
      return;
    }

    const result = duplicateCustomPreset(duplicatingPreset.id, duplicateName);
    
    if (result) {
      setCustomPresets(getCustomPresets());
      setDuplicatingPreset(null);
      setDuplicateName('');

      toast({
        title: "Preset duplicated",
        description: `"${duplicateName}" has been created successfully`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to duplicate preset",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = customPresets.findIndex((p) => p.id === active.id);
      const newIndex = customPresets.findIndex((p) => p.id === over.id);

      const reordered = arrayMove(customPresets, oldIndex, newIndex);
      setCustomPresets(reordered);
      reorderCustomPresets(reordered);

      toast({
        title: "Presets reordered",
        description: "Custom preset order has been updated",
      });
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <div className="border-r border-border p-3 space-y-3 w-[200px]">
              <div>
                <div className="text-sm font-medium mb-2">Quick Select</div>
                <div className="space-y-1">
                  {defaultPresets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left font-normal"
                      onClick={() => onDateChange(preset.range)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              {customPresets.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Custom Presets</div>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={customPresets.map(p => p.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-1">
                        {customPresets.map((preset) => (
                          <SortablePresetItem
                            key={preset.id}
                            preset={preset}
                            onSelect={() => onDateChange(preset.range)}
                            onDuplicate={() => handleDuplicatePreset(preset.id, preset.name)}
                            onEdit={() => handleEditPreset(preset.id, preset.name)}
                            onDelete={() => handleDeletePreset(preset.id, preset.name)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              <div className="pt-2 border-t border-border">
                <div className="text-sm font-medium mb-2">Save Current</div>
                <div className="space-y-2">
                  <Input
                    placeholder="Preset name..."
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                    className="h-8 text-sm"
                  />
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={handleSavePreset}
                  >
                    <Save className="h-3 w-3 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={onDateChange}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={!!editingPreset} onOpenChange={(open) => !open && setEditingPreset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Preset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Preset Name</label>
              <Input
                placeholder="Preset name..."
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdatePreset()}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="update-range"
                checked={updateRange}
                onChange={(e) => setUpdateRange(e.target.checked)}
                className="rounded border-border"
              />
              <label htmlFor="update-range" className="text-sm">
                Update date range to current selection
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPreset(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePreset}>
              Update Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!duplicatingPreset} onOpenChange={(open) => !open && setDuplicatingPreset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Preset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">New Preset Name</label>
              <Input
                placeholder="Preset name..."
                value={duplicateName}
                onChange={(e) => setDuplicateName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveDuplicate()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDuplicatingPreset(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}