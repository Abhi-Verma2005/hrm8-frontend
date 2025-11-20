import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardPageLayout } from '@/components/layouts/DashboardPageLayout';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Loader2, Building2, MapPin, User, Users, CreditCard, Palette, CheckCircle2, Circle, Edit, Phone, Globe, Calendar, Mail } from 'lucide-react';
import {
  CompanyProfileSectionKey,
  COMPANY_PROFILE_SECTION_ENUM,
} from '@/types/companyProfile';
import { cn } from '@/lib/utils';

const enumToKeyMap = Object.entries(COMPANY_PROFILE_SECTION_ENUM).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [value]: key as CompanyProfileSectionKey,
  }),
  {} as Record<string, CompanyProfileSectionKey>
);

const sectionConfig = [
  {
    key: 'basicDetails' as CompanyProfileSectionKey,
    title: 'Basic Details',
    description: 'Company name, size, industry, and contact information',
    icon: Building2,
  },
  {
    key: 'primaryLocation' as CompanyProfileSectionKey,
    title: 'Locations',
    description: 'Primary and additional office locations',
    icon: MapPin,
  },
  {
    key: 'personalProfile' as CompanyProfileSectionKey,
    title: 'Personal Profile',
    description: 'Your position and contact details',
    icon: User,
  },
  {
    key: 'teamMembers' as CompanyProfileSectionKey,
    title: 'Team Members',
    description: 'Invited team members and collaborators',
    icon: Users,
  },
  {
    key: 'billing' as CompanyProfileSectionKey,
    title: 'Billing',
    description: 'Payment preferences and billing information',
    icon: CreditCard,
  },
  {
    key: 'branding' as CompanyProfileSectionKey,
    title: 'Branding',
    description: 'Company branding and careers page settings',
    icon: Palette,
  },
];

