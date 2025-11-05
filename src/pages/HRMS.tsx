import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, BarChart3 } from "lucide-react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Link } from "react-router-dom";

export default function HRMS() {
  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">HRMS</h1>
            <p className="text-muted-foreground">Complete human resource management system</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/dashboard/hrms">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Dashboard
            </Link>
          </Button>
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
