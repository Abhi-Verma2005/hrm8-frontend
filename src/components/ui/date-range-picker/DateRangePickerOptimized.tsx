import * as React from 'react';
import { Calendar as CalendarIcon, Save } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, subDays, subMonths, startOfQuarter, startOfYear } from 'date-fns';
import { 
  getCustomPresets, 
  saveCustomPreset, 
  updateCustomPreset, 
  deleteCustomPreset, 
  duplicateCustomPreset, 
  reorderCustomPresets 
} from '@/lib/dateRangePresetStorage';
import { useToast } from '@/hooks/use-toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { PresetItem } from './PresetItem';
import { PresetCategoryGroup } from './PresetCategoryGroup';
import { SavePresetDialog, EditPresetDialog, DuplicatePresetDialog } from './PresetDialogs';

export interface DateRangePickerProps {
  date?: DateRange;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
}

// Consolidated state types
interface PresetDialogState {
  open: boolean;
  name: string;
  category: string;
}

interface EditDialogState extends PresetDialogState {
  id: string;
  updateRange: boolean;
}

interface DuplicateDialogState extends PresetDialogState {
  id: string;
}

const DEFAULT_PRESETS = [
  { label: 'Last 7 days', range: { from: subDays(new Date(), 6), to: new Date() } },
  { label: 'Last 30 days', range: { from: subDays(new Date(), 29), to: new Date() } },
  { label: 'Last quarter', range: { from: startOfQuarter(subMonths(new Date(), 3)), to: new Date() } },
  { label: 'Last year', range: { from: startOfYear(subMonths(new Date(), 12)), to: new Date() } },
] as const;

