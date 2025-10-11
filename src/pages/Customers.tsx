import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building } from "lucide-react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";

export default function Customers() {
  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships and accounts</p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <Building className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>Customer management features are under development</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This page will provide customer CRM, account management, and relationship tracking features.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
