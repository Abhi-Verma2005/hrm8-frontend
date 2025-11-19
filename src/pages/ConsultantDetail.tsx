import { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
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
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getConsultantById, updateConsultant } from '@/lib/consultantStorage';
import { calculateConsultantMetrics } from '@/lib/consultantService';
import { ConsultantHeroSection } from '@/components/consultants/detail/ConsultantHeroSection';
import { ConsultantOverviewTab } from '@/components/consultants/detail/ConsultantOverviewTab';
import { PerformanceTab } from '@/components/consultants/detail/PerformanceTab';
import { AssignmentsTab } from '@/components/consultants/detail/AssignmentsTab';
import { RPOAssignmentsTab } from '@/components/consultants/detail/RPOAssignmentsTab';
import { CommissionsTab } from '@/components/consultants/detail/CommissionsTab';
import { ActivityTab } from '@/components/consultants/detail/ActivityTab';
import { DocumentsTab } from '@/components/consultants/detail/DocumentsTab';
import { SettingsTab } from '@/components/consultants/detail/SettingsTab';
import type { Consultant } from '@/types/consultant';

export default function ConsultantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fetchedConsultant = id ? getConsultantById(id) : null;
  const [consultant, setConsultant] = useState<Consultant | null>(fetchedConsultant);
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    // Initialize mock data here if needed
  }, []);

  if (!consultant) {
    return <Navigate to="/consultants" replace />;
  }

  const metrics = calculateConsultantMetrics(consultant);

  const handleEdit = () => {
    navigate(`/consultants?action=edit&id=${consultant.id}`);
  };

  const handleConsultantUpdate = (updates: Partial<Consultant>) => {
    if (!consultant) return;
    const updated = updateConsultant(consultant.id, updates);
    if (updated) {
      setConsultant(updated);
    }
  };

  return (
    <DashboardPageLayout>
      <div className="p-12 space-y-6">
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
    </DashboardPageLayout>
  );
}
