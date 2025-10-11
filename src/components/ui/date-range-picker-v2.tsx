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
  const [selectionMode, setSelectionMode] = React.useState<'quick' | 'month' | 'year' | 'custom'>('quick');
  const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear());
  const [showCalendar, setShowCalendar] = React.useState(false);

  const handlePresetSelect = (presetValue: PresetValue) => {
    if (presetValue === "custom") {
      setShowCalendar(true);
      setSelectedPreset("custom");
      setSelectionMode('custom');
      return;
    }

    const preset = COMPACT_PRESETS.find(p => p.value === presetValue);
    if (preset && onChange) {
      onChange(preset.getRange());
      setSelectedPreset(presetValue);
      setShowCalendar(false);
      setSelectionMode('quick');
      setOpen(false);
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    const date = new Date(selectedYear, monthIndex, 1);
    const range = {
      from: startOfMonth(date),
      to: endOfMonth(date)
    };
    onChange?.(range);
    setSelectedPreset("custom");
    setSelectionMode('quick');
    setOpen(false);
  };

  const handleYearSelect = (year: number) => {
    const date = new Date(year, 0, 1);
    const range = {
      from: startOfYear(date),
      to: endOfYear(date)
    };
    onChange?.(range);
    setSelectedPreset("custom");
    setSelectionMode('quick');
    setOpen(false);
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
    
    // Check if it's a full month range
    const isFullMonth = value.from && value.to && 
      value.from.getDate() === 1 &&
      value.to.getMonth() === value.from.getMonth() &&
      value.to.getDate() === endOfMonth(value.from).getDate();
    
    if (isFullMonth) {
      return format(value.from, "MMMM yyyy");
    }
    
    // Check if it's a full year range
    const isFullYear = value.from && value.to &&
      value.from.getMonth() === 0 && value.from.getDate() === 1 &&
      value.to.getMonth() === 11 && value.to.getDate() === 31;
    
    if (isFullYear) {
      return format(value.from, "yyyy");
    }
    
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
                <RadioGroupItem 
                  value="select-month" 
                  id="compact-select-month"
                  onClick={() => setSelectionMode('month')}
                />
                <Label htmlFor="compact-select-month" className="text-sm cursor-pointer font-normal">
                  Select month...
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="select-year" 
                  id="compact-select-year"
                  onClick={() => setSelectionMode('year')}
                />
                <Label htmlFor="compact-select-year" className="text-sm cursor-pointer font-normal">
                  Select year...
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="custom" 
                  id="compact-custom"
                  onClick={() => setSelectionMode('custom')}
                />
                <Label htmlFor="compact-custom" className="text-sm cursor-pointer font-normal">
                  Custom range...
                </Label>
              </div>
            </RadioGroup>
          </div>

          {selectionMode === 'month' && (
            <div className="pt-3 border-t space-y-2">
              <Select value={selectedYear.toString()} onValueChange={(y) => setSelectedYear(parseInt(y))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-3 gap-1">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, index) => (
                  <Button
                    key={month}
                    variant="ghost"
                    size="sm"
                    className="text-xs px-1 h-8"
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectionMode === 'year' && (
            <div className="pt-3 border-t">
              <div className="grid grid-cols-2 gap-1">
                {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <Button
                    key={year}
                    variant="ghost"
                    size="sm"
                    className="text-sm h-9"
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectionMode === 'custom' && showCalendar && (
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
  const [monthSelectorYear, setMonthSelectorYear] = React.useState<number>(new Date().getFullYear());

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

  const handleMonthSelect = (monthIndex: number) => {
    const date = new Date(monthSelectorYear, monthIndex, 1);
    const range = {
      from: startOfMonth(date),
      to: endOfMonth(date)
    };
    onChange?.(range);
    setSelectedPreset(null);
    setOpen(false);
  };

  const handleYearSelect = (year: number) => {
    const date = new Date(year, 0, 1);
    const range = {
      from: startOfYear(date),
      to: endOfYear(date)
    };
    onChange?.(range);
    setSelectedPreset(null);
    setOpen(false);
  };

  const formatDisplayText = () => {
    if (!value?.from) return placeholder;
    
    // Check if it's a full month range
    const isFullMonth = value.from && value.to && 
      value.from.getDate() === 1 &&
      value.to.getMonth() === value.from.getMonth() &&
      value.to.getDate() === endOfMonth(value.from).getDate();
    
    if (isFullMonth) {
      return format(value.from, "MMMM yyyy");
    }
    
    // Check if it's a full year range
    const isFullYear = value.from && value.to &&
      value.from.getMonth() === 0 && value.from.getDate() === 1 &&
      value.to.getMonth() === 11 && value.to.getDate() === 31 &&
      value.from.getFullYear() === value.to.getFullYear();
    
    if (isFullYear) {
      return format(value.from, "yyyy");
    }
    
    // Check if it matches a preset
    const matchedPreset = FULL_PRESETS.find(p => isRangeEqual(p.getRange(), value));
    if (matchedPreset) {
      return matchedPreset.label;
    }
    
    // Custom range - show dates
    if (value.to) {
      // If same month, show condensed format
      if (value.from.getMonth() === value.to.getMonth() && 
          value.from.getFullYear() === value.to.getFullYear()) {
        return `${format(value.from, "MMM d")} - ${format(value.to, "d, yyyy")}`;
      }
      // If same year, omit year from first date
      if (value.from.getFullYear() === value.to.getFullYear()) {
        return `${format(value.from, "MMM d")} - ${format(value.to, "MMM d, yyyy")}`;
      }
      // Different years, show full dates
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
            "justify-start text-left font-normal min-w-[240px] transition-all",
            !value && "text-muted-foreground",
            value && "font-medium border-primary/40 hover:border-primary/60",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="flex-1 truncate">{formatDisplayText()}</span>
          {value?.from && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="ml-2 h-6 w-6 p-0 hover:bg-muted-foreground/20"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
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

            {/* Separator */}
            <div className="border-t my-2" />

            {/* Select Month Section */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Select Month
              </p>
              <Select 
                value={monthSelectorYear.toString()} 
                onValueChange={(y) => setMonthSelectorYear(parseInt(y))}
              >
                <SelectTrigger className="w-full h-8 text-sm">
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
              
              <div className="grid grid-cols-3 gap-1">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, index) => (
                  <Button
                    key={month}
                    variant="ghost"
                    size="sm"
                    className="text-xs px-1 h-8"
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month}
                  </Button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="border-t my-2" />

            {/* Select Year Section */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Select Year
              </p>
              <div className="grid grid-cols-2 gap-1">
                {years.slice(0, 6).map((year) => (
                  <Button
                    key={year}
                    variant="ghost"
                    size="sm"
                    className="text-sm h-9"
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </Button>
                ))}
              </div>
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