export function DateRangePicker({ date, onDateChange, className }: DateRangePickerProps) {
  const [customPresets, setCustomPresets] = React.useState(getCustomPresets());
  const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Consolidated dialog states
  const [saveDialog, setSaveDialog] = React.useState<PresetDialogState>({
    open: false,
    name: '',
    category: '',
  });

  const [editDialog, setEditDialog] = React.useState<EditDialogState>({
    open: false,
    id: '',
    name: '',
    category: '',
    updateRange: false,
  });

  const [duplicateDialog, setDuplicateDialog] = React.useState<DuplicateDialogState>({
    open: false,
    id: '',
    name: '',
    category: '',
  });

  // Memoized sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Memoized categories
  const categories = React.useMemo(() => {
    const cats = new Set<string>();
    customPresets.forEach(preset => {
      if (preset.category) cats.add(preset.category);
    });
    return Array.from(cats).sort();
  }, [customPresets]);

  // Memoized grouped presets
  const groupedPresets = React.useMemo(() => {
    const groups: Record<string, typeof customPresets> = {};
    const uncategorized: typeof customPresets = [];

    customPresets.forEach(preset => {
      if (preset.category) {
        if (!groups[preset.category]) {
          groups[preset.category] = [];
        }
        groups[preset.category].push(preset);
      } else {
        uncategorized.push(preset);
      }
    });

    return { groups, uncategorized };
  }, [customPresets]);

  // Initialize open categories
  React.useEffect(() => {
    const initialOpen: Record<string, boolean> = {};
    Object.keys(groupedPresets.groups).forEach(cat => {
      initialOpen[cat] = true;
    });
    setOpenCategories(prev => ({ ...initialOpen, ...prev }));
  }, []);

  // Memoized handlers
  const handleSavePreset = React.useCallback(() => {
    if (!saveDialog.name.trim()) {
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

    saveCustomPreset(saveDialog.name, date, saveDialog.category);
    setCustomPresets(getCustomPresets());
    setSaveDialog({ open: false, name: '', category: '' });

    toast({
      title: "Preset saved",
      description: `"${saveDialog.name}" has been saved successfully`,
    });
  }, [saveDialog, date, toast]);

  const handleUpdatePreset = React.useCallback(() => {
    if (!editDialog.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for this preset",
        variant: "destructive",
      });
      return;
    }

    if (editDialog.updateRange && (!date?.from || !date?.to)) {
      toast({
        title: "Date range required",
        description: "Please select a date range to update",
        variant: "destructive",
      });
      return;
    }

    updateCustomPreset(
      editDialog.id, 
      editDialog.name, 
      editDialog.updateRange ? date : undefined, 
      editDialog.category
    );
    setCustomPresets(getCustomPresets());
    setEditDialog({ open: false, id: '', name: '', category: '', updateRange: false });

    toast({
      title: "Preset updated",
      description: `"${editDialog.name}" has been updated successfully`,
    });
  }, [editDialog, date, toast]);

  const handleDeletePreset = React.useCallback((id: string, name: string) => {
    deleteCustomPreset(id);
    setCustomPresets(getCustomPresets());

    toast({
      title: "Preset deleted",
      description: `"${name}" has been removed`,
    });
  }, [toast]);

  const handleDuplicateComplete = React.useCallback(() => {
    if (!duplicateDialog.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for the duplicate preset",
        variant: "destructive",
      });
      return;
    }

    duplicateCustomPreset(duplicateDialog.id, duplicateDialog.name, duplicateDialog.category);
    setCustomPresets(getCustomPresets());
    setDuplicateDialog({ open: false, id: '', name: '', category: '' });

    toast({
      title: "Preset duplicated",
      description: `"${duplicateDialog.name}" has been created`,
    });
  }, [duplicateDialog, toast]);

  const handleDragEnd = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = customPresets.findIndex(p => p.id === active.id);
    const newIndex = customPresets.findIndex(p => p.id === over.id);

    const reordered = arrayMove(customPresets, oldIndex, newIndex);
    setCustomPresets(reordered);
    reorderCustomPresets(reordered);
  }, [customPresets]);

  const openSaveDialog = React.useCallback(() => {
    setSaveDialog({ open: true, name: '', category: '' });
  }, []);

  const openEditDialog = React.useCallback((id: string, name: string, category?: string) => {
    setEditDialog({ 
      open: true, 
      id, 
      name, 
      category: category || '', 
      updateRange: false 
    });
  }, []);

  const openDuplicateDialog = React.useCallback((id: string, name: string, category?: string) => {
    setDuplicateDialog({ 
      open: true, 
      id, 
      name: `${name} (copy)`, 
      category: category || '' 
    });
  }, []);

  return (
    <>
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex">
              {/* Presets Sidebar */}
              <div className="w-64 border-r border-border p-3 space-y-2 max-h-[400px] overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">Presets</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={openSaveDialog}
                    disabled={!date?.from || !date?.to}
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </div>

                {/* Default Presets */}
                <div className="space-y-1">
                  {DEFAULT_PRESETS.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start font-normal"
                      onClick={() => onDateChange(preset.range)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>

                {/* Custom Presets */}
                {customPresets.length > 0 && (
                  <>
                    <div className="border-t border-border my-2" />
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      modifiers={[restrictToVerticalAxis]}
                    >
                      <div className="space-y-1">
                        {/* Categorized Presets */}
                        {Object.entries(groupedPresets.groups).map(([category, presets]) => (
                          <PresetCategoryGroup
                            key={category}
                            category={category}
                            presets={presets}
                            isOpen={openCategories[category] ?? true}
                            onToggle={() => setOpenCategories(prev => ({ 
                              ...prev, 
                              [category]: !prev[category] 
                            }))}
                            onSelectPreset={onDateChange}
                            onDuplicatePreset={openDuplicateDialog}
                            onEditPreset={openEditDialog}
                            onDeletePreset={handleDeletePreset}
                          />
                        ))}

                        {/* Uncategorized Presets */}
                        {groupedPresets.uncategorized.length > 0 && (
                          <SortableContext
                            items={groupedPresets.uncategorized.map(p => p.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {groupedPresets.uncategorized.map((preset) => (
                              <PresetItem
                                key={preset.id}
                                preset={preset}
                                onSelect={() => onDateChange(preset.range)}
                                onDuplicate={() => openDuplicateDialog(preset.id, preset.name, preset.category)}
                                onEdit={() => openEditDialog(preset.id, preset.name, preset.category)}
                                onDelete={() => handleDeletePreset(preset.id, preset.name)}
                              />
                            ))}
                          </SortableContext>
                        )}
                      </div>
                    </DndContext>
                  </>
                )}
              </div>

              {/* Calendar */}
              <div className="p-3">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={onDateChange}
                  numberOfMonths={2}
                  className={cn("pointer-events-auto")}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Dialogs */}
      <SavePresetDialog
        open={saveDialog.open}
        onOpenChange={(open) => setSaveDialog(prev => ({ ...prev, open }))}
        presetName={saveDialog.name}
        presetCategory={saveDialog.category}
        onNameChange={(name) => setSaveDialog(prev => ({ ...prev, name }))}
        onCategoryChange={(category) => setSaveDialog(prev => ({ ...prev, category }))}
        onSave={handleSavePreset}
        categories={categories}
      />

      <EditPresetDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog(prev => ({ ...prev, open }))}
        editName={editDialog.name}
        editCategory={editDialog.category}
        updateRange={editDialog.updateRange}
        onNameChange={(name) => setEditDialog(prev => ({ ...prev, name }))}
        onCategoryChange={(category) => setEditDialog(prev => ({ ...prev, category }))}
        onUpdateRangeChange={(updateRange) => setEditDialog(prev => ({ ...prev, updateRange }))}
        onUpdate={handleUpdatePreset}
        categories={categories}
      />

      <DuplicatePresetDialog
        open={duplicateDialog.open}
        onOpenChange={(open) => setDuplicateDialog(prev => ({ ...prev, open }))}
        duplicateName={duplicateDialog.name}
        duplicateCategory={duplicateDialog.category}
        onNameChange={(name) => setDuplicateDialog(prev => ({ ...prev, name }))}
        onCategoryChange={(category) => setDuplicateDialog(prev => ({ ...prev, category }))}
        onDuplicate={handleDuplicateComplete}
        categories={categories}
      />
    </>
  );
}