export default function CompanyProfile() {
  const { data, isLoading } = useCompanyProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CompanyProfileSectionKey>('basicDetails');

  const profile = data?.profile;
  const profileData = profile?.profileData || {};

  const completedSectionKeys = new Set(
    profile?.completedSections
      ?.map((section) => enumToKeyMap[section])
      .filter(Boolean) as CompanyProfileSectionKey[] || []
  );

  // Calculate completion percentage based on actual completed sections
  // Always calculate from completed sections count to ensure accuracy
  const actualCompletionPercentage = Math.round((completedSectionKeys.size / sectionConfig.length) * 100);

  const handleEdit = (section: CompanyProfileSectionKey) => {
    navigate(`/onboarding?section=${section}`);
  };

  if (isLoading && !profile) {
    return (
      <DashboardPageLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </DashboardPageLayout>
    );
  }

  const basicDetails = profileData.basicDetails || {};
  const primaryLocation = profileData.primaryLocation || {};
  const personalProfile = profileData.personalProfile || {};
  const teamMembers = profileData.teamMembers || { invites: [] };
  const billing = profileData.billing || {};
  const branding = profileData.branding || {};

  return (
    <DashboardPageLayout>
      <div className="p-6">
        <div className="space-y-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Company Profile</h1>
              <p className="text-muted-foreground mt-2">
                View and manage your company information and onboarding details
              </p>
            </div>
            <Button onClick={() => navigate('/onboarding')}>
              Continue Onboarding
            </Button>
          </div>

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Completion</CardTitle>
                  <CardDescription>
                    Complete all required sections to unlock full features
                  </CardDescription>
                </div>
                <Badge variant={profile?.status === 'COMPLETED' ? 'default' : 'secondary'}>
                  {profile?.status === 'COMPLETED' ? 'Complete' : 'In Progress'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {completedSectionKeys.size} of {sectionConfig.length} sections completed
                  </span>
                  <span className="font-medium">{actualCompletionPercentage}%</span>
                </div>
                <Progress value={actualCompletionPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CompanyProfileSectionKey)}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {sectionConfig.map((section) => {
                const isComplete = completedSectionKeys.has(section.key);
                const Icon = section.icon;
                return (
                  <TabsTrigger
                    key={section.key}
                    value={section.key}
                    className="flex flex-col items-center gap-2 h-auto py-3"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-xs">{section.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Basic Details Tab */}
            <TabsContent value="basicDetails" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Basic Company Details</CardTitle>
                      <CardDescription>
                        {sectionConfig.find((s) => s.key === 'basicDetails')?.description}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEdit('basicDetails')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                      <p className="text-base mt-1">{basicDetails.companyName || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Company Size</label>
                      <p className="text-base mt-1">{basicDetails.companySize || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Industries</label>
                      <p className="text-base mt-1">
                        {basicDetails.industries?.length ? basicDetails.industries.join(', ') : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-base mt-1 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {basicDetails.phone?.countryCode && basicDetails.phone?.number
                          ? `${basicDetails.phone.countryCode} ${basicDetails.phone.number}`
                          : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Website</label>
                      <p className="text-base mt-1 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {basicDetails.websiteUrl || user?.companyWebsite || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Year Founded</label>
                      <p className="text-base mt-1">{basicDetails.yearFounded || 'Not set'}</p>
                    </div>
                  </div>
                  {basicDetails.overview && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Overview</label>
                      <p className="text-base mt-1">{basicDetails.overview}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Primary Location Tab */}
            <TabsContent value="primaryLocation" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Locations</CardTitle>
                      <CardDescription>
                        {sectionConfig.find((s) => s.key === 'primaryLocation')?.description}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEdit('primaryLocation')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {primaryLocation.name ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Location Name</label>
                        <p className="text-base mt-1">{primaryLocation.name}</p>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Street Address</label>
                          <p className="text-base mt-1">{primaryLocation.streetAddress}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">City</label>
                          <p className="text-base mt-1">{primaryLocation.city}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">State/Region</label>
                          <p className="text-base mt-1">{primaryLocation.stateOrRegion}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Postal Code</label>
                          <p className="text-base mt-1">{primaryLocation.postalCode}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Country</label>
                          <p className="text-base mt-1">{primaryLocation.country}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No location information set</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Personal Profile Tab */}
            <TabsContent value="personalProfile" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Profile</CardTitle>
                      <CardDescription>
                        {sectionConfig.find((s) => s.key === 'personalProfile')?.description}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEdit('personalProfile')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Position Title</label>
                      <p className="text-base mt-1">{personalProfile.positionTitle || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-base mt-1 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {personalProfile.phone?.countryCode && personalProfile.phone?.number
                          ? `${personalProfile.phone.countryCode} ${personalProfile.phone.number}`
                          : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Location</label>
                      <p className="text-base mt-1 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {personalProfile.location || 'Not set'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Members Tab */}
            <TabsContent value="teamMembers" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Team Members</CardTitle>
                      <CardDescription>
                        {sectionConfig.find((s) => s.key === 'teamMembers')?.description}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEdit('teamMembers')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {teamMembers.invites && teamMembers.invites.length > 0 ? (
                    <div className="space-y-3">
                      {teamMembers.invites.map((invite: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{invite.email}</p>
                                <p className="text-sm text-muted-foreground">{invite.role}</p>
                              </div>
                            </div>
                            <Badge variant={invite.status === 'accepted' ? 'default' : 'secondary'}>
                              {invite.status || 'pending'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No team members invited yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Billing Setup</CardTitle>
                      <CardDescription>
                        {sectionConfig.find((s) => s.key === 'billing')?.description}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEdit('billing')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Payment Preference</label>
                      <p className="text-base mt-1 capitalize">{billing.paymentPreference || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Subscription Plan</label>
                      <p className="text-base mt-1">{billing.subscriptionPlan || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Registered Business Name</label>
                      <p className="text-base mt-1">{billing.registeredBusinessName || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tax ID</label>
                      <p className="text-base mt-1">{billing.taxId || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Accounts Email</label>
                      <p className="text-base mt-1">{billing.accountsEmail || 'Not set'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Branding Tab */}
            <TabsContent value="branding" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Branding & Careers Page</CardTitle>
                      <CardDescription>
                        {sectionConfig.find((s) => s.key === 'branding')?.description}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEdit('branding')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Careers Page Enabled</label>
                      <p className="text-base mt-1">{branding.careersPageEnabled ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Subdomain</label>
                      <p className="text-base mt-1">{branding.subdomain || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Brand Color</label>
                      <div className="flex items-center gap-2 mt-1">
                        {branding.brandColor && (
                          <div
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: branding.brandColor }}
                          />
                        )}
                        <p className="text-base">{branding.brandColor || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                  {branding.companyIntroduction && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Company Introduction</label>
                      <p className="text-base mt-1">{branding.companyIntroduction}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
