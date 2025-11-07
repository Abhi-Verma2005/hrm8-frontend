import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, TrendingUp, Mail, AlertCircle } from "lucide-react";
import { getScheduledEmails, ScheduledEmail } from "@/lib/scheduledEmails";
import { getAutomationRules } from "@/lib/automatedReminders";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function AutomationMetricsDashboard() {
  const scheduledEmails = useMemo(() => getScheduledEmails(), []);
  const automationRules = useMemo(() => getAutomationRules(), []);

  const metrics = useMemo(() => {
    const total = scheduledEmails.length;
    const sent = scheduledEmails.filter(e => e.status === 'sent').length;
    const pending = scheduledEmails.filter(e => e.status === 'pending').length;
    const cancelled = scheduledEmails.filter(e => e.status === 'cancelled').length;
    const successRate = total > 0 ? Math.round((sent / total) * 100) : 0;
    const activeRules = automationRules.filter(r => r.enabled).length;

    // Get upcoming emails (next 7 days)
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcoming = scheduledEmails.filter(e => 
      e.status === 'pending' && 
      e.scheduledFor >= now && 
      e.scheduledFor <= sevenDaysFromNow
    );

    return {
      total,
      sent,
      pending,
      cancelled,
      successRate,
      activeRules,
      upcoming: upcoming.length,
      upcomingEmails: upcoming.sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime()),
    };
  }, [scheduledEmails, automationRules]);

  const getStatusBadge = (email: ScheduledEmail) => {
    const variants = {
      pending: "default",
      sent: "secondary",
      cancelled: "destructive",
    } as const;

    return (
      <Badge variant={variants[email.status]}>
        {email.status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeRules}</div>
            <p className="text-xs text-muted-foreground">
              {automationRules.length} total rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Scheduled</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.sent} sent, {metrics.cancelled} cancelled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming (7 days)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.upcoming}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled to send
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Scheduled Emails
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.upcomingEmails.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No emails scheduled in the next 7 days</p>
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.upcomingEmails.map((email) => (
                <div
                  key={email.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{email.emailType}</span>
                      {getStatusBadge(email)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {email.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(email.scheduledFor, "MMM d, yyyy 'at' h:mm a")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {email.recipientCount} recipient{email.recipientCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
