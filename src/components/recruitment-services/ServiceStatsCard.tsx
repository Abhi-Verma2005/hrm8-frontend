import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
  className?: string;
}

export function ServiceStatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  change,
  className
}: ServiceStatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {(description || change) && (
              <p className="text-xs text-muted-foreground mt-1">
                {change && trend && (
                  <span className={cn(
                    "font-medium",
                    trend === 'up' && "text-success",
                    trend === 'down' && "text-destructive"
                  )}>
                    {change}
                  </span>
                )}
                {change && description && " "}
                {description}
              </p>
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
