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
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis } from "recharts";

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
  chartData?: Array<{ name: string; value: number; secondary?: number }>;
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
  chartData,
}: EnhancedStatCardProps) {
  const { formatCurrency } = useCurrencyFormat();

  // Format the display value
  const displayValue = isCurrency && rawValue !== undefined
    ? formatCurrency(rawValue)
    : (typeof value === 'number' && isNaN(value)) ? 0 : value;

  // Generate default chart data if not provided
  const defaultChartData = chartData || Array.from({ length: 12 }, (_, i) => ({
    name: `${i + 1}`,
    value: Math.floor(Math.random() * 100) + 50,
    secondary: Math.floor(Math.random() * 80) + 40,
  }));

  const sizeStyles = {
    compact: "p-2 sm:p-3",
    default: "p-3 sm:p-4 md:p-4",
    large: "p-4 sm:p-5 md:p-6",
  };

  const valueSizeStyles = {
    compact: "text-xl sm:text-2xl",
    default: "text-2xl sm:text-3xl",
    large: "text-3xl sm:text-4xl md:text-5xl",
  };

  // Chart color based on variant - using lighter, more subtle colors
  const chartColor = {
    primary: "hsl(var(--primary) / 0.6)",
    success: "hsl(var(--success) / 0.6)",
    warning: "hsl(var(--warning) / 0.6)",
    neutral: "hsl(215 20% 55%)", // Lighter blue-gray
  }[variant];

  return (
    <Card
      className={cn(
        sizeStyles[size],
        "relative h-full flex flex-col overflow-hidden",
        "group cursor-default",
        "border border-border/60 bg-card"
      )}
    >
      {/* Content wrapper */}
      <div className="relative flex flex-col h-full">
        {/* Header Section: Icon, Title and Menu */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
            <div className="text-muted-foreground [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5">
              {icon}
            </div>
            <h4 className="text-xs sm:text-sm font-semibold text-foreground tracking-wide truncate">
              {title}
            </h4>
          </div>

          {showMenu && menuItems.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-6 w-6 sm:h-7 sm:w-7 opacity-60 hover:opacity-100 transition-opacity duration-200",
                    "hover:bg-muted/60"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-foreground" />
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

        {/* Main Value Section */}
        <div className="mb-2 sm:mb-3">
          <h3 className={cn(
            valueSizeStyles[size],
            "font-bold tracking-tight text-foreground mb-1 sm:mb-1.5",
            "leading-none"
          )}>
            {displayValue}
          </h3>

          {/* Change text - integrated into design with blinking colored arrow and colored text */}
          <div className={cn(
            "flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs",
            trend === "up" && "text-emerald-600 dark:text-emerald-400",
            trend === "down" && "text-red-600 dark:text-red-400",
            !trend && "text-muted-foreground"
          )}>
            {trend === "up" && (
              <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 animate-[blink_1.5s_ease-in-out_infinite]" />
            )}
            {trend === "down" && (
              <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 animate-[blink_1.5s_ease-in-out_infinite]" />
            )}
            <span>{change}</span>
          </div>
          <style>{`
          @keyframes blink {
            0%, 100% { 
              opacity: 1; 
              transform: scale(1);
            }
            50% { 
              opacity: 0.4; 
              transform: scale(0.95);
            }
          }
        `}</style>
        </div>

        {/* Mini Chart Section */}
        <div className="mt-auto -mx-3 sm:-mx-4 md:-mx-5 -mb-3 sm:-mb-4 md:-mb-5 h-[60px] sm:h-[75px] md:h-[90px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={defaultChartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${variant}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <YAxis hide domain={[0, 'auto']} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#gradient-${variant})`}
                dot={false}
                activeDot={false}
                baseLine={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {showAction && onAction && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}
