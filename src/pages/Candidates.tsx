import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { useRecentRecords } from "@/hooks/useRecentRecords";

export default function Candidates() {
  const { addRecentRecord } = useRecentRecords();

  // TODO: Activate when implementing candidate detail page:
  // useEffect(() => {
  //   if (candidateId && candidateName) {
  //     addRecentRecord({
  //       id: candidateId,
  //       type: 'candidate',
  //       name: candidateName,
  //       url: `/candidates/${candidateId}`
  //     });
  //   }
  // }, [candidateId, candidateName, addRecentRecord]);
  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Candidates</h1>
          <p className="text-muted-foreground">Manage and track all candidates</p>
          {/* TODO: Add DateRangeFilter here when implementing candidate list */}
          {/* Example:
            <div className="mt-4">
              <DateRangeFilter
                value={dateRange}
                onChange={setDateRange}
                placeholder="Filter by application date"
              />
            </div>
          */}
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
    </DashboardPageLayout>
  );
}
