import { AppLayout } from "@/components/AppLayout";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Applications() {
  return (
    <AppLayout>
      <SidebarProvider defaultOpen>
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <DashboardHeader />
            <main className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2">Applications</h1>
                  <p className="text-muted-foreground">Review and process applications</p>
                </div>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <CardTitle>Coming Soon</CardTitle>
                        <CardDescription>Application management features are under development</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This page will allow you to review, filter, and process all job applications.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AppLayout>
  );
}
