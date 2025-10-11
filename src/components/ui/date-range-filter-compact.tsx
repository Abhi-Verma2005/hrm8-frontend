import * as React from "react";
import { X, Filter } from "lucide-react";
import { format, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";

export type PresetRange = {
  label: string;
  value: string;
  range: DateRange;
};

// Default preset ranges for compact mode
const DEFAULT_COMPACT_PRESETS: PresetRange[] = [
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
    label: "This month",
    value: "this-month",
    range: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) }
  }
];

export type DateRangeFilterCompactProps = {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  presets?: PresetRange[];
  showIcon?: boolean;
  iconOnly?: boolean;
  align?: "start" | "center" | "end";
};

export function DateRangeFilterCompact({
  value,
  onChange,
  presets = DEFAULT_COMPACT_PRESETS,
  showIcon = true,
  iconOnly = false,
  align = "end"
}: DateRangeFilterCompactProps) {
  const [open, setOpen] = React.useState(false);

  const handlePresetSelect = (preset: PresetRange) => {
    if (onChange) {
      onChange(preset.range);
    }
    setOpen(false);
  };

  const handleClear = () => {
    if (onChange) {
      onChange(undefined);
    }
    setOpen(false);
  };

  const formatDisplayText = () => {
    if (!value?.from) return null;
    
    if (value.to) {
      return `${format(value.from, "MMM d")} - ${format(value.to, "MMM d")}`;
    }
    
    return format(value.from, "MMM d, yyyy");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size={iconOnly ? "icon-sm" : "sm"}
          className={cn(value?.from && "text-primary")}
        >
          {showIcon && <Filter className="h-4 w-4" />}
          {!iconOnly && formatDisplayText() && (
            <span className="ml-1">{formatDisplayText()}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <div className="flex flex-col sm:flex-row">
          {/* Preset Buttons */}
          <div className="border-b sm:border-b-0 sm:border-r p-3 space-y-1 min-w-[140px]">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Quick Select
            </div>
            <div className="space-y-1">
              {presets.map((preset) => (
                <Button
                  key={preset.value}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => handlePresetSelect(preset)}
                >
                  {preset.label}
                </Button>
              ))}
              {value?.from && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm text-destructive"
                  onClick={handleClear}
                >
                  <X className="h-3 w-3 mr-2" />
                  Clear filter
                </Button>
              )}
            </div>
          </div>

          {/* Calendar */}
          <div className="p-3">
            <Calendar
              mode="range"
              selected={value}
              onSelect={onChange}
              numberOfMonths={1}
              initialFocus
              className="pointer-events-auto"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
