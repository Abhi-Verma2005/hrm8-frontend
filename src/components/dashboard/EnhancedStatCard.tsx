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
  trend?: "up" | "down";
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
  elevation = "none",
  showGradient = false,
  showBorder = false,
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
    compact: "text-xl",
    default: "text-2xl",
    large: "text-3xl",
  };

  const elevationStyles = {
    none: "",
    sm: "hover:shadow-md",
    md: "hover:shadow-lg",
    lg: "hover:shadow-xl",
  };

  const variantStyles = {
    primary: showBorder ? "border-l-6 border-l-blue-500 dark:border-l-blue-400" : "",
    success: showBorder ? "border-l-6 border-l-emerald-500 dark:border-l-emerald-400" : "",
    warning: showBorder ? "border-l-6 border-l-orange-500 dark:border-l-orange-400" : "",
    neutral: showBorder ? "border-l-6 border-l-purple-500 dark:border-l-purple-400" : "",
  };

  // Base gradient that always shows with borders
  const borderGradientStyles = {
    primary: showBorder ? "bg-gradient-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-950/30 dark:to-cyan-950/20" : "",
    success: showBorder ? "bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-950/30 dark:to-green-950/20" : "",
    warning: showBorder ? "bg-gradient-to-br from-orange-50/50 to-amber-50/30 dark:from-orange-950/30 dark:to-amber-950/20" : "",
    neutral: showBorder ? "bg-gradient-to-br from-purple-50/50 to-indigo-50/30 dark:from-purple-950/30 dark:to-indigo-950/20" : "",
  };

  // Additional gradient overlay (controlled by showGradient prop)
  const overlayGradientStyles = {
    primary: showGradient ? "bg-gradient-to-br from-blue-100/30 to-transparent dark:from-blue-900/20 dark:to-transparent" : "",
    success: showGradient ? "bg-gradient-to-br from-emerald-100/30 to-transparent dark:from-emerald-900/20 dark:to-transparent" : "",
    warning: showGradient ? "bg-gradient-to-br from-orange-100/30 to-transparent dark:from-orange-900/20 dark:to-transparent" : "",
    neutral: showGradient ? "bg-gradient-to-br from-purple-100/30 to-transparent dark:from-purple-900/20 dark:to-transparent" : "",
  };

  const iconBgStyles = {
    primary: "bg-blue-500 text-white shadow-lg shadow-blue-500/30 dark:bg-blue-600 dark:shadow-blue-600/40",
    success: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 dark:bg-emerald-600 dark:shadow-emerald-600/40",
    warning: "bg-orange-500 text-white shadow-lg shadow-orange-500/30 dark:bg-orange-600 dark:shadow-orange-600/40",
    neutral: "bg-purple-500 text-white shadow-lg shadow-purple-500/30 dark:bg-purple-600 dark:shadow-purple-600/40",
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
        "relative h-full flex flex-col justify-between overflow-hidden",
        "transition-colors",
        variantStyles[variant],
        borderGradientStyles[variant],
        overlayGradientStyles[variant],
        elevation !== "none" && `${elevationStyles[elevation]}`
      )}
    >
      <div className={cn(
        "flex items-center justify-between mb-4 gap-2 flex-wrap min-w-0",
        layout === "horizontal" && "flex-row items-center",
        showMenu && "pr-8"
      )}>
        <div className={cn(
          "rounded-full shadow-md flex items-center justify-center w-10 h-10 flex-none",
          iconBgStyles[variant]
        )}>
          {icon}
        </div>
        <Badge
          variant="outline"
          className={cn(
            "px-2.5 py-1 rounded-full inline-flex items-start gap-1 text-xs leading-tight max-w-full break-words",
            trend === "up"
              ? "bg-success/10 text-success border-success/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          )}
        >
          {trend === "up" ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1" />
          )}
          <span className="block">{change}</span>
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-2 font-medium">
        {title}
      </p>
      <h3 className={cn(
        valueSizeStyles[size], 
        "font-bold tracking-tight"
      )}>
        {displayValue}
      </h3>

      {showAction && onAction && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-4 right-4"
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
              className="absolute top-4 right-4 opacity-70"
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
