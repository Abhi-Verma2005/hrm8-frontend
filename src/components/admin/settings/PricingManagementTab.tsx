import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ATSSubscriptionManager, AddonServiceManager, RecruitmentServiceManager } from '@/components/admin/pricing';
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ats">ATS Subscriptions</TabsTrigger>
          <TabsTrigger value="addons">Add-on Services</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment Services</TabsTrigger>
          <TabsTrigger value="notes">Pricing Notes</TabsTrigger>
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

        {/* Pricing Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Notes & Guidelines</CardTitle>
              <CardDescription>Important information about pricing structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{PRICING_NOTES.annualPayment}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      All ATS subscription fees are billed annually
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{PRICING_NOTES.currency}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      All prices are shown in GBP (£)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Flexible Add-ons</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add-on services can be purchased separately and combined with any subscription tier
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Custom Pricing Available</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enterprise and high-volume customers can request custom pricing arrangements
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
