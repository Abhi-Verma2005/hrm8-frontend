import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { BackgroundCheckNotificationBadge } from "@/components/backgroundChecks/BackgroundCheckNotificationBadge";
import { BackgroundChecksFilterBar } from "@/components/backgroundChecks/BackgroundChecksFilterBar";
import { useAutomatedReminders } from "@/hooks/useAutomatedReminders";
import { Button } from "@/components/ui/button";
import { Shield, Plus, FileText, Download, Upload, BarChart3, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { getBackgroundChecks, saveBackgroundCheck, getBackgroundCheckById } from "@/lib/mockBackgroundCheckStorage";
import { getConsentsByBackgroundCheck } from "@/lib/backgroundChecks/consentStorage";
import { getRefereesByBackgroundCheck } from "@/lib/backgroundChecks/refereeStorage";
import { exportBackgroundCheckPDF } from "@/lib/backgroundChecks/backgroundCheckExport";
import { BackgroundCheck } from "@/types/backgroundCheck";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BackgroundCheckForm } from "@/components/backgroundChecks/BackgroundCheckForm";
import { toast } from "@/hooks/use-toast";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { BackgroundChecksTable } from "@/components/backgroundChecks/BackgroundChecksTable";
import { getBackgroundCheckStats } from "@/lib/backgroundChecks/dashboardStats";

export default function BackgroundChecks() {
  const navigate = useNavigate();
  const [checks, setChecks] = useState<BackgroundCheck[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [checkTypeFilter, setCheckTypeFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");

  // Enable automated reminders
  useAutomatedReminders({
    enabled: true,
    checkInterval: 60000, // Check every minute
    onRemindersProcessed: (result) => {
      console.log('Reminders processed:', result);
    }
  });

  useEffect(() => {
    loadChecks();
  }, []);

  const loadChecks = () => {
    setChecks(getBackgroundChecks());
  };

  const stats = getBackgroundCheckStats();

  // Filter checks based on active filters
  const filteredChecks = useMemo(() => {
    let filtered = checks;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(check => 
        check.candidateName.toLowerCase().includes(searchLower) ||
        check.id.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(check => check.status === statusFilter);
    }

    // Check type filter
    if (checkTypeFilter !== "all") {
      filtered = filtered.filter(check => 
        check.checkTypes.some(ct => ct.type === checkTypeFilter)
      );
    }

    // Provider filter
    if (providerFilter !== "all") {
      filtered = filtered.filter(check => check.provider === providerFilter);
    }

    return filtered;
  }, [checks, searchTerm, statusFilter, checkTypeFilter, providerFilter]);

  const handleInitiateCheck = (data: any) => {
    const newCheck: BackgroundCheck = {
      id: `bgc-${Date.now()}`,
      candidateId: 'cand-temp',
      candidateName: 'Sample Candidate',
      provider: data.provider,
      checkTypes: data.checkTypes.map((type: string) => ({
        type: type as any,
        required: true,
      })),
      status: 'pending-consent',
      initiatedBy: 'current-user',
      initiatedByName: 'Current User',
      initiatedDate: new Date().toISOString(),
      consentGiven: false,
      results: [],
      overallStatus: 'clear',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveBackgroundCheck(newCheck);
    loadChecks();
    setIsFormOpen(false);
    toast({
      title: "Background Check Initiated",
      description: "Consent request has been sent to the candidate.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: "Your report is being generated...",
    });
  };

  const handleDownloadReport = (checkId: string) => {
    const check = getBackgroundCheckById(checkId);
    if (!check) {
      toast({
        title: "Error",
        description: "Background check not found.",
        variant: "destructive",
      });
      return;
    }

    const consents = getConsentsByBackgroundCheck(checkId);
    const referees = getRefereesByBackgroundCheck(checkId);
    
    try {
      exportBackgroundCheckPDF(check, consents, referees);
      toast({
        title: "Report Downloaded",
        description: "Background check report has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to generate PDF report.",
        variant: "destructive",
      });
    }
  };

  const handleSendReminder = (checkId: string) => {
    toast({
      title: "Reminder Sent",
      description: "Consent reminder has been sent to the candidate.",
    });
  };

  const handleCancelCheck = (checkId: string) => {
    toast({
      title: "Check Cancelled",
      description: "Background check has been cancelled successfully.",
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCheckTypeFilter("all");
    setProviderFilter("all");
  };

  const activeFilterCount = [
    searchTerm ? 1 : 0,
    statusFilter !== "all" ? 1 : 0,
    checkTypeFilter !== "all" ? 1 : 0,
    providerFilter !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <DashboardPageLayout
      breadcrumbActions={
        <>
          <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
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
            <h1 className="text-3xl font-bold tracking-tight">Background Checks</h1>
            <p className="text-muted-foreground">
              Manage candidate screening and verification
            </p>
          </div>
          <div className="flex items-center gap-3">
            <BackgroundCheckNotificationBadge />
            <Button 
              variant="outline" 
              onClick={() => navigate('/questionnaire-templates')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Manage Templates
            </Button>
            <Button 
              variant="outline" 
              asChild
            >
              <Link to="/dashboard/background-checks">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Dashboard
              </Link>
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Initiate Check
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Total Background Checks"
            value={stats.total.toString()}
            change={`+${stats.changeFromLastMonth.total}%`}
            trend="up"
            icon={<Shield className="h-6 w-6" />}
            variant="neutral"
            showGradient={false}
            showBorder={true}
            elevation="sm"
            iconPosition="left"
          />
          <EnhancedStatCard
            title="Active Checks"
            value={stats.active.toString()}
            change={`${stats.changeFromLastMonth.active}%`}
            trend="down"
            icon={<Shield className="h-6 w-6" />}
            variant="primary"
            showGradient={false}
            showBorder={true}
            elevation="sm"
            iconPosition="left"
          />
          <EnhancedStatCard
            title="Completion Rate"
            value={`${stats.completionRate.toFixed(1)}%`}
            change={`+${stats.changeFromLastMonth.completionRate}%`}
            trend="up"
            icon={<CheckCircle className="h-6 w-6" />}
            variant="success"
            showGradient={false}
            showBorder={true}
            elevation="sm"
            iconPosition="left"
          />
          <EnhancedStatCard
            title="Avg. Completion Time"
            value={`${stats.avgCompletionTime} days`}
            change={`${stats.changeFromLastMonth.avgCompletionTime}%`}
            trend="down"
            icon={<Clock className="h-6 w-6" />}
            variant="warning"
            showGradient={false}
            showBorder={true}
            elevation="sm"
            iconPosition="left"
          />
        </div>

        {/* Filters */}
        <BackgroundChecksFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          checkTypeFilter={checkTypeFilter}
          onCheckTypeChange={setCheckTypeFilter}
          providerFilter={providerFilter}
          onProviderChange={setProviderFilter}
          onClearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Background Checks Table */}
        <BackgroundChecksTable
          checks={filteredChecks}
          onDownloadReport={handleDownloadReport}
          onSendReminder={handleSendReminder}
          onCancelCheck={handleCancelCheck}
          onViewDetails={(checkId) => navigate(`/background-checks/${checkId}`)}
        />

        {/* Initiate Check Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Initiate Background Check</DialogTitle>
            </DialogHeader>
            <BackgroundCheckForm
              candidateName="Sample Candidate"
              onSubmit={handleInitiateCheck}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardPageLayout>
  );
}
