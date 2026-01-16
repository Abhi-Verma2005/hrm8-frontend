import { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { Hrm8PageLayout } from '@/components/layouts/Hrm8PageLayout'; // Import Admin Layout
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Edit,
  Archive,
  MoreVertical,
  Plus,
  DollarSign,
  TrendingUp,
  FileText,
  Calendar,
  Briefcase,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReassignJobsDialog } from '@/components/consultants/ReassignJobsDialog';
import { staffService, StaffMember } from '@/lib/hrm8/staffService';
import { useHrm8Auth } from '@/contexts/Hrm8AuthContext';
import { toast } from 'sonner';
import { ConsultantHeroSection } from '@/components/consultants/detail/ConsultantHeroSection';
import { ConsultantOverviewTab } from '@/components/consultants/detail/ConsultantOverviewTab';
import { PerformanceTab } from '@/components/consultants/detail/PerformanceTab';
import { AssignmentsTab } from '@/components/consultants/detail/AssignmentsTab';
import { RPOAssignmentsTab } from '@/components/consultants/detail/RPOAssignmentsTab';
import { CommissionsTab } from '@/components/consultants/detail/CommissionsTab';
import { ActivityTab } from '@/components/consultants/detail/ActivityTab';
import { DocumentsTab } from '@/components/consultants/detail/DocumentsTab';
import { SettingsTab } from '@/components/consultants/detail/SettingsTab';
import { Consultant as ConsultantType } from '@/types/consultant'; // Import existing type to cast if needed

export default function ConsultantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { hrm8User } = useHrm8Auth();
  const isGlobalAdmin = !!hrm8User;

  const [consultant, setConsultant] = useState<any | null>(null); // Using any temporarily to bridge types
  const [loading, setLoading] = useState(true);
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);

  useEffect(() => {
    loadConsultant();
  }, [id]);

  const loadConsultant = async () => {
    if (!id) return;
    try {
      setLoading(true);
      // Determine source based on auth context. For now assuming Admin accessing via StaffPage
      // If we wanted to support Consultants viewing themselves, we'd check `useConsultantAuth`
      const response = await staffService.getById(id);

      if (response && response.data?.consultant) {
        const rawConsultant = response.data.consultant;
        // Ensure array fields are initialized to prevent map errors
        setConsultant({
          ...rawConsultant,
          specialization: rawConsultant.specialization || [],
          certifications: rawConsultant.certifications || [],
          languages: rawConsultant.languages || [],
          tags: rawConsultant.tags || [],
          assignedEmployers: rawConsultant.assignedEmployers || [],
          assignedJobs: rawConsultant.assignedJobs || []
        });
      } else {
        toast.error("Consultant not found");
        navigate('/consultants');
      }
    } catch (error) {
      console.error("Failed to load consultant", error);
      toast.error("Failed to load consultant details");
    } finally {
      setLoading(false);
    }
  };

  const PageLayout = isGlobalAdmin ? Hrm8PageLayout : DashboardPageLayout;

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center p-12">
          Loading...
        </div>
      </PageLayout>
    );
  }

  if (!consultant) {
    return <Navigate to="/consultants" replace />;
  }

  const metrics = { // Default empty metrics if not present on StaffMember
    closedDeals: 0,
    totalSalesRevenue: consultant.totalRevenue || 0,
    activeOpportunities: 0,
    averageDealSize: 0,
    quotaAttainment: 0,
    totalPlacements: consultant.totalPlacements || 0,
    totalRevenue: consultant.totalRevenue || 0,
    successRate: consultant.successRate || 0,
    averageDaysToFill: consultant.averageDaysToFill || 0,
    capacityUtilization: {
      employers: {
        current: consultant.currentEmployers || 0,
        max: consultant.maxEmployers || 10,
        percentage: ((consultant.currentEmployers || 0) / (consultant.maxEmployers || 10)) * 100
      },
      jobs: {
        current: consultant.currentJobs || 0,
        max: consultant.maxJobs || 20,
        percentage: ((consultant.currentJobs || 0) / (consultant.maxJobs || 20)) * 100
      }
    },
    // Add other missing fields to safely satisfy ConsultantMetrics if needed elsewhere
    activeAssignments: consultant.currentJobs || 0,
    lifetimeCommissions: consultant.totalCommissionsPaid || 0,
    pendingCommissions: consultant.pendingCommissions || 0,
    daysEmployed: 0, // Calculate if hireDate available
    clientSatisfaction: consultant.clientSatisfaction || 0,
    candidateSatisfaction: consultant.candidateSatisfaction || 0
  };

  const handleEdit = () => {
    // Admin edit logic, probably opens a drawer or modal, or redirects
    // For now, let's just log or use the sidebar action
    toast.info("Validation: Edit functionality for Admin should use StaffForm");
  };

  const handleConsultantUpdate = async (updates: Partial<any>) => {
    if (!consultant) return;
    try {
      await staffService.update(consultant.id, updates);
      toast.success("Consultant updated");
      loadConsultant();
    } catch (e) {
      toast.error("Failed to update consultant");
    }
  };

  return (
    <PageLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/consultants">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setReassignDialogOpen(true)}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Reassign Jobs
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleConsultantUpdate({ status: 'inactive' })}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Deactivate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleConsultantUpdate({ status: 'on-leave' })}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Set On Leave
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Hero Section */}
        <ConsultantHeroSection consultant={consultant} metrics={metrics} />

        {/* Tabs with inline Quick Actions */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Tabs List - Flexible */}
            <TabsList className="flex-shrink-0">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="rpo">RPO Assignments</TabsTrigger>
              <TabsTrigger value="commissions">Commissions</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Quick Actions - Right side */}
            <div className="flex items-center gap-2 lg:ml-auto">
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate(`/consultants/${consultant.id}?tab=assignments`)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Assignment
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate(`/consultants/${consultant.id}?tab=commissions`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <DollarSign className="h-4 w-4 mr-1.5" />
                Add Commission
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/consultants/${consultant.id}?tab=performance`)}
              >
                <TrendingUp className="h-4 w-4 mr-1.5" />
                Performance
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/consultants/${consultant.id}?tab=documents`)}
              >
                <FileText className="h-4 w-4 mr-1.5" />
                Documents
              </Button>
            </div>
          </div>

          {/* Tab Contents */}
          <TabsContent value="overview">
            <ConsultantOverviewTab consultant={consultant} metrics={metrics} />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceTab consultantId={consultant.id} />
          </TabsContent>

          <TabsContent value="assignments">
            <AssignmentsTab consultantId={consultant.id} consultant={consultant} />
          </TabsContent>

          <TabsContent value="rpo">
            <RPOAssignmentsTab consultant={consultant} />
          </TabsContent>

          <TabsContent value="commissions">
            <CommissionsTab
              consultantId={consultant.id}
              consultantName={`${consultant.firstName} ${consultant.lastName}`}
            />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityTab consultantId={consultant.id} />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab consultantId={consultant.id} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab consultantId={consultant.id} consultant={consultant} />
          </TabsContent>
        </Tabs>
      </div>

      <ReassignJobsDialog
        open={reassignDialogOpen}
        onOpenChange={setReassignDialogOpen}
        consultant={consultant}
        onSuccess={() => {
          // In a real app we might want to refresh consultant stats here
          // For now just close, as counters likely update in background or on refetch
        }}
      />
    </PageLayout>
  );
}
