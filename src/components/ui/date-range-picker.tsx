import * as React from 'react';
import { Calendar as CalendarIcon, Save, Trash2, Edit } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format, subDays, subMonths, startOfQuarter, startOfYear } from 'date-fns';
import { getCustomPresets, saveCustomPreset, updateCustomPreset, deleteCustomPreset } from '@/lib/dateRangePresetStorage';
import { useToast } from '@/hooks/use-toast';

export interface DateRangePickerProps {
  date?: DateRange;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
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
  const { toast } = useToast();

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
                  <div className="space-y-1">
                    {customPresets.map((preset) => (
                      <div key={preset.id} className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 justify-start text-left font-normal"
                          onClick={() => onDateChange(preset.range)}
                        >
                          {preset.name}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditPreset(preset.id, preset.name)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDeletePreset(preset.id, preset.name)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
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
    </div>
  );
}