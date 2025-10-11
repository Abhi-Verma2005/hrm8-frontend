import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EnhancedStatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "neutral";
  showAction?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export function EnhancedStatCard({
  title,
  value,
  change,
  trend,
  icon,
  variant = "neutral",
  showAction = false,
  actionLabel = "View",
  onAction,
}: EnhancedStatCardProps) {
  const variantStyles = {
    primary: "border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-transparent",
    success: "border-l-4 border-l-success bg-gradient-to-br from-success/5 to-transparent",
    warning: "border-l-4 border-l-warning bg-gradient-to-br from-warning/5 to-transparent",
    neutral: "border-l-4 border-l-muted-foreground bg-card",
  };

  const iconBgStyles = {
    primary: "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground",
    success: "bg-gradient-to-br from-success to-success/80 text-white",
    warning: "bg-gradient-to-br from-warning to-warning/80 text-white",
    neutral: "bg-muted text-muted-foreground",
  };

  return (
    <Card
      className={cn(
        "p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group relative",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-xl shadow-md", iconBgStyles[variant])}>
          {icon}
        </div>
        <Badge
          className={cn(
            "shadow-sm",
            trend === "up"
              ? "bg-success/10 text-success border-success/20 hover:bg-success/20"
              : "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20"
          )}
        >
          {trend === "up" ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1" />
          )}
          {change}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-2 font-medium">{title}</p>
      <h3 className="text-3xl font-bold tracking-tight">{value}</h3>

      {showAction && onAction && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onAction();
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
