import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeedbackRequestDashboard } from '@/components/feedback/FeedbackRequestDashboard';
import { FeedbackAnalyticsDashboard } from '@/components/feedback/FeedbackAnalyticsDashboard';
import { AutomationRulesManager } from '@/components/feedback/AutomationRulesManager';

export default function FeedbackDashboard() {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="requests" className="w-full">
        <TabsList>
          <TabsTrigger value="requests">All Requests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-6">
          <FeedbackRequestDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <FeedbackAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="automation" className="mt-6">
          <AutomationRulesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
