/**
 * Applications Page
 * List of candidate's applications
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService, Application } from '@/lib/applicationService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CandidatePageLayout } from '@/components/layouts/CandidatePageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Search, Loader2, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const response = await applicationService.getCandidateApplications();
      setApplications(response.data?.applications || []);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setIsLoading(false);
    }
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
      case 'WITHDRAWN':
        return <Badge variant="outline">Withdrawn</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return app.id.toLowerCase().includes(query) || app.jobId.toLowerCase().includes(query);
  });

  return (
    <CandidatePageLayout
      title="My Applications"
      subtitle="Track your job applications"
    >
      <div className="p-6 space-y-6">

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Applications</CardTitle>
              <CardDescription>
                {applications.length} total application{applications.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Button onClick={() => navigate('/candidate/jobs')}>
                Browse Jobs
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">
                {searchQuery ? 'No applications match your search' : 'No applications yet'}
              </p>
              {!searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/candidate/jobs')}
                >
                  Browse Jobs
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/application/${app.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">Application #{app.id.slice(0, 8)}</h4>
                      {getStatusBadge(app.status)}
                      {app.isNew && (
                        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Applied {formatDistanceToNow(new Date(app.appliedDate), { addSuffix: true })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Job ID: {app.jobId.slice(0, 8)}...
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/application/${app.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </CandidatePageLayout>
  );
}

