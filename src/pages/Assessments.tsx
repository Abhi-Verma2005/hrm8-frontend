import { useState, useMemo } from 'react';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { AssessmentNotificationBadge } from '@/components/assessments/AssessmentNotificationBadge';
import { AssessmentsFilterBar } from '@/components/assessments/AssessmentsFilterBar';
import { AssessmentsTable } from '@/components/assessments/AssessmentsTable';
import { AssessmentInvitationWizard } from '@/components/assessments/AssessmentInvitationWizard';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, TrendingUp, Award, Clock, LayoutDashboard, Settings, BarChart3 } from 'lucide-react';
import { getAssessments } from '@/lib/mockAssessmentStorage';
import { getAssessmentStats } from '@/lib/assessments/dashboardStats';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Assessments() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');

  const stats = getAssessmentStats();
  const allAssessments = getAssessments();

  const filteredAssessments = useMemo(() => {
    let filtered = allAssessments;

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(a => a.assessmentType === typeFilter);
    }

    if (providerFilter !== 'all') {
      filtered = filtered.filter(a => a.provider === providerFilter);
    }

    return filtered;
  }, [allAssessments, searchTerm, statusFilter, typeFilter, providerFilter]);

  const activeFilterCount = [
    searchTerm ? 1 : 0,
    statusFilter !== 'all' ? 1 : 0,
    typeFilter !== 'all' ? 1 : 0,
    providerFilter !== 'all' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setProviderFilter('all');
  };

  const handleViewDetails = (id: string) => {
    navigate(`/assessments/${id}`);
  };

  const handleSendReminder = (id: string) => {
    toast({ title: "Reminder sent successfully" });
  };

  const handleDownloadReport = (id: string) => {
    toast({ title: "Report downloaded" });
  };

  const handleCancelAssessment = (id: string) => {
    toast({ title: "Assessment cancelled" });
  };

  return (
    <DashboardPageLayout
      title="Assessments"
      breadcrumbActions={
        <div className="flex items-center gap-2">
          <AssessmentNotificationBadge />
          <Button variant="outline" size="sm" onClick={() => navigate('/assessments/compare')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Compare Results
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/assessment-templates')}>
            <Settings className="h-4 w-4 mr-2" />
            Manage Templates
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/assessments')}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            View Dashboard
          </Button>
          <Button size="sm" onClick={() => setWizardOpen(true)}>
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Invite Candidate
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Total Assessments"
            value={stats.total}
            icon={<ClipboardCheck className="h-6 w-6" />}
            change={`${Math.abs(stats.changeFromLastMonth.total)}%`}
            trend={stats.changeFromLastMonth.total > 0 ? 'up' : 'down'}
            showGradient={false}
            showBorder={true}
            elevation="sm"
            variant="neutral"
            showMenu={true}
            menuItems={[
              { label: 'View all assessments', onClick: () => clearFilters() },
              { label: 'View dashboard', onClick: () => navigate('/dashboard/assessments') },
              { label: 'Export data', onClick: () => toast({ title: "Exporting data..." }) }
            ]}
          />
          <EnhancedStatCard
            title="Active Assessments"
            value={stats.active}
            icon={<TrendingUp className="h-6 w-6" />}
            change={`${Math.abs(stats.changeFromLastMonth.active)}%`}
            trend={stats.changeFromLastMonth.active > 0 ? 'up' : 'down'}
            showGradient={false}
            showBorder={true}
            elevation="sm"
            variant="primary"
            showMenu={true}
            menuItems={[
              { label: 'View active assessments', onClick: () => setStatusFilter('in-progress') },
              { label: 'Invite candidate', onClick: () => setWizardOpen(true) }
            ]}
          />
          <EnhancedStatCard
            title="Avg. Score"
            value={`${stats.avgScore}%`}
            icon={<Award className="h-6 w-6" />}
            change={`${Math.abs(stats.changeFromLastMonth.avgScore)}%`}
            trend={stats.changeFromLastMonth.avgScore > 0 ? 'up' : 'down'}
            showGradient={false}
            showBorder={true}
            elevation="sm"
            variant="success"
            showMenu={true}
            menuItems={[
              { label: 'View completed assessments', onClick: () => setStatusFilter('completed') },
              { label: 'View high performers', onClick: () => toast({ title: "Filtering high performers..." }) }
            ]}
          />
          <EnhancedStatCard
            title="Pass Rate"
            value={`${stats.passRate}%`}
            icon={<Clock className="h-6 w-6" />}
            change={`${Math.abs(stats.changeFromLastMonth.completed)}%`}
            trend={stats.changeFromLastMonth.completed > 0 ? 'up' : 'down'}
            showGradient={false}
            showBorder={true}
            elevation="sm"
            variant="warning"
            showMenu={true}
            menuItems={[
              { label: 'View analytics', onClick: () => navigate('/dashboard/assessments') },
              { label: 'Export reports', onClick: () => toast({ title: "Exporting reports..." }) }
            ]}
          />
        </div>

        <AssessmentsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          providerFilter={providerFilter}
          onProviderChange={setProviderFilter}
          onClearFilters={clearFilters}
          activeFilterCount={activeFilterCount}
        />

        <AssessmentsTable
          assessments={filteredAssessments}
          onViewDetails={handleViewDetails}
          onSendReminder={handleSendReminder}
          onDownloadReport={handleDownloadReport}
          onCancelAssessment={handleCancelAssessment}
          onBulkSendReminders={(ids) => toast({ title: `Reminders sent to ${ids.length} candidates` })}
          onBulkExport={(ids) => toast({ title: `Exporting ${ids.length} reports` })}
          onBulkCancel={(ids) => toast({ title: `Cancelled ${ids.length} assessments` })}
        />

        <AssessmentInvitationWizard
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
          onComplete={() => window.location.reload()}
        />
      </div>
    </DashboardPageLayout>
  );
}
