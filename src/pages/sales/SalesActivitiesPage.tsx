import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import { Plus, ListChecks, Calendar, AlertCircle, CheckCircle, Eye, Download, BarChart3 } from "lucide-react";
import { getAllActivities, getActivityStats } from "@/lib/salesActivityStorage";
import type { SalesActivity } from "@/types/salesActivity";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { createActivityColumns } from "@/components/sales/SalesActivityTableColumns";
import { ActivitiesFilterBar } from "@/components/sales/ActivitiesFilterBar";
import { ActivityBulkActions } from "@/components/sales/ActivityBulkActions";

export default function SalesActivitiesPage() {
  const [activities] = useState<SalesActivity[]>(getAllActivities());
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [outcomeFilter, setOutcomeFilter] = useState("all");
  const stats = getActivityStats();

  const columns = useMemo(() => createActivityColumns(), []);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch =
        search === "" ||
        activity.subject.toLowerCase().includes(search.toLowerCase()) ||
        activity.salesAgentName.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "all" || activity.activityType === typeFilter;
      const matchesOutcome = outcomeFilter === "all" || activity.outcome === outcomeFilter;

      return matchesSearch && matchesType && matchesOutcome;
    });
  }, [activities, search, typeFilter, outcomeFilter]);

  const handleClearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setOutcomeFilter("all");
  };

  const handleExport = (selectedIds: string[]) => {
    console.log("Exporting selected activities:", selectedIds);
  };

  const handleDelete = (selectedIds: string[]) => {
    console.log("Deleting selected activities:", selectedIds);
  };

  const handleMarkComplete = (selectedIds: string[]) => {
    console.log("Marking activities as complete:", selectedIds);
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="text-base font-semibold flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sales Activities</h1>
            <p className="text-muted-foreground mt-2">Track and log all sales activities</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Log Activity
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard/sales">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Dashboard
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Total Activities"
            value={stats.total.toString()}
            change="All time"
            icon={<ListChecks className="h-6 w-6" />}
            variant="neutral"
            showMenu={true}
            menuItems={[
              {
                label: "View All Activities",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => { }
              },
              {
                label: "Log Activity",
                icon: <Plus className="h-4 w-4" />,
                onClick: () => { }
              },
              {
                label: "Export",
                icon: <Download className="h-4 w-4" />,
                onClick: () => { }
              }
            ]}
          />
          <EnhancedStatCard
            title="Completed"
            value={stats.completed.toString()}
            change="Finished tasks"
            icon={<CheckCircle className="h-6 w-6" />}
            variant="success"
            showMenu={true}
            menuItems={[
              {
                label: "View Completed",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => { }
              }
            ]}
          />
          <EnhancedStatCard
            title="Upcoming"
            value={stats.upcoming.toString()}
            change="Scheduled"
            icon={<Calendar className="h-6 w-6" />}
            variant="primary"
            showMenu={true}
            menuItems={[
              {
                label: "View Schedule",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => { }
              }
            ]}
          />
          <EnhancedStatCard
            title="Follow-ups"
            value={stats.followUpNeeded.toString()}
            change="Need attention"
            icon={<AlertCircle className="h-6 w-6" />}
            variant="warning"
            showMenu={true}
            menuItems={[
              {
                label: "View Follow-ups",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => { }
              },
              {
                label: "Mark Complete",
                icon: <CheckCircle className="h-4 w-4" />,
                onClick: () => { }
              }
            ]}
          />
        </div>

        <ActivitiesFilterBar
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          outcomeFilter={outcomeFilter}
          onOutcomeFilterChange={setOutcomeFilter}
          onClearFilters={handleClearFilters}
        />

        <DataTable
          columns={columns}
          data={filteredActivities}
          selectable
          renderBulkActions={(selectedIds) => (
            <ActivityBulkActions
              selectedCount={selectedIds.length}
              onExport={() => handleExport(selectedIds)}
              onDelete={() => handleDelete(selectedIds)}
              onMarkComplete={() => handleMarkComplete(selectedIds)}
              onClearSelection={() => { }}
            />
          )}
          exportable
          exportFilename="sales-activities"
        />
      </div>
    </DashboardPageLayout>
  );
}
