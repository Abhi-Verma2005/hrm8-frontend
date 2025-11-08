import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { DataTable } from "@/components/tables/DataTable";
import { candidateTableColumns } from "@/components/candidates/CandidateTableColumns";
import { CandidatesFilterBar } from "@/components/candidates/CandidatesFilterBar";
import { CandidateDetailView } from "@/components/candidates/CandidateDetailView";
import { CandidateFormWizard } from "@/components/candidates/CandidateFormWizard";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Users, UserCheck, Briefcase, UserX, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { getCandidates, getCandidateById, saveCandidate, updateCandidate } from "@/lib/mockCandidateStorage";
import { uploadDocument } from "@/lib/mockDocumentStorage";
import { addHistoryEvent } from "@/lib/mockCandidateHistory";
import type { Candidate } from "@/types/entities";

export default function Candidates() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Candidate['status'] | 'all'>('all');
  const [experienceLevelFilter, setExperienceLevelFilter] = useState<Candidate['experienceLevel'] | 'all'>('all');
  const [workArrangementFilter, setWorkArrangementFilter] = useState<Candidate['workArrangement'] | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<Candidate['source'] | 'all'>('all');
  
  const candidates = getCandidates();

  // Handle form routes (/candidates/new or /candidates/:id/edit)
  const isNewForm = candidateId === 'new';
  const isEditForm = candidateId?.includes('edit');
  const actualCandidateId = isEditForm ? candidateId.replace('/edit', '') : candidateId;

  const handleSaveCandidate = async (data: Partial<Candidate>) => {
    if (isNewForm) {
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

      // Handle document uploads if any
      // This would be done after the form completes
      
      navigate(`/candidates/${newId}`);
    } else if (actualCandidateId) {
      // Update existing candidate
      updateCandidate(actualCandidateId, data);

      addHistoryEvent({
        candidateId: actualCandidateId,
        eventType: 'profile_updated',
        title: 'Candidate Profile Updated',
        description: 'Candidate information was modified',
        timestamp: new Date(),
        userName: 'Current User',
      });

      navigate(`/candidates/${actualCandidateId}`);
    }
  };

  // Show form wizard for new or edit
  if (isNewForm || isEditForm) {
    const candidateToEdit = isEditForm && actualCandidateId ? getCandidateById(actualCandidateId) : undefined;
    
    return (
      <DashboardPageLayout>
        <div className="p-6">
          <CandidateFormWizard
            candidate={candidateToEdit}
            onSave={handleSaveCandidate}
            onCancel={() => navigate('/candidates')}
          />
        </div>
      </DashboardPageLayout>
    );
  }

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
  
  // List view - show all candidates with filters
  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
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
  }, [candidates, searchTerm, statusFilter, experienceLevelFilter, workArrangementFilter, sourceFilter]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== 'all') count++;
    if (experienceLevelFilter !== 'all') count++;
    if (workArrangementFilter !== 'all') count++;
    if (sourceFilter !== 'all') count++;
    return count;
  }, [searchTerm, statusFilter, experienceLevelFilter, workArrangementFilter, sourceFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter('all');
    setExperienceLevelFilter('all');
    setWorkArrangementFilter('all');
    setSourceFilter('all');
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
            <p className="text-muted-foreground">
              Manage candidate pool and placements
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/candidates/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Candidate
              </Link>
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
          emptyMessage="No candidates found"
        />
      </div>
    </DashboardPageLayout>
  );
}
