import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { useRecentRecords } from "@/hooks/useRecentRecords";

export default function Jobs() {
  const { addRecentRecord } = useRecentRecords();

  // TODO: Activate when implementing job detail page:
  // useEffect(() => {
  //   if (jobId && jobTitle) {
  //     addRecentRecord({
  //       id: jobId,
  //       type: 'job',
  //       name: jobTitle,
  //       url: `/jobs/${jobId}`
  //     });
  //   }
  // }, [jobId, jobTitle, addRecentRecord]);
  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-muted-foreground">Create and manage job postings</p>
          {/* TODO: Add date filter when implementing job list */}
          {/* Example:
            import { DateRangePicker } from "@/components/ui/date-range-picker-v2";
            
            <div className="mt-4">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="Filter by posting date"
              />
            </div>
          */}
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
    </DashboardPageLayout>
  );
}
