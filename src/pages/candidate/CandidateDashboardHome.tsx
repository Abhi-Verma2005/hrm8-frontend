/**
 * Candidate Dashboard Home
 * Main dashboard content for candidates
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidateAuth } from '@/contexts/CandidateAuthContext';
import { applicationService, Application } from '@/lib/applicationService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CandidatePageLayout } from '@/components/layouts/CandidatePageLayout';
import { AtsPageHeader } from '@/components/layouts/AtsPageHeader';
import {
  Briefcase,
  FileText,
  User,
} from 'lucide-react';

export default function CandidateDashboardHome() {
  const { candidate } = useCandidateAuth();
  const navigate = useNavigate();
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
        return (
          <Badge variant="outline" className="h-6 px-2 text-xs rounded-full bg-primary/10 text-primary border-primary/20">
            New
          </Badge>
        );
      case 'SCREENING':
        return (
          <Badge variant="outline" className="h-6 px-2 text-xs rounded-full bg-muted">
            Screening
          </Badge>
        );
      case 'INTERVIEW':
        return (
          <Badge variant="outline" className="h-6 px-2 text-xs rounded-full bg-warning/10 text-warning border-warning/20">
            Interview
          </Badge>
        );
      case 'OFFER':
        return (
          <Badge variant="outline" className="h-6 px-2 text-xs rounded-full bg-success/10 text-success border-success/20">
            Offer
          </Badge>
        );
      case 'HIRED':
        return (
          <Badge variant="outline" className="h-6 px-2 text-xs rounded-full bg-success/10 text-success border-success/20">
            Hired
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="outline" className="h-6 px-2 text-xs rounded-full bg-destructive/10 text-destructive border-destructive/20">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="h-6 px-2 text-xs rounded-full">
            {status}
          </Badge>
        );
    }
  };

  return (
    <CandidatePageLayout>
      <div className="p-6 space-y-6">
        <AtsPageHeader
          title="Dashboard"
          subtitle={`Welcome back, ${candidate?.firstName}!`}
        />

        {/* Profile Completeness */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Profile Completeness</CardTitle>
            <CardDescription className="text-sm">
              Complete your profile to improve your job matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{profileCompleteness}% Complete</span>
                <span className="text-muted-foreground">{100 - profileCompleteness}% remaining</span>
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
                <CardTitle className="text-base font-semibold">Recent Applications</CardTitle>
                <CardDescription className="text-sm">Your latest job applications</CardDescription>
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
                <p className="text-sm">No applications yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate('/candidate/jobs')}
                >
                  Browse Jobs
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/candidate/applications/${app.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold">Application #{app.id.slice(0, 8)}</h4>
                        {getStatusBadge(app.status)}
                        {app.isNew && (
                          <Badge variant="outline" className="h-6 px-2 text-xs rounded-full bg-primary/10 text-primary border-primary/20">
                            New
                          </Badge>
                        )}
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
          <Card className="cursor-pointer" onClick={() => navigate('/candidate/jobs')}>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
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

          <Card className="cursor-pointer" onClick={() => navigate('/candidate/profile')}>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
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
    </CandidatePageLayout>
  );
}















