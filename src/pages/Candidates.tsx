import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { DataTable } from "@/components/tables/DataTable";
import { candidateTableColumns } from "@/components/candidates/CandidateTableColumns";
import { CandidatesFilterBar } from "@/components/candidates/CandidatesFilterBar";
import { CandidateDetailView } from "@/components/candidates/CandidateDetailView";
import { CandidateFormWizard } from "@/components/candidates/CandidateFormWizard";
import { FormDrawer } from "@/components/ui/form-drawer";
import { AdvancedSearchBuilder } from "@/components/candidates/AdvancedSearchBuilder";
import { SavedSearchesPanel } from "@/components/candidates/SavedSearchesPanel";
import { DuplicateDetectionPanel } from "@/components/candidates/DuplicateDetectionPanel";
import { SearchHistoryPanel } from "@/components/candidates/SearchHistoryPanel";
import { CandidateBulkActionsToolbar } from "@/components/candidates/bulk/CandidateBulkActionsToolbar";
import { CandidatePipelineBoard } from "@/components/candidates/pipeline/CandidatePipelineBoard";
import { CandidateImportDialog } from "@/components/candidates/import-export/CandidateImportDialog";
import { CandidateExportDialog } from "@/components/candidates/import-export/CandidateExportDialog";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Plus, Download, Upload, Users, UserCheck, Briefcase, UserX, BarChart3, Search, Filter, List, Kanban } from "lucide-react";
import { Link } from "react-router-dom";
import { getCandidates, getCandidateById, saveCandidate, updateCandidate } from "@/lib/mockCandidateStorage";
import { uploadDocument } from "@/lib/mockDocumentStorage";
import { addHistoryEvent } from "@/lib/mockCandidateHistory";
import { executeAdvancedSearch } from "@/lib/advancedSearchExecutor";
import { addSearchHistory, type SavedSearch, type SearchHistory, type SearchGroup } from "@/lib/savedSearchService";
import { updateCandidatePriority } from "@/lib/pipelineService";
import type { Candidate } from "@/types/entities";
import { useToast } from "@/hooks/use-toast";

