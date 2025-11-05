import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plug } from "lucide-react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";

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
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <Plug className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <CardTitle>System Integrations</CardTitle>
                <CardDescription>
                  Connect your HRM8 platform with external services
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure integrations with third-party services, APIs, and platforms to enhance your recruitment workflow.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Available integrations will include:</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
                <li>Email service providers (SMTP, SendGrid, etc.)</li>
                <li>Calendar integrations (Google Calendar, Outlook)</li>
                <li>Job board connectors (Indeed, LinkedIn, etc.)</li>
                <li>Background check services</li>
                <li>Video interview platforms</li>
                <li>Payment gateways</li>
                <li>Applicant tracking systems</li>
                <li>HR software integrations</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
