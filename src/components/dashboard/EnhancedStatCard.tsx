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
import { useCurrencyFormat } from "@/contexts/CurrencyFormatContext";

interface EnhancedStatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "neutral";
  showAction?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  showMenu?: boolean;
  menuItems?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }>;
  isCurrency?: boolean;
  rawValue?: number;
  size?: "default" | "compact" | "large";
  layout?: "vertical" | "horizontal";
  elevation?: "none" | "sm" | "md" | "lg";
  showGradient?: boolean;
  showBorder?: boolean;
  iconPosition?: "left" | "right" | "top";
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
  showMenu = false,
  menuItems = [],
  isCurrency = false,
  rawValue,
  size = "default",
  layout = "vertical",
  elevation = "md",
  showGradient = true,
  showBorder = true,
  iconPosition = "left",
}: EnhancedStatCardProps) {
  const { formatCurrency } = useCurrencyFormat();
  
  // Format the display value
  const displayValue = isCurrency && rawValue !== undefined 
    ? formatCurrency(rawValue) 
    : value;
  const sizeStyles = {
    compact: "p-4",
    default: "p-6",
    large: "p-8",
  };

  const valueSizeStyles = {
    compact: "text-2xl",
    default: "text-3xl",
    large: "text-4xl",
  };

  const elevationStyles = {
    none: "",
    sm: "hover:shadow-md",
    md: "hover:shadow-lg",
    lg: "hover:shadow-xl",
  };

  const variantStyles = {
    primary: showBorder ? "border-l-6 border-l-blue-500" : "",
    success: showBorder ? "border-l-6 border-l-emerald-500" : "",
    warning: showBorder ? "border-l-6 border-l-orange-500" : "",
    neutral: showBorder ? "border-l-6 border-l-purple-500" : "",
  };

  const gradientStyles = {
    primary: showGradient ? "bg-gradient-to-br from-blue-50/50 to-cyan-50/30" : "",
    success: showGradient ? "bg-gradient-to-br from-emerald-50/50 to-green-50/30" : "",
    warning: showGradient ? "bg-gradient-to-br from-orange-50/50 to-amber-50/30" : "",
    neutral: showGradient ? "bg-gradient-to-br from-purple-50/50 to-indigo-50/30" : "",
  };

  const iconBgStyles = {
    primary: "bg-blue-500 text-white shadow-lg shadow-blue-500/30",
    success: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30",
    warning: "bg-orange-500 text-white shadow-lg shadow-orange-500/30",
    neutral: "bg-purple-500 text-white shadow-lg shadow-purple-500/30",
  };

  const iconSizeStyles = {
    compact: "p-2",
    default: "p-3",
    large: "p-4",
  };

  return (
    <Card
      className={cn(
        sizeStyles[size],
        "transition-all duration-300 cursor-pointer group relative h-full flex flex-col justify-between",
        variantStyles[variant],
        gradientStyles[variant],
        elevation !== "none" && `${elevationStyles[elevation]} hover:-translate-y-1`
      )}
    >
      <div className={cn(
        "flex items-start justify-between mb-4",
        layout === "horizontal" && "flex-row items-center",
        showMenu && "pr-8"
      )}>
        <div className={cn("rounded-xl shadow-md", iconBgStyles[variant], iconSizeStyles[size])}>
          {icon}
        </div>
        <Badge
          className={cn(
            "shadow-sm -mt-[2px]",
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
      <h3 className={cn(valueSizeStyles[size], "font-bold tracking-tight")}>{displayValue}</h3>

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

      {showMenu && menuItems.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-4 right-4 opacity-60 hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
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
    </Card>
  );
}
