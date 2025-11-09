import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ATSSubscriptionManager, 
  AddonServiceManager, 
  RecruitmentServiceManager,
  CustomPricingManager,
  PricingHistoryViewer,
  PricingExportTools,
  BulkOperations
} from '@/components/admin/pricing';
import { DollarSign, Check } from 'lucide-react';
import { PRICING_NOTES } from '@/lib/subscriptionConfig';

export function PricingManagementTab() {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Pricing Management</CardTitle>
              <CardDescription>
                Configure pricing for ATS subscriptions, add-on services, and recruitment services
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="ats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="ats">ATS Tiers</TabsTrigger>
          <TabsTrigger value="addons">Add-ons</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          <TabsTrigger value="custom">Custom Pricing</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Ops</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        {/* ATS Subscriptions Tab */}
        <TabsContent value="ats" className="space-y-4">
          <ATSSubscriptionManager />
        </TabsContent>

        {/* Add-on Services Tab */}
        <TabsContent value="addons" className="space-y-4">
          <AddonServiceManager />
        </TabsContent>

        {/* Recruitment Services Tab */}
        <TabsContent value="recruitment" className="space-y-4">
          <RecruitmentServiceManager />
        </TabsContent>

        {/* Custom Pricing Tab */}
        <TabsContent value="custom" className="space-y-4">
          <CustomPricingManager />
        </TabsContent>

        {/* Bulk Operations Tab */}
        <TabsContent value="bulk" className="space-y-4">
          <BulkOperations />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <PricingHistoryViewer />
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          <PricingExportTools />
        </TabsContent>
      </Tabs>
    </div>
  );
}
