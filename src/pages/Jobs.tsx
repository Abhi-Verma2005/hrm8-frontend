import { AppLayout } from "@/components/AppLayout";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function Jobs() {
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
                  <h1 className="text-3xl font-bold mb-2">Jobs</h1>
                  <p className="text-muted-foreground">Create and manage job postings</p>
                </div>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <CardTitle>Coming Soon</CardTitle>
                        <CardDescription>Job management features are under development</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This page will allow you to create, edit, and manage job postings across multiple platforms.
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
