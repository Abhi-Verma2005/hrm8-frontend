import { useState, useEffect } from "react";
import { useParams, Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Edit, 
  Archive, 
  MoreVertical,
  Plus,
  UserPlus,
  Briefcase,
  DollarSign
} from "lucide-react";
import { getEmployerById, calculateEmployerMetrics, updateEmployer } from "@/lib/employerService";
import { EmployerOverview } from "@/components/employers/detail/EmployerOverview";
import { EmployerHeroSection } from "@/components/employers/detail/EmployerHeroSection";
import EmployerUsersTab from "@/components/employers/detail/users/EmployerUsersTab";
import EmployerJobsTab from "@/components/employers/detail/jobs/EmployerJobsTab";
import LocationsDepartmentsTab from "@/components/employers/detail/locations/LocationsDepartmentsTab";
import { BillingSubscriptionsTab } from "@/components/employers/detail/billing/BillingSubscriptionsTab";
import { ServicesTab } from "@/components/employers/detail/services/ServicesTab";
import { ActivityHistoryTab } from "@/components/employers/detail/activity/ActivityHistoryTab";
import { initializeMockCRMData } from "@/data/mockCRMData";
import { initializeMockContacts } from "@/data/mockContactsData";
import { initializeMockDocuments } from "@/data/mockDocumentsData";
import { DocumentsTab } from "@/components/employers/detail/documents/DocumentsTab";
import { SettingsTab } from "@/components/employers/detail/settings/SettingsTab";
import { Employer } from "@/types/entities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function EmployerDetail() {
  const { employerId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fetchedEmployer = employerId ? getEmployerById(employerId) : null;
  const [employer, setEmployer] = useState<Employer | null>(fetchedEmployer);
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    initializeMockCRMData();
    initializeMockContacts();
    initializeMockDocuments();
    initializeMockDocuments();
  }, []);

  if (!employer) {
    return <Navigate to="/employers" replace />;
  }

  const metrics = calculateEmployerMetrics(employer);

  const handleEdit = () => {
    navigate(`/employers/${employer.id}/edit`);
  };

  const handleEmployerUpdate = (updates: Partial<Employer>) => {
    if (!employer) return;
    const updated = updateEmployer(employer.id, updates);
    if (updated) {
      setEmployer(updated);
    }
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/employers">
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
                <DropdownMenuItem>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Hero Section */}
        <EmployerHeroSection employer={employer} metrics={metrics} />

        {/* Tabs with inline Quick Actions */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Tabs Menu Items - Left side */}
            <TabsList className="flex-shrink-0">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="locations">Locations & Departments</TabsTrigger>
              <TabsTrigger value="billing">Billing & Subscriptions</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="activity">Activity & History</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Quick Actions - Right side */}
            <div className="flex items-center gap-2 lg:ml-auto">
              <Button 
                variant="default"
                size="sm"
                onClick={() => navigate('/jobs/create')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Create Job
              </Button>
              <Button 
                variant="default"
                size="sm"
                onClick={() => navigate(`/employers/${employer.id}?tab=users`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4 mr-1.5" />
                Add User
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate(`/employers/${employer.id}?tab=jobs`)}
              >
                <Briefcase className="h-4 w-4 mr-1.5" />
                Jobs
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate(`/employers/${employer.id}?tab=billing`)}
              >
                <DollarSign className="h-4 w-4 mr-1.5" />
                Billing
              </Button>
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <EmployerOverview employer={employer} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <EmployerUsersTab employerId={employer.id} />
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <EmployerJobsTab employerId={employer.id} />
          </TabsContent>

          {/* Locations & Departments Tab */}
          <TabsContent value="locations">
            <LocationsDepartmentsTab employerId={employer.id} employer={employer} />
          </TabsContent>

          {/* Billing & Subscriptions Tab */}
          <TabsContent value="billing">
            <BillingSubscriptionsTab 
              employer={employer} 
              onEmployerUpdate={handleEmployerUpdate}
            />
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <ServicesTab employerId={employer.id} />
          </TabsContent>

          {/* Activity & History Tab */}
          <TabsContent value="activity">
            <ActivityHistoryTab employerId={employer.id} />
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <DocumentsTab employerId={employer.id} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsTab employerId={employer.id} employer={employer} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
