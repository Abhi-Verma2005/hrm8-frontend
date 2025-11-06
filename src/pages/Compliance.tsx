import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileText, AlertTriangle, CheckCircle, History, Database } from "lucide-react";
import { useRBAC } from "@/hooks/useRBAC";
import { getAuditLogs, getPolicies, getPolicyAcknowledgments, getComplianceAlerts, getDataSubjectRequests } from "@/lib/complianceStorage";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/tables/DataTable";
import { AuditLog, CompliancePolicy, ComplianceAlert } from "@/types/compliance";

export default function Compliance() {
  const { isHRAdmin, isSuperAdmin } = useRBAC();
  const [activeTab, setActiveTab] = useState("overview");

  const auditLogs = getAuditLogs();
  const policies = getPolicies();
  const alerts = getComplianceAlerts();
  const dsRequests = getDataSubjectRequests();

  const auditColumns: Column<AuditLog>[] = [
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }) => new Date(row.original.timestamp).toLocaleString(),
    },
    {
      accessorKey: "userName",
      header: "User",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.action}</Badge>
      ),
    },
    {
      accessorKey: "module",
      header: "Module",
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
    },
  ];

  const policyColumns: Column<CompliancePolicy>[] = [
    {
      accessorKey: "title",
      header: "Policy Title",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.category}</Badge>
      ),
    },
    {
      accessorKey: "version",
      header: "Version",
    },
    {
      accessorKey: "effectiveDate",
      header: "Effective Date",
    },
    {
      accessorKey: "requiresAcknowledgment",
      header: "Requires Ack.",
      cell: ({ row }) => (
        row.original.requiresAcknowledgment ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      ),
    },
  ];

  if (!isHRAdmin && !isSuperAdmin) {
    return (
      <DashboardPageLayout>
        <div className="p-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Shield className="h-8 w-8" />
                <div>
                  <p className="font-semibold">Access Restricted</p>
                  <p className="text-sm">You don't have permission to view compliance data.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Compliance & Audit
            </h1>
            <p className="text-muted-foreground">
              Manage policies, audit trails, and compliance reporting
            </p>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                    {alerts.length} Compliance Alert{alerts.length > 1 ? 's' : ''}
                  </h3>
                  <div className="space-y-2 mt-2">
                    {alerts.slice(0, 3).map((alert) => (
                      <p key={alert.id} className="text-sm text-orange-800 dark:text-orange-200">
                        • {alert.message}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Policies</p>
                  <p className="text-2xl font-bold">{policies.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Audit Logs</p>
                  <p className="text-2xl font-bold">{auditLogs.length}</p>
                </div>
                <History className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold">{alerts.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Data Requests</p>
                  <p className="text-2xl font-bold">{dsRequests.length}</p>
                </div>
                <Database className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="acknowledgments">Acknowledgments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
                <CardDescription>Key compliance metrics and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Policy Acknowledgment Rate</p>
                        <p className="text-sm text-muted-foreground">95% of employees</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <History className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Audit Log Retention</p>
                        <p className="text-sm text-muted-foreground">7 years of records</p>
                      </div>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">GDPR Compliance</p>
                        <p className="text-sm text-muted-foreground">Data subject requests tracked</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50">Compliant</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit-logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>Complete system activity log</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={auditColumns}
                  data={auditLogs.slice(0, 50)}
                  searchKey="userName"
                  searchPlaceholder="Search by user..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Company Policies</CardTitle>
                    <CardDescription>Manage organizational policies</CardDescription>
                  </div>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Add Policy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={policyColumns}
                  data={policies}
                  searchKey="title"
                  searchPlaceholder="Search policies..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="acknowledgments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Policy Acknowledgments</CardTitle>
                <CardDescription>Track employee policy acknowledgments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Acknowledgment tracking will display employee signatures and dates.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Reports</CardTitle>
                <CardDescription>Generate and view compliance reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto flex-col items-start p-4">
                    <FileText className="h-5 w-5 mb-2" />
                    <p className="font-semibold">GDPR Report</p>
                    <p className="text-sm text-muted-foreground">Data processing activities</p>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col items-start p-4">
                    <FileText className="h-5 w-5 mb-2" />
                    <p className="font-semibold">Audit Summary</p>
                    <p className="text-sm text-muted-foreground">Monthly audit overview</p>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col items-start p-4">
                    <FileText className="h-5 w-5 mb-2" />
                    <p className="font-semibold">Policy Compliance</p>
                    <p className="text-sm text-muted-foreground">Acknowledgment status</p>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col items-start p-4">
                    <FileText className="h-5 w-5 mb-2" />
                    <p className="font-semibold">Data Retention</p>
                    <p className="text-sm text-muted-foreground">Record lifecycle report</p>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
