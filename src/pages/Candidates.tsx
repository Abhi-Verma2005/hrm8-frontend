import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { DataTable } from "@/components/tables/DataTable";
import { candidateTableColumns } from "@/components/candidates/CandidateTableColumns";
import { CandidatesFilterBar } from "@/components/candidates/CandidatesFilterBar";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { getCandidates } from "@/lib/mockCandidateStorage";
import { Card } from "@/components/ui/card";
import type { Candidate } from "@/types/entities";

export default function Candidates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Candidate['status'] | 'all'>('all');
  const [experienceLevelFilter, setExperienceLevelFilter] = useState<Candidate['experienceLevel'] | 'all'>('all');
  const [workArrangementFilter, setWorkArrangementFilter] = useState<Candidate['workArrangement'] | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<Candidate['source'] | 'all'>('all');
  
  const candidates = getCandidates();

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
          <Button asChild>
            <Link to="/candidates/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Candidate
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Candidates</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.placed}</div>
            <div className="text-sm text-muted-foreground">Placed</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <div className="text-sm text-muted-foreground">Inactive</div>
          </Card>
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
