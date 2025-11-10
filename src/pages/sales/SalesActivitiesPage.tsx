import { useState } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/tables/DataTable";
import { Plus } from "lucide-react";
import { getAllActivities } from "@/lib/salesActivityStorage";
import type { SalesActivity } from "@/types/salesActivity";
import { format } from "date-fns";

export default function SalesActivitiesPage() {
  const [activities] = useState<SalesActivity[]>(getAllActivities());

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
    <DashboardPageLayout
      title="Sales Activities"
      subtitle="Track and log all sales activities"
      fullWidth={true}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Log Activity
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={activities}
        searchable
        searchKeys={["subject", "salesAgentName"]}
        exportable
        exportFilename="sales-activities"
      />
    </DashboardPageLayout>
  );
}
