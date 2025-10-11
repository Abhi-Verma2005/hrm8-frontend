import * as React from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { addDays, format, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import type { DateRange } from "react-day-picker";

export type PresetRange = {
  label: string;
  value: string;
  range: DateRange;
};

export type DateRangeFilterProps = {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  presets?: PresetRange[];
  placeholder?: string;
  className?: string;
  align?: "start" | "center" | "end";
  showClear?: boolean;
  showCompare?: boolean;
};

// Default preset ranges
export const DEFAULT_PRESETS: PresetRange[] = [
  {
    label: "Today",
    value: "today",
    range: { from: startOfDay(new Date()), to: endOfDay(new Date()) }
  },
  {
    label: "Yesterday",
    value: "yesterday",
    range: { from: startOfDay(subDays(new Date(), 1)), to: endOfDay(subDays(new Date(), 1)) }
  },
  {
    label: "Last 7 days",
    value: "last-7",
    range: { from: startOfDay(subDays(new Date(), 6)), to: endOfDay(new Date()) }
  },
  {
    label: "Last 14 days",
    value: "last-14",
    range: { from: startOfDay(subDays(new Date(), 13)), to: endOfDay(new Date()) }
  },
  {
    label: "Last 30 days",
    value: "last-30",
    range: { from: startOfDay(subDays(new Date(), 29)), to: endOfDay(new Date()) }
  },
  {
    label: "Last 90 days",
    value: "last-90",
    range: { from: startOfDay(subDays(new Date(), 89)), to: endOfDay(new Date()) }
  },
  {
    label: "This week",
    value: "this-week",
    range: { from: startOfWeek(new Date()), to: endOfWeek(new Date()) }
  },
  {
    label: "Last week",
    value: "last-week",
    range: { from: startOfWeek(subDays(new Date(), 7)), to: endOfWeek(subDays(new Date(), 7)) }
  },
  {
    label: "This month",
    value: "this-month",
    range: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) }
  },
  {
    label: "Last month",
    value: "last-month",
    range: { from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }
  },
  {
    label: "This year",
    value: "this-year",
    range: { from: startOfYear(new Date()), to: endOfYear(new Date()) }
  },
  {
    label: "Last year",
    value: "last-year",
    range: { from: startOfYear(subYears(new Date(), 1)), to: endOfYear(subYears(new Date(), 1)) }
  }
];

export function DateRangeFilter({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  placeholder = "Select date range",
  className,
  align = "start",
  showClear = true,
  showCompare = false
}: DateRangeFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(null);

  const handlePresetSelect = (preset: PresetRange) => {
    setSelectedPreset(preset.value);
    onChange?.(preset.range);
    setOpen(false);
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    setSelectedPreset(null); // Clear preset when manually selecting
    onChange?.(range);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPreset(null);
    if (onChange) {
      onChange(undefined);
    }
  };

  const formatDisplayText = () => {
    if (!value?.from) return placeholder;
    
    if (selectedPreset) {
      const preset = presets.find(p => p.value === selectedPreset);
      if (preset) return preset.label;
    }

    if (value.to) {
      return `${format(value.from, "MMM d, yyyy")} - ${format(value.to, "MMM d, yyyy")}`;
    }
    
    return format(value.from, "MMM d, yyyy");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDisplayText()}
          {showClear && value?.from && (
            <X
              className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <div className="flex">
          {/* Preset Buttons */}
          <div className="border-r p-3 space-y-1 min-w-[140px]">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Quick Select
            </div>
            <div className="space-y-1">
              {presets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={selectedPreset === preset.value ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => handlePresetSelect(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            {showCompare && (
              <>
                <Separator className="my-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm text-muted-foreground"
                >
                  Compare periods
                </Button>
              </>
            )}
          </div>

          {/* Calendar */}
          <div className="p-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Custom Range
            </div>
            <Calendar
              mode="range"
              selected={value}
              onSelect={handleCalendarSelect}
              numberOfMonths={2}
              initialFocus
              className="pointer-events-auto"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
