import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EnhancedStatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "neutral";
  description?: string;
  showAction?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  showMenu?: boolean;
  menuItems?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }>;
}

export function EnhancedStatCard({
  title,
  value,
  change,
  trend,
  icon,
  variant = "neutral",
  description,
  showAction = false,
  actionLabel = "View",
  onAction,
  showMenu = false,
  menuItems = [],
}: EnhancedStatCardProps) {
  const variantStyles = {
    primary: "bg-cyan-50/50 dark:bg-cyan-950/20 border-cyan-100 dark:border-cyan-900/30",
    success: "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30",
    warning: "bg-orange-50/50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30",
    neutral: "bg-card border-border",
  };

  const iconBgStyles = {
    primary: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400",
    success: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
    warning: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400",
    neutral: "bg-muted text-muted-foreground",
  };

  return (
    <Card
      className={cn(
        "p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group relative h-full flex flex-col border",
        variantStyles[variant]
      )}
    >
      {/* Header: Icon + Title + Menu */}
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("p-2 rounded-lg", iconBgStyles[variant])}>
          <div className="h-5 w-5 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <p className="text-xs font-medium text-muted-foreground flex-1">{title}</p>
        {showMenu && menuItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-6 w-6 opacity-60 hover:opacity-100 transition-opacity -mr-1"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {menuItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick();
                  }}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Value */}
      <h3 className="text-3xl font-bold tracking-tight mb-3">{value}</h3>

      {/* Footer: Badge + Description */}
      <div className="flex items-center gap-2 mt-auto">
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] px-1.5 py-0.5 h-5",
            trend === "up"
              ? "bg-success/10 text-success border-success/30"
              : "bg-destructive/10 text-destructive border-destructive/30"
          )}
        >
          {trend === "up" ? (
            <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
          ) : (
            <TrendingDown className="h-2.5 w-2.5 mr-0.5" />
          )}
          {change}
        </Badge>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>

      {showAction && onAction && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
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
