import * as React from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { format, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, setYear, setMonth } from "date-fns";
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
  },
  {
    label: "This year",
    value: "this-year",
    range: { from: startOfYear(new Date()), to: endOfYear(new Date()) }
  }
];

// Generate year presets (last 6 years)
const generateYearPresets = (): PresetRange[] => {
  const currentYear = new Date().getFullYear();
  const years: PresetRange[] = [];
  
  for (let i = 0; i < 6; i++) {
    const year = currentYear - i;
    const yearDate = setYear(new Date(), year);
    years.push({
      label: year.toString(),
      value: `year-${year}`,
      range: { 
        from: startOfYear(yearDate), 
        to: endOfYear(yearDate) 
      }
    });
  }
  
  return years;
};

// Generate month presets for current year
const generateMonthPresets = (): PresetRange[] => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  return months.map((month, index) => {
    const monthDate = setMonth(new Date(), index);
    return {
      label: month,
      value: `month-${index}`,
      range: {
        from: startOfMonth(monthDate),
        to: endOfMonth(monthDate)
      }
    };
  });
};

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
  const [activeTab, setActiveTab] = React.useState<"quick" | "year" | "month">("quick");
  
  const yearPresets = React.useMemo(() => generateYearPresets(), []);
  const monthPresets = React.useMemo(() => generateMonthPresets(), []);

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
          {showIcon && <CalendarIcon className="h-4 w-4" />}
          {!iconOnly && formatDisplayText() && (
            <span className="ml-1">{formatDisplayText()}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <div className="flex flex-col sm:flex-row">
          {/* Preset Buttons with Tabs */}
          <div className="border-b sm:border-b-0 sm:border-r p-2 space-y-1 min-w-[120px]">
            {/* Tab Navigation */}
            <div className="flex gap-1 mb-2">
              <Button
                variant={activeTab === "quick" ? "secondary" : "ghost"}
                size="sm"
                className="flex-1 text-xs px-2"
                onClick={() => setActiveTab("quick")}
              >
                Quick
              </Button>
              <Button
                variant={activeTab === "year" ? "secondary" : "ghost"}
                size="sm"
                className="flex-1 text-xs px-2"
                onClick={() => setActiveTab("year")}
              >
                Year
              </Button>
              <Button
                variant={activeTab === "month" ? "secondary" : "ghost"}
                size="sm"
                className="flex-1 text-xs px-2"
                onClick={() => setActiveTab("month")}
              >
                Month
              </Button>
            </div>

            {/* Quick Presets Tab */}
            {activeTab === "quick" && (
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
              </div>
            )}

            {/* Year Tab */}
            {activeTab === "year" && (
              <div className="grid grid-cols-2 gap-1">
                {yearPresets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant="ghost"
                    size="sm"
                    className="text-sm"
                    onClick={() => handlePresetSelect(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Month Tab */}
            {activeTab === "month" && (
              <div className="grid grid-cols-3 gap-1">
                {monthPresets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant="ghost"
                    size="sm"
                    className="text-xs px-1"
                    onClick={() => handlePresetSelect(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Clear Button */}
            {value?.from && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm text-destructive mt-2"
                onClick={handleClear}
              >
                <X className="h-3 w-3 mr-2" />
                Clear filter
              </Button>
            )}
          </div>

          {/* Calendar */}
          <div className="p-2">
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
