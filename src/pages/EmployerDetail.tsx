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
  MoreVertical,
  Building2
} from "lucide-react";
import { getEmployerById } from "@/lib/employerService";
import { EmployerStatusBadge } from "@/components/employers/EmployerStatusBadge";
import { AccountTypeBadge } from "@/components/employers/AccountTypeBadge";
import { SubscriptionTierBadge } from "@/components/employers/SubscriptionTierBadge";
import { EmployerOverview } from "@/components/employers/detail/EmployerOverview";
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

  const handleEdit = () => {
    // TODO: Open edit drawer/dialog
    console.log("Edit employer:", employer.id);
  };

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/employers">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            
            {/* Company Logo */}
            <div className="flex-shrink-0 w-20 h-20">
              <div className="w-full h-full border border-border rounded-lg bg-card overflow-hidden">
                {employer.logo ? (
                  <img 
                    src={employer.logo}
                    alt={`${employer.name} logo`}
                    className="h-full w-full object-contain p-2"
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        e.currentTarget.style.display = 'none';
                        const placeholder = document.createElement('div');
                        placeholder.className = 'h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5';
                        placeholder.innerHTML = `<span class="text-2xl font-bold text-primary">${employer.name.substring(0, 2).toUpperCase()}</span>`;
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <span className="text-2xl font-bold text-primary">
                      {employer.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold truncate">{employer.name}</h1>
                <EmployerStatusBadge status={employer.status} />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground">{employer.industry}</p>
                <span className="text-muted-foreground">•</span>
                <p className="text-muted-foreground">{employer.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <AccountTypeBadge accountType={employer.accountType} />
                <SubscriptionTierBadge tier={employer.subscriptionTier} />
              </div>
            </div>
          </div>
          
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
            <EmployerOverview employer={employer} onEdit={handleEdit} />
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
