import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MobileTabs, MobileTabsList, MobileTabsTrigger, MobileTabsContent } from '@/components/ui/mobile-tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ATSSubscriptionManager, 
  AddonServiceManager, 
  RecruitmentServiceManager,
  CustomPricingManager,
  PricingHistoryViewer,
  PricingExportTools,
  BulkOperations,
  PricingCalculator,
  ClientComparisonTool,
  PricingAnalytics,
  ApprovalWorkflows
} from '@/components/admin/pricing';
import { DollarSign } from 'lucide-react';
import { useIsMobile } from '@/hooks/useMediaQuery';

const tabs = [
  { value: 'ats', label: 'ATS' },
  { value: 'addons', label: 'Add-ons' },
  { value: 'recruitment', label: 'Recruitment' },
  { value: 'custom', label: 'Custom' },
  { value: 'calculator', label: 'Calculator' },
  { value: 'comparison', label: 'Comparison' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'approvals', label: 'Approvals' },
  { value: 'bulk', label: 'Bulk' },
  { value: 'history', label: 'History' },
  { value: 'export', label: 'Export' },
];

export function PricingManagementTab() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('ats');

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader className="p-4 md:p-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg md:text-2xl truncate">Pricing Management</CardTitle>
              <CardDescription className="text-xs md:text-sm line-clamp-2">
                Configure pricing for ATS subscriptions, add-on services, and recruitment services
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {isMobile ? (
        <MobileTabs value={activeTab} onValueChange={setActiveTab}>
          <MobileTabsList>
            {tabs.map((tab) => (
              <MobileTabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </MobileTabsTrigger>
            ))}
          </MobileTabsList>

          <MobileTabsContent value="ats">
            <ATSSubscriptionManager />
          </MobileTabsContent>

          <MobileTabsContent value="addons">
            <AddonServiceManager />
          </MobileTabsContent>

          <MobileTabsContent value="recruitment">
            <RecruitmentServiceManager />
          </MobileTabsContent>

          <MobileTabsContent value="custom">
            <CustomPricingManager />
          </MobileTabsContent>

          <MobileTabsContent value="calculator">
            <PricingCalculator />
          </MobileTabsContent>

          <MobileTabsContent value="comparison">
            <ClientComparisonTool />
          </MobileTabsContent>

          <MobileTabsContent value="analytics">
            <PricingAnalytics />
          </MobileTabsContent>

          <MobileTabsContent value="approvals">
            <ApprovalWorkflows />
          </MobileTabsContent>

          <MobileTabsContent value="bulk">
            <BulkOperations />
          </MobileTabsContent>

          <MobileTabsContent value="history">
            <PricingHistoryViewer />
          </MobileTabsContent>

          <MobileTabsContent value="export">
            <PricingExportTools />
          </MobileTabsContent>
        </MobileTabs>
      ) : (
        <Tabs defaultValue="ats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-11 gap-1">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="ats" className="space-y-4">
            <ATSSubscriptionManager />
          </TabsContent>

          <TabsContent value="addons" className="space-y-4">
            <AddonServiceManager />
          </TabsContent>

          <TabsContent value="recruitment" className="space-y-4">
            <RecruitmentServiceManager />
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <CustomPricingManager />
          </TabsContent>

          <TabsContent value="calculator" className="space-y-4">
            <PricingCalculator />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <ClientComparisonTool />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <PricingAnalytics />
          </TabsContent>

          <TabsContent value="approvals" className="space-y-4">
            <ApprovalWorkflows />
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <BulkOperations />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <PricingHistoryViewer />
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <PricingExportTools />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
