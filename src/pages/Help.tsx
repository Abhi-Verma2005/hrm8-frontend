import { AppLayout } from "@/components/AppLayout";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function Help() {
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
                  <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
                  <p className="text-muted-foreground">Get assistance and learn how to use the platform</p>
                </div>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        <HelpCircle className="h-6 w-6 text-foreground" />
                      </div>
                      <div>
                        <CardTitle>Coming Soon</CardTitle>
                        <CardDescription>Help documentation and support features are under development</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This page will provide documentation, FAQs, tutorials, and support resources.
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
