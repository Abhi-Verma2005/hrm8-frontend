import { Badge } from "@/components/ui/badge";
import { getHealthScoreColor } from "@/lib/employerModuleUtils";
import { Activity } from "lucide-react";

interface HealthScoreBadgeProps {
  score?: number;
  showIcon?: boolean;
  className?: string;
}

export function HealthScoreBadge({ score, showIcon = true, className }: HealthScoreBadgeProps) {
  if (!score) {
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
        N/A
      </Badge>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className={`${getHealthScoreColor(score)} ${className || ''}`}
    >
      {showIcon && <Activity className="w-3 h-3 mr-1" />}
      {score}/100
    </Badge>
  );
}
