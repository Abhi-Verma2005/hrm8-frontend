import { useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker-v2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, X, Calendar } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRangePresets } from "./DateRangePresets";

interface DateRangeComparisonProps {
  primaryRange?: DateRange;
  comparisonRange?: DateRange;
  onPrimaryRangeChange: (range: DateRange | undefined) => void;
  onComparisonRangeChange: (range: DateRange | undefined) => void;
  onDisableComparison: () => void;
}

export function DateRangeComparison({
  primaryRange,
  comparisonRange,
  onPrimaryRangeChange,
  onComparisonRangeChange,
  onDisableComparison,
}: DateRangeComparisonProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">Comparison Mode</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDisableComparison}
            className="h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-xs">
          Compare metrics between two time periods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Primary Period */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs">Period A</Badge>
            <span className="text-xs text-muted-foreground">
              {primaryRange?.from && primaryRange?.to
                ? `${format(primaryRange.from, "MMM d, yyyy")} - ${format(primaryRange.to, "MMM d, yyyy")}`
                : "Select period"}
            </span>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <div>
                <DateRangePicker
                  value={primaryRange}
                  onChange={onPrimaryRangeChange}
                  placeholder="Select Period A"
                  size="sm"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <DateRangePresets
                onSelectPreset={onPrimaryRangeChange}
                currentRange={primaryRange}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Comparison Period */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">Period B</Badge>
            <span className="text-xs text-muted-foreground">
              {comparisonRange?.from && comparisonRange?.to
                ? `${format(comparisonRange.from, "MMM d, yyyy")} - ${format(comparisonRange.to, "MMM d, yyyy")}`
                : "Select period"}
            </span>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <div>
                <DateRangePicker
                  value={comparisonRange}
                  onChange={onComparisonRangeChange}
                  placeholder="Select Period B"
                  size="sm"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <DateRangePresets
                onSelectPreset={onComparisonRangeChange}
                currentRange={comparisonRange}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
