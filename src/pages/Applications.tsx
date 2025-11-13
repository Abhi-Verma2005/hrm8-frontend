import { useState, useEffect, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Upload, Download, LayoutGrid, List, Filter, X, GitCompare, Sparkles as SparklesIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { ApplicationPipeline } from "@/components/applications/ApplicationPipeline";
import { ApplicationListView } from "@/components/applications/ApplicationListView";
import { CandidateRecommendations } from "@/components/applications/CandidateRecommendations";
import { CandidateComparison } from "@/components/applications/CandidateComparison";
import { BulkAIScoringDialog } from "@/components/applications/BulkAIScoringDialog";
import { ApplicationDetailPanel } from "@/components/applications/ApplicationDetailPanel";
import { ApplicationFilters } from "@/components/applications/ApplicationFilters";
import { ApplicationBulkActionsToolbar } from "@/components/applications/ApplicationBulkActionsToolbar";
import { AdvancedFiltersDialog } from "@/components/applications/AdvancedFiltersDialog";
import { SmartFiltersBar } from "@/components/applications/SmartFiltersBar";
import { AdvancedExportDialog } from "@/components/applications/AdvancedExportDialog";
import { ImportDialog } from "@/components/applications/ImportDialog";
import { BulkScheduleInterviewDialog } from "@/components/applications/BulkScheduleInterviewDialog";
import { getApplications, updateApplication, saveApplication } from "@/lib/mockApplicationStorage";
import { Application, ApplicationStage, ApplicationStatus } from "@/types/application";
import { ApplicationFilters as FilterType } from "@/types/filterPreset";
import { exportToCSV } from "@/utils/exportHelpers";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { performFuzzySearch } from "@/lib/advancedSearchService";
import { mockJobs } from "@/data/mockTableData";
import { FileText, UserCheck, Clock, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useToast } from "@/hooks/use-toast";

export default function Applications() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStages, setSelectedStages] = useState<ApplicationStage[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ApplicationStatus[]>([]);
  const [viewMode, setViewMode] = useState<"pipeline" | "list">("pipeline");
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<string[]>([]);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [bulkScheduleOpen, setBulkScheduleOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterType>({});
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(true);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showBulkScoring, setShowBulkScoring] = useState(false);

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
    setBulkScheduleOpen(true);
  };

  const handleBulkReject = () => {
    selectedApplicationIds.forEach(id => {
      updateApplication(id, { 
        status: 'rejected',
        stage: 'Rejected',
      });
    });
    loadApplications();
    setSelectedApplicationIds([]);
    toast({
      title: "Applications rejected",
      description: `${selectedApplicationIds.length} application(s) rejected.`,
    });
  };

  // Advanced filter handlers
  const handleApplyFilters = (filters: FilterType) => {
    setAppliedFilters(filters);
    
    // Apply filters to applications
    if (filters.status) {
      setSelectedStatuses(filters.status as ApplicationStatus[]);
    }
    if (filters.search) {
      setSearchQuery(filters.search);
    }
  };

  const handleSmartFilterSelect = (filters: FilterType) => {
    handleApplyFilters(filters);
    toast({
      title: "Filter applied",
      description: "Smart filter has been applied to your applications.",
    });
  };

  // Export handlers
  const handleExport = (format: string, selectedFields: string[]) => {
    const dataToExport = filteredApplications.map(app => ({
      name: app.candidateName,
      email: app.candidateEmail,
      jobTitle: app.jobTitle,
      status: app.status,
      stage: app.stage,
      score: app.score,
      appliedDate: app.appliedDate,
      assignedToName: app.assignedToName || '',
    }));

    const filename = `applications_export_${new Date().toISOString().split('T')[0]}`;

    switch (format) {
      case 'csv':
        exportToCSV(dataToExport, filename);
        break;
      case 'excel':
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Applications');
        XLSX.writeFile(wb, `${filename}.xlsx`);
        break;
      case 'pdf':
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Applications Export', 14, 15);
        autoTable(doc, {
          head: [['Name', 'Email', 'Job', 'Status', 'Score']],
          body: dataToExport.map(d => [d.name, d.email, d.jobTitle, d.status, d.score.toString()]),
        });
        doc.save(`${filename}.pdf`);
        break;
      case 'json':
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.json`;
        link.click();
        break;
    }
  };

  // Import handler
  const handleImport = async (data: any[]) => {
    data.forEach(row => {
      const application: Partial<Application> = {
        candidateName: row.name,
        candidateEmail: row.email,
        jobTitle: row.jobTitle || row.position || 'Not Specified',
        status: (row.status as ApplicationStatus) || 'applied',
        stage: (row.stage as ApplicationStage) || 'New Application',
        appliedDate: row.appliedDate || row.date || new Date().toISOString(),
        score: row.score ? Number(row.score) : 0,
      };
      
      saveApplication(application as Application);
    });
    
    loadApplications();
  };

  // Bulk interview scheduling handler
  const handleBulkSchedule = (data: any) => {
    toast({
      title: "Interviews scheduled",
      description: `${selectedApplicationIds.length} interviews scheduled successfully.`,
    });
    setSelectedApplicationIds([]);
    setBulkScheduleOpen(false);
  };

  const filteredApplications = applications.filter((app) => {
    // Filter by selected job if one is selected
    if (selectedJobId && selectedJobId !== "all" && selectedJobId !== "unread") {
      if (app.jobId !== selectedJobId) return false;
    }

    // Filter by unread status if "unread" is selected or showUnreadOnly is true with no job selected
    if (selectedJobId === "unread" || (showUnreadOnly && !selectedJobId)) {
      if (app.isRead) return false;
    }

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

  // Calculate stats
  const stats = useMemo(() => {
    const unreadCount = applications.filter(app => !app.isRead).length;
    const avgAIMatch = applications.filter(app => app.aiMatchScore).length > 0
      ? Math.round(applications.filter(app => app.aiMatchScore).reduce((sum, app) => sum + (app.aiMatchScore || 0), 0) / applications.filter(app => app.aiMatchScore).length)
      : 0;
    const needsActionCount = applications.filter(app => 
      app.stage === 'New Application' || app.stage === 'Resume Review'
    ).length;

    return {
      total: applications.length,
      unread: unreadCount,
      avgAIMatch,
      needsAction: needsActionCount,
    };
  }, [applications]);

  const handleJobSelect = (value: string) => {
    if (value === "all") {
      setSelectedJobId(null);
      setShowUnreadOnly(false);
    } else if (value === "unread") {
      setSelectedJobId("unread");
      setShowUnreadOnly(true);
    } else {
      setSelectedJobId(value);
      setShowUnreadOnly(false);
    }
  };

  const selectedJob = selectedJobId && selectedJobId !== "all" && selectedJobId !== "unread"
    ? mockJobs.find(j => j.id === selectedJobId)
    : null;

  const handleToggleCompareMode = () => {
    setIsCompareMode(!isCompareMode);
    setSelectedForComparison([]);
  };

  const handleToggleSelect = (applicationId: string) => {
    setSelectedForComparison(prev => 
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleCompare = () => {
    if (selectedForComparison.length >= 2) {
      setShowComparison(true);
    }
  };

  const handleRemoveFromComparison = (applicationId: string) => {
    setSelectedForComparison(prev => prev.filter(id => id !== applicationId));
    if (selectedForComparison.length <= 2) {
      setShowComparison(false);
    }
  };

  const applicationsToCompare = applications.filter(app => 
    selectedForComparison.includes(app.id)
  );

  return (
    <DashboardPageLayout
      breadcrumbActions={
        <>
          <Button variant="outline" size="sm" onClick={() => setImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </>
      }
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
            <p className="text-muted-foreground">
              Review and process {applications.length} applications
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant={isCompareMode ? "default" : "outline"} 
              size="sm"
              onClick={handleToggleCompareMode}
            >
              <GitCompare className="mr-2 h-4 w-4" />
              {isCompareMode ? 'Exit Compare' : 'Compare'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAdvancedFiltersOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
            <div className="flex items-center border rounded-lg p-1 gap-1">
              <Button
                variant={viewMode === 'pipeline' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('pipeline')}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Pipeline
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content with Recommendations Sidebar */}
        <div className="grid gap-4 lg:grid-cols-[1fr_350px]">
          <div className="space-y-4">
            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <EnhancedStatCard
                title="Total Applications"
                value={stats.total.toString()}
                change=""
                icon={<FileText />}
                variant="neutral"
                showBorder
                elevation="sm"
              />
              <EnhancedStatCard
                title="New/Unread"
                value={stats.unread.toString()}
                change=""
                icon={<UserCheck />}
                variant="primary"
                showBorder
                elevation="sm"
              />
              <EnhancedStatCard
                title="Avg AI Match"
                value={`${stats.avgAIMatch}%`}
                change=""
                icon={<Sparkles />}
                variant="success"
                showBorder
                elevation="sm"
              />
              <EnhancedStatCard
                title="Needs Action"
                value={stats.needsAction.toString()}
                change=""
                icon={<Clock />}
                variant="warning"
                showBorder
                elevation="sm"
              />
            </div>

            {/* Job Selection Filter */}
            <Card className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Label className="text-sm font-medium whitespace-nowrap">Filter by Job:</Label>
              <Select value={selectedJobId || "unread"} onValueChange={handleJobSelect}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Select a job or view unread" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unread">📬 New/Unread Applications</SelectItem>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectSeparator />
                  {mockJobs.slice(0, 20).map(job => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} - {job.employer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedJob && (
                <Button variant="ghost" size="sm" onClick={() => handleJobSelect("unread")}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {filteredApplications.length} application(s)
            </div>
              </div>
            </Card>

            {/* Compare Mode Alert */}
            {isCompareMode && (
              <Alert>
                <GitCompare className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>
                    Select candidates to compare ({selectedForComparison.length} selected)
                  </span>
                  {selectedForComparison.length >= 1 && (
                    <div className="flex gap-2">
                      {selectedForComparison.length >= 2 && (
                        <Button size="sm" onClick={handleCompare} variant="default">
                          Compare {selectedForComparison.length} Candidates
                        </Button>
                      )}
                      <Button size="sm" onClick={() => setShowBulkScoring(true)} variant="secondary">
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Re-score {selectedForComparison.length}
                      </Button>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Smart Filters */}
            <SmartFiltersBar onFilterSelect={handleSmartFilterSelect} />

            <ApplicationFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedStages={selectedStages}
              onStagesChange={setSelectedStages}
              selectedStatuses={selectedStatuses}
              onStatusesChange={setSelectedStatuses}
              onClearFilters={handleClearFilters}
            />

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
              <ApplicationPipeline 
                applications={filteredApplications}
                isCompareMode={isCompareMode}
                selectedForComparison={selectedForComparison}
                onToggleSelect={handleToggleSelect}
              />
            ) : (
              <ApplicationListView
                applications={filteredApplications}
                onApplicationClick={handleApplicationClick}
                selectable
                onSelectedRowsChange={setSelectedApplicationIds}
              />
            )}
          </div>

          {/* AI Recommendations Sidebar */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <CandidateRecommendations 
              applications={applications}
              jobId={selectedJobId && selectedJobId !== "all" && selectedJobId !== "unread" ? selectedJobId : undefined}
              maxRecommendations={5}
            />
          </div>
        </div>

        <ApplicationDetailPanel
          application={selectedApplication}
          open={detailPanelOpen}
          onOpenChange={setDetailPanelOpen}
          onRefresh={loadApplications}
        />

        <CandidateComparison
          applications={applicationsToCompare}
          open={showComparison}
          onOpenChange={setShowComparison}
          onRemoveCandidate={handleRemoveFromComparison}
        />

        {/* Dialogs */}
        <AdvancedFiltersDialog
          open={advancedFiltersOpen}
          onOpenChange={setAdvancedFiltersOpen}
          onApplyFilters={handleApplyFilters}
          currentFilters={appliedFilters}
        />

        <AdvancedExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          onExport={handleExport}
          availableFields={['name', 'email', 'jobTitle', 'status', 'stage', 'score', 'appliedDate', 'assignedToName']}
          totalRecords={filteredApplications.length}
        />

        <ImportDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
          onImport={handleImport}
          requiredFields={['name', 'email', 'jobTitle', 'status', 'stage', 'appliedDate']}
        />

        <BulkScheduleInterviewDialog
          open={bulkScheduleOpen}
          onOpenChange={setBulkScheduleOpen}
          selectedCount={selectedApplicationIds.length}
          onSchedule={handleBulkSchedule}
        />

        <BulkAIScoringDialog
          open={showBulkScoring}
          onOpenChange={setShowBulkScoring}
          applications={applicationsToCompare}
          onComplete={() => {
            setIsCompareMode(false);
            setSelectedForComparison([]);
            loadApplications();
          }}
        />
      </div>
    </DashboardPageLayout>
  );
}
