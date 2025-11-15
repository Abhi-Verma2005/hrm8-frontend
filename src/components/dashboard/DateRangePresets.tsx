import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { subDays, startOfQuarter, endOfQuarter, subQuarters, startOfYear, endOfYear, subYears } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface DateRangePresetsProps {
  onSelectPreset: (range: DateRange) => void;
  currentRange?: DateRange;
  className?: string;
}

interface Preset {
  label: string;
  getRange: () => DateRange;
}

const PRESETS: Preset[] = [
  {
    label: "Last 7 days",
    getRange: () => ({ from: subDays(new Date(), 6), to: new Date() })
  },
  {
    label: "Last 30 days",
    getRange: () => ({ from: subDays(new Date(), 29), to: new Date() })
  },
  {
    label: "This quarter",
    getRange: () => ({ from: startOfQuarter(new Date()), to: endOfQuarter(new Date()) })
  },
  {
    label: "Last quarter",
    getRange: () => ({ from: startOfQuarter(subQuarters(new Date(), 1)), to: endOfQuarter(subQuarters(new Date(), 1)) })
  },
  {
    label: "This year",
    getRange: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) })
  },
  {
    label: "Last year",
    getRange: () => ({ from: startOfYear(subYears(new Date(), 1)), to: endOfYear(subYears(new Date(), 1)) })
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

export function DateRangePresets({ onSelectPreset, currentRange, className }: DateRangePresetsProps) {
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <div className="flex items-center gap-1 text-sm text-muted-foreground mr-1">
        <Calendar className="h-3.5 w-3.5" />
        <span className="font-medium">Quick:</span>
      </div>
      {PRESETS.map((preset) => {
        const range = preset.getRange();
        const isActive = isRangeEqual(range, currentRange);
        
        return (
          <Button
            key={preset.label}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectPreset(range)}
            className={cn(
              "h-7 text-xs",
              isActive && "pointer-events-none"
            )}
          >
            {preset.label}
          </Button>
        );
      })}
    </div>
  );
}
