import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeedbackRequestDashboard } from '@/components/feedback/FeedbackRequestDashboard';
import { FeedbackAnalyticsDashboard } from '@/components/feedback/FeedbackAnalyticsDashboard';
import { AutomationRulesManager } from '@/components/feedback/AutomationRulesManager';
import { TeamPerformanceAnalytics } from '@/components/feedback/TeamPerformanceAnalytics';

export default function FeedbackDashboard() {
  return (
    <DashboardPageLayout>
      <Helmet>
        <title>Feedback Dashboard - ATS</title>
      </Helmet>
      <div className="p-12 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Feedback Dashboard</h1>
          <p className="text-muted-foreground">Monitor feedback requests, analytics, and team performance</p>
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requests">All Requests</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="performance">Team Performance</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6">
            <FeedbackRequestDashboard />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <FeedbackAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <TeamPerformanceAnalytics />
          </TabsContent>

          <TabsContent value="automation" className="mt-6">
            <AutomationRulesManager />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
