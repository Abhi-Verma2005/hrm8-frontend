import { useState } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/tables/DataTable";
import { Plus, ListChecks, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { getAllActivities, getActivityStats } from "@/lib/salesActivityStorage";
import type { SalesActivity } from "@/types/salesActivity";
import { format } from "date-fns";
import { StatsCard } from "@/components/ui/stats-card";

export default function SalesActivitiesPage() {
  const [activities] = useState<SalesActivity[]>(getAllActivities());
  const stats = getActivityStats();

  const columns: Column<SalesActivity>[] = [
    {
      key: "subject",
      label: "Subject",
    },
    {
      key: "activityType",
      label: "Type",
      render: (activity) => activity.activityType.charAt(0).toUpperCase() + activity.activityType.slice(1),
    },
    {
      key: "salesAgentName",
      label: "Sales Agent",
    },
    {
      key: "employerName",
      label: "Employer",
      render: (activity) => activity.employerName || "-",
    },
    {
      key: "outcome",
      label: "Outcome",
      render: (activity) => {
        if (!activity.outcome) return "-";
        const colors: Record<string, string> = {
          successful: "bg-green-100 text-green-800",
          unsuccessful: "bg-red-100 text-red-800",
          "follow-up-needed": "bg-orange-100 text-orange-800",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[activity.outcome]}`}>
            {activity.outcome.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </span>
        );
      },
    },
    {
      key: "completedAt",
      label: "Completed",
      render: (activity) => activity.completedAt ? format(new Date(activity.completedAt), 'MMM dd, yyyy HH:mm') : "Scheduled",
    },
    {
      key: "duration",
      label: "Duration",
      render: (activity) => activity.duration ? `${activity.duration} min` : "-",
    },
  ];

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sales Activities</h1>
            <p className="text-muted-foreground mt-2">Track and log all sales activities</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Log Activity
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Activities"
            value={stats.total}
            icon={ListChecks}
            description="All time"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle}
            description="Finished tasks"
          />
          <StatsCard
            title="Upcoming"
            value={stats.upcoming}
            icon={Calendar}
            description="Scheduled"
          />
          <StatsCard
            title="Follow-ups"
            value={stats.followUpNeeded}
            icon={AlertCircle}
            description="Need attention"
          />
        </div>

        <DataTable
          columns={columns}
          data={activities}
          searchable
          searchKeys={["subject", "salesAgentName"]}
          exportable
          exportFilename="sales-activities"
        />
      </div>
    </DashboardPageLayout>
  );
}
