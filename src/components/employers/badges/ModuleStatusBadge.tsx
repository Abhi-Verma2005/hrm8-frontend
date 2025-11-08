import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface ModuleStatusBadgeProps {
  enabled: boolean;
  moduleName: string;
  className?: string;
}

export function ModuleStatusBadge({ enabled, moduleName, className }: ModuleStatusBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={`${
        enabled 
          ? 'bg-green-500/10 text-green-600 border-green-500/20' 
          : 'bg-muted text-muted-foreground border-border'
      } ${className || ''}`}
    >
      {enabled ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
      {moduleName}
    </Badge>
  );
}
