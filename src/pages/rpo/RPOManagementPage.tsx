import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { RPOConsultantSuggestions } from '@/components/rpo/RPOConsultantSuggestions';
import { RPORenewalAnalytics } from '@/components/rpo/RPORenewalAnalytics';
import { RPOSLATracker } from '@/components/rpo/RPOSLATracker';
import { RPOPlacementPipeline } from '@/components/rpo/RPOPlacementPipeline';
import { RPOReportsGenerator } from '@/components/rpo/RPOReportsGenerator';
import { RPONotifications } from '@/components/rpo/RPONotifications';
import { RPOConsultantPerformanceDashboard } from '@/components/rpo/RPOConsultantPerformanceDashboard';
import { RPOConsultantSkillMatrix } from '@/components/rpo/RPOConsultantSkillMatrix';
import { RPOWorkloadBalancingDashboard } from '@/components/rpo/RPOWorkloadBalancingDashboard';
import { RPOPerformanceReviewSystem } from '@/components/rpo/RPOPerformanceReviewSystem';
import { RPOContractHealthScoring } from '@/components/rpo/RPOContractHealthScoring';
import { LayoutDashboard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function RPODashboardPage() {
  const handleConsultantAssign = (consultantId: string) => {
    console.log('Assigning consultant:', consultantId);
  };

  const handleRenewalAction = (action: string) => {
    toast({
      title: 'Action Initiated',
      description: `${action} has been scheduled.`,
    });
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-3xl font-bold">RPO Management Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Comprehensive RPO analytics, insights, and management tools
          </p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-11">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="workload">Workload</TabsTrigger>
            <TabsTrigger value="suggestions">AI</TabsTrigger>
            <TabsTrigger value="renewals">Renewals</TabsTrigger>
            <TabsTrigger value="sla">SLA</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <RPONotifications />
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <RPOContractHealthScoring />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <RPOConsultantPerformanceDashboard />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <RPOPerformanceReviewSystem />
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <RPOConsultantSkillMatrix />
          </TabsContent>

          <TabsContent value="workload" className="space-y-6">
            <RPOWorkloadBalancingDashboard />
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <RPOConsultantSuggestions
              contractId="mock-contract-1"
              requiredSkills={['Technology', 'Healthcare']}
              onAssign={handleConsultantAssign}
            />
          </TabsContent>

          <TabsContent value="renewals" className="space-y-6">
            <RPORenewalAnalytics
              contractId="mock-contract-1"
              onTakeAction={handleRenewalAction}
            />
          </TabsContent>

          <TabsContent value="sla" className="space-y-6">
            <RPOSLATracker contractId="mock-contract-1" />
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6">
            <RPOPlacementPipeline contractId="mock-contract-1" />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <RPOReportsGenerator contractId="mock-contract-1" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
