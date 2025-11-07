import { useState, useEffect } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Upload, Download, LayoutGrid, List } from "lucide-react";
import { ApplicationPipeline } from "@/components/applications/ApplicationPipeline";
import { ApplicationDetailPanel } from "@/components/applications/ApplicationDetailPanel";
import { ApplicationFilters } from "@/components/applications/ApplicationFilters";
import { getApplications } from "@/lib/mockApplicationStorage";
import { Application, ApplicationStage, ApplicationStatus } from "@/types/application";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStages, setSelectedStages] = useState<ApplicationStage[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ApplicationStatus[]>([]);
  const [viewMode, setViewMode] = useState<"pipeline" | "list">("pipeline");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    const allApplications = getApplications();
    setApplications(allApplications);
  };

  const handleApplicationClick = (application: Application) => {
    setSelectedApplication(application);
    setDetailPanelOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStages([]);
    setSelectedStatuses([]);
  };

  const filteredApplications = applications.filter((app) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !app.candidateName.toLowerCase().includes(query) &&
        !app.candidateEmail.toLowerCase().includes(query) &&
        !app.jobTitle.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    if (selectedStages.length > 0 && !selectedStages.includes(app.stage)) {
      return false;
    }

    if (selectedStatuses.length > 0 && !selectedStatuses.includes(app.status)) {
      return false;
    }

    return true;
  });

  return (
    <DashboardPageLayout
      breadcrumbActions={
        <>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </>
      }
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Applications</h1>
            <p className="text-muted-foreground">
              Review and process {applications.length} applications
            </p>
          </div>

          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <TabsList>
              <TabsTrigger value="pipeline">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Pipeline
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4 mr-2" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ApplicationFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStages={selectedStages}
          onStagesChange={setSelectedStages}
          selectedStatuses={selectedStatuses}
          onStatusesChange={setSelectedStatuses}
          onClearFilters={handleClearFilters}
        />

        {viewMode === "pipeline" ? (
          <ApplicationPipeline
            applications={filteredApplications}
            onApplicationClick={handleApplicationClick}
            onRefresh={loadApplications}
          />
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p>List view coming soon</p>
          </div>
        )}

        <ApplicationDetailPanel
          application={selectedApplication}
          open={detailPanelOpen}
          onOpenChange={setDetailPanelOpen}
          onRefresh={loadApplications}
        />
      </div>
    </DashboardPageLayout>
  );
}
