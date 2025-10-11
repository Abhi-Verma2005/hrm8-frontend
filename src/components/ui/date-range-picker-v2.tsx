import * as React from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { DateRange } from "react-day-picker";

type PresetValue = "last-7" | "last-14" | "last-30" | "this-month" | "last-month" | "this-year" | "last-year" | "all-time" | "custom";

interface Preset {
  label: string;
  value: PresetValue;
  getRange: () => DateRange;
}

const COMPACT_PRESETS: Preset[] = [
  {
    label: "Last 7 days",
    value: "last-7",
    getRange: () => ({ from: subDays(new Date(), 6), to: new Date() })
  },
  {
    label: "Last 30 days",
    value: "last-30",
    getRange: () => ({ from: subDays(new Date(), 29), to: new Date() })
  },
  {
    label: "This month",
    value: "this-month",
    getRange: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) })
  },
  {
    label: "This year",
    value: "this-year",
    getRange: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) })
  }
];

const FULL_PRESETS: Preset[] = [
  {
    label: "Last 7 days",
    value: "last-7",
    getRange: () => ({ from: subDays(new Date(), 6), to: new Date() })
  },
  {
    label: "Last 14 days",
    value: "last-14",
    getRange: () => ({ from: subDays(new Date(), 13), to: new Date() })
  },
  {
    label: "Last 30 days",
    value: "last-30",
    getRange: () => ({ from: subDays(new Date(), 29), to: new Date() })
  },
  {
    label: "This month",
    value: "this-month",
    getRange: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) })
  },
  {
    label: "Last month",
    value: "last-month",
    getRange: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) })
  },
  {
    label: "This year",
    value: "this-year",
    getRange: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) })
  },
  {
    label: "Last year",
    value: "last-year",
    getRange: () => ({ from: startOfYear(subYears(new Date(), 1)), to: endOfYear(subYears(new Date(), 1)) })
  },
  {
    label: "All time",
    value: "all-time",
    getRange: () => ({ from: new Date(2020, 0, 1), to: new Date() })
  }
];

// Helper to check if two date ranges are equal
const isRangeEqual = (range1?: DateRange, range2?: DateRange): boolean => {
  if (!range1 || !range2) return false;
  return (
    range1.from?.getTime() === range2.from?.getTime() &&
    range1.to?.getTime() === range2.to?.getTime()
  );
};

// Helper to find which preset matches the current range
const findMatchingPreset = (value?: DateRange, presets: Preset[] = FULL_PRESETS): PresetValue | null => {
  if (!value) return null;
  const matchedPreset = presets.find(preset => isRangeEqual(preset.getRange(), value));
  return matchedPreset?.value || null;
};

// Compact Version - Icon only, minimal presets
export interface DateRangePickerCompactProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  align?: "start" | "center" | "end";
}

