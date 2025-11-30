/**
 * Candidate Dashboard
 * Main dashboard for candidates
 */

import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { CandidateAuthGuard } from '@/components/auth/CandidateAuthGuard';
import { useCandidateAuth } from '@/contexts/CandidateAuthContext';
import { applicationService, Application } from '@/lib/applicationService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Bookmark,
  Settings,
  MessageSquare,
} from 'lucide-react';
import { UnifiedDashboardLayout } from '@/components/layouts/UnifiedDashboardLayout';
import type { DashboardMenuItem } from '@/components/layouts/UnifiedDashboardLayout';

const menuItems: DashboardMenuItem[] = [
  { path: '/candidate/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/candidate/jobs', label: 'Browse Jobs', icon: Briefcase },
  { path: '/candidate/applications', label: 'Applications', icon: FileText },
  { path: '/candidate/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
  { path: '/candidate/messages', label: 'Messages', icon: MessageSquare },
  { path: '/candidate/profile', label: 'My Profile', icon: User },
  { path: '/candidate/settings', label: 'Settings', icon: Settings },
];

// Settings placeholder component
const SettingsPage = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold">Settings</h1>
    <p className="text-muted-foreground">Settings page coming soon</p>
  </div>
);

export default function CandidateDashboard() {
  const { candidate, logout } = useCandidateAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [profileCompleteness, setProfileCompleteness] = useState(0);

  useEffect(() => {
    loadRecentApplications();
    calculateProfileCompleteness();
  }, [candidate]);

  const loadRecentApplications = async () => {
    try {
      const response = await applicationService.getCandidateApplications();
      const apps = response.data?.applications || [];
      setRecentApplications(apps.slice(0, 5));
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  const calculateProfileCompleteness = () => {
    if (!candidate) {
      setProfileCompleteness(0);
      return;
    }

    let completed = 0;
    const total = 6;

    if (candidate.firstName && candidate.lastName) completed++;
    if (candidate.email) completed++;
    if (candidate.phone) completed++;
    if (candidate.city && candidate.country) completed++;
    if (candidate.linkedInUrl) completed++;
    if (candidate.photo) completed++;

    setProfileCompleteness(Math.round((completed / total) * 100));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="default">New</Badge>;
      case 'SCREENING':
        return <Badge variant="secondary">Screening</Badge>;
      case 'INTERVIEW':
        return <Badge variant="outline">Interview</Badge>;
      case 'OFFER':
        return <Badge className="bg-green-500">Offer</Badge>;
      case 'HIRED':
        return <Badge className="bg-green-600">Hired</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <CandidateAuthGuard>
      <UnifiedDashboardLayout
        title="Candidate Portal"
        subtitle={candidate ? `${candidate.firstName} ${candidate.lastName}` : undefined}
        menuItems={menuItems}
        user={{
          name: candidate ? `${candidate.firstName} ${candidate.lastName}` : undefined,
          email: candidate?.email,
        }}
        onLogout={handleLogout}
        showHeader={true}
        showSidebar={true}
      >
        {location.pathname === '/candidate/dashboard' ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {candidate?.firstName}!</p>
            </div>

              {/* Profile Completeness */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Completeness</CardTitle>
                  <CardDescription>
                    Complete your profile to improve your job matches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{profileCompleteness}% Complete</span>
                      <span>{100 - profileCompleteness}% remaining</span>
                    </div>
                    <Progress value={profileCompleteness} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/candidate/profile')}
                      className="mt-4"
                    >
                      Complete Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Applications</CardTitle>
                      <CardDescription>Your latest job applications</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/candidate/applications')}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentApplications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No applications yet</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        asChild
                      >
                        <Link to="/candidate/jobs">Browse Jobs</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentApplications.map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => navigate(`/candidate/applications/${app.id}`)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">Application #{app.id.slice(0, 8)}</h4>
                              {getStatusBadge(app.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Applied {new Date(app.appliedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/candidate/jobs" className="block">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Browse Jobs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Search and apply for new opportunities
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/candidate/profile')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Update Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Keep your profile up to date
                    </p>
                  </CardContent>
                </Card>
              </div>
          </div>
        ) : (
          <Outlet />
        )}
      </UnifiedDashboardLayout>
    </CandidateAuthGuard>
  );
}

