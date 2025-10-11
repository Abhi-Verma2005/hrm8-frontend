import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";

export default function HRMS() {
  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">HRMS</h1>
          <p className="text-muted-foreground">Complete human resource management system</p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <Heart className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>HRMS module with comprehensive HR features is under development</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This module will provide employee management, attendance, payroll, performance reviews, and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
