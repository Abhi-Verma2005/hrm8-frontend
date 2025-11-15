import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonStatCardProps {
  title: string;
  icon?: React.ReactNode;
  primaryValue: string;
  primaryLabel?: string | number;
  comparisonValue: string;
  comparisonLabel?: string | number;
  change?: number; // Percentage change
  changeLabel?: string;
  trend?: "up" | "down" | "neutral";
  formatValue?: (value: string) => string;
}

export function ComparisonStatCard({
  title,
  icon,
  primaryValue,
  primaryLabel = "Period A",
  comparisonValue,
  comparisonLabel = "Period B",
  change,
  changeLabel,
  trend,
  formatValue = (v) => v,
}: ComparisonStatCardProps) {
  // Auto-detect trend if not provided
  const detectedTrend = trend || (change && change > 0 ? "up" : change && change < 0 ? "down" : "neutral");
  
  const TrendIcon = detectedTrend === "up" ? TrendingUp : detectedTrend === "down" ? TrendingDown : Minus;
  
  const trendColor = detectedTrend === "up" 
    ? "text-green-600 dark:text-green-400" 
    : detectedTrend === "down" 
    ? "text-red-600 dark:text-red-400" 
    : "text-muted-foreground";

  const bgColor = detectedTrend === "up"
    ? "bg-green-50 dark:bg-green-950/20"
    : detectedTrend === "down"
    ? "bg-red-50 dark:bg-red-950/20"
    : "bg-muted/20";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {icon && <div className="text-muted-foreground">{icon}</div>}
          </div>

          {/* Period A */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <Badge variant="default" className="text-[10px] h-4 px-1.5">A</Badge>
              <span className="text-xs text-muted-foreground">{primaryLabel}</span>
            </div>
            <p className="text-2xl font-bold">{formatValue(primaryValue)}</p>
          </div>

          {/* Comparison Divider */}
          <div className="flex items-center gap-2 py-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">vs</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Period B */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">B</Badge>
              <span className="text-xs text-muted-foreground">{comparisonLabel}</span>
            </div>
            <p className="text-2xl font-bold">{formatValue(comparisonValue)}</p>
          </div>

          {/* Change Indicator */}
          {change !== undefined && (
            <div className={cn("flex items-center gap-2 p-2 rounded-md", bgColor)}>
              <TrendIcon className={cn("h-4 w-4", trendColor)} />
              <div className="flex-1">
                <p className={cn("text-sm font-semibold", trendColor)}>
                  {change > 0 ? "+" : ""}{change.toFixed(1)}%
                </p>
                {changeLabel && (
                  <p className="text-xs text-muted-foreground">{changeLabel}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
