import { AppLayout } from "@/components/AppLayout";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function Candidates() {
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
                  <h1 className="text-3xl font-bold mb-2">Candidates</h1>
                  <p className="text-muted-foreground">Manage and track all candidates</p>
                </div>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Coming Soon</CardTitle>
                        <CardDescription>Candidate management features are under development</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This page will allow you to view, filter, and manage all candidates in your recruitment pipeline.
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
