import { Badge } from "@/components/ui/badge";
import { getPriorityColor } from "@/lib/employerModuleUtils";
import { AlertCircle, Flag } from "lucide-react";

interface PriorityBadgeProps {
  priority?: 'low' | 'medium' | 'high' | 'critical';
  showIcon?: boolean;
  className?: string;
}

export function PriorityBadge({ priority, showIcon = true, className }: PriorityBadgeProps) {
  if (!priority) {
    return null;
  }

  const priorityLabels: Record<typeof priority, string> = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'critical': 'Critical'
  };

  const Icon = priority === 'critical' ? AlertCircle : Flag;

  return (
    <Badge 
      variant="outline" 
      className={`${getPriorityColor(priority)} ${className || ''}`}
    >
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {priorityLabels[priority]}
    </Badge>
  );
}
