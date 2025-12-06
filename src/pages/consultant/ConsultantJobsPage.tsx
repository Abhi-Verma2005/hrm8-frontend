/**
 * Consultant Jobs Page
 * View assigned jobs for consultants
 */

import { useState, useEffect } from 'react';
import { useConsultantAuth } from '@/contexts/ConsultantAuthContext';
import { consultantService } from '@/lib/consultant/consultantService';
import { jobService } from '@/lib/api/jobService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { ConsultantPageLayout } from '@/components/layouts/ConsultantPageLayout';
import { AtsPageHeader } from '@/components/layouts/AtsPageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function ConsultantJobsPage() {
  const { consultant } = useConsultantAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await consultantService.getJobs();
      if (response.success && response.data?.jobIds) {
        const jobIds = response.data.jobIds;
        
        // Fetch full job details
        const jobPromises = jobIds.map(async (jobId: string) => {
          const jobResponse = await jobService.getJobById(jobId);
          return jobResponse.success && jobResponse.data?.job ? jobResponse.data.job : null;
        });
        
        const jobDetails = (await Promise.all(jobPromises)).filter(Boolean);
        setJobs(jobDetails);
      }
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Job Title',
      sortable: true,
      render: (job: any) => (
        <div>
          <div className="text-sm font-semibold">{job.title}</div>
          {job.department && (
            <div className="text-xs text-muted-foreground">{job.department}</div>
          )}
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (job: any) => (
        <div className="flex items-center gap-1">
          <span className="text-sm">{job.location}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (job: any) => {
        if (job.status === 'ACTIVE') {
          return (
            <Badge variant="outline" className="h-6 px-2 text-xs rounded-full bg-success/10 text-success border-success/20">
              Active
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className="h-6 px-2 text-xs rounded-full">
          {job.status}
        </Badge>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (job: any) => (
        <span className="text-sm text-muted-foreground">
          {new Date(job.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <ConsultantPageLayout>
      <div className="p-6 space-y-6">
        <AtsPageHeader
          title="My Jobs"
          subtitle="View and manage your assigned jobs"
        />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <EnhancedStatCard
          title="Total Jobs"
          value={jobs.length.toString()}
            icon={<Briefcase className="h-5 w-5" />}
          variant="neutral"
        />

        <EnhancedStatCard
          title="Active Jobs"
          value={jobs.filter(j => j.status === 'ACTIVE').length.toString()}
            icon={<Clock className="h-5 w-5" />}
            variant="neutral"
        />
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="text-base font-semibold">Assigned Jobs</CardTitle>
            <CardDescription className="text-sm">
              {jobs.length} total job{jobs.length !== 1 ? 's' : ''} assigned
            </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-sm">Loading jobs...</div>
              </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No jobs assigned yet</p>
            </div>
          ) : (
            <DataTable
              data={jobs}
              columns={columns}
              searchable
              searchKeys={['title', 'location', 'department']}
              emptyMessage="No jobs found"
            />
          )}
        </CardContent>
      </Card>
      </div>
    </ConsultantPageLayout>
  );
}
