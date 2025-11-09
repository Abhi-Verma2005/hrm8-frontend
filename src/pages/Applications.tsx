import { useState, useEffect } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Upload, Download, LayoutGrid, List } from "lucide-react";
import { ApplicationPipeline } from "@/components/applications/ApplicationPipeline";
import { ApplicationListView } from "@/components/applications/ApplicationListView";
import { ApplicationDetailPanel } from "@/components/applications/ApplicationDetailPanel";
import { ApplicationBulkActionsToolbar } from "@/components/applications/ApplicationBulkActionsToolbar";
import { AdvancedFilters } from "@/components/applications/AdvancedFilters";
import { ExportDataDialog } from "@/components/applications/ExportDataDialog";
import { getApplications, updateApplication } from "@/lib/mockApplicationStorage";
import { Application, ApplicationStage, ApplicationStatus } from "@/types/application";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function Applications() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"pipeline" | "list">("pipeline");
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<string[]>([]);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [filters, setFilters] = useState<any>({
    search: '',
    status: '',
    stage: '',
    recruiter: '',
    source: '',
  });

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

  const filteredApplications = applications.filter((app) => {
    if (filters.search) {
      const query = filters.search.toLowerCase();
      if (
        !app.candidateName.toLowerCase().includes(query) &&
        !app.candidateEmail.toLowerCase().includes(query) &&
        !app.jobTitle.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    if (filters.status && app.status !== filters.status) return false;
    if (filters.stage && app.stage !== filters.stage) return false;
    if (filters.recruiter && app.assignedToName !== filters.recruiter) return false;
    if (filters.dateFrom && new Date(app.appliedDate) < filters.dateFrom) return false;
    if (filters.dateTo && new Date(app.appliedDate) > filters.dateTo) return false;

    return true;
  });

  // Bulk action handlers
  const handleBulkStatusUpdate = (status: ApplicationStatus, stage: ApplicationStage) => {
    selectedApplicationIds.forEach(id => {
      updateApplication(id, { status, stage });
    });
    loadApplications();
    setSelectedApplicationIds([]);
    toast({
      title: "Status updated",
      description: `${selectedApplicationIds.length} application(s) updated successfully.`,
    });
  };

  const handleBulkAssignRecruiter = (recruiterId: string) => {
    const recruiterNames: Record<string, string> = {
      'recruiter-1': 'Sarah Johnson',
      'recruiter-2': 'Michael Chen',
      'recruiter-3': 'Emily Rodriguez',
      'recruiter-4': 'David Kim',
      'recruiter-5': 'Jessica Brown',
    };

    selectedApplicationIds.forEach(id => {
      updateApplication(id, { 
        assignedTo: recruiterId,
        assignedToName: recruiterNames[recruiterId]
      });
    });
    loadApplications();
    setSelectedApplicationIds([]);
    toast({
      title: "Recruiter assigned",
      description: `${selectedApplicationIds.length} application(s) assigned to ${recruiterNames[recruiterId]}.`,
    });
  };

  const handleBulkEmail = () => {
    toast({
      title: "Email composer",
      description: `Opening email composer for ${selectedApplicationIds.length} candidate(s).`,
    });
  };

  const handleBulkScheduleInterview = () => {
    toast({
      title: "Interview scheduler",
      description: `Opening scheduler for ${selectedApplicationIds.length} application(s).`,
    });
  };

  const handleBulkReject = () => {
    selectedApplicationIds.forEach(id => {
      updateApplication(id, { 
        status: 'rejected',
        stage: 'Rejected',
        rejectionDate: new Date()
      });
    });
    loadApplications();
    setSelectedApplicationIds([]);
  };

  return (
    <DashboardPageLayout
      breadcrumbActions={
        <>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
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

        <AdvancedFilters onFilterChange={setFilters} />

        {viewMode === "list" && (
          <ApplicationBulkActionsToolbar
            selectedCount={selectedApplicationIds.length}
            onClearSelection={() => setSelectedApplicationIds([])}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            onBulkAssignRecruiter={handleBulkAssignRecruiter}
            onBulkEmail={handleBulkEmail}
            onBulkScheduleInterview={handleBulkScheduleInterview}
            onBulkReject={handleBulkReject}
          />
        )}

        {viewMode === "pipeline" ? (
          <ApplicationPipeline applications={filteredApplications} />
        ) : (
          <ApplicationListView
            applications={filteredApplications}
            onApplicationClick={handleApplicationClick}
            selectable
            onSelectedRowsChange={setSelectedApplicationIds}
          />
        )}

        <ApplicationDetailPanel
          application={selectedApplication}
          open={detailPanelOpen}
          onOpenChange={setDetailPanelOpen}
          onRefresh={loadApplications}
        />

        <ExportDataDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          data={filteredApplications}
          filename="applications-export"
        />
      </div>
    </DashboardPageLayout>
  );
}
