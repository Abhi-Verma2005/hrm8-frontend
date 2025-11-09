import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronUp,
  User,
  Globe,
  Monitor,
  Clock,
  Database,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: string;
  category: string;
  entityType: string;
  entityId: string;
  changes: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed";
}

interface AuditLogTimelineProps {
  logs: AuditLog[];
  onLogClick?: (log: AuditLog) => void;
}

const categoryColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  pricing: { 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/30", 
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500"
  },
  commission: { 
    bg: "bg-green-500/10", 
    border: "border-green-500/30", 
    text: "text-green-600 dark:text-green-400",
    dot: "bg-green-500"
  },
  territory: { 
    bg: "bg-purple-500/10", 
    border: "border-purple-500/30", 
    text: "text-purple-600 dark:text-purple-400",
    dot: "bg-purple-500"
  },
  currency: { 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/30", 
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500"
  },
  security: { 
    bg: "bg-red-500/10", 
    border: "border-red-500/30", 
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500"
  },
  settings: { 
    bg: "bg-slate-500/10", 
    border: "border-slate-500/30", 
    text: "text-slate-600 dark:text-slate-400",
    dot: "bg-slate-500"
  },
  audit: { 
    bg: "bg-cyan-500/10", 
    border: "border-cyan-500/30", 
    text: "text-cyan-600 dark:text-cyan-400",
    dot: "bg-cyan-500"
  },
};

export function AuditLogTimeline({ logs, onLogClick }: AuditLogTimelineProps) {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  const toggleExpanded = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const isExpanded = (logId: string) => expandedLogs.has(logId);

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || categoryColors.settings;
  };

  // Group logs by date
  const groupedLogs = logs.reduce((groups, log) => {
    const date = log.timestamp.split(" ")[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, AuditLog[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedLogs).map(([date, dateLogs]) => (
        <div key={date} className="space-y-4">
          {/* Date Header */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              {date}
            </div>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Timeline Items */}
          <div className="relative pl-8 space-y-4">
            {/* Vertical Line */}
            <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-border" />

            {dateLogs.map((log, index) => {
              const colors = getCategoryColor(log.category);
              const expanded = isExpanded(log.id);

              return (
                <Collapsible
                  key={log.id}
                  open={expanded}
                  onOpenChange={() => toggleExpanded(log.id)}
                >
                  <Card
                    className={cn(
                      "relative transition-all duration-200 hover:shadow-md",
                      colors.bg,
                      colors.border,
                      "border-l-4"
                    )}
                  >
                    {/* Timeline Dot */}
                    <div
                      className={cn(
                        "absolute -left-8 top-6 h-5 w-5 rounded-full border-4 border-background",
                        colors.dot
                      )}
                    />

                    <CollapsibleTrigger className="w-full">
                      <div className="p-4 cursor-pointer">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className={cn("capitalize", colors.text)}>
                                {log.category}
                              </Badge>
                              <Badge
                                variant={log.status === "success" ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {log.status}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-foreground mb-1">
                              {log.action}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {log.user} • {log.timestamp.split(" ")[1]}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {expanded ? "Hide" : "Show"} details
                            </span>
                            {expanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="animate-accordion-down">
                      <div className="px-4 pb-4 pt-2 space-y-3 border-t border-border/50">
                        {/* Changes */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Changes</p>
                          <p className="text-sm bg-background/50 rounded p-2 border border-border/30">
                            {log.changes}
                          </p>
                        </div>

                        {/* Entity Info */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                              <Database className="h-3 w-3" />
                              Entity Type
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {log.entityType}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                              <Tag className="h-3 w-3" />
                              Entity ID
                            </p>
                            <p className="text-xs font-mono bg-background/50 rounded px-2 py-1 border border-border/30">
                              {log.entityId}
                            </p>
                          </div>
                        </div>

                        {/* User & Network Info */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                              <User className="h-3 w-3" />
                              User ID
                            </p>
                            <p className="text-xs font-mono bg-background/50 rounded px-2 py-1 border border-border/30">
                              {log.userId}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                              <Globe className="h-3 w-3" />
                              IP Address
                            </p>
                            <p className="text-xs font-mono bg-background/50 rounded px-2 py-1 border border-border/30">
                              {log.ipAddress}
                            </p>
                          </div>
                        </div>

                        {/* User Agent */}
                        <div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                            <Monitor className="h-3 w-3" />
                            User Agent
                          </p>
                          <p className="text-xs font-mono bg-background/50 rounded p-2 border border-border/30 break-all">
                            {log.userAgent}
                          </p>
                        </div>

                        {/* View Full Details Button */}
                        {onLogClick && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onLogClick(log);
                            }}
                            className="text-xs text-primary hover:underline font-medium"
                          >
                            View full details →
                          </button>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>
        </div>
      ))}

      {logs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No audit logs found matching your filters.
        </div>
      )}
    </div>
  );
}