export default function Candidates() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Candidate['status'] | 'all'>('all');
  const [experienceLevelFilter, setExperienceLevelFilter] = useState<Candidate['experienceLevel'] | 'all'>('all');
  const [workArrangementFilter, setWorkArrangementFilter] = useState<Candidate['workArrangement'] | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<Candidate['source'] | 'all'>('all');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedSearchGroups, setAdvancedSearchGroups] = useState<SearchGroup[]>([]);
  const [advancedSearchOperator, setAdvancedSearchOperator] = useState<'AND' | 'OR'>('AND');
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCandidateId, setEditingCandidateId] = useState<string | null>(null);
  
  const candidates = getCandidates();

  // Handle query parameter for creating new candidate
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setEditingCandidateId(null);
      setDrawerOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSaveCandidate = async (data: Partial<Candidate>) => {
    if (!editingCandidateId) {
      // Create new candidate
      const newId = `candidate-${Date.now()}`;
      const newCandidate: Candidate = {
        id: newId,
        firstName: data.firstName!,
        lastName: data.lastName!,
        name: data.name!,
        email: data.email!,
        phone: data.phone!,
        photo: data.photo,
        city: data.city!,
        state: data.state,
        country: data.country!,
        location: data.location!,
        currentPosition: data.currentPosition,
        desiredPosition: data.desiredPosition,
        position: data.position!,
        experienceYears: data.experienceYears!,
        experience: data.experience!,
        experienceLevel: data.experienceLevel!,
        skills: data.skills!,
        education: data.education,
        certifications: data.certifications,
        salaryCurrency: data.salaryCurrency!,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        workArrangement: data.workArrangement!,
        employmentTypePreferences: data.employmentTypePreferences!,
        noticePeriod: data.noticePeriod,
        availabilityDate: data.availabilityDate,
        linkedInUrl: data.linkedInUrl,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
        source: data.source!,
        sourceDetails: data.sourceDetails,
        tags: data.tags || [],
        status: 'active',
        rating: 0,
        appliedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      saveCandidate(newCandidate);

      // Add history event
      addHistoryEvent({
        candidateId: newId,
        eventType: 'profile_updated',
        title: 'Candidate Profile Created',
        description: 'New candidate added to the system',
        timestamp: new Date(),
        userName: 'Current User',
      });

      toast({
        title: "Candidate added",
        description: "New candidate has been added successfully.",
      });

      setDrawerOpen(false);
      navigate(`/candidates/${newId}`);
    } else {
      // Update existing candidate
      updateCandidate(editingCandidateId, data);

      addHistoryEvent({
        candidateId: editingCandidateId,
        eventType: 'profile_updated',
        title: 'Candidate Profile Updated',
        description: 'Candidate information was modified',
        timestamp: new Date(),
        userName: 'Current User',
      });

      toast({
        title: "Candidate updated",
        description: "Candidate has been updated successfully.",
      });

      setDrawerOpen(false);
      navigate(`/candidates/${editingCandidateId}`);
    }
  };

  // If candidateId is present, show detail view
  if (candidateId) {
    const candidate = getCandidateById(candidateId);
    
    if (!candidate) {
      return (
        <DashboardPageLayout>
          <div className="p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Candidate Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The candidate you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to="/candidates">Back to Candidates</Link>
              </Button>
            </div>
          </div>
        </DashboardPageLayout>
      );
    }

    return (
      <DashboardPageLayout>
        <div className="p-6">
          <CandidateDetailView candidate={candidate} />
        </div>
      </DashboardPageLayout>
    );
  }
  
  const handleAdvancedSearch = (groups: SearchGroup[], globalOperator: 'AND' | 'OR') => {
    setAdvancedSearchGroups(groups);
    setAdvancedSearchOperator(globalOperator);
    setShowAdvancedSearch(false);
  };

  const handleSelectSavedSearch = (search: SavedSearch) => {
    setAdvancedSearchGroups(search.groups);
    setAdvancedSearchOperator(search.globalOperator);
    setShowSearchPanel(false);
  };

  const handleSelectSearchHistory = (history: SearchHistory) => {
    setSearchTerm(history.searchQuery);
    // Could restore other filters from history.filters if needed
    setShowSearchPanel(false);
  };

  // List view - show all candidates with filters
  const filteredCandidates = useMemo(() => {
    let results = candidates;

    // Apply advanced search if active
    if (advancedSearchGroups.length > 0) {
      results = executeAdvancedSearch(results, advancedSearchGroups, advancedSearchOperator);
    } else {
      // Apply basic filters
      results = results.filter(candidate => {
        // Search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = 
            candidate.name.toLowerCase().includes(searchLower) ||
            candidate.email.toLowerCase().includes(searchLower) ||
            candidate.position.toLowerCase().includes(searchLower) ||
            candidate.skills.some(skill => skill.toLowerCase().includes(searchLower));
          
          if (!matchesSearch) return false;
        }

        // Status filter
        if (statusFilter !== 'all' && candidate.status !== statusFilter) {
          return false;
        }

        // Experience level filter
        if (experienceLevelFilter !== 'all' && candidate.experienceLevel !== experienceLevelFilter) {
          return false;
        }

        // Work arrangement filter
        if (workArrangementFilter !== 'all' && candidate.workArrangement !== workArrangementFilter) {
          return false;
        }

        // Source filter
        if (sourceFilter !== 'all' && candidate.source !== sourceFilter) {
          return false;
        }

        return true;
      });
    }

    // Track search in history
    if (searchTerm || advancedSearchGroups.length > 0) {
      addSearchHistory(searchTerm, { 
        status: statusFilter, 
        experienceLevel: experienceLevelFilter,
        advancedSearch: advancedSearchGroups.length > 0
      }, results.length);
    }

    return results;
  }, [candidates, searchTerm, statusFilter, experienceLevelFilter, workArrangementFilter, sourceFilter, advancedSearchGroups, advancedSearchOperator]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== 'all') count++;
    if (experienceLevelFilter !== 'all') count++;
    if (workArrangementFilter !== 'all') count++;
    if (sourceFilter !== 'all') count++;
    if (advancedSearchGroups.length > 0) count++;
    return count;
  }, [searchTerm, statusFilter, experienceLevelFilter, workArrangementFilter, sourceFilter, advancedSearchGroups]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter('all');
    setExperienceLevelFilter('all');
    setWorkArrangementFilter('all');
    setSourceFilter('all');
    setAdvancedSearchGroups([]);
  };

  // Bulk action handlers
  const handleBulkStageUpdate = (stageId: string) => {
    toast({
      title: "Stage updated",
      description: `${selectedCandidates.length} candidate(s) moved to new stage.`,
    });
    setSelectedCandidates([]);
  };

  const handleBulkTagAdd = (tags: string[]) => {
    toast({
      title: "Tags added",
      description: `Tags added to ${selectedCandidates.length} candidate(s).`,
    });
    setSelectedCandidates([]);
  };

  const handleBulkPriorityUpdate = (priority: 'high' | 'medium' | 'low') => {
    selectedCandidates.forEach(id => {
      updateCandidatePriority(id, priority);
    });
    toast({
      title: "Priority updated",
      description: `${selectedCandidates.length} candidate(s) priority updated.`,
    });
    setSelectedCandidates([]);
  };

  const handleBulkArchive = () => {
    toast({
      title: "Candidates archived",
      description: `${selectedCandidates.length} candidate(s) archived.`,
    });
    setSelectedCandidates([]);
  };

  const handleBulkDelete = () => {
    toast({
      title: "Candidates deleted",
      description: `${selectedCandidates.length} candidate(s) deleted.`,
      variant: "destructive",
    });
    setSelectedCandidates([]);
  };

  const handleBulkEmail = () => {
    toast({
      title: "Email composer",
      description: `Opening email composer for ${selectedCandidates.length} candidate(s).`,
    });
  };

  const handleBulkScheduleInterview = () => {
    toast({
      title: "Interview scheduler",
      description: `Opening scheduler for ${selectedCandidates.length} candidate(s).`,
    });
  };

  const handleImportCandidates = async (
    candidatesData: Partial<Candidate>[],
    duplicateAction: 'skip' | 'update' | 'create'
  ) => {
    console.log("Importing candidates:", candidatesData, "Action:", duplicateAction);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Import successful",
      description: `${candidatesData.length} candidates imported`,
    });
  };

  const stats = useMemo(() => ({
    total: candidates.length,
    active: candidates.filter(c => c.status === 'active').length,
    placed: candidates.filter(c => c.status === 'placed').length,
    inactive: candidates.filter(c => c.status === 'inactive').length,
  }), [candidates]);

  return (
    <DashboardPageLayout
      breadcrumbActions={
        <>
          <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
            <p className="text-muted-foreground">
              Manage candidate pool and placements
            </p>
          </div>
          <div className="flex gap-2">
            <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'list' | 'kanban')}>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="kanban" aria-label="Kanban view">
                <Kanban className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            <Button onClick={() => {
              setEditingCandidateId(null);
              setDrawerOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Candidate
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/candidates">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Candidates"
            value={stats.total}
            icon={Users}
            description={`${stats.active} currently active`}
          />
          <StatsCard
            title="Active"
            value={stats.active}
            icon={UserCheck}
            description={`${stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(0) : 0}% of total`}
          />
          <StatsCard
            title="Placed"
            value={stats.placed}
            icon={Briefcase}
            description="Successfully placed"
          />
          <StatsCard
            title="Inactive"
            value={stats.inactive}
            icon={UserX}
            description="Not currently seeking"
          />
        </div>

        {/* Bulk Actions Toolbar */}
        {viewMode === 'list' && (
          <CandidateBulkActionsToolbar
            selectedCount={selectedCandidates.length}
            onClearSelection={() => setSelectedCandidates([])}
            onBulkStageUpdate={handleBulkStageUpdate}
            onBulkTagAdd={handleBulkTagAdd}
            onBulkPriorityUpdate={handleBulkPriorityUpdate}
            onBulkArchive={handleBulkArchive}
            onBulkDelete={handleBulkDelete}
            onBulkEmail={handleBulkEmail}
            onBulkScheduleInterview={handleBulkScheduleInterview}
          />
        )}

        {viewMode === 'list' && (
          <div className="flex gap-2">
            <Button 
              variant={showAdvancedSearch ? "default" : "outline"}
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            >
              <Search className="mr-2 h-4 w-4" />
              Advanced Search
            </Button>
            <Button 
              variant={showSearchPanel ? "default" : "outline"}
              onClick={() => setShowSearchPanel(!showSearchPanel)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Saved & History
            </Button>
          </div>
        )}

        {showAdvancedSearch && (
          <AdvancedSearchBuilder 
            onSearch={handleAdvancedSearch}
            onClose={() => setShowAdvancedSearch(false)}
          />
        )}

        {showSearchPanel && (
          <Tabs defaultValue="saved" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="duplicates">Duplicates</TabsTrigger>
            </TabsList>
            <TabsContent value="saved">
              <SavedSearchesPanel onSelectSearch={handleSelectSavedSearch} />
            </TabsContent>
            <TabsContent value="history">
              <SearchHistoryPanel onSelectHistory={handleSelectSearchHistory} />
            </TabsContent>
            <TabsContent value="duplicates">
              <DuplicateDetectionPanel />
            </TabsContent>
          </Tabs>
        )}

        {viewMode === 'list' && (
          <>
            <CandidatesFilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              experienceLevelFilter={experienceLevelFilter}
              onExperienceLevelChange={setExperienceLevelFilter}
              workArrangementFilter={workArrangementFilter}
              onWorkArrangementChange={setWorkArrangementFilter}
              sourceFilter={sourceFilter}
              onSourceChange={setSourceFilter}
              onClearFilters={handleClearFilters}
              activeFilterCount={activeFilterCount}
            />

            <DataTable
              data={filteredCandidates}
              columns={candidateTableColumns}
              selectable
              onSelectedRowsChange={setSelectedCandidates}
              emptyMessage="No candidates found"
            />
          </>
        )}

        {viewMode === 'kanban' && (
          <CandidatePipelineBoard
            filters={{
              search: searchTerm,
            }}
            onViewDetails={(candidate) => navigate(`/candidates/${candidate.id}`)}
          />
        )}
      </div>

      <CandidateImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        existingCandidates={candidates}
        onImport={handleImportCandidates}
      />

      <CandidateExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        candidates={filteredCandidates}
        selectedCandidates={selectedCandidates.map(id => 
          filteredCandidates.find(c => c.id === id)!
        ).filter(Boolean)}
      />

      <FormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editingCandidateId ? "Edit Candidate" : "Add New Candidate"}
        description={editingCandidateId ? "Update candidate information" : "Fill in the candidate details"}
        width="xl"
      >
        <CandidateFormWizard
          candidate={editingCandidateId ? getCandidateById(editingCandidateId) : undefined}
          onSave={handleSaveCandidate}
          onCancel={() => setDrawerOpen(false)}
        />
      </FormDrawer>
    </DashboardPageLayout>
  );
}
