import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Calendar, Link2 } from "lucide-react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { EmailIntegrationCard } from "@/components/integrations/EmailIntegrationCard";
import { CalendarIntegrationCard } from "@/components/integrations/CalendarIntegrationCard";
import { ATSIntegrationCard } from "@/components/integrations/ATSIntegrationCard";

export default function Integrations() {
  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Integrations</h1>
            <p className="text-muted-foreground">
              Manage and configure all system integrations
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="email" className="space-y-6">
          <TabsList>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="ats">
              <Link2 className="h-4 w-4 mr-2" />
              ATS Systems
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Email Integrations</h2>
              <p className="text-muted-foreground mb-4">
                Connect your email accounts to send and receive emails directly from the platform
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <EmailIntegrationCard
                provider="gmail"
                name="Gmail"
                description="Connect your Gmail account for email communications"
              />
              <EmailIntegrationCard
                provider="outlook"
                name="Outlook"
                description="Connect your Outlook account for email communications"
              />
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Calendar Integrations</h2>
              <p className="text-muted-foreground mb-4">
                Sync your calendar to schedule interviews and manage availability
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <CalendarIntegrationCard
                provider="google"
                name="Google Calendar"
                description="Sync with Google Calendar for scheduling"
              />
              <CalendarIntegrationCard
                provider="outlook"
                name="Outlook Calendar"
                description="Sync with Outlook Calendar for scheduling"
              />
            </div>
          </TabsContent>

          <TabsContent value="ats" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">ATS System Integrations</h2>
              <p className="text-muted-foreground mb-4">
                Connect to external ATS systems to sync candidates and job postings
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <ATSIntegrationCard provider="greenhouse" />
              <ATSIntegrationCard provider="lever" />
              <ATSIntegrationCard provider="workday" />
              <ATSIntegrationCard provider="icims" />
              <ATSIntegrationCard provider="taleo" />
              <ATSIntegrationCard provider="jobvite" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
