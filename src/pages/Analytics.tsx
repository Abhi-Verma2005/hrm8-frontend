import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3, Upload, Download } from "lucide-react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";

export default function Analytics() {
  return (
    <DashboardPageLayout
      breadcrumbActions={
        <>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </>
      }
    >
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Detailed recruitment analytics and insights</p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>Advanced analytics features are under development</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This page will provide detailed analytics, reports, and insights into your recruitment process.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
