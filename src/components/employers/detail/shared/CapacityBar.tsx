import { LucideIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CapacityBarProps {
  label: string;
  current: number;
  max: number;
  icon: LucideIcon;
  format?: 'number' | 'currency';
  warning?: boolean;
}

export function CapacityBar({ 
  label, 
  current, 
  max, 
  icon: Icon, 
  format = 'number',
  warning = false
}: CapacityBarProps) {
  const percentage = max === Infinity ? 0 : Math.min((current / max) * 100, 100);
  const isUnlimited = max === Infinity;
  
  const formatValue = (val: number) => {
    if (format === 'currency') {
      return `$${val.toLocaleString()}`;
    }
    return val.toLocaleString();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {formatValue(current)} / {isUnlimited ? '∞' : formatValue(max)}
        </span>
      </div>
      {!isUnlimited && (
        <div className="space-y-1">
          <Progress 
            value={percentage} 
            className={warning ? '[&>div]:bg-destructive' : ''}
          />
          <p className="text-xs text-muted-foreground text-right">
            {percentage.toFixed(0)}% used
          </p>
        </div>
      )}
    </div>
  );
}
