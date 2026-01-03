import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { AtsPageHeader } from "@/components/layouts/AtsPageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCategoriesTab } from "@/components/admin/settings/JobCategoriesTab";
import { JobTagsTab } from "@/components/admin/settings/JobTagsTab";
import { useHrm8Auth } from "@/contexts/Hrm8AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Hrm8SettingsPage() {
    const { hrm8User } = useHrm8Auth();
    const isGlobalAdmin = hrm8User?.role === 'GLOBAL_ADMIN';

    if (!isGlobalAdmin) {
        return (
            <DashboardPageLayout>
                <div className="p-6">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Access denied. Only HRM8 Global Administrators can access settings.
                        </AlertDescription>
                    </Alert>
                </div>
            </DashboardPageLayout>
        );
    }

    return (
        <DashboardPageLayout>
            <div className="p-6 space-y-6">
                <AtsPageHeader
                    title="HRM8 Settings"
                    subtitle="Global system configuration and job board management"
                />

                <Tabs defaultValue="job-categories" className="space-y-4">
                    <div className="overflow-x-auto -mx-1 px-1">
                        <TabsList className="inline-flex w-auto gap-1 rounded-full border bg-muted/40 px-1 py-1 shadow-sm">
                            <TabsTrigger
                                value="job-categories"
                                className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                                Job Categories
                            </TabsTrigger>
                            <TabsTrigger
                                value="job-tags"
                                className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                                Job Tags
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="job-categories" className="mt-6">
                        <JobCategoriesTab />
                    </TabsContent>

                    <TabsContent value="job-tags" className="mt-6">
                        <JobTagsTab />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardPageLayout>
    );
}
