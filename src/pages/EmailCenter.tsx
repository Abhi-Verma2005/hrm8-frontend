import { useState, useEffect } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { EmailStatsCard } from '@/components/emails/EmailStatsCard';
import { EmailLogsList } from '@/components/emails/EmailLogsList';
import { ScheduledEmailsList } from '@/components/emails/ScheduledEmailsList';
import { EmailAnalytics } from '@/components/emails/EmailAnalytics';
import { ScheduleEmailDialog } from '@/components/emails/ScheduleEmailDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Clock, Eye, MousePointerClick, Plus } from 'lucide-react';
import { getEmailStats, getRecentEmails, getScheduledEmails, saveEmailLog } from '@/lib/emailTrackingStorage';
import { EmailLog } from '@/types/emailTracking';

export default function EmailCenter() {
  const [stats, setStats] = useState(getEmailStats());
  const [recentEmails, setRecentEmails] = useState(getRecentEmails());
  const [scheduledEmails, setScheduledEmails] = useState(getScheduledEmails());
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  const refreshData = () => {
    setStats(getEmailStats());
    setRecentEmails(getRecentEmails());
    setScheduledEmails(getScheduledEmails());
  };

  const handleScheduleEmail = (emailData: Omit<EmailLog, 'id' | 'createdAt'>) => {
    const newEmail: EmailLog = {
      ...emailData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    saveEmailLog(newEmail);
    refreshData();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Email Center</h1>
          <p className="text-muted-foreground">Manage and track all email communications</p>
        </div>
        <Button onClick={() => setScheduleDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Email
        </Button>
      </div>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <EmailStatsCard
            title="Total Sent"
            value={stats.totalSent}
            icon={Mail}
          />
          <EmailStatsCard
            title="Open Rate"
            value={`${stats.openRate.toFixed(1)}%`}
            icon={Eye}
          />
          <EmailStatsCard
            title="Click Rate"
            value={`${stats.clickRate.toFixed(1)}%`}
            icon={MousePointerClick}
          />
          <EmailStatsCard
            title="Scheduled"
            value={scheduledEmails.length}
            icon={Clock}
          />
        </div>

        {/* Analytics Charts */}
        <EmailAnalytics stats={stats} />

        {/* Email Lists */}
        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recent">Recent Emails</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          </TabsList>

          <TabsContent value="recent">
            <EmailLogsList emails={recentEmails} />
          </TabsContent>

          <TabsContent value="scheduled">
            <ScheduledEmailsList
              emails={scheduledEmails}
              onEdit={(email) => console.log('Edit', email)}
              onCancel={(email) => console.log('Cancel', email)}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ScheduleEmailDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        onSchedule={handleScheduleEmail}
      />
    </div>
  );
}
