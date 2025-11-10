import { useState } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Plus } from "lucide-react";
import { getAllActivities } from "@/lib/salesActivityStorage";
import type { SalesActivity } from "@/types/salesActivity";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export default function SalesActivitiesPage() {
  const [activities] = useState<SalesActivity[]>(getAllActivities());

  const columns: ColumnDef<SalesActivity>[] = [
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "activityType",
      header: "Type",
      cell: ({ getValue }) => {
        const type = getValue() as string;
        return type.charAt(0).toUpperCase() + type.slice(1);
      },
    },
    {
      accessorKey: "salesAgentName",
      header: "Sales Agent",
    },
    {
      accessorKey: "employerName",
      header: "Employer",
      cell: ({ getValue }) => getValue() || "-",
    },
    {
      accessorKey: "outcome",
      header: "Outcome",
      cell: ({ getValue }) => {
        const outcome = getValue() as string | undefined;
        if (!outcome) return "-";
        const colors: Record<string, string> = {
          successful: "bg-green-100 text-green-800",
          unsuccessful: "bg-red-100 text-red-800",
          "follow-up-needed": "bg-orange-100 text-orange-800",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[outcome]}`}>
            {outcome.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </span>
        );
      },
    },
    {
      accessorKey: "completedAt",
      header: "Completed",
      cell: ({ getValue }) => {
        const date = getValue() as string | undefined;
        return date ? format(new Date(date), 'MMM dd, yyyy HH:mm') : "Scheduled";
      },
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ getValue }) => {
        const duration = getValue() as number | undefined;
        return duration ? `${duration} min` : "-";
      },
    },
  ];

  return (
    <DashboardPageLayout
      title="Sales Activities"
      subtitle="Track and log all sales activities"
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
        searchKey="subject"
        searchPlaceholder="Search activities..."
      />
    </DashboardPageLayout>
  );
}
