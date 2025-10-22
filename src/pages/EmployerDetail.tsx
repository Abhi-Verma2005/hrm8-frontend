import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Edit, 
  Archive, 
  MoreVertical
} from "lucide-react";
import { getEmployerById, calculateEmployerMetrics } from "@/lib/employerService";
import { EmployerOverview } from "@/components/employers/detail/EmployerOverview";
import { EmployerHeroSection } from "@/components/employers/detail/EmployerHeroSection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function EmployerDetail() {
  const { employerId } = useParams();
  const employer = employerId ? getEmployerById(employerId) : null;
  const [activeTab, setActiveTab] = useState("overview");

  if (!employer) {
    return <Navigate to="/employers" replace />;
  }

  const metrics = calculateEmployerMetrics(employer);

  const handleEdit = () => {
    // TODO: Open edit drawer/dialog
    console.log("Edit employer:", employer.id);
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
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

          {/* Overview Tab */}
          <TabsContent value="overview">
            <EmployerOverview employer={employer} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium mb-2">User Management</p>
                  <p className="text-sm">User management will be available in Phase 2</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium mb-2">Jobs Overview</p>
                  <p className="text-sm">Jobs management will be available in Phase 2</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations & Departments Tab */}
          <TabsContent value="locations">
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium mb-2">Locations & Departments</p>
                  <p className="text-sm">Location and department management will be available in Phase 2</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing & Subscriptions Tab */}
          <TabsContent value="billing">
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium mb-2">Billing & Subscriptions</p>
                  <p className="text-sm">Billing management will be available in Phase 3</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium mb-2">Recruitment Services</p>
                  <p className="text-sm">Service management will be available in Phase 4</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity & History Tab */}
          <TabsContent value="activity">
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium mb-2">Activity Timeline</p>
                  <p className="text-sm">Activity tracking will be available in Phase 4</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium mb-2">Document Repository</p>
                  <p className="text-sm">Document management will be available in Phase 5</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium mb-2">Territory & Team Settings</p>
                  <p className="text-sm">Settings management will be available in Phase 5</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