export function DateRangePickerCompact({
  value,
  onChange,
  align = "end"
}: DateRangePickerCompactProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedPreset, setSelectedPreset] = React.useState<PresetValue | null>(
    () => findMatchingPreset(value, COMPACT_PRESETS)
  );
  const [showCalendar, setShowCalendar] = React.useState(false);

  const handlePresetSelect = (presetValue: PresetValue) => {
    if (presetValue === "custom") {
      setShowCalendar(true);
      setSelectedPreset("custom");
      return;
    }

    const preset = COMPACT_PRESETS.find(p => p.value === presetValue);
    if (preset && onChange) {
      onChange(preset.getRange());
      setSelectedPreset(presetValue);
      setShowCalendar(false);
      setOpen(false);
    }
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    if (onChange) {
      onChange(range);
    }
    if (range?.from && range?.to) {
      setSelectedPreset("custom");
      setOpen(false);
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange(undefined);
    }
    setSelectedPreset(null);
    setShowCalendar(false);
    setOpen(false);
  };

  const formatTooltip = () => {
    if (!value?.from) return "Filter by date";
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
          size="icon-sm"
          className={cn(value?.from && "text-primary")}
          title={formatTooltip()}
        >
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <div className="p-3 space-y-3" style={{ minWidth: "200px" }}>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Quick Filters</p>
            <RadioGroup value={selectedPreset || ""} onValueChange={handlePresetSelect}>
              {COMPACT_PRESETS.map((preset) => (
                <div key={preset.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={preset.value} id={`compact-${preset.value}`} />
                  <Label 
                    htmlFor={`compact-${preset.value}`} 
                    className="text-sm cursor-pointer font-normal"
                  >
                    {preset.label}
                  </Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="compact-custom" />
                <Label htmlFor="compact-custom" className="text-sm cursor-pointer font-normal">
                  Custom range...
                </Label>
              </div>
            </RadioGroup>
          </div>

          {showCalendar && (
            <div className="pt-3 border-t">
              <Calendar
                mode="range"
                selected={value}
                onSelect={handleCalendarSelect}
                numberOfMonths={1}
                initialFocus
                className="pointer-events-auto"
              />
            </div>
          )}

          {value?.from && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-sm text-destructive"
              onClick={handleClear}
            >
              <X className="h-3 w-3 mr-2" />
              Clear filter
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Full Version - Button trigger, comprehensive options
export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  align?: "start" | "center" | "end";
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Select date range",
  className,
  align = "start"
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedPreset, setSelectedPreset] = React.useState<PresetValue | null>(
    () => findMatchingPreset(value, FULL_PRESETS)
  );
  
  // Calendar navigation state
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(value?.from || new Date());

  const handlePresetSelect = (presetValue: PresetValue) => {
    const preset = FULL_PRESETS.find(p => p.value === presetValue);
    if (preset && onChange) {
      const range = preset.getRange();
      onChange(range);
      setSelectedPreset(presetValue);
      setCalendarMonth(range.from || new Date());
      setOpen(false);
    }
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    if (onChange) {
      onChange(range);
    }
    // Check if this matches a preset
    const matchedPreset = findMatchingPreset(range, FULL_PRESETS);
    setSelectedPreset(matchedPreset || "custom");
    
    if (range?.from && range?.to) {
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange(undefined);
    }
    setSelectedPreset(null);
  };

  const formatDisplayText = () => {
    if (!value?.from) return placeholder;
    
    // Check if it matches a preset
    const matchedPreset = FULL_PRESETS.find(p => isRangeEqual(p.getRange(), value));
    if (matchedPreset) {
      return matchedPreset.label;
    }
    
    if (value.to) {
      return `${format(value.from, "MMM d, yyyy")} - ${format(value.to, "MMM d, yyyy")}`;
    }
    return format(value.from, "MMM d, yyyy");
  };

  // Generate month and year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(calendarMonth);
    newDate.setMonth(parseInt(monthIndex));
    setCalendarMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(calendarMonth);
    newDate.setFullYear(parseInt(year));
    setCalendarMonth(newDate);
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
          {value?.from && (
            <X
              className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <div className="flex flex-col sm:flex-row">
          {/* Quick Ranges */}
          <div className="p-3 space-y-2 border-b sm:border-b-0 sm:border-r" style={{ minWidth: "160px" }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Quick Ranges
            </p>
            <div className="space-y-1">
              {FULL_PRESETS.map((preset) => (
                <Button
                  key={preset.value}
                  variant={selectedPreset === preset.value ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-sm font-normal"
                  onClick={() => handlePresetSelect(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Selection */}
          <div className="p-3 space-y-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Custom Selection
              </p>
              
              {/* Month/Year Dropdowns */}
              <div className="flex gap-2">
                <Select 
                  value={calendarMonth.getMonth().toString()} 
                  onValueChange={handleMonthChange}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={month} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={calendarMonth.getFullYear().toString()} 
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Calendar */}
            <Calendar
              mode="range"
              selected={value}
              onSelect={handleCalendarSelect}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              numberOfMonths={1}
              initialFocus
              className="pointer-events-auto"
            />

            {/* Manual Date Input */}
            <div className="space-y-2 pt-2 border-t">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">From</Label>
                  <Input
                    type="date"
                    value={value?.from ? format(value.from, "yyyy-MM-dd") : ""}
                    onChange={(e) => {
                      if (e.target.value && onChange) {
                        onChange({ from: new Date(e.target.value), to: value?.to });
                      }
                    }}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">To</Label>
                  <Input
                    type="date"
                    value={value?.to ? format(value.to, "yyyy-MM-dd") : ""}
                    onChange={(e) => {
                      if (e.target.value && onChange) {
                        onChange({ from: value?.from, to: new Date(e.target.value) });
                      }
                    }}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
