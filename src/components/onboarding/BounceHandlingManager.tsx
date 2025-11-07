import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  getBounceRecords, 
  getEmailHealthStatuses, 
  recordBounce, 
  unblockEmail, 
  clearBounceHistory,
  getBounceStatistics,
  type EmailHealthStatus 
} from "@/lib/bounceHandling";
import { getOnboardingWorkflows } from "@/lib/onboardingStorage";
import { toast } from "sonner";
import { AlertTriangle, Shield, CheckCircle2, XCircle, Trash2, RefreshCw, Search } from "lucide-react";
import { format } from "date-fns";

export function BounceHandlingManager() {
  const [bounceRecords] = useState(getBounceRecords());
  const [healthStatuses, setHealthStatuses] = useState<EmailHealthStatus[]>(getEmailHealthStatuses());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'warning' | 'blocked'>('all');

  const workflows = useMemo(() => getOnboardingWorkflows(), []);
  const stats = useMemo(() => getBounceStatistics(), [bounceRecords]);

  const refreshData = () => {
    setHealthStatuses(getEmailHealthStatuses());
  };

  const filteredStatuses = useMemo(() => {
    return healthStatuses.filter(status => {
      const matchesSearch = status.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = statusFilter === 'all' || status.status === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [healthStatuses, searchQuery, statusFilter]);

  const handleSimulateBounce = (email: string, type: 'hard' | 'soft' | 'complaint') => {
    const reasons = {
      hard: 'Mailbox does not exist',
      soft: 'Mailbox full',
      complaint: 'Recipient marked as spam',
    };
    
    recordBounce(email, type, reasons[type]);
    toast.success(`${type} bounce recorded for ${email}`);
    refreshData();
  };

  const handleUnblock = (email: string) => {
    unblockEmail(email);
    toast.success(`${email} has been unblocked`);
    refreshData();
  };

  const handleClearHistory = (email: string) => {
    clearBounceHistory(email);
    toast.success(`Bounce history cleared for ${email}`);
    refreshData();
  };

  const getStatusBadge = (status: EmailHealthStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-600"><AlertTriangle className="h-3 w-3 mr-1" />Warning</Badge>;
      case 'blocked':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Blocked</Badge>;
    }
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) return <Badge variant="destructive">High Risk</Badge>;
    if (score >= 30) return <Badge className="bg-yellow-600">Medium Risk</Badge>;
    return <Badge className="bg-green-600">Low Risk</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Bounce Handling & Email Health
        </h3>
        <p className="text-sm text-muted-foreground">
          Monitor and manage email bounces to maintain sender reputation
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Bounces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBounces}</div>
            <p className="text-xs text-muted-foreground">
              All time bounces
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Hard Bounces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.hardBounces}</div>
            <p className="text-xs text-muted-foreground">
              Permanent failures
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Soft Bounces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.softBounces}</div>
            <p className="text-xs text-muted-foreground">
              Temporary failures
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.blockedEmails}</div>
            <p className="text-xs text-muted-foreground">
              {stats.warningEmails} at warning
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="healthy">Healthy</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Email Health List */}
      {filteredStatuses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {healthStatuses.length === 0 
                ? "No email health data yet. Send some emails to start monitoring." 
                : "No emails match your filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredStatuses.map(status => {
            const workflow = workflows.find(w => w.employeeEmail === status.email);
            
            return (
              <Card key={status.email}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {workflow?.employeeName || status.email}
                        {getStatusBadge(status.status)}
                        {getRiskBadge(status.riskScore)}
                      </CardTitle>
                      <CardDescription>{status.email}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {status.isBlocked && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUnblock(status.email)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Unblock
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleClearHistory(status.email)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Metrics */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                      <p className="text-2xl font-bold">{status.riskScore}/100</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Hard Bounces</p>
                      <p className="text-2xl font-bold text-red-600">{status.hardBounces}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Soft Bounces</p>
                      <p className="text-2xl font-bold text-yellow-600">{status.softBounces}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Complaints</p>
                      <p className="text-2xl font-bold text-orange-600">{status.complaints}</p>
                    </div>
                  </div>

                  {status.lastBounce && (
                    <div className="text-sm text-muted-foreground">
                      Last bounce: {format(new Date(status.lastBounce), 'PPp')}
                    </div>
                  )}

                  {/* Simulate Bounces (Demo) */}
                  {!status.isBlocked && (
                    <div className="flex gap-2 pt-2 border-t">
                      <p className="text-sm text-muted-foreground self-center">Simulate:</p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSimulateBounce(status.email, 'soft')}
                      >
                        Soft Bounce
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSimulateBounce(status.email, 'hard')}
                      >
                        Hard Bounce
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSimulateBounce(status.email, 'complaint')}
                      >
                        Complaint
                      </Button>
                    </div>
                  )}

                  {status.isBlocked && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <p className="text-sm font-medium text-destructive">
                        ⚠️ This email address is blocked from receiving emails
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {status.hardBounces > 0 && "Hard bounces indicate the email address doesn't exist. "}
                        {status.complaints > 0 && "Spam complaints were received from this address. "}
                        Review and unblock if this was a mistake.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">About Bounce Handling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Hard Bounce:</strong> Permanent failure (mailbox doesn't exist). Email blocked after 1 occurrence.</p>
          <p><strong>Soft Bounce:</strong> Temporary failure (mailbox full, server down). Email blocked after 5 occurrences.</p>
          <p><strong>Complaint:</strong> Recipient marked email as spam. Email blocked after 1 complaint.</p>
          <p className="text-muted-foreground pt-2">
            Maintaining a clean email list protects your sender reputation and improves deliverability.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
