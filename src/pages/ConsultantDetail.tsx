import { useParams } from 'react-router-dom';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConsultantHeroSection } from '@/components/consultants/detail/ConsultantHeroSection';
import { ConsultantOverviewTab } from '@/components/consultants/detail/ConsultantOverviewTab';
import { PerformanceTab } from '@/components/consultants/detail/PerformanceTab';
import { AssignmentsTab } from '@/components/consultants/detail/AssignmentsTab';
import { CommissionsTab } from '@/components/consultants/detail/CommissionsTab';
import { ActivityTab } from '@/components/consultants/detail/ActivityTab';
import { DocumentsTab } from '@/components/consultants/detail/DocumentsTab';
import { SettingsTab } from '@/components/consultants/detail/SettingsTab';
import { getConsultantById } from '@/lib/consultantStorage';

export default function ConsultantDetail() {
  const { id } = useParams<{ id: string }>();
  const consultant = id ? getConsultantById(id) : undefined;

  if (!consultant) {
    return (
      <DashboardPageLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Consultant not found</h2>
            <p className="text-muted-foreground mt-2">The consultant you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout>
      <div className="space-y-6">
        <ConsultantHeroSection consultant={consultant} />

        <div className="px-6 pb-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="commissions">Commissions</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ConsultantOverviewTab consultant={consultant} />
            </TabsContent>

            <TabsContent value="performance">
              <PerformanceTab consultantId={consultant.id} />
            </TabsContent>

            <TabsContent value="assignments">
              <AssignmentsTab consultantId={consultant.id} consultant={consultant} />
            </TabsContent>

            <TabsContent value="commissions">
              <CommissionsTab consultantId={consultant.id} consultant={consultant} />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityTab consultantId={consultant.id} />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentsTab consultantId={consultant.id} />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab consultantId={consultant.id} consultant={consultant} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
