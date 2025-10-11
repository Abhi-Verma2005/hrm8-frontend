import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";

export default function Finance() {
  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Finance</h1>
          <p className="text-muted-foreground">Financial management, budgeting, and reporting</p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>Financial management features are under development</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This page will provide financial tracking, budgeting, invoicing, and expense management.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
