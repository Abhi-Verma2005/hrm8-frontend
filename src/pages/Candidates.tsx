import { useState, useMemo } from "react";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { DataTable } from "@/components/tables/DataTable";
import { candidateTableColumns } from "@/components/candidates/CandidateTableColumns";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { getCandidates } from "@/lib/mockCandidateStorage";
import { Card } from "@/components/ui/card";

export default function Candidates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  
  const candidates = getCandidates();

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = !searchQuery || 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(candidate.status);
      
      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchQuery, statusFilter]);

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

        <DataTable
          data={filteredCandidates}
          columns={candidateTableColumns}
          selectable
          searchable
          searchKeys={['name', 'email', 'position']}
          statusFilter
          statusOptions={[
            { label: 'Active', value: 'active' },
            { label: 'Placed', value: 'placed' },
            { label: 'Inactive', value: 'inactive' },
          ]}
          statusKey="status"
          emptyMessage="No candidates found"
        />
      </div>
    </DashboardPageLayout>
  );
}
