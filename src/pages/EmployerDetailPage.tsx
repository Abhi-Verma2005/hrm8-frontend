import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployerById } from "@/lib/employerService";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Building2, Mail, Globe, MapPin, Users, Briefcase, 
  DollarSign, TrendingUp, BarChart3, Settings, FileText 
} from "lucide-react";
import { EmployerOverview } from "@/components/employers/detail/EmployerOverview";
import { SettingsTab } from "@/components/employers/detail/settings/SettingsTab";
import { AnalyticsTab } from "@/components/employers/detail/analytics/AnalyticsTab";
import EmployerUsersTab from "@/components/employers/detail/users/EmployerUsersTab";
import { SubscriptionUpgradeWizard } from "@/components/subscription/SubscriptionUpgradeWizard";

export default function EmployerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showUpgradeWizard, setShowUpgradeWizard] = useState(false);

  const employer = id ? getEmployerById(id) : undefined;

  if (!employer) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Employer Not Found</h2>
          <Button onClick={() => navigate("/employers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employers
          </Button>
        </div>
      </div>
    );
  }

  const handleUpgrade = (tier: any, hrmsEnabled: boolean, hrmsEmployeeCount: number, addons: string[]) => {
    console.log('Upgrading:', { tier, hrmsEnabled, hrmsEmployeeCount, addons });
    // In production, this would call an API to update the subscription
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'default',
      inactive: 'secondary',
      pending: 'secondary',
      trial: 'outline',
      expired: 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/employers")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={employer.logo} />
              <AvatarFallback>
                {employer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-3xl font-bold">{employer.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {employer.industry}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {employer.location}
                </span>
                {getStatusBadge(employer.status)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowUpgradeWizard(true)}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
          <Button>
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Active Jobs</span>
          </div>
          <p className="text-2xl font-bold">{employer.usage.activeJobs}</p>
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Total Candidates</span>
          </div>
          <p className="text-2xl font-bold">{employer.usage.totalCandidates}</p>
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-muted-foreground">Employees</span>
          </div>
          <p className="text-2xl font-bold">{employer.usage.activeEmployees}</p>
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-muted-foreground">MRR</span>
          </div>
          <p className="text-2xl font-bold">${employer.monthlySubscriptionFee || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <EmployerOverview employer={employer} />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab employer={employer} />
        </TabsContent>

        <TabsContent value="users">
          <EmployerUsersTab employerId={employer.id} />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab employerId={employer.id} employer={employer} />
        </TabsContent>
      </Tabs>

      {/* Upgrade Wizard */}
      <SubscriptionUpgradeWizard
        open={showUpgradeWizard}
        onClose={() => setShowUpgradeWizard(false)}
        currentTier={employer.subscriptionTier}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
