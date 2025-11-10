/**
 * @deprecated This component has been replaced by EnhancedStatCard.
 * Please use EnhancedStatCard from @/components/dashboard/EnhancedStatCard instead.
 * 
 * EnhancedStatCard provides:
 * - Consistent styling across all dashboards
 * - Action menus with contextual options
 * - Better customization options (size, layout, elevation)
 * - Currency formatting support
 * - Improved hover effects and animations
 * 
 * Migration guide:
 * Old: <StatsCard title="..." value={...} icon={Icon} description="..." />
 * New: <EnhancedStatCard title="..." value={...} change="+10%" trend="up" icon={<Icon className="h-6 w-6" />} variant="neutral" />
 */

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  change?: string;
  isLoading?: boolean;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  change,
  isLoading,
  className
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card className={cn("shadow-md", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              {description && <Skeleton className="h-3 w-40" />}
            </div>
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <p className={`text-xs font-medium ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
              </p>
            )}
            {change && (
              <p className="text-xs text-muted-foreground">{change}</p>
            )}
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
