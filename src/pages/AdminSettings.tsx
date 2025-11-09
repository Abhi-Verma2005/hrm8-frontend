import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { useRBAC } from "@/hooks/useRBAC";
import { isDevelopmentMode } from "@/lib/rbacService";
import { AlertCircle, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LogViewerDialog } from "@/components/admin/LogViewerDialog";
import { AdminSettingsDashboard } from "@/components/admin/settings/AdminSettingsDashboard";
import { PricingManagementTab } from "@/components/admin/settings/PricingManagementTab";
import { CommissionsManagementTab } from "@/components/admin/settings/CommissionsManagementTab";
import { TerritoryRegionsTab } from "@/components/admin/settings/TerritoryRegionsTab";
import { CurrencyManagementTab } from "@/components/admin/settings/CurrencyManagementTab";
import { UserManagementTab } from "@/components/admin/settings/UserManagementTab";
import { SystemConfigurationTab } from "@/components/admin/settings/SystemConfigurationTab";
import { IntegrationsTab } from "@/components/admin/settings/IntegrationsTab";
import { SecurityComplianceTab } from "@/components/admin/settings/SecurityComplianceTab";
import { AuditLogsTab } from "@/components/admin/settings/AuditLogsTab";

export default function AdminSettings() {
  const { isSuperAdmin, loading } = useRBAC();
  const [logViewerOpen, setLogViewerOpen] = useState(false);

  // In dev mode, bypass permission check - only enforce in production
  const hasAccess = isDevelopmentMode() || isSuperAdmin;

  // Don't show error while loading roles
  if (loading) {
    return (
      <DashboardPageLayout>
        <div className="p-6">Loading...</div>
      </DashboardPageLayout>
    );
  }

  if (!hasAccess) {
    return (
      <DashboardPageLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You do not have permission to access admin settings. Only super administrators can access this page.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Settings</h1>
            <p className="text-muted-foreground">System-wide configuration and administration</p>
          </div>
          {isDevelopmentMode() && (
            <Button variant="outline" onClick={() => setLogViewerOpen(true)}>
              <FileText className="h-4 w-4 mr-2" />
              View Logs
            </Button>
          )}
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid grid-cols-5 lg:grid-cols-10 w-full">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="commission">Commission</TabsTrigger>
            <TabsTrigger value="territory">Territory</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminSettingsDashboard />
          </TabsContent>

          <TabsContent value="pricing">
            <PricingManagementTab />
          </TabsContent>

          <TabsContent value="commission">
            <CommissionsManagementTab />
          </TabsContent>

          <TabsContent value="territory">
            <TerritoryRegionsTab />
          </TabsContent>

          <TabsContent value="currency">
            <CurrencyManagementTab />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementTab />
          </TabsContent>

          <TabsContent value="system">
            <SystemConfigurationTab />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationsTab />
          </TabsContent>

          <TabsContent value="security">
            <SecurityComplianceTab />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogsTab />
          </TabsContent>
        </Tabs>
      </div>

      <LogViewerDialog open={logViewerOpen} onOpenChange={setLogViewerOpen} />
    </DashboardPageLayout>
  );
}
