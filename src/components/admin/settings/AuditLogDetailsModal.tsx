import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Clock, 
  Globe, 
  Monitor, 
  Activity, 
  FileText, 
  Tag,
  Database,
  History
} from "lucide-react";

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

interface AuditLogDetailsModalProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
  relatedLogs?: AuditLog[];
}

export function AuditLogDetailsModal({
  log,
  isOpen,
  onClose,
  relatedLogs = [],
}: AuditLogDetailsModalProps) {
  if (!log) return null;

  // Parse user agent to extract browser and OS info
  const parseUserAgent = (ua: string) => {
    const browserMatch = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/);
    const osMatch = ua.match(/\(([^)]+)\)/);
    return {
      browser: browserMatch ? browserMatch[0] : "Unknown",
      os: osMatch ? osMatch[1] : "Unknown",
      full: ua,
    };
  };

  const userAgentInfo = parseUserAgent(log.userAgent);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <DialogTitle>Audit Log Details</DialogTitle>
          </div>
          <DialogDescription>
            Complete information for audit log entry #{log.id}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Status Banner */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">{log.action}</h3>
                  <p className="text-sm text-muted-foreground">{log.timestamp}</p>
                </div>
              </div>
              <Badge
                variant={log.status === "success" ? "default" : "destructive"}
                className="text-sm"
              >
                {log.status}
              </Badge>
            </div>

            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{log.user}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">User ID</p>
                    <p className="font-mono text-sm">{log.userId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entity Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Entity Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Entity Type</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="capitalize">
                        {log.entityType}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entity ID</p>
                    <p className="font-mono text-sm">{log.entityId}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Category</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="outline" className="capitalize">
                        {log.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Changes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Changes Made
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{log.changes}</p>
                </div>
              </CardContent>
            </Card>

            {/* Network & Device Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Network & Device Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Globe className="h-3 w-3" />
                      IP Address
                    </p>
                    <p className="font-mono text-sm mt-1">{log.ipAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Timestamp
                    </p>
                    <p className="font-mono text-sm mt-1">{log.timestamp}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                    <Monitor className="h-3 w-3" />
                    User Agent Details
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-20">Browser:</span>
                      <Badge variant="secondary" className="text-xs">
                        {userAgentInfo.browser}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-20">OS:</span>
                      <Badge variant="secondary" className="text-xs">
                        {userAgentInfo.os}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Full User Agent:</p>
                      <p className="text-xs font-mono bg-muted/30 p-2 rounded break-all">
                        {userAgentInfo.full}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Logs */}
            {relatedLogs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Related Logs ({relatedLogs.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {relatedLogs.slice(0, 5).map((relatedLog) => (
                      <div
                        key={relatedLog.id}
                        className="p-3 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{relatedLog.action}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {relatedLog.timestamp} • {relatedLog.user}
                            </p>
                          </div>
                          <Badge
                            variant={relatedLog.status === "success" ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {relatedLog.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {relatedLogs.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        And {relatedLogs.length - 5} more related log(s)
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
